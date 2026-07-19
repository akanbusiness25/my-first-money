import { z } from "zod";

export const BucketKeySchema = z.enum(["spend", "save", "give", "grow"]);
export type BucketKey = z.infer<typeof BucketKeySchema>;

export const StarterSplit = {
  spend: 7_000,
  save: 1_000,
  give: 1_000,
  grow: 1_000,
} as const satisfies Record<BucketKey, number>;

const bucketOrder: BucketKey[] = ["spend", "save", "give", "grow"];

export function allocateByBasisPoints(
  totalMinor: number,
  split: Readonly<Record<BucketKey, number>> = StarterSplit,
): Record<BucketKey, number> {
  if (!Number.isSafeInteger(totalMinor) || totalMinor < 0) {
    throw new Error("INVALID_TOTAL_MINOR");
  }

  const basisPointTotal = bucketOrder.reduce(
    (sum, bucket) => sum + split[bucket],
    0,
  );
  if (basisPointTotal !== 10_000) {
    throw new Error("INVALID_SPLIT_TOTAL");
  }

  const rows = bucketOrder.map((bucket, index) => {
    const numerator = totalMinor * split[bucket];
    return {
      bucket,
      index,
      floor: Math.floor(numerator / 10_000),
      remainder: numerator % 10_000,
    };
  });

  const remaining = totalMinor - rows.reduce((sum, row) => sum + row.floor, 0);
  const priority = [...rows].sort(
    (left, right) =>
      right.remainder - left.remainder || left.index - right.index,
  );

  const result: Record<BucketKey, number> = {
    spend: 0,
    save: 0,
    give: 0,
    grow: 0,
  };
  for (const row of rows) result[row.bucket] = row.floor;

  for (let index = 0; index < remaining; index += 1) {
    const row = priority[index];
    if (!row) throw new Error("ALLOCATION_ROUNDING_FAILED");
    result[row.bucket] += 1;
  }

  return result;
}

export interface PaydayTaskInput {
  kind: "responsibility" | "paid" | "extra";
  status: "not_checked" | "completed" | "not_completed";
  amountMinor: number;
}

export function calculatePaydayMinor(
  baseAmountMinor: number,
  tasks: readonly PaydayTaskInput[],
): number {
  if (!Number.isSafeInteger(baseAmountMinor) || baseAmountMinor < 0) {
    throw new Error("INVALID_BASE_AMOUNT");
  }

  return tasks.reduce((total, task) => {
    if (!Number.isSafeInteger(task.amountMinor) || task.amountMinor < 0) {
      throw new Error("INVALID_TASK_AMOUNT");
    }
    if (task.kind === "responsibility") return total;
    return task.status === "completed" ? total + task.amountMinor : total;
  }, baseAmountMinor);
}
