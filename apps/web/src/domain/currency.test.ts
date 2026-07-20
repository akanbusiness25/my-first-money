import { describe, expect, it } from "vitest";
import { formatUsdMinor, parseUsdInputToMinor } from "./currency";

describe("USD display money", () => {
  it("formats integer cents consistently", () => {
    expect(formatUsdMinor(1_800)).toBe("$18.00");
    expect(formatUsdMinor(1)).toBe("$0.01");
    expect(formatUsdMinor(0)).toBe("$0.00");
  });

  it("rejects unsafe, fractional, and negative minor units", () => {
    expect(() => formatUsdMinor(-1)).toThrow("INVALID_MONEY_MINOR");
    expect(() => formatUsdMinor(1.5)).toThrow("INVALID_MONEY_MINOR");
    expect(() => formatUsdMinor(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      "INVALID_MONEY_MINOR",
    );
  });

  it("parses a strict decimal dollar input into integer cents", () => {
    expect(parseUsdInputToMinor("18")).toBe(1_800);
    expect(parseUsdInputToMinor("0.01")).toBe(1);
    expect(parseUsdInputToMinor("12.5")).toBe(1_250);
    expect(parseUsdInputToMinor("1.234")).toBeNull();
    expect(parseUsdInputToMinor("$5")).toBeNull();
  });
});
