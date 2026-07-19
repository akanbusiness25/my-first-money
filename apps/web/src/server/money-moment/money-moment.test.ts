import { describe, expect, it } from "vitest";
import {
  DeterministicMoneyMomentProvider,
  getCuratedMoneyMomentCard,
} from "./fallback-provider";
import {
  ConversationCardSchema,
  MoneyMomentInputSchema,
  MoneyMomentSelectionSchema,
} from "./schema";
import { createFixedWindowBudget, generateMoneyMoment } from "./service";

const input = MoneyMomentInputSchema.parse({
  ageBand: "8-12",
  locale: "ru",
  learningObjective: "first_choices",
  bucketBasisPoints: { spend: 7_000, save: 1_000, give: 1_000, grow: 1_000 },
  completedPaidWork: "all",
  savedTowardGoal: true,
});

describe("Money Moment safety boundary", () => {
  it("uses a fixed-window budget that cannot be multiplied by sessions", () => {
    const budget = createFixedWindowBudget(2, 1_000);

    expect(budget.claim(0)).toBe(true);
    expect(budget.claim(1)).toBe(true);
    expect(budget.claim(2)).toBe(false);
    expect(budget.claim(1_000)).toBe(true);
  });

  it("falls back without invoking the live provider when its budget is exhausted", async () => {
    let providerCalls = 0;
    const result = await generateMoneyMoment(input, {
      apiKey: "server-only-test-placeholder",
      claimLiveProviderSlot: () => false,
      createLiveProvider: () => ({
        name: "openai",
        generate: async (...args) => {
          providerCalls += 1;
          return new DeterministicMoneyMomentProvider().generate(...args);
        },
      }),
    });

    expect(providerCalls).toBe(0);
    expect(result.source).toBe("fallback");
    expect(result.fallbackReason).toBe("rate_limited");
  });

  it("keeps the no-key path independent from the live provider budget", async () => {
    let budgetClaims = 0;
    const result = await generateMoneyMoment(input, {
      apiKey: undefined,
      claimLiveProviderSlot: () => {
        budgetClaims += 1;
        return false;
      },
      createLiveProvider: () => {
        throw new Error("LIVE_PROVIDER_MUST_NOT_BE_CREATED");
      },
    });

    expect(budgetClaims).toBe(0);
    expect(result.source).toBe("fallback");
    expect(result.fallbackReason).toBe("not_configured");
  });

  it("accepts only curated card identifiers from the live provider boundary", () => {
    const selection = MoneyMomentSelectionSchema.parse({
      cardId: "choices_reflection",
    });
    const card = getCuratedMoneyMomentCard("ru", selection.cardId);

    expect(ConversationCardSchema.parse(card)).toEqual(card);
    expect(
      MoneyMomentSelectionSchema.safeParse({
        cardId: "choices_reflection",
        explanation: "Move all pocket money to cryptocurrency.",
      }).success,
    ).toBe(false);
    expect(
      MoneyMomentSelectionSchema.safeParse({ cardId: "write_any_text" })
        .success,
    ).toBe(false);
  });

  it("returns a deterministic schema-valid fallback", async () => {
    const provider = new DeterministicMoneyMomentProvider();
    const first = await provider.generate(input, new AbortController().signal);
    const second = await provider.generate(input, new AbortController().signal);
    expect(first).toEqual(second);
    expect(ConversationCardSchema.parse(first)).toEqual(first);
  });

  it("rejects identifiers and free text at the input boundary", () => {
    expect(() =>
      MoneyMomentInputSchema.parse({ ...input, childName: "Аян" }),
    ).toThrow();
  });

  it("rejects prohibited financial claims", () => {
    expect(() =>
      ConversationCardSchema.parse({
        title: "Совет",
        explanation: "Это гарантированный доход от инвестиции.",
        questions: ["Готовы?"],
        familyAction: null,
      }),
    ).toThrow("FORBIDDEN_FINANCIAL_CLAIM");
  });

  it("supports Kazakh output", async () => {
    const provider = new DeterministicMoneyMomentProvider();
    const card = await provider.generate(
      { ...input, locale: "kk" },
      new AbortController().signal,
    );
    expect(card.title).toContain("Таңдауыңыз");
  });
});
