import { z } from "zod";
import type { Currency } from "./currency";
import type { DemoLedgerEvent } from "./ledger";
import type { BucketKey } from "./money";

export const LocaleSchema = z.enum(["en", "ru", "kk"]);
export type Locale = z.infer<typeof LocaleSchema>;

export const AgeBandSchema = z.enum(["4-7", "8-12", "13+"]);
export type AgeBand = z.infer<typeof AgeBandSchema>;

export const LearningObjectiveSchema = z.enum([
  "first_choices",
  "saving_patience",
  "balanced_sharing",
]);
export type LearningObjective = z.infer<typeof LearningObjectiveSchema>;

export const TaskStatusSchema = z.enum([
  "not_checked",
  "completed",
  "not_completed",
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export type DemoStage =
  | "child_setup"
  | "mission_builder"
  | "agreement"
  | "week"
  | "quick_check"
  | "payday"
  | "closed";

export interface DemoChild {
  displayName: string;
  ageBand: AgeBand;
  presentationToken: "leaf";
  currency: Currency;
}

export interface DemoTask {
  id: "clear_table" | "water_plants" | "sort_books";
  kind: "responsibility" | "paid";
  amountMinor: number;
  status: TaskStatus;
}

export interface DemoMission {
  objective: LearningObjective;
  baseAmountMinor: number;
  tasks: DemoTask[];
  agreementVersion: 1;
  parentMarked: boolean;
  childMarked: boolean;
}

export interface DemoPayday {
  idempotencyKey: string;
  baseAmountMinor: number;
  paidTaskMinor: number;
  totalMinor: number;
  allocation: Record<BucketKey, number>;
  growBonusMinor: number;
  closedAt: string;
}

export interface ConversationCard {
  title: string;
  explanation: string;
  questions: string[];
  familyAction: string | null;
}

export interface DemoMoneyMoment {
  card: ConversationCard;
  source: "openai" | "fallback";
  generatedAt: string;
}

export interface DemoState {
  stage: DemoStage;
  locale: Locale;
  child: DemoChild | null;
  mission: DemoMission | null;
  payday: DemoPayday | null;
  preferences: {
    soundEnabled: boolean;
    motionEnabled: boolean;
  };
  ledgerEvents: DemoLedgerEvent[];
  moneyMoment: DemoMoneyMoment | null;
  saveGoal: {
    title: string;
    targetMinor: number;
  };
}

export function createInitialDemoState(): DemoState {
  return {
    stage: "child_setup",
    locale: "en",
    child: null,
    mission: null,
    payday: null,
    preferences: {
      soundEnabled: true,
      motionEnabled: true,
    },
    ledgerEvents: [],
    moneyMoment: null,
    saveGoal: { title: "Scooter", targetMinor: 8_000 },
  };
}

export function createDemoTasks(): DemoTask[] {
  return [
    {
      id: "clear_table",
      kind: "responsibility",
      amountMinor: 0,
      status: "not_checked",
    },
    {
      id: "water_plants",
      kind: "paid",
      amountMinor: 500,
      status: "not_checked",
    },
    {
      id: "sort_books",
      kind: "paid",
      amountMinor: 300,
      status: "not_checked",
    },
  ];
}
