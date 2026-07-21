"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  CircleUserRound,
  Clock3,
  Globe2,
  Layers3,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { formatUsdMinor, parseUsdInputToMinor } from "@/domain/currency";
import type { DemoState, Locale } from "@/domain/demo";
import type { DemoCommand } from "@/domain/demo-contract";
import type { RootTab } from "./closed-week";
import { copy } from "./copy";

interface AppShellProps {
  state: DemoState;
  busy: boolean;
  tab?: RootTab;
  onTabChange?: (tab: RootTab) => void;
  onCommand: (command: DemoCommand) => Promise<void>;
  children: ReactNode;
}

const localeOptions: readonly Locale[] = ["en", "ru", "kk"];

export function AppShell({
  state,
  busy,
  tab,
  onTabChange,
  onCommand,
  children,
}: AppShellProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = state.locale;
  }, [state.locale]);

  return (
    <div
      className={`app-frame${state.preferences.motionEnabled ? "" : " motion-disabled"}`}
    >
      <header className="app-header">
        <div className="brand-lockup" aria-label="My First Money">
          <span className="brand-jars" aria-hidden="true">
            {(["spend", "save", "give", "grow"] as const).map((bucket) => (
              <Image
                key={bucket}
                src={`/jars/${bucket}.png`}
                width={28}
                height={42}
                alt=""
              />
            ))}
          </span>
          <strong>
            My First
            <br />
            Money
          </strong>
        </div>
        <button
          type="button"
          className="profile-button"
          aria-label={copy[state.locale].parentMenu}
          onClick={() => setSettingsOpen(true)}
        >
          <CircleUserRound aria-hidden="true" />
        </button>
      </header>

      <main className="app-main">{children}</main>

      {state.stage === "closed" && tab && onTabChange ? (
        <BottomNavigation
          locale={state.locale}
          tab={tab}
          onTabChange={onTabChange}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsSheet
          state={state}
          busy={busy}
          onClose={() => setSettingsOpen(false)}
          onCommand={onCommand}
        />
      ) : null}
    </div>
  );
}

function BottomNavigation({
  locale,
  tab,
  onTabChange,
}: {
  locale: Locale;
  tab: RootTab;
  onTabChange: (tab: RootTab) => void;
}) {
  const c = copy[locale];
  const items: Array<{
    id: RootTab;
    label: string;
    icon: ReactNode;
  }> = [
    { id: "week", label: c.navWeek, icon: <CalendarDays aria-hidden="true" /> },
    {
      id: "jars",
      label: c.navJars,
      icon: <Image src="/jars/save.png" width={28} height={40} alt="" />,
    },
    { id: "history", label: c.navHistory, icon: <Clock3 aria-hidden="true" /> },
  ];
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={tab === item.id ? "active" : ""}
          aria-current={tab === item.id ? "page" : undefined}
          onClick={() => {
            onTabChange(item.id);
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function SettingsSheet({
  state,
  busy,
  onClose,
  onCommand,
}: {
  state: DemoState;
  busy: boolean;
  onClose: () => void;
  onCommand: (command: DemoCommand) => Promise<void>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [locale, setLocale] = useState(state.locale);
  const [soundEnabled, setSoundEnabled] = useState(
    state.preferences.soundEnabled,
  );
  const [motionEnabled, setMotionEnabled] = useState(
    state.preferences.motionEnabled,
  );
  const [goalTitle, setGoalTitle] = useState(state.saveGoal.title);
  const [goalIcon, setGoalIcon] = useState(state.saveGoal.icon);
  const [goalTarget, setGoalTarget] = useState(
    (state.saveGoal.targetMinor / 100).toFixed(2),
  );
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const c = copy[locale];

  useEffect(() => {
    dialogRef.current
      ?.querySelector<HTMLElement>("button, input, select")
      ?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), select:not([disabled])",
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    const targetMinor = parseUsdInputToMinor(goalTarget);
    if (
      !targetMinor ||
      targetMinor < 100 ||
      targetMinor > 1_000_000 ||
      goalTitle.trim().length < 1 ||
      goalTitle.trim().length > 40
    ) {
      setError(c.invalidGoal);
      return;
    }

    setError(null);
    try {
      await onCommand({
        action: "update_preferences",
        locale,
        soundEnabled,
        motionEnabled,
      });
      await onCommand({
        action: "update_save_goal",
        title: goalTitle,
        targetMinor,
        icon: goalIcon,
      });
      onClose();
    } catch {
      setError(c.requestFailed);
    }
  }

  async function resetDemo() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    try {
      await onCommand({ action: "reset" });
      onClose();
    } catch {
      setError(c.requestFailed);
    }
  }

  return (
    <div className="sheet-backdrop" onPointerDown={onClose}>
      <div
        ref={dialogRef}
        className="sheet settings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onKeyDown={handleKeyDown}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet__handle" aria-hidden="true" />
        <header className="sheet__header">
          <span className="sheet__icon">
            <CircleUserRound aria-hidden="true" />
          </span>
          <h2 id="settings-title">{c.settingsTitle}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label={c.close}
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <form className="settings-form" onSubmit={saveSettings}>
          <div className="settings-row settings-row--fixed">
            <CircleUserRound aria-hidden="true" />
            <span>
              <strong>{c.childProfile}</strong>
              <small>{state.child?.displayName ?? "—"}</small>
            </span>
            <b>{state.child?.ageBand ?? "—"}</b>
          </div>

          <div className="settings-row settings-row--fixed settings-plan">
            <Layers3 aria-hidden="true" />
            <span>
              <strong>{c.currentPlan}</strong>
              <small>{c.freePlan}</small>
              <small>{c.plusComingSoon}</small>
            </span>
            <b>Free</b>
          </div>

          <fieldset className="settings-group">
            <legend>
              <Globe2 aria-hidden="true" />
              {c.language}
            </legend>
            <div className="segmented-control">
              {localeOptions.map((option) => {
                const label =
                  option === "en"
                    ? c.english
                    : option === "ru"
                      ? c.russian
                      : c.kazakh;
                return (
                  <label key={option}>
                    <input
                      type="radio"
                      name="locale"
                      value={option}
                      checked={locale === option}
                      onChange={() => setLocale(option)}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="settings-row settings-row--fixed">
            <BadgeDollarSign aria-hidden="true" />
            <span>
              <strong>{c.currency}</strong>
              <small>{c.usdOnly}</small>
            </span>
            <b>USD</b>
          </div>

          <label className="settings-row">
            <Volume2 aria-hidden="true" />
            <span>
              <strong>{c.sound}</strong>
              <small>{c.soundHelp}</small>
            </span>
            <input
              className="switch"
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.target.checked)}
            />
          </label>

          <label className="settings-row">
            <Sparkles aria-hidden="true" />
            <span>
              <strong>{c.motion}</strong>
              <small>{c.motionHelp}</small>
            </span>
            <input
              className="switch"
              type="checkbox"
              checked={motionEnabled}
              onChange={(event) => setMotionEnabled(event.target.checked)}
            />
          </label>

          <fieldset className="settings-group goal-settings">
            <legend>
              <Target aria-hidden="true" />
              {c.saveGoal}
            </legend>
            <label className="field">
              <span>{c.goalName}</span>
              <input
                value={goalTitle}
                maxLength={40}
                onChange={(event) => setGoalTitle(event.target.value)}
              />
            </label>
            <label className="field">
              <span>{c.goalIcon}</span>
              <select
                value={goalIcon}
                onChange={(event) =>
                  setGoalIcon(event.target.value as typeof goalIcon)
                }
              >
                <option value="scooter">{c.iconScooter}</option>
                <option value="bike">{c.iconBike}</option>
                <option value="books">{c.iconBooks}</option>
                <option value="game">{c.iconGame}</option>
                <option value="trip">{c.iconTrip}</option>
                <option value="custom">{c.iconCustom}</option>
              </select>
            </label>
            <label className="field">
              <span>{c.targetAmount}</span>
              <span className="money-input">
                <span aria-hidden="true">$</span>
                <input
                  inputMode="decimal"
                  value={goalTarget}
                  onChange={(event) => setGoalTarget(event.target.value)}
                />
              </span>
            </label>
            <small>
              {formatUsdMinor(state.saveGoal.targetMinor)} ·{" "}
              {state.saveGoal.title}
            </small>
          </fieldset>

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <button className="button" type="submit" disabled={busy}>
            {c.saveChanges}
          </button>
          <button
            className="danger-action"
            type="button"
            disabled={busy}
            onClick={() => void resetDemo()}
          >
            <RotateCcw aria-hidden="true" />
            <span>
              <strong>{confirmReset ? c.resetHelp : c.resetDemo}</strong>
              <small>{confirmReset ? c.resetDemo : c.resetHelp}</small>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
