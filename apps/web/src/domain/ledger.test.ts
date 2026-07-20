import { describe, expect, it } from "vitest";
import {
  bucketShareBasisPoints,
  goalProgressBasisPoints,
  projectLedgerBalances,
} from "./ledger";

const now = "2026-07-20T12:00:00.000Z";

describe("append-only demo ledger projection", () => {
  it("projects bonuses and moves without rewriting payday", () => {
    const payday = { spend: 1_260, save: 180, give: 180, grow: 180 };

    const balances = projectLedgerBalances({
      payday,
      growBonusMinor: 100,
      events: [
        {
          id: "bonus",
          kind: "parent_bonus",
          bucket: "save",
          amountMinor: 100,
          createdAt: now,
        },
        {
          id: "move",
          kind: "bucket_move",
          fromBucket: "spend",
          toBucket: "give",
          amountMinor: 60,
          createdAt: now,
        },
      ],
    });

    expect(balances).toEqual({
      spend: 1_200,
      save: 280,
      give: 240,
      grow: 280,
    });
    expect(payday).toEqual({
      spend: 1_260,
      save: 180,
      give: 180,
      grow: 180,
    });
  });

  it("calculates current bucket shares that total 100 percent", () => {
    const shares = bucketShareBasisPoints({
      spend: 1_200,
      save: 280,
      give: 240,
      grow: 280,
    });

    expect(shares).toEqual({
      spend: 6_000,
      save: 1_400,
      give: 1_200,
      grow: 1_400,
    });
    expect(Object.values(shares).reduce((sum, share) => sum + share, 0)).toBe(
      10_000,
    );
  });

  it("clamps goal progress and validates integer cents", () => {
    expect(goalProgressBasisPoints(280, 8_000)).toBe(350);
    expect(goalProgressBasisPoints(9_000, 8_000)).toBe(10_000);
    expect(() => goalProgressBasisPoints(10, 0)).toThrow(
      "INVALID_GOAL_TARGET_MINOR",
    );
    expect(() => goalProgressBasisPoints(1.5, 100)).toThrow(
      "INVALID_MONEY_MINOR",
    );
  });

  it("rejects a move that would make a bucket negative", () => {
    expect(() =>
      projectLedgerBalances({
        payday: { spend: 100, save: 0, give: 0, grow: 0 },
        growBonusMinor: 0,
        events: [
          {
            id: "bad-move",
            kind: "bucket_move",
            fromBucket: "save",
            toBucket: "give",
            amountMinor: 1,
            createdAt: now,
          },
        ],
      }),
    ).toThrow("INSUFFICIENT_BUCKET_BALANCE");
  });
});
