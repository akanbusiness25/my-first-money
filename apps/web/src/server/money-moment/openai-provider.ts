import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ConversationCard } from "@/domain/demo";
import { getCuratedMoneyMomentCard } from "./fallback-provider";
import type { MoneyMomentProvider } from "./provider";
import { MoneyMomentSelectionSchema, type MoneyMomentInput } from "./schema";

export class OpenAiMoneyMomentProvider implements MoneyMomentProvider {
  readonly name = "openai" as const;
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, timeout: 6_000, maxRetries: 1 });
  }

  async generate(
    input: MoneyMomentInput,
    signal: AbortSignal,
  ): Promise<ConversationCard> {
    const response = await this.client.responses.parse(
      {
        model: "gpt-5.6-sol",
        store: false,
        max_output_tokens: 60,
        input: [
          {
            role: "system",
            content:
              "Select exactly one reviewed conversation card ID for this parent-facing family reflection. Use only the supplied enums, booleans, and percentages. Return no generated prose and no personal details.",
          },
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
        text: {
          format: zodTextFormat(
            MoneyMomentSelectionSchema,
            "money_moment_selection",
          ),
        },
        tools: [],
      },
      { signal },
    );

    for (const output of response.output) {
      if (output.type !== "message") continue;
      for (const item of output.content) {
        if (item.type === "refusal") throw new Error("MODEL_REFUSAL");
        if (item.type === "output_text" && item.parsed) {
          const selection = MoneyMomentSelectionSchema.parse(item.parsed);
          return getCuratedMoneyMomentCard(input.locale, selection.cardId);
        }
      }
    }

    throw new Error("MODEL_OUTPUT_MISSING");
  }
}
