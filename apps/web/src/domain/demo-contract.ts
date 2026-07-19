import { z } from "zod";
import {
  AgeBandSchema,
  LearningObjectiveSchema,
  LocaleSchema,
  TaskStatusSchema,
} from "./demo";

const displayNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(24)
  .regex(/^[\p{L}\p{N} .'-]+$/u, "DISPLAY_NAME_INVALID");

export const DemoCommandSchema = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("reset") }),
  z.strictObject({ action: z.literal("set_locale"), locale: LocaleSchema }),
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
  z.strictObject({ action: z.literal("apply_demo_correction") }),
]);

export type DemoCommand = z.infer<typeof DemoCommandSchema>;
