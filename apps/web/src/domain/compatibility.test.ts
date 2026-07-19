import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("compatibility baseline", () => {
  it("runs TypeScript 7, Vitest, and Zod together", () => {
    const amount = z.int().nonnegative().parse(1_800);
    expect(amount).toBe(1_800);
  });
});
