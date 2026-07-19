import { describe, expect, it } from "vitest";
import {
  applyDemoCommand,
  bucketBalance,
  getOrCreateDemoSession,
  getOrCreateDemoSessionInStore,
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

  it("closes payday idempotently and keeps an append-only correction", () => {
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
    applyDemoCommand(session, { action: "apply_demo_correction" });
    applyDemoCommand(session, { action: "apply_demo_correction" });

    expect(session.state.payday).toEqual(firstPayday);
    expect(session.state.payday?.totalMinor).toBe(1_800);
    expect(session.state.corrections).toHaveLength(1);
    expect(bucketBalance(session.state, "save")).toBe(280);
    expect(bucketBalance(session.state, "grow")).toBe(280);
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
    applyDemoCommand(session, { action: "confirm_agreement" });
    applyDemoCommand(session, { action: "open_quick_check" });
    expect(() => applyDemoCommand(session, { action: "finish_check" })).toThrow(
      "TASKS_STILL_UNCHECKED",
    );
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
