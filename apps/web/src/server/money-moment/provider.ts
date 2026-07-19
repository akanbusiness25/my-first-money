import type { ConversationCard } from "@/domain/demo";
import type { MoneyMomentInput } from "./schema";

export interface MoneyMomentProvider {
  readonly name: "fallback" | "openai";
  generate(
    input: MoneyMomentInput,
    signal: AbortSignal,
  ): Promise<ConversationCard>;
}
