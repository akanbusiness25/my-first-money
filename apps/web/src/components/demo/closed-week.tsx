"use client";

import {
  ArrowLeft,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  GitFork,
  Gift,
  HandHeart,
  LockKeyhole,
  MoveHorizontal,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  UsersRound,
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { formatUsdMinor } from "@/domain/currency";
import type { DemoState, Locale } from "@/domain/demo";
import type { DemoCommand } from "@/domain/demo-contract";
import {
  bucketShareBasisPoints,
  goalProgressBasisPoints,
  projectLedgerBalances,
} from "@/domain/ledger";
import type { BucketKey } from "@/domain/money";
import { bucketCopy, copy } from "./copy";
import { JarVisual } from "./jar-visual";
import { ParentActions } from "./parent-actions";
import { useJarSound } from "./use-jar-sound";

export type RootTab = "week" | "jars" | "history";

interface ClosedWeekProps {
  state: DemoState;
  tab: RootTab;
  busy: boolean;
  onTabChange: (tab: RootTab) => void;
  onCommand: (command: DemoCommand) => Promise<void>;
}

const buckets: readonly BucketKey[] = ["spend", "save", "give", "grow"];

const bucketIcons: Record<BucketKey, LucideIcon> = {
  spend: ShoppingBag,
  save: ShieldCheck,
  give: HandHeart,
  grow: Sprout,
};

const localeTags: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  kk: "kk-KZ",
};

function formatPercent(basisPoints: number): string {
  const percent = basisPoints / 100;
  return `${Number.isInteger(percent) ? percent : percent.toFixed(1)}%`;
}

function formatEventDate(value: string, locale: Locale): string {
  if (locale === "kk") {
    // Compact Chromium ICU can render Kazakh months as "M07"; keep dates numeric.
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));
  }

  return new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function GoalCard({
  locale,
  title,
  savedMinor,
  targetMinor,
}: {
  locale: Locale;
  title: string;
  savedMinor: number;
  targetMinor: number;
}) {
  const progress = goalProgressBasisPoints(savedMinor, targetMinor);
  return (
    <section className="goal-card" aria-label={copy[locale].saveGoal}>
      <span className="goal-card__icon" aria-hidden="true">
        <Image src="/jars/scooter.png" width={96} height={64} alt="" />
      </span>
      <span className="goal-card__body">
        <strong>{title}</strong>
        <span>
          <b>{formatUsdMinor(savedMinor)}</b> / {formatUsdMinor(targetMinor)}
        </span>
        <span className="goal-progress" aria-hidden="true">
          <span style={{ width: `${progress / 100}%` }} />
        </span>
      </span>
      <span className="sr-only">
        {copy[locale].goalProgress}: {formatPercent(progress)}
      </span>
    </section>
  );
}

function InteractiveJar({
  bucket,
  fillBasisPoints,
  locale,
  focused = false,
  soundEnabled,
  onActivate,
}: {
  bucket: BucketKey;
  fillBasisPoints: number;
  locale: Locale;
  focused?: boolean;
  soundEnabled: boolean;
  onActivate?: () => void;
}) {
  const labels = bucketCopy[locale];
  const { play } = useJarSound(bucket, soundEnabled);
  return (
    <JarVisual
      bucket={bucket}
      fillBasisPoints={fillBasisPoints}
      focused={focused}
      interactive
      label={`${labels[bucket].label} jar`}
      onActivate={onActivate}
      onShake={play}
    />
  );
}

function JarRow({
  locale,
  balances,
  fillBasisPoints,
  interactive,
  soundEnabled,
  onSelect,
}: {
  locale: Locale;
  balances: Readonly<Record<BucketKey, number>>;
  fillBasisPoints: Readonly<Record<BucketKey, number>>;
  interactive?: boolean;
  soundEnabled: boolean;
  onSelect?: (bucket: BucketKey) => void;
}) {
  const labels = bucketCopy[locale];
  return (
    <div className="jar-row">
      {buckets.map((bucket) => (
        <article className={`jar-item jar-item--${bucket}`} key={bucket}>
          {interactive ? (
            <InteractiveJar
              bucket={bucket}
              fillBasisPoints={fillBasisPoints[bucket]}
              locale={locale}
              soundEnabled={soundEnabled}
              onActivate={() => onSelect?.(bucket)}
            />
          ) : (
            <JarVisual
              bucket={bucket}
              fillBasisPoints={fillBasisPoints[bucket]}
              label={`${labels[bucket].label} jar`}
            />
          )}
          <strong>{labels[bucket].label}</strong>
          <b>{formatUsdMinor(balances[bucket])}</b>
          {interactive ? (
            <span>{formatPercent(fillBasisPoints[bucket])}</span>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function PrimaryActions({
  locale,
  busy,
  onBonus,
  onMove,
}: {
  locale: Locale;
  busy: boolean;
  onBonus: () => void;
  onMove: () => void;
}) {
  const c = copy[locale];
  return (
    <div className="primary-actions">
      <button className="button button--hero" disabled={busy} onClick={onBonus}>
        <Gift aria-hidden="true" />
        {c.addParentBonus}
      </button>
      <button
        className="button button--outline"
        disabled={busy}
        onClick={onMove}
      >
        <ArrowRightLeft aria-hidden="true" />
        {c.moveMoney}
      </button>
      <p className="parent-note">
        <LockKeyhole aria-hidden="true" />
        {c.parentConfirms}
      </p>
    </div>
  );
}

function WeekScreen({
  state,
  balances,
  onCommand,
  busy,
}: {
  state: DemoState;
  balances: Record<BucketKey, number>;
  onCommand: (command: DemoCommand) => Promise<void>;
  busy: boolean;
}) {
  const c = copy[state.locale];
  const [momentOpen, setMomentOpen] = useState(false);
  const [momentError, setMomentError] = useState(false);
  const immutableSplit = {
    spend: 7_000,
    save: 1_000,
    give: 1_000,
    grow: 1_000,
  };

  async function openMoneyMoment() {
    setMomentError(false);
    try {
      await onCommand({ action: "request_money_moment" });
      setMomentOpen(true);
    } catch {
      setMomentError(true);
    }
  }

  return (
    <div className="closed-screen week-complete-screen">
      <div className="celebration-mark" aria-hidden="true">
        <Sparkles className="celebration-mark__spark celebration-mark__spark--one" />
        <span className="celebration-mark__check">
          <Check />
        </span>
        <Sparkles className="celebration-mark__spark celebration-mark__spark--two" />
      </div>
      <header className="hero-heading hero-heading--center">
        <h1>{c.weekComplete}</h1>
        <p>{c.weekCompleteBody}</p>
      </header>

      <div className="reviewed-amount">
        <UsersRound aria-hidden="true" />
        <span>{c.familyReviewed}</span>
        <strong>{formatUsdMinor(state.payday?.totalMinor ?? 0)}</strong>
      </div>

      <div className="allocation-fork" aria-hidden="true">
        <GitFork />
      </div>

      <JarRow
        locale={state.locale}
        balances={balances}
        fillBasisPoints={immutableSplit}
        soundEnabled={false}
      />

      <GoalCard
        locale={state.locale}
        title={state.saveGoal.title}
        savedMinor={balances.save}
        targetMinor={state.saveGoal.targetMinor}
      />

      <button
        className="button button--hero"
        disabled={busy}
        onClick={() => void openMoneyMoment()}
      >
        <Sparkles aria-hidden="true" />
        {c.talkAboutWeek}
      </button>
      {momentError ? (
        <p className="form-error" role="alert">
          {c.requestFailed}
        </p>
      ) : null}
      <button
        className="text-button"
        disabled={busy}
        onClick={() => void onCommand({ action: "reset" })}
      >
        {c.startNextWeek}
      </button>

      {momentOpen && state.moneyMoment ? (
        <MoneyMomentSheet state={state} onClose={() => setMomentOpen(false)} />
      ) : null}
    </div>
  );
}

function JarsScreen({
  state,
  balances,
  shares,
  busy,
  onCommand,
}: {
  state: DemoState;
  balances: Record<BucketKey, number>;
  shares: Record<BucketKey, number>;
  busy: boolean;
  onCommand: (command: DemoCommand) => Promise<void>;
}) {
  const c = copy[state.locale];
  const labels = bucketCopy[state.locale];
  const [selectedBucket, setSelectedBucket] = useState<BucketKey | null>(null);
  const [actionMode, setActionMode] = useState<"bonus" | "move" | null>(null);

  if (selectedBucket) {
    const Icon = bucketIcons[selectedBucket];
    const progress =
      selectedBucket === "save"
        ? goalProgressBasisPoints(balances.save, state.saveGoal.targetMinor)
        : shares[selectedBucket];
    const heading =
      selectedBucket === "save"
        ? `${state.saveGoal.title} goal`
        : `${labels[selectedBucket].label} ${c.jarDetail.toLocaleLowerCase(state.locale)}`;

    return (
      <div className="closed-screen jar-detail-screen">
        <button className="back-link" onClick={() => setSelectedBucket(null)}>
          <ArrowLeft aria-hidden="true" />
          {c.backToJars}
        </button>

        <div className="bucket-tabs" role="tablist" aria-label={c.fourJars}>
          {buckets.map((bucket) => {
            const TabIcon = bucketIcons[bucket];
            return (
              <button
                key={bucket}
                role="tab"
                aria-selected={selectedBucket === bucket}
                className={`bucket-tab bucket-tab--${bucket}`}
                onClick={() => setSelectedBucket(bucket)}
              >
                <TabIcon aria-hidden="true" />
                {labels[bucket].label}
              </button>
            );
          })}
        </div>

        <header className="focused-heading">
          <span className={`bucket-chip bucket-chip--${selectedBucket}`}>
            <Icon aria-hidden="true" />
            {labels[selectedBucket].label}
          </span>
          <h1>{heading}</h1>
          <p>
            <strong>{formatUsdMinor(balances[selectedBucket])}</strong>
            {selectedBucket === "save"
              ? ` / ${formatUsdMinor(state.saveGoal.targetMinor)}`
              : ` · ${c.currentBalance}`}
          </p>
          <b className="progress-pill">{formatPercent(progress)}</b>
        </header>

        <div className="focused-jar-wrap">
          <InteractiveJar
            bucket={selectedBucket}
            fillBasisPoints={progress}
            locale={state.locale}
            focused
            soundEnabled={state.preferences.soundEnabled}
          />
        </div>

        <div className="shake-cue">
          <MoveHorizontal aria-hidden="true" />
          <strong>{c.dragToShake}</strong>
          <Volume2 aria-hidden="true" />
        </div>
        <p className="keyboard-hint">{c.keyboardShake}</p>

        <PrimaryActions
          locale={state.locale}
          busy={busy}
          onBonus={() => setActionMode("bonus")}
          onMove={() => setActionMode("move")}
        />

        {actionMode ? (
          <ParentActions
            mode={actionMode}
            locale={state.locale}
            balances={balances}
            busy={busy}
            initialBucket={selectedBucket}
            onClose={() => setActionMode(null)}
            onCommand={onCommand}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="closed-screen jars-screen">
      <header className="hero-heading">
        <h1>{c.fourJars}</h1>
        <p>{c.fourJarsBody}</p>
      </header>

      <JarRow
        locale={state.locale}
        balances={balances}
        fillBasisPoints={shares}
        interactive
        soundEnabled={state.preferences.soundEnabled}
        onSelect={setSelectedBucket}
      />

      <p className="tap-hint">
        <MoveHorizontal aria-hidden="true" />
        {c.jarDetail}
      </p>

      <GoalCard
        locale={state.locale}
        title={state.saveGoal.title}
        savedMinor={balances.save}
        targetMinor={state.saveGoal.targetMinor}
      />

      <PrimaryActions
        locale={state.locale}
        busy={busy}
        onBonus={() => setActionMode("bonus")}
        onMove={() => setActionMode("move")}
      />

      {actionMode ? (
        <ParentActions
          mode={actionMode}
          locale={state.locale}
          balances={balances}
          busy={busy}
          onClose={() => setActionMode(null)}
          onCommand={onCommand}
        />
      ) : null}
    </div>
  );
}

function HistoryScreen({ state }: { state: DemoState }) {
  const c = copy[state.locale];
  const labels = bucketCopy[state.locale];
  const payday = state.payday;

  return (
    <div className="closed-screen history-screen">
      <header className="hero-heading">
        <h1>{c.historyTitle}</h1>
        <p>{c.historyBody}</p>
      </header>

      {payday ? (
        <ol className="history-list">
          <li>
            <span className="history-list__mark history-list__mark--closed">
              <CheckCircle2 aria-hidden="true" />
            </span>
            <div>
              <span>{c.weekClosed}</span>
              <strong>{formatUsdMinor(payday.totalMinor)}</strong>
              <p>
                {formatUsdMinor(payday.baseAmountMinor)} +{" "}
                {formatUsdMinor(payday.paidTaskMinor)} ={" "}
                {formatUsdMinor(payday.totalMinor)}
              </p>
              <time dateTime={payday.closedAt}>
                {formatEventDate(payday.closedAt, state.locale)}
              </time>
            </div>
          </li>
          <li>
            <span className="history-list__mark history-list__mark--grow">
              <Sprout aria-hidden="true" />
            </span>
            <div>
              <span>{c.growBonus}</span>
              <strong>
                +{formatUsdMinor(payday.growBonusMinor)} · {labels.grow.label}
              </strong>
            </div>
          </li>
          {state.ledgerEvents.map((event) => {
            if (event.kind === "parent_bonus") {
              return (
                <li key={event.id}>
                  <span className="history-list__mark">
                    <Gift aria-hidden="true" />
                  </span>
                  <div>
                    <span>{c.parentBonus}</span>
                    <strong>
                      +{formatUsdMinor(event.amountMinor)} ·{" "}
                      {labels[event.bucket].label}
                    </strong>
                    <time dateTime={event.createdAt}>
                      {formatEventDate(event.createdAt, state.locale)}
                    </time>
                  </div>
                </li>
              );
            }
            return (
              <li key={event.id}>
                <span className="history-list__mark">
                  <ArrowRightLeft aria-hidden="true" />
                </span>
                <div>
                  <span>{c.bucketMove}</span>
                  <strong>
                    {formatUsdMinor(event.amountMinor)} ·{" "}
                    {labels[event.fromBucket].label} →{" "}
                    {labels[event.toBucket].label}
                  </strong>
                  <time dateTime={event.createdAt}>
                    {formatEventDate(event.createdAt, state.locale)}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="empty-state">{c.noActivity}</p>
      )}
    </div>
  );
}

function MoneyMomentSheet({
  state,
  onClose,
}: {
  state: DemoState;
  onClose: () => void;
}) {
  const c = copy[state.locale];
  const card = state.moneyMoment?.card;
  if (!card) return null;
  return (
    <div className="sheet-backdrop" onPointerDown={onClose}>
      <section
        className="sheet money-moment-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="money-moment-heading"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header className="sheet__header">
          <span className="sheet__icon">
            <Sparkles aria-hidden="true" />
          </span>
          <div>
            <span>{c.localCard}</span>
            <h2 id="money-moment-heading">{card.title}</h2>
          </div>
          <button
            className="icon-button"
            aria-label={c.close}
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <p>{card.explanation}</p>
        <h3>{c.questions}</h3>
        <ol>
          {card.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
        {card.familyAction ? (
          <div className="family-action">
            <strong>{c.familyAction}</strong>
            <p>{card.familyAction}</p>
          </div>
        ) : null}
        <button className="button" onClick={onClose}>
          {c.close}
        </button>
      </section>
    </div>
  );
}

export function ClosedWeek({
  state,
  tab,
  busy,
  onTabChange: _onTabChange,
  onCommand,
}: ClosedWeekProps) {
  void _onTabChange;
  const payday = state.payday;
  const balances = projectLedgerBalances({
    payday: payday?.allocation ?? null,
    growBonusMinor: payday?.growBonusMinor ?? 0,
    events: state.ledgerEvents,
  });
  const shares = bucketShareBasisPoints(balances);

  if (tab === "jars") {
    return (
      <JarsScreen
        state={state}
        balances={balances}
        shares={shares}
        busy={busy}
        onCommand={onCommand}
      />
    );
  }
  if (tab === "history") return <HistoryScreen state={state} />;
  return (
    <WeekScreen
      state={state}
      balances={balances}
      busy={busy}
      onCommand={onCommand}
    />
  );
}
