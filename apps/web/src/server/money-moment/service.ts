import type { ConversationCard } from "@/domain/demo";
import { DeterministicMoneyMomentProvider } from "./fallback-provider";
import { OpenAiMoneyMomentProvider } from "./openai-provider";
import type { MoneyMomentProvider } from "./provider";
import { MoneyMomentInputSchema, type MoneyMomentInput } from "./schema";

const LIVE_PROVIDER_WINDOW_MS = 60_000;
const MAX_LIVE_PROVIDER_CALLS_PER_WINDOW = 12;

export interface FixedWindowBudget {
  claim(now?: number): boolean;
}

export function createFixedWindowBudget(
  limit: number,
  windowMs: number,
): FixedWindowBudget {
  let windowStartedAt: number | null = null;
  let used = 0;

  return {
    claim(now = Date.now()) {
      if (windowStartedAt === null || now - windowStartedAt >= windowMs) {
        windowStartedAt = now;
        used = 0;
      }
      if (used >= limit) return false;
      used += 1;
      return true;
    },
  };
}

declare global {
  var __myFirstMoneyLiveProviderBudget: FixedWindowBudget | undefined;
}

const liveProviderBudget =
  globalThis.__myFirstMoneyLiveProviderBudget ??
  (globalThis.__myFirstMoneyLiveProviderBudget = createFixedWindowBudget(
    MAX_LIVE_PROVIDER_CALLS_PER_WINDOW,
    LIVE_PROVIDER_WINDOW_MS,
  ));

export interface MoneyMomentRuntime {
  apiKey: string | undefined;
  claimLiveProviderSlot(): boolean;
  createLiveProvider(apiKey: string): MoneyMomentProvider;
}

function defaultRuntime(): MoneyMomentRuntime {
  return {
    apiKey: process.env.OPENAI_API_KEY,
    claimLiveProviderSlot: () => liveProviderBudget.claim(),
    createLiveProvider: (apiKey) => new OpenAiMoneyMomentProvider(apiKey),
  };
}

export interface MoneyMomentResult {
  card: ConversationCard;
  source: "openai" | "fallback";
  fallbackReason:
    "not_configured" | "rate_limited" | "provider_unavailable" | null;
  latencyMs: number;
}

export async function generateMoneyMoment(
  rawInput: MoneyMomentInput,
  runtime: MoneyMomentRuntime = defaultRuntime(),
): Promise<MoneyMomentResult> {
  const input = MoneyMomentInputSchema.parse(rawInput);
  const fallback = new DeterministicMoneyMomentProvider();
  const apiKey = runtime.apiKey;
  const startedAt = performance.now();

  if (!apiKey) {
    const card = await fallback.generate(input, new AbortController().signal);
    return {
      card,
      source: "fallback",
      fallbackReason: "not_configured",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  }

  if (!runtime.claimLiveProviderSlot()) {
    const card = await fallback.generate(input, new AbortController().signal);
    return {
      card,
      source: "fallback",
      fallbackReason: "rate_limited",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_500);
  try {
    const card = await runtime
      .createLiveProvider(apiKey)
      .generate(input, controller.signal);
    return {
      card,
      source: "openai",
      fallbackReason: null,
      latencyMs: Math.round(performance.now() - startedAt),
    };
  } catch {
    const card = await fallback.generate(input, new AbortController().signal);
    return {
      card,
      source: "fallback",
      fallbackReason: "provider_unavailable",
      latencyMs: Math.round(performance.now() - startedAt),
    };
  } finally {
    clearTimeout(timeout);
  }
}
