import { z } from "zod";
import {
  AgeBandSchema,
  LearningObjectiveSchema,
  LocaleSchema,
  TaskStatusSchema,
} from "./demo";
import { BucketKeySchema } from "./money";

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
      action: z.literal("create_child"),
      displayName: displayNameSchema,
      ageBand: AgeBandSchema,
    }),
    z.strictObject({
      action: z.literal("create_mission"),
      objective: LearningObjectiveSchema,
      baseAmountMinor: z.literal(1_000),
    }),
    z.strictObject({ action: z.literal("confirm_agreement") }),
    z.strictObject({ action: z.literal("open_quick_check") }),
    z.strictObject({ action: z.literal("back_to_week") }),
    z.strictObject({
      action: z.literal("set_task_status"),
      taskId: z.enum(["clear_table", "water_plants", "sort_books"]),
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
