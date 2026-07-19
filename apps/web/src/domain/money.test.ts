import { describe, expect, it } from "vitest";
import {
  allocateByBasisPoints,
  calculatePaydayMinor,
  StarterSplit,
} from "./money";

describe("integer money rules", () => {
  it("allocates the starter split exactly", () => {
    expect(allocateByBasisPoints(1_803, StarterSplit)).toEqual({
      spend: 1_262,
      save: 181,
      give: 180,
      grow: 180,
    });
  });

  it("keeps unpaid responsibilities out of payday", () => {
    expect(
      calculatePaydayMinor(1_000, [
        { kind: "responsibility", status: "completed", amountMinor: 9_999 },
        { kind: "paid", status: "completed", amountMinor: 500 },
        { kind: "paid", status: "not_completed", amountMinor: 300 },
      ]),
    ).toBe(1_500);
  });

  it("rejects an invalid split", () => {
    expect(() =>
      allocateByBasisPoints(100, {
        spend: 7_000,
        save: 1_000,
        give: 1_000,
        grow: 999,
      }),
    ).toThrow("INVALID_SPLIT_TOTAL");
  });
});
