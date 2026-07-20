import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./demo";
import { DemoCommandSchema } from "./demo-contract";

describe("managed redesign demo contract", () => {
  it("starts in English with USD and accessible motion preferences", () => {
    const state = createInitialDemoState();

    expect(state.locale).toBe("en");
    expect(state.saveGoal).toEqual({ title: "Scooter", targetMinor: 8_000 });
    expect(state.preferences).toEqual({
      soundEnabled: true,
      motionEnabled: true,
    });
  });

  it("rejects same-bucket moves and out-of-range amounts", () => {
    expect(
      DemoCommandSchema.safeParse({
        action: "move_money",
        idempotencyKey: "2466234e-259b-4292-902e-b05b6d560503",
        fromBucket: "save",
        toBucket: "save",
        amountMinor: 100,
      }).success,
    ).toBe(false);
    expect(
      DemoCommandSchema.safeParse({
        action: "add_parent_bonus",
        idempotencyKey: "c0316ecf-90df-4469-963c-3865c67d6297",
        bucket: "save",
        amountMinor: 10_001,
      }).success,
    ).toBe(false);
  });

  it("trims goal titles and rejects unknown preference fields", () => {
    expect(
      DemoCommandSchema.parse({
        action: "update_save_goal",
        title: "  Scooter  ",
        targetMinor: 8_000,
      }),
    ).toMatchObject({ title: "Scooter" });
    expect(
      DemoCommandSchema.safeParse({
        action: "update_preferences",
        locale: "en",
        soundEnabled: true,
        motionEnabled: true,
        currency: "KZT",
      }).success,
    ).toBe(false);
  });
});
