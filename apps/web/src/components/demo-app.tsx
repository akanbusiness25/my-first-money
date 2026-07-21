"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDollarSign,
  LoaderCircle,
  PencilLine,
  PlayCircle,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/demo/app-shell";
import { ClosedWeek, type RootTab } from "@/components/demo/closed-week";
import { bucketCopy, copy, taskCopy } from "@/components/demo/copy";
import { JarVisual } from "@/components/demo/jar-visual";
import { formatUsdMinor } from "@/domain/currency";
import { parseUsdInputToMinor } from "@/domain/currency";
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
  const [actionError, setActionError] = useState<string | null>(null);

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
    setActionError(null);
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
      if (
        command.action === "reset" ||
        command.action === "confirm_agreement" ||
        command.action === "start_next_week"
      ) {
        setTab("week");
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "REQUEST_REJECTED";
      if (code === "SESSION_EXPIRED" || code === "CSRF_REJECTED") {
        await load();
        setActionError(copy[snapshot.state.locale].sessionExpired);
      } else {
        setActionError(copy[snapshot.state.locale].requestFailed);
      }
      throw error;
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
  const productRoot = state.stage === "week" || state.stage === "closed";
  const journeyCommand = async (command: DemoCommand) => {
    try {
      await send(command);
    } catch {
      // The app-level alert already reports the failure and recovers expired
      // bounded sessions. Journey controls do not need a second error surface.
    }
  };
  return (
    <AppShell
      state={state}
      busy={busy}
      tab={productRoot ? tab : undefined}
      onTabChange={productRoot ? setTab : undefined}
      onCommand={send}
    >
      {actionError ? (
        <p className="session-notice" role="alert">
          {actionError}
        </p>
      ) : null}
      {state.stage === "closed" ? (
        <ClosedWeek
          state={state}
          tab={tab}
          busy={busy}
          onTabChange={setTab}
          onCommand={send}
        />
      ) : state.stage === "week" ? (
        tab === "week" ? (
          <ActiveWeek state={state} busy={busy} onCommand={journeyCommand} />
        ) : (
          <ClosedWeek
            state={state}
            tab={tab}
            busy={busy}
            onTabChange={setTab}
            onCommand={send}
          />
        )
      ) : (
        <JourneyScreen
          key={snapshot.csrfToken}
          state={state}
          busy={busy}
          onCommand={journeyCommand}
        />
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
  step?: number;
}) {
  return (
    <header className="journey-heading">
      {step ? (
        <span className="step-count" aria-label={`Step ${step} of 3`}>
          {step}/3
        </span>
      ) : null}
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function ChildSetup({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const [runMode, setRunMode] = useState<"choice" | "test" | "fresh">("choice");
  const [displayName, setDisplayName] = useState(
    state.child?.displayName ?? "",
  );
  const [ageBand, setAgeBand] = useState<AgeBand>(
    state.child?.ageBand ?? "8-12",
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!displayName.trim()) return;
    void onCommand({
      action: "create_child",
      displayName: displayName.trim(),
      ageBand,
    });
  }

  if (runMode === "choice") {
    return (
      <section className="journey-screen run-choice-screen">
        <header className="journey-heading journey-heading--plain">
          <h1>{c.runChoiceTitle}</h1>
          <p>{c.runChoiceBody}</p>
        </header>
        <div className="run-choice-list">
          <button
            type="button"
            className="run-choice-card run-choice-card--primary"
            onClick={() => {
              setDisplayName("Alex");
              setAgeBand("8-12");
              setRunMode("test");
            }}
          >
            <PlayCircle aria-hidden="true" />
            <span>
              <strong>{c.testRun}</strong>
              <small>{c.testRunHelp}</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="run-choice-card"
            onClick={() => {
              setDisplayName("");
              setAgeBand("8-12");
              setRunMode("fresh");
            }}
          >
            <PencilLine aria-hidden="true" />
            <span>
              <strong>{c.startFresh}</strong>
              <small>{c.startFreshHelp}</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="journey-screen">
      <button
        type="button"
        className="back-link"
        onClick={() => setRunMode("choice")}
      >
        <ArrowLeft aria-hidden="true" />
        {c.backToRunChoice}
      </button>
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
  const [objective, setObjective] = useState<LearningObjective>(
    state.mission?.objective ?? "first_choices",
  );
  const [baseAmount, setBaseAmount] = useState(
    ((state.mission?.baseAmountMinor ?? 1_000) / 100).toFixed(2),
  );
  const baseAmountMinor = parseUsdInputToMinor(baseAmount);
  const objectives: Array<{
    id: LearningObjective;
    label: string;
    help: string;
  }> = [
    {
      id: "first_choices",
      label: c.objectiveFirstChoices,
      help: c.objectiveFirstHelp,
    },
    {
      id: "saving_patience",
      label: c.objectiveSavingPatience,
      help: c.objectiveSavingHelp,
    },
    {
      id: "balanced_sharing",
      label: c.objectiveBalancedSharing,
      help: c.objectiveSharingHelp,
    },
  ];

  return (
    <section className="journey-screen">
      <button
        className="back-link"
        disabled={busy}
        onClick={() => void onCommand({ action: "back_to_child_setup" })}
      >
        <ArrowLeft aria-hidden="true" />
        {c.back}
      </button>
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
            <span>
              <strong>
                {item.label}
                {item.id === "first_choices" ? (
                  <small className="default-label">{c.defaultChoice}</small>
                ) : null}
              </strong>
              <small>{item.help}</small>
            </span>
            <Check aria-hidden="true" />
          </label>
        ))}
      </div>
      <label className="field weekly-base-field">
        <span>{c.weeklyBase}</span>
        <span className="money-input">
          <span aria-hidden="true">$</span>
          <input
            inputMode="decimal"
            value={baseAmount}
            aria-describedby="weekly-base-help"
            onChange={(event) => setBaseAmount(event.target.value)}
          />
        </span>
        <small id="weekly-base-help">{c.weeklyBaseHelp}</small>
      </label>
      <button
        className="button"
        disabled={
          busy ||
          baseAmountMinor === null ||
          baseAmountMinor < 0 ||
          baseAmountMinor > 10_000
        }
        onClick={() =>
          void onCommand({
            action: "create_mission",
            objective,
            baseAmountMinor: baseAmountMinor!,
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
  const mission = state.mission;
  const labels = taskCopy[state.locale];
  const taskGroups = [
    {
      kind: "responsibility" as const,
      title: c.responsibilities,
    },
    { kind: "paid" as const, title: c.paidJobs },
  ];
  return (
    <section className="journey-screen">
      <button
        className="back-link"
        disabled={busy}
        onClick={() => void onCommand({ action: "back_to_mission_builder" })}
      >
        <ArrowLeft aria-hidden="true" />
        {c.back}
      </button>
      <StepHeader title={c.agreementTitle} body={c.agreementBody} step={3} />
      <div className="agreement-people">
        <button
          type="button"
          aria-pressed={mission?.parentMarked ?? false}
          disabled={busy}
          onClick={() =>
            void onCommand({
              action: "set_agreement_mark",
              actor: "parent",
              marked: !(mission?.parentMarked ?? false),
            })
          }
        >
          <UsersRound aria-hidden="true" />
          {c.parentMarked}
          {mission?.parentMarked ? <CheckCircle2 aria-hidden="true" /> : null}
          <span className="mini-confetti" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-pressed={mission?.childMarked ?? false}
          disabled={busy}
          onClick={() =>
            void onCommand({
              action: "set_agreement_mark",
              actor: "child",
              marked: !(mission?.childMarked ?? false),
            })
          }
        >
          <ShieldCheck aria-hidden="true" />
          {c.childMarked}
          {mission?.childMarked ? <CheckCircle2 aria-hidden="true" /> : null}
          <span className="mini-confetti" aria-hidden="true" />
        </button>
      </div>
      <p className="agreement-marks-help">{c.agreementMarksHelp}</p>
      <div className="agreement-task-groups">
        {taskGroups.map((group) => (
          <fieldset key={group.kind}>
            <legend>{group.title}</legend>
            {(mission?.tasks ?? [])
              .filter((task) => task.kind === group.kind)
              .map((task) => (
                <label className="agreement-task-option" key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.included}
                    disabled={busy}
                    onChange={(event) =>
                      void onCommand({
                        action: "set_task_included",
                        taskId: task.id,
                        included: event.target.checked,
                      })
                    }
                  />
                  <span>
                    <strong>{labels[task.id].label}</strong>
                    <small>{labels[task.id].detail}</small>
                  </span>
                </label>
              ))}
          </fieldset>
        ))}
      </div>
      <p className="base-not-penalty">{c.baseNotPenalty}</p>
      <button
        className="button"
        disabled={
          busy ||
          !mission?.parentMarked ||
          !mission.childMarked ||
          !mission.tasks.some((task) => task.included)
        }
        onClick={() => void onCommand({ action: "confirm_agreement" })}
      >
        {c.startWeek}
      </button>
    </section>
  );
}

function ActiveWeek({ state, busy, onCommand }: JourneyProps) {
  const c = copy[state.locale];
  const objectiveCopy: Record<LearningObjective, string> = {
    first_choices: c.objectiveFirstChoices,
    saving_patience: c.objectiveSavingPatience,
    balanced_sharing: c.objectiveBalancedSharing,
  };
  return (
    <section className="closed-screen active-week-screen">
      <header className="hero-heading">
        <h1>{c.thisWeek}</h1>
        <p>{c.activeWeekDemoBody}</p>
      </header>
      <div className="mission-banner">
        <Target aria-hidden="true" />
        <span>
          {state.mission
            ? objectiveCopy[state.mission.objective]
            : c.objectiveFirstChoices}
        </span>
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
  const tasks = (state.mission?.tasks ?? []).filter((task) => task.included);
  const labels = taskCopy[state.locale];
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <span className="task-list__check">
            <Circle aria-hidden="true" />
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
  const tasks = (state.mission?.tasks ?? []).filter((task) => task.included);
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
      <StepHeader title={c.quickCheckTitle} body={c.quickCheckBody} />
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
      <p className="base-not-penalty">{c.baseNotPenalty}</p>
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
      <button
        className="back-link"
        disabled={busy}
        onClick={() => void onCommand({ action: "back_to_agreement" })}
      >
        <ArrowLeft aria-hidden="true" />
        {c.back}
      </button>
      <StepHeader title={c.paydayTitle} body={c.paydayBody} />
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
      </button>
    </section>
  );
}
