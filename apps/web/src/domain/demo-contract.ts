import { z } from "zod";
import {
  AgeBandSchema,
  GoalIconSchema,
  LearningObjectiveSchema,
  LocaleSchema,
  TaskIdSchema,
  TaskStatusSchema,
} from "./demo";
import { BucketKeySchema } from "./money";
import { bucketUsePurposes } from "./ledger";

const displayNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(24)
  .regex(/^[\p{L}\p{N} .'-]+$/u, "DISPLAY_NAME_INVALID");

const idempotencyKeySchema = z.uuid();
const ledgerAmountMinorSchema = z.number().int().min(1).max(10_000);
const goalTitleSchema = z.string().trim().min(1).max(40);

export const DemoCommandSchema = z
  .discriminatedUnion("action", [
    z.strictObject({ action: z.literal("reset") }),
    z.strictObject({ action: z.literal("back_to_child_setup") }),
    z.strictObject({ action: z.literal("back_to_mission_builder") }),
    z.strictObject({ action: z.literal("back_to_agreement") }),
    z.strictObject({ action: z.literal("start_next_week") }),
    z.strictObject({ action: z.literal("set_locale"), locale: LocaleSchema }),
    z.strictObject({
      action: z.literal("update_preferences"),
      locale: LocaleSchema,
      soundEnabled: z.boolean(),
      motionEnabled: z.boolean(),
    }),
    z.strictObject({
      action: z.literal("update_save_goal"),
      title: goalTitleSchema,
      targetMinor: z.number().int().min(100).max(1_000_000),
      icon: GoalIconSchema,
    }),
    z.strictObject({
      action: z.literal("add_parent_bonus"),
      idempotencyKey: idempotencyKeySchema,
      bucket: BucketKeySchema,
      amountMinor: ledgerAmountMinorSchema,
    }),
    z.strictObject({
      action: z.literal("move_money"),
      idempotencyKey: idempotencyKeySchema,
      fromBucket: BucketKeySchema,
      toBucket: BucketKeySchema,
      amountMinor: ledgerAmountMinorSchema,
    }),
    z.strictObject({
      action: z.literal("record_bucket_use"),
      idempotencyKey: idempotencyKeySchema,
      bucket: BucketKeySchema,
      purpose: z.enum(bucketUsePurposes),
      amountMinor: ledgerAmountMinorSchema,
    }),
    z.strictObject({
      action: z.literal("create_child"),
      displayName: displayNameSchema,
      ageBand: AgeBandSchema,
    }),
    z.strictObject({
      action: z.literal("create_mission"),
      objective: LearningObjectiveSchema,
      baseAmountMinor: z.number().int().min(0).max(10_000),
    }),
    z.strictObject({
      action: z.literal("set_agreement_mark"),
      actor: z.enum(["parent", "child"]),
      marked: z.boolean(),
    }),
    z.strictObject({
      action: z.literal("set_task_included"),
      taskId: TaskIdSchema,
      included: z.boolean(),
    }),
    z.strictObject({ action: z.literal("confirm_agreement") }),
    z.strictObject({ action: z.literal("open_quick_check") }),
    z.strictObject({ action: z.literal("back_to_week") }),
    z.strictObject({
      action: z.literal("set_task_status"),
      taskId: TaskIdSchema,
      status: TaskStatusSchema,
    }),
    z.strictObject({ action: z.literal("finish_check") }),
    z.strictObject({
      action: z.literal("confirm_payday"),
      idempotencyKey: z.uuid(),
    }),
    z.strictObject({ action: z.literal("request_money_moment") }),
  ])
  .superRefine((command, context) => {
    if (
      command.action === "move_money" &&
      command.fromBucket === command.toBucket
    ) {
      context.addIssue({
        code: "custom",
        message: "SAME_BUCKET_MOVE",
        path: ["toBucket"],
      });
    }
  });

export type DemoCommand = z.infer<typeof DemoCommandSchema>;
