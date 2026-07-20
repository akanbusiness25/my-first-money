import { describe, expect, it } from "vitest";
import { bucketCopy, copy, taskCopy } from "./copy";

describe("EN/RU/KK product copy contract", () => {
  it("keeps every locale structurally complete", () => {
    expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy.ru).sort());
    expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy.kk).sort());
    expect(Object.keys(bucketCopy.en).sort()).toEqual(
      Object.keys(bucketCopy.ru).sort(),
    );
    expect(Object.keys(taskCopy.en).sort()).toEqual(
      Object.keys(taskCopy.kk).sort(),
    );
  });

  it("uses the approved English-first labels", () => {
    expect(copy.en.settingsTitle).toBe("Parent settings");
    expect(copy.en.weekComplete).toBe("Week complete");
    expect(copy.en.addParentBonus).toBe("Add parent bonus");
    expect(copy.en.moveMoney).toBe("Move money");
    expect(bucketCopy.en.save.label).toBe("Save");
  });
});
