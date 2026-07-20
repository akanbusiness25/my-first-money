"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/demo/app-shell";
import { ClosedWeek, type RootTab } from "@/components/demo/closed-week";
import { bucketCopy, copy, taskCopy } from "@/components/demo/copy";
import { JarVisual } from "@/components/demo/jar-visual";
import { formatUsdMinor } from "@/domain/currency";
import type {
  AgeBand,
  DemoState,
  LearningObjective,
  TaskStatus,
} from "@/domain/demo";
import type { DemoCommand } from "@/domain/demo-contract";
import {
  allocateByBasisPoints,
  calculatePaydayMinor,
  StarterSplit,
  type BucketKey,
} from "@/domain/money";
import { PwaRegister } from "./pwa-register";

interface DemoSnapshot {
  state: DemoState;
  csrfToken: string;
  expiresAt: string;
}

interface ErrorPayload {
  error?: { code?: string };
}

async function parseSnapshot(response: Response): Promise<DemoSnapshot> {
  const body = (await response.json()) as DemoSnapshot | ErrorPayload;
  if (!response.ok || !("state" in body)) {
    const code = "error" in body ? body.error?.code : undefined;
    throw new Error(code ?? "REQUEST_REJECTED");
  }
  return body;
}

export function DemoApp() {
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [loadingError, setLoadingError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<RootTab>("week");

  async function load() {
    setLoadingError(false);
    try {
      const response = await fetch("/api/v1/demo", {
        credentials: "same-origin",
        cache: "no-store",
      });
      setSnapshot(await parseSnapshot(response));
    } catch {
      setLoadingError(true);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void fetch("/api/v1/demo", {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(parseSnapshot)
      .then((next) => {
        if (active) setSnapshot(next);
      })
      .catch(() => {
        if (active && !controller.signal.aborted) setLoadingError(true);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function send(command: DemoCommand): Promise<void> {
    if (!snapshot || busy) throw new Error("REQUEST_BUSY");
    setBusy(true);
    try {
      const response = await fetch("/api/v1/demo", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": snapshot.csrfToken,
        },
        body: JSON.stringify(command),
      });
      const next = await parseSnapshot(response);
      setSnapshot(next);
      if (command.action === "reset") setTab("week");
    } finally {
      setBusy(false);
    }
  }

  if (!snapshot) {
    return (
      <div className="app-frame app-state-screen">
        <div className="state-mark">
          {loadingError ? (
            <CircleDollarSign aria-hidden="true" />
          ) : (
            <LoaderCircle className="spin" aria-hidden="true" />
          )}
        </div>
        <h1>{loadingError ? copy.en.loadError : copy.en.loading}</h1>
        {loadingError ? (
          <button className="button" onClick={() => void load()}>
            {copy.en.retry}
          </button>
        ) : null}
      </div>
    );
  }

  const { state } = snapshot;
  return (
    <AppShell
      state={state}
      busy={busy}
      tab={state.stage === "closed" ? tab : undefined}
      onTabChange={state.stage === "closed" ? setTab : undefined}
      onCommand={send}
    >
      {state.stage === "closed" ? (
        <ClosedWeek
          state={state}
          tab={tab}
          busy={busy}
          onTabChange={setTab}
          onCommand={send}
        />
      ) : (
        <JourneyScreen state={state} busy={busy} onCommand={send} />
      )}
      <PwaRegister />
    </AppShell>
  );
}

function JourneyScreen({
  state,
  busy,
  onCommand,
}: {
  state: DemoState;
  busy: boolean;
  onCommand: (command: DemoCommand) => Promise<void>;
}) {
  switch (state.stage) {
    case "child_setup":
      return <ChildSetup state={state} busy={busy} onCommand={onCommand} />;
    case "mission_builder":
      return <MissionBuilder state={state} busy={busy} onCommand={onCommand} />;
    case "agreement":
      return <Agreement state={state} busy={busy} onCommand={onCommand} />;
    case "week":
      return <ActiveWeek state={state} busy={busy} onCommand={onCommand} />;
    case "quick_check":
      return <QuickCheck state={state} busy={busy} onCommand={onCommand} />;
    case "payday":
      return <Payday state={state} busy={busy} onCommand={onCommand} />;
    default:
      return null;
  }
}

function StepHeader({
  title,
  body,
  step,
}: {
  title: string;
  body: string;
  step: number;
}) {
  return (
    <header className="journey-heading">
      <span className="step-count" aria-label={`Step ${step} of 6`}>
        {step}/6
      </span>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function ChildSetup({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const [displayName, setDisplayName] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand>("8-12");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!displayName.trim()) return;
    void onCommand({
      action: "create_child",
      displayName: displayName.trim(),
      ageBand,
    });
  }

  return (
    <section className="journey-screen">
      <StepHeader title={c.startTitle} body={c.startBody} step={1} />
      <form className="journey-form" onSubmit={submit}>
        <label className="field">
          <span>{c.childNickname}</span>
          <input
            autoComplete="off"
            maxLength={24}
            placeholder={c.nicknamePlaceholder}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <label className="field">
          <span>{c.ageBand}</span>
          <select
            value={ageBand}
            onChange={(event) => setAgeBand(event.target.value as AgeBand)}
          >
            <option value="4-7">4–7</option>
            <option value="8-12">8–12</option>
            <option value="13+">13+</option>
          </select>
        </label>
        <button
          className="button"
          disabled={busy || !displayName.trim()}
          type="submit"
        >
          {c.continue}
          <ChevronRight aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

interface JourneyProps {
  state: DemoState;
  busy: boolean;
  onCommand: (command: DemoCommand) => Promise<void>;
}

function MissionBuilder({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const [objective, setObjective] =
    useState<LearningObjective>("first_choices");
  const objectives: Array<{
    id: LearningObjective;
    label: string;
  }> = [
    { id: "first_choices", label: c.objectiveFirstChoices },
    { id: "saving_patience", label: c.objectiveSavingPatience },
    { id: "balanced_sharing", label: c.objectiveBalancedSharing },
  ];

  return (
    <section className="journey-screen">
      <StepHeader title={c.missionTitle} body={c.missionBody} step={2} />
      <div
        className="choice-list"
        role="radiogroup"
        aria-label={c.missionTitle}
      >
        {objectives.map((item) => (
          <label key={item.id} className="choice-row">
            <input
              type="radio"
              name="objective"
              checked={objective === item.id}
              onChange={() => setObjective(item.id)}
            />
            <Target aria-hidden="true" />
            <span>{item.label}</span>
            <Check aria-hidden="true" />
          </label>
        ))}
      </div>
      <div className="amount-preview">
        <span>{c.weeklyBase}</span>
        <strong>{formatUsdMinor(1_000)}</strong>
      </div>
      <button
        className="button"
        disabled={busy}
        onClick={() =>
          void onCommand({
            action: "create_mission",
            objective,
            baseAmountMinor: 1_000,
          })
        }
      >
        {c.buildMission}
        <ChevronRight aria-hidden="true" />
      </button>
    </section>
  );
}

function Agreement({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  return (
    <section className="journey-screen">
      <StepHeader title={c.agreementTitle} body={c.agreementBody} step={3} />
      <div className="agreement-people">
        <span>
          <UsersRound aria-hidden="true" />
          {c.parentMarked}
          <CheckCircle2 aria-hidden="true" />
        </span>
        <span>
          <ShieldCheck aria-hidden="true" />
          {c.childMarked}
          <CheckCircle2 aria-hidden="true" />
        </span>
      </div>
      <TaskList state={state} />
      <button
        className="button"
        disabled={busy}
        onClick={() => void onCommand({ action: "confirm_agreement" })}
      >
        {c.startWeek}
        <Sparkles aria-hidden="true" />
      </button>
    </section>
  );
}

function ActiveWeek({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  return (
    <section className="journey-screen active-week-screen">
      <StepHeader title={c.thisWeek} body={c.weekReady} step={4} />
      <div className="mission-banner">
        <Target aria-hidden="true" />
        <span>{c.objectiveFirstChoices}</span>
        <strong>{formatUsdMinor(state.mission?.baseAmountMinor ?? 0)}</strong>
      </div>
      <TaskList state={state} />
      <button
        className="button"
        disabled={busy}
        onClick={() => void onCommand({ action: "open_quick_check" })}
      >
        {c.quickCheck}
        <ChevronRight aria-hidden="true" />
      </button>
    </section>
  );
}

function TaskList({ state }: { state: DemoState }) {
  const tasks = state.mission?.tasks ?? [];
  const labels = taskCopy[state.locale];
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <span className="task-list__check">
            <Check aria-hidden="true" />
          </span>
          <span>
            <strong>{labels[task.id].label}</strong>
            <small>{labels[task.id].detail}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

function QuickCheck({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const labels = taskCopy[state.locale];
  const tasks = state.mission?.tasks ?? [];
  const complete = tasks.every((task) => task.status !== "not_checked");

  function setStatus(taskId: (typeof tasks)[number]["id"], status: TaskStatus) {
    void onCommand({ action: "set_task_status", taskId, status });
  }

  return (
    <section className="journey-screen">
      <button
        className="back-link"
        disabled={busy}
        onClick={() => void onCommand({ action: "back_to_week" })}
      >
        <ArrowLeft aria-hidden="true" />
        {c.back}
      </button>
      <StepHeader title={c.quickCheckTitle} body={c.weekReady} step={5} />
      <div className="check-list">
        {tasks.map((task) => (
          <fieldset key={task.id}>
            <legend>
              <strong>{labels[task.id].label}</strong>
              <small>{labels[task.id].detail}</small>
            </legend>
            <div className="status-choice">
              <button
                type="button"
                aria-pressed={task.status === "completed"}
                disabled={busy}
                onClick={() => setStatus(task.id, "completed")}
              >
                <Check aria-hidden="true" />
                {c.completed}
              </button>
              <button
                type="button"
                aria-pressed={task.status === "not_completed"}
                disabled={busy}
                onClick={() => setStatus(task.id, "not_completed")}
              >
                {c.notCompleted}
              </button>
            </div>
          </fieldset>
        ))}
      </div>
      <button
        className="button"
        disabled={busy || !complete}
        onClick={() => void onCommand({ action: "finish_check" })}
      >
        {c.finishCheck}
        <ChevronRight aria-hidden="true" />
      </button>
    </section>
  );
}

function Payday({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const mission = state.mission;
  const totalMinor = mission
    ? calculatePaydayMinor(mission.baseAmountMinor, mission.tasks)
    : 0;
  const allocation = allocateByBasisPoints(totalMinor);
  const labels = bucketCopy[state.locale];
  const paidExtras = totalMinor - (mission?.baseAmountMinor ?? 0);

  return (
    <section className="journey-screen payday-screen">
      <StepHeader title={c.paydayTitle} body={c.paydayBody} step={6} />
      <div className="payday-total">
        <CircleDollarSign aria-hidden="true" />
        <span>
          <small>{c.familyReviewed}</small>
          <strong>{formatUsdMinor(totalMinor)}</strong>
        </span>
      </div>
      <dl className="payday-breakdown">
        <div>
          <dt>{c.baseAmount}</dt>
          <dd>{formatUsdMinor(mission?.baseAmountMinor ?? 0)}</dd>
        </div>
        <div>
          <dt>{c.paidExtras}</dt>
          <dd>+{formatUsdMinor(paidExtras)}</dd>
        </div>
      </dl>
      <div className="payday-jars">
        {(Object.keys(allocation) as BucketKey[]).map((bucket) => (
          <div key={bucket}>
            <JarVisual
              bucket={bucket}
              fillBasisPoints={StarterSplit[bucket]}
              label={`${labels[bucket].label} jar`}
            />
            <strong>{labels[bucket].label}</strong>
            <span>{formatUsdMinor(allocation[bucket])}</span>
          </div>
        ))}
      </div>
      <button
        className="button"
        disabled={busy}
        onClick={() =>
          void onCommand({
            action: "confirm_payday",
            idempotencyKey: crypto.randomUUID(),
          })
        }
      >
        {c.confirmPayday}
        <Sparkles aria-hidden="true" />
      </button>
    </section>
  );
}
