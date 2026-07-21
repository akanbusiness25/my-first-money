import type { BucketKey } from "./money";

const bucketOrder: readonly BucketKey[] = ["spend", "save", "give", "grow"];

export type DemoLedgerEvent =
  | {
      id: string;
      kind: "parent_bonus";
      bucket: BucketKey;
      amountMinor: number;
      createdAt: string;
    }
  | {
      id: string;
      kind: "bucket_move";
      fromBucket: BucketKey;
      toBucket: BucketKey;
      amountMinor: number;
      createdAt: string;
    }
  | {
      id: string;
      kind: "bucket_use";
      bucket: BucketKey;
      purpose: "purchase" | "goal" | "gift" | "learning";
      amountMinor: number;
      createdAt: string;
    };

export type BucketBalances = Record<BucketKey, number>;

interface LedgerProjectionInput {
  payday: Readonly<BucketBalances> | null;
  growBonusMinor: number;
  previousPaydays?: readonly {
    allocation: Readonly<BucketBalances>;
    growBonusMinor: number;
  }[];
  events: readonly DemoLedgerEvent[];
}

function assertMinorUnits(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("INVALID_MONEY_MINOR");
  }
}

export function projectLedgerBalances({
  payday,
  growBonusMinor,
  previousPaydays = [],
  events,
}: LedgerProjectionInput): BucketBalances {
  assertMinorUnits(growBonusMinor);

  const balances: BucketBalances = {
    spend: payday?.spend ?? 0,
    save: payday?.save ?? 0,
    give: payday?.give ?? 0,
    grow: payday?.grow ?? 0,
  };

  for (const bucket of bucketOrder) assertMinorUnits(balances[bucket]);
  balances.grow += growBonusMinor;

  for (const previous of previousPaydays) {
    assertMinorUnits(previous.growBonusMinor);
    for (const bucket of bucketOrder) {
      assertMinorUnits(previous.allocation[bucket]);
      balances[bucket] += previous.allocation[bucket];
    }
    balances.grow += previous.growBonusMinor;
  }

  for (const event of events) {
    assertMinorUnits(event.amountMinor);
    if (event.kind === "parent_bonus") {
      balances[event.bucket] += event.amountMinor;
      continue;
    }

    if (event.kind === "bucket_use") {
      if (balances[event.bucket] < event.amountMinor) {
        throw new Error("INSUFFICIENT_BUCKET_BALANCE");
      }
      balances[event.bucket] -= event.amountMinor;
      continue;
    }

    if (event.fromBucket === event.toBucket) {
      throw new Error("SAME_BUCKET_MOVE");
    }
    if (balances[event.fromBucket] < event.amountMinor) {
      throw new Error("INSUFFICIENT_BUCKET_BALANCE");
    }
    balances[event.fromBucket] -= event.amountMinor;
    balances[event.toBucket] += event.amountMinor;
  }

  return balances;
}

export function bucketShareBasisPoints(
  balances: Readonly<BucketBalances>,
): BucketBalances {
  for (const bucket of bucketOrder) assertMinorUnits(balances[bucket]);
  const total = bucketOrder.reduce(
    (sum, bucket) => sum + BigInt(balances[bucket]),
    0n,
  );
  if (total === 0n) return { spend: 0, save: 0, give: 0, grow: 0 };

  const rows = bucketOrder.map((bucket, index) => {
    const numerator = BigInt(balances[bucket]) * 10_000n;
    return {
      bucket,
      index,
      floor: Number(numerator / total),
      remainder: numerator % total,
    };
  });
  const result: BucketBalances = { spend: 0, save: 0, give: 0, grow: 0 };
  for (const row of rows) result[row.bucket] = row.floor;

  const remaining = 10_000 - rows.reduce((sum, row) => sum + row.floor, 0);
  const priority = [...rows].sort(
    (left, right) =>
      (left.remainder === right.remainder
        ? 0
        : left.remainder > right.remainder
          ? -1
          : 1) || left.index - right.index,
  );
  for (let index = 0; index < remaining; index += 1) {
    const row = priority[index];
    if (!row) throw new Error("SHARE_ROUNDING_FAILED");
    result[row.bucket] += 1;
  }
  return result;
}

export function goalProgressBasisPoints(
  savedMinor: number,
  targetMinor: number,
): number {
  assertMinorUnits(savedMinor);
  if (!Number.isSafeInteger(targetMinor) || targetMinor <= 0) {
    throw new Error("INVALID_GOAL_TARGET_MINOR");
  }

  const progress = Number((BigInt(savedMinor) * 10_000n) / BigInt(targetMinor));
  return Math.min(progress, 10_000);
}
