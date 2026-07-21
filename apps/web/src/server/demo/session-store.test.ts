import { describe, expect, it } from "vitest";
import {
  applyDemoCommand,
  bucketBalance,
  getOrCreateDemoSession,
  getOrCreateDemoSessionInStore,
  MAX_DEMO_CLOSED_PAYDAYS,
  MAX_DEMO_LEDGER_EVENTS,
} from "./session-store";

function advanceToPayday() {
  const { session } = getOrCreateDemoSession();
  applyDemoCommand(session, {
    action: "create_child",
    displayName: "Аян",
    ageBand: "8-12",
  });
  applyDemoCommand(session, {
    action: "create_mission",
    objective: "first_choices",
    baseAmountMinor: 1_000,
  });
  applyDemoCommand(session, {
    action: "set_agreement_mark",
    actor: "parent",
    marked: true,
  });
  applyDemoCommand(session, {
    action: "set_agreement_mark",
    actor: "child",
    marked: true,
  });
  applyDemoCommand(session, { action: "confirm_agreement" });
  applyDemoCommand(session, { action: "open_quick_check" });
  for (const taskId of ["clear_table", "water_plants", "sort_books"] as const) {
    applyDemoCommand(session, {
      action: "set_task_status",
      taskId,
      status: "completed",
    });
  }
  applyDemoCommand(session, { action: "finish_check" });
  return session;
}

describe("isolated demo session lifecycle", () => {
  it("rejects fresh sessions at capacity while preserving existing sessions", () => {
    const store = new Map();
    const first = getOrCreateDemoSessionInStore(store, undefined, 1_000, 2);
    getOrCreateDemoSessionInStore(store, undefined, 1_001, 2);

    expect(store).toHaveLength(2);
    expect(() =>
      getOrCreateDemoSessionInStore(store, undefined, 1_002, 2),
    ).toThrow("DEMO_CAPACITY_REACHED");
    expect(() =>
      getOrCreateDemoSessionInStore(store, "unknown-session", 1_002, 2),
    ).toThrow("DEMO_CAPACITY_REACHED");
    expect(store).toHaveLength(2);
    expect(
      getOrCreateDemoSessionInStore(store, first.session.id, 1_003, 2),
    ).toMatchObject({ created: false, session: { id: first.session.id } });
  });

  it("reclaims expired capacity before admitting a fresh session", () => {
    const store = new Map();
    const first = getOrCreateDemoSessionInStore(store, undefined, 0, 1);
    const replacement = getOrCreateDemoSessionInStore(
      store,
      undefined,
      30 * 60 * 1_000 + 1,
      1,
    );

    expect(replacement.session.id).not.toBe(first.session.id);
    expect(store).toHaveLength(1);
  });

  it("does not share family state between sessions", () => {
    const first = getOrCreateDemoSession().session;
    const second = getOrCreateDemoSession().session;
    applyDemoCommand(first, {
      action: "create_child",
      displayName: "Аян",
      ageBand: "8-12",
    });

    expect(first.state.child?.displayName).toBe("Аян");
    expect(second.state.child).toBeNull();
    expect(first.id).not.toBe(second.id);
  });

  it("closes payday idempotently and appends idempotent ledger actions", () => {
    const session = advanceToPayday();
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "f3a1b869-622c-4e43-9631-b9764c792951",
    });
    const firstPayday = structuredClone(session.state.payday);
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "e6988215-02cd-472e-8679-818f2127addb",
    });
    const bonusId = "1bf5ebea-87fd-475d-9f4d-0903a86ab0bf";
    applyDemoCommand(session, {
      action: "add_parent_bonus",
      idempotencyKey: bonusId,
      bucket: "save",
      amountMinor: 100,
    });
    applyDemoCommand(session, {
      action: "add_parent_bonus",
      idempotencyKey: bonusId,
      bucket: "save",
      amountMinor: 100,
    });
    applyDemoCommand(session, {
      action: "move_money",
      idempotencyKey: "1ce28295-123e-4f77-91eb-7f31b08a2f03",
      fromBucket: "save",
      toBucket: "give",
      amountMinor: 40,
    });

    expect(session.state.payday).toEqual(firstPayday);
    expect(session.state.payday?.totalMinor).toBe(1_800);
    expect(session.state.ledgerEvents).toHaveLength(2);
    expect(bucketBalance(session.state, "save")).toBe(240);
    expect(bucketBalance(session.state, "give")).toBe(220);
    expect(bucketBalance(session.state, "grow")).toBe(280);
  });

  it("rejects ledger actions before payday and moves over the balance", () => {
    const fresh = getOrCreateDemoSession().session;
    expect(() =>
      applyDemoCommand(fresh, {
        action: "add_parent_bonus",
        idempotencyKey: "f0d42d35-4a8e-4e57-a278-fe699175d354",
        bucket: "save",
        amountMinor: 100,
      }),
    ).toThrow("STAGE_CONFLICT");

    const session = advanceToPayday();
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "b46904b0-942b-4346-ab2d-75877788d36e",
    });
    expect(() =>
      applyDemoCommand(session, {
        action: "move_money",
        idempotencyKey: "092bdb13-d083-47aa-b3c5-bbb8b1b77ba7",
        fromBucket: "save",
        toBucket: "give",
        amountMinor: 10_000,
      }),
    ).toThrow("INSUFFICIENT_BUCKET_BALANCE");
    expect(session.state.ledgerEvents).toHaveLength(0);
  });

  it("bounds append-only demo ledger growth without breaking idempotency", () => {
    const session = advanceToPayday();
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "7dc145b2-eeab-4784-9f85-76e997760305",
    });
    session.state.ledgerEvents = Array.from(
      { length: MAX_DEMO_LEDGER_EVENTS },
      (_, index) => ({
        id: `00000000-0000-4000-8000-${index.toString().padStart(12, "0")}`,
        kind: "parent_bonus" as const,
        bucket: "save" as const,
        amountMinor: 1,
        createdAt: new Date(0).toISOString(),
      }),
    );

    expect(() =>
      applyDemoCommand(session, {
        action: "add_parent_bonus",
        idempotencyKey: "00000000-0000-4000-8000-000000000000",
        bucket: "save",
        amountMinor: 1,
      }),
    ).not.toThrow();
    expect(() =>
      applyDemoCommand(session, {
        action: "add_parent_bonus",
        idempotencyKey: "fbe537c8-df57-4942-b974-18de53e0e673",
        bucket: "save",
        amountMinor: 1,
      }),
    ).toThrow("DEMO_LEDGER_CAPACITY_REACHED");
  });

  it("updates server-session preferences and a trimmed Save goal", () => {
    const { session } = getOrCreateDemoSession();

    applyDemoCommand(session, {
      action: "update_preferences",
      locale: "kk",
      soundEnabled: false,
      motionEnabled: false,
    });
    applyDemoCommand(session, {
      action: "update_save_goal",
      title: "  First bike  ",
      targetMinor: 12_500,
      icon: "bike",
    });

    expect(session.state.locale).toBe("kk");
    expect(session.state.preferences).toEqual({
      soundEnabled: false,
      motionEnabled: false,
    });
    expect(session.state.saveGoal).toEqual({
      title: "First bike",
      targetMinor: 12_500,
      icon: "bike",
    });
  });

  it("requires an explicit status for every task", () => {
    const { session } = getOrCreateDemoSession();
    applyDemoCommand(session, {
      action: "create_child",
      displayName: "Аян",
      ageBand: "8-12",
    });
    applyDemoCommand(session, {
      action: "create_mission",
      objective: "first_choices",
      baseAmountMinor: 1_000,
    });
    applyDemoCommand(session, {
      action: "set_agreement_mark",
      actor: "parent",
      marked: true,
    });
    applyDemoCommand(session, {
      action: "set_agreement_mark",
      actor: "child",
      marked: true,
    });
    applyDemoCommand(session, { action: "confirm_agreement" });
    applyDemoCommand(session, { action: "open_quick_check" });
    expect(() => applyDemoCommand(session, { action: "finish_check" })).toThrow(
      "TASKS_STILL_UNCHECKED",
    );
  });

  it("requires both playful agreement marks before the week starts", () => {
    const { session } = getOrCreateDemoSession();
    applyDemoCommand(session, {
      action: "create_child",
      displayName: "Ayan",
      ageBand: "8-12",
    });
    applyDemoCommand(session, {
      action: "create_mission",
      objective: "saving_patience",
      baseAmountMinor: 750,
    });

    expect(() =>
      applyDemoCommand(session, { action: "confirm_agreement" }),
    ).toThrow("AGREEMENT_MARKS_REQUIRED");
    applyDemoCommand(session, {
      action: "set_agreement_mark",
      actor: "parent",
      marked: true,
    });
    applyDemoCommand(session, {
      action: "set_agreement_mark",
      actor: "child",
      marked: true,
    });
    applyDemoCommand(session, { action: "confirm_agreement" });

    expect(session.state.stage).toBe("week");
    expect(session.state.mission?.baseAmountMinor).toBe(750);
  });

  it("records supervised jar use and carries balances into the next week", () => {
    const session = advanceToPayday();
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "bfdf4a5d-880e-4377-9234-15f4c92a8860",
    });
    applyDemoCommand(session, {
      action: "record_bucket_use",
      idempotencyKey: "681d1a3a-3c8d-4aa0-bf3a-0af4b06d1134",
      bucket: "spend",
      purpose: "purchase",
      amountMinor: 260,
    });

    expect(bucketBalance(session.state, "spend")).toBe(1_000);
    applyDemoCommand(session, { action: "start_next_week" });

    expect(session.state.stage).toBe("mission_builder");
    expect(session.state.child?.displayName).toBe("Аян");
    expect(session.state.closedPaydays).toHaveLength(1);
    expect(session.state.weekNumber).toBe(2);
    expect(bucketBalance(session.state, "spend")).toBe(1_000);
    expect(session.state.ledgerEvents[0]).toMatchObject({
      kind: "bucket_use",
      purpose: "purchase",
    });
  });

  it("bounds immutable closed-week history in the anonymous demo", () => {
    const session = advanceToPayday();
    applyDemoCommand(session, {
      action: "confirm_payday",
      idempotencyKey: "2dc42ead-ff71-49c1-b507-144c5e07b012",
    });
    const payday = structuredClone(session.state.payday!);
    session.state.closedPaydays = Array.from(
      { length: MAX_DEMO_CLOSED_PAYDAYS },
      (_, index) => ({
        ...payday,
        weekNumber: index + 1,
        idempotencyKey: `closed-week-${index}`,
      }),
    );

    expect(() =>
      applyDemoCommand(session, { action: "start_next_week" }),
    ).toThrow("DEMO_HISTORY_CAPACITY_REACHED");
    expect(session.state.stage).toBe("closed");
  });

  it("does not mint a new Money Moment allowance on reset", () => {
    const { session } = getOrCreateDemoSession();
    session.moneyMomentCount = 3;
    session.lastMoneyMomentAt = 1_000;

    applyDemoCommand(session, { action: "reset" });

    expect(session.moneyMomentCount).toBe(3);
    expect(session.lastMoneyMomentAt).toBe(1_000);
  });
});
