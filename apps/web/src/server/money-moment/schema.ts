import { z } from "zod";
import {
  AgeBandSchema,
  LearningObjectiveSchema,
  LocaleSchema,
} from "@/domain/demo";

export const MoneyMomentInputSchema = z.strictObject({
  ageBand: AgeBandSchema,
  locale: LocaleSchema,
  learningObjective: LearningObjectiveSchema,
  bucketBasisPoints: z.strictObject({
    spend: z.literal(7_000),
    save: z.literal(1_000),
    give: z.literal(1_000),
    grow: z.literal(1_000),
  }),
  completedPaidWork: z.enum(["none", "some", "all"]),
  savedTowardGoal: z.boolean(),
});

export type MoneyMomentInput = z.infer<typeof MoneyMomentInputSchema>;

export const MoneyMomentCardIdSchema = z.enum([
  "choices_reflection",
  "goal_progress",
]);

export type MoneyMomentCardId = z.infer<typeof MoneyMomentCardIdSchema>;

export const MoneyMomentSelectionSchema = z.strictObject({
  cardId: MoneyMomentCardIdSchema,
});

const forbiddenClaims =
  /(interest|yield|investment|guaranteed return|financial advice|\bbuy\b|\bsell\b|процент|доходност|инвестиц|гарантированн|купи|продай|пайыз|кепілді табыс)/iu;

export const ConversationCardSchema = z
  .strictObject({
    title: z.string().min(1).max(60),
    explanation: z.string().min(1).max(240),
    questions: z.array(z.string().min(1).max(150)).min(1).max(3),
    familyAction: z.string().min(1).max(150).nullable(),
  })
  .superRefine((card, context) => {
    const text = [
      card.title,
      card.explanation,
      ...card.questions,
      card.familyAction ?? "",
    ].join(" ");
    if (forbiddenClaims.test(text)) {
      context.addIssue({
        code: "custom",
        message: "FORBIDDEN_FINANCIAL_CLAIM",
      });
    }
  });
