import { randomUUID } from "node:crypto";
import type { DemoCommand } from "@/domain/demo-contract";
import {
  createDemoTasks,
  createInitialDemoState,
  type DemoState,
} from "@/domain/demo";
import { projectLedgerBalances } from "@/domain/ledger";
import { allocateByBasisPoints, calculatePaydayMinor } from "@/domain/money";
import type { BucketKey } from "@/domain/money";

const SESSION_TTL_MS = 30 * 60 * 1_000;
export const MAX_DEMO_SESSIONS = 500;
export const MAX_DEMO_LEDGER_EVENTS = 100;

export interface DemoSession {
  id: string;
  csrfToken: string;
  state: DemoState;
  expiresAt: number;
  moneyMomentCount: number;
  lastMoneyMomentAt: number | null;
}

declare global {
  var __myFirstMoneyDemoSessions: Map<string, DemoSession> | undefined;
}

const sessions =
  globalThis.__myFirstMoneyDemoSessions ??
  (globalThis.__myFirstMoneyDemoSessions = new Map<string, DemoSession>());

function pruneExpired(store: Map<string, DemoSession>, now: number): void {
  for (const [id, session] of store) {
    if (session.expiresAt <= now) store.delete(id);
  }
}

function createSession(now: number): DemoSession {
  return {
    id: randomUUID(),
    csrfToken: randomUUID(),
    state: createInitialDemoState(),
    expiresAt: now + SESSION_TTL_MS,
    moneyMomentCount: 0,
    lastMoneyMomentAt: null,
  };
}

export function getOrCreateDemoSession(candidateId?: string): {
  session: DemoSession;
  created: boolean;
} {
  return getOrCreateDemoSessionInStore(
    sessions,
    candidateId,
    Date.now(),
    MAX_DEMO_SESSIONS,
  );
}

export function getOrCreateDemoSessionInStore(
  store: Map<string, DemoSession>,
  candidateId: string | undefined,
  now: number,
  capacity: number,
): { session: DemoSession; created: boolean } {
  pruneExpired(store, now);

  const existing = candidateId ? store.get(candidateId) : undefined;
  if (existing && existing.expiresAt > now) {
    existing.expiresAt = now + SESSION_TTL_MS;
    return { session: existing, created: false };
  }

  if (store.size >= capacity) throw new Error("DEMO_CAPACITY_REACHED");

  const session = createSession(now);
  store.set(session.id, session);
  return { session, created: true };
}

function requireMission(state: DemoState) {
  if (!state.mission) throw new Error("MISSION_REQUIRED");
  return state.mission;
}

function requireClosedPayday(state: DemoState) {
  if (state.stage !== "closed" || !state.payday) {
    throw new Error("STAGE_CONFLICT");
  }
  return state.payday;
}

function assertLedgerAmount(amountMinor: number): void {
  if (
    !Number.isSafeInteger(amountMinor) ||
    amountMinor < 1 ||
    amountMinor > 10_000
  ) {
    throw new Error("INVALID_LEDGER_AMOUNT");
  }
}

function assertLedgerCapacity(state: DemoState): void {
  if (state.ledgerEvents.length >= MAX_DEMO_LEDGER_EVENTS) {
    throw new Error("DEMO_LEDGER_CAPACITY_REACHED");
  }
}

export function applyDemoCommand(
  session: DemoSession,
  command: DemoCommand,
): void {
  const state = session.state;

  switch (command.action) {
    case "reset":
      session.state = createInitialDemoState();
      session.csrfToken = randomUUID();
      return;
    case "set_locale":
      state.locale = command.locale;
      return;
    case "update_preferences":
      state.locale = command.locale;
      state.preferences = {
        soundEnabled: command.soundEnabled,
        motionEnabled: command.motionEnabled,
      };
      return;
    case "update_save_goal":
      if (
        !Number.isSafeInteger(command.targetMinor) ||
        command.targetMinor < 100 ||
        command.targetMinor > 1_000_000
      ) {
        throw new Error("INVALID_GOAL_TARGET_MINOR");
      }
      state.saveGoal = {
        title: command.title.trim(),
        targetMinor: command.targetMinor,
      };
      return;
    case "add_parent_bonus":
      requireClosedPayday(state);
      assertLedgerAmount(command.amountMinor);
      if (
        state.ledgerEvents.some((event) => event.id === command.idempotencyKey)
      ) {
        return;
      }
      assertLedgerCapacity(state);
      state.ledgerEvents.push({
        id: command.idempotencyKey,
        kind: "parent_bonus",
        bucket: command.bucket,
        amountMinor: command.amountMinor,
        createdAt: new Date().toISOString(),
      });
      return;
    case "move_money": {
      const payday = requireClosedPayday(state);
      assertLedgerAmount(command.amountMinor);
      if (command.fromBucket === command.toBucket) {
        throw new Error("SAME_BUCKET_MOVE");
      }
      if (
        state.ledgerEvents.some((event) => event.id === command.idempotencyKey)
      ) {
        return;
      }
      assertLedgerCapacity(state);
      const balances = projectLedgerBalances({
        payday: payday.allocation,
        growBonusMinor: payday.growBonusMinor,
        events: state.ledgerEvents,
      });
      if (balances[command.fromBucket] < command.amountMinor) {
        throw new Error("INSUFFICIENT_BUCKET_BALANCE");
      }
      state.ledgerEvents.push({
        id: command.idempotencyKey,
        kind: "bucket_move",
        fromBucket: command.fromBucket,
        toBucket: command.toBucket,
        amountMinor: command.amountMinor,
        createdAt: new Date().toISOString(),
      });
      return;
    }
    case "create_child":
      if (state.stage !== "child_setup") throw new Error("STAGE_CONFLICT");
      state.child = {
        displayName: command.displayName,
        ageBand: command.ageBand,
        presentationToken: "leaf",
        currency: "USD",
      };
      state.stage = "mission_builder";
      return;
    case "create_mission":
      if (state.stage !== "mission_builder" || !state.child)
        throw new Error("STAGE_CONFLICT");
      state.mission = {
        objective: command.objective,
        baseAmountMinor: command.baseAmountMinor,
        tasks: createDemoTasks(),
        agreementVersion: 1,
        parentMarked: true,
        childMarked: true,
      };
      state.stage = "agreement";
      return;
    case "confirm_agreement":
      if (state.stage !== "agreement") throw new Error("STAGE_CONFLICT");
      requireMission(state);
      state.stage = "week";
      return;
    case "open_quick_check":
      if (state.stage !== "week") throw new Error("STAGE_CONFLICT");
      requireMission(state);
      state.stage = "quick_check";
      return;
    case "back_to_week":
      if (state.stage !== "quick_check") throw new Error("STAGE_CONFLICT");
      state.stage = "week";
      return;
    case "set_task_status": {
      if (state.stage !== "quick_check") throw new Error("STAGE_CONFLICT");
      const task = requireMission(state).tasks.find(
        (item) => item.id === command.taskId,
      );
      if (!task) throw new Error("TASK_NOT_FOUND");
      task.status = command.status;
      return;
    }
    case "finish_check": {
      if (state.stage !== "quick_check") throw new Error("STAGE_CONFLICT");
      const mission = requireMission(state);
      if (mission.tasks.some((task) => task.status === "not_checked")) {
        throw new Error("TASKS_STILL_UNCHECKED");
      }
      state.stage = "payday";
      return;
    }
    case "confirm_payday": {
      if (state.payday) return;
      if (state.stage !== "payday") throw new Error("STAGE_CONFLICT");
      const mission = requireMission(state);
      const totalMinor = calculatePaydayMinor(
        mission.baseAmountMinor,
        mission.tasks,
      );
      const paidTaskMinor = totalMinor - mission.baseAmountMinor;
      state.payday = {
        idempotencyKey: command.idempotencyKey,
        baseAmountMinor: mission.baseAmountMinor,
        paidTaskMinor,
        totalMinor,
        allocation: allocateByBasisPoints(totalMinor),
        growBonusMinor: 100,
        closedAt: new Date().toISOString(),
      };
      state.stage = "closed";
      return;
    }
    case "request_money_moment":
      throw new Error("MONEY_MOMENT_REQUIRES_PROVIDER");
  }
}

export function bucketBalance(state: DemoState, bucket: BucketKey) {
  return projectLedgerBalances({
    payday: state.payday?.allocation ?? null,
    growBonusMinor: state.payday?.growBonusMinor ?? 0,
    events: state.ledgerEvents,
  })[bucket];
}
