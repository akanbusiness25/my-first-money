import { z } from "zod";

export const CurrencySchema = z.literal("USD");
export type Currency = z.infer<typeof CurrencySchema>;

export function formatUsdMinor(minor: number): string {
  if (!Number.isSafeInteger(minor) || minor < 0) {
    throw new Error("INVALID_MONEY_MINOR");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

export function parseUsdInputToMinor(input: string): number | null {
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(input.trim());
  if (!match) return null;

  const dollars = Number(match[1]);
  const cents = Number((match[2] ?? "").padEnd(2, "0"));
  const minor = dollars * 100 + cents;
  return Number.isSafeInteger(minor) ? minor : null;
}
