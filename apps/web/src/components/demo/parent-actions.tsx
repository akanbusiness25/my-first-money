"use client";

import { ArrowRight, Gift, HandCoins, LockKeyhole, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatUsdMinor, parseUsdInputToMinor } from "@/domain/currency";
import type { Locale } from "@/domain/demo";
import type { DemoCommand } from "@/domain/demo-contract";
import type { BucketKey } from "@/domain/money";
import { bucketCopy, copy } from "./copy";

type ParentActionMode = "bonus" | "move" | "use";
type BucketUsePurpose = "purchase" | "goal" | "gift" | "learning";

interface ParentActionsProps {
  mode: ParentActionMode;
  locale: Locale;
  balances: Readonly<Record<BucketKey, number>>;
  busy: boolean;
  initialBucket?: BucketKey;
  onClose: () => void;
  onCommand: (command: DemoCommand) => Promise<void>;
}

const buckets: readonly BucketKey[] = ["spend", "save", "give", "grow"];

export function ParentActions({
  mode,
  locale,
  balances,
  busy,
  initialBucket = "save",
  onClose,
  onCommand,
}: ParentActionsProps) {
  const c = copy[locale];
  const labels = bucketCopy[locale];
  const dialogRef = useRef<HTMLDivElement>(null);
  const [bucket, setBucket] = useState<BucketKey>(initialBucket);
  const [fromBucket, setFromBucket] = useState<BucketKey>(
    initialBucket === "save" ? "spend" : initialBucket,
  );
  const [toBucket, setToBucket] = useState<BucketKey>(
    initialBucket === "spend" ? "save" : initialBucket,
  );
  const [amount, setAmount] = useState(mode === "bonus" ? "1.00" : "0.50");
  const [purpose, setPurpose] = useState<BucketUsePurpose>("purchase");
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const title =
    mode === "bonus"
      ? c.addParentBonus
      : mode === "move"
        ? c.moveMoney
        : c.useFromJar;
  const amountMinor = parseUsdInputToMinor(amount);

  useEffect(() => {
    dialogRef.current
      ?.querySelector<HTMLElement>("button, input, select")
      ?.focus();
  }, []);

  function validate(): string | null {
    if (!amountMinor || amountMinor > 10_000) return c.invalidAmount;
    if (mode === "move" && fromBucket === toBucket) return c.sameJarError;
    if (mode === "move" && amountMinor > balances[fromBucket]) {
      return c.insufficientBalance;
    }
    if (mode === "use" && amountMinor > balances[bucket]) {
      return c.insufficientBalance;
    }
    return null;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setReviewing(false);
      return;
    }
    if (!reviewing) {
      setError(null);
      setReviewing(true);
      return;
    }

    try {
      if (mode === "bonus") {
        await onCommand({
          action: "add_parent_bonus",
          idempotencyKey: crypto.randomUUID(),
          bucket,
          amountMinor: amountMinor!,
        });
      } else if (mode === "move") {
        await onCommand({
          action: "move_money",
          idempotencyKey: crypto.randomUUID(),
          fromBucket,
          toBucket,
          amountMinor: amountMinor!,
        });
      } else {
        await onCommand({
          action: "record_bucket_use",
          idempotencyKey: crypto.randomUUID(),
          bucket,
          purpose,
          amountMinor: amountMinor!,
        });
      }
      onClose();
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "";
      setError(
        code.includes("INSUFFICIENT") ? c.insufficientBalance : c.requestFailed,
      );
      setReviewing(false);
    }
  }

  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
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

  return (
    <div className="sheet-backdrop" onPointerDown={onClose}>
      <div
        ref={dialogRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-action-title"
        onKeyDown={handleDialogKeyDown}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet__handle" aria-hidden="true" />
        <header className="sheet__header">
          <span className="sheet__icon" aria-hidden="true">
            {mode === "bonus" ? (
              <Gift />
            ) : mode === "move" ? (
              <ArrowRight />
            ) : (
              <HandCoins />
            )}
          </span>
          <h2 id="parent-action-title">{title}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label={c.close}
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <form className="action-form" onSubmit={submit}>
          {mode === "bonus" || mode === "use" ? (
            <label className="field">
              <span>{c.chooseJar}</span>
              <select
                value={bucket}
                disabled={reviewing || busy}
                onChange={(event) => {
                  setBucket(event.target.value as BucketKey);
                  setReviewing(false);
                }}
              >
                {buckets.map((key) => (
                  <option key={key} value={key}>
                    {labels[key].label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="field-pair">
              <label className="field">
                <span>{c.fromJar}</span>
                <select
                  value={fromBucket}
                  disabled={reviewing || busy}
                  onChange={(event) => {
                    setFromBucket(event.target.value as BucketKey);
                    setReviewing(false);
                  }}
                >
                  {buckets.map((key) => (
                    <option key={key} value={key}>
                      {labels[key].label} · {formatUsdMinor(balances[key])}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{c.toJar}</span>
                <select
                  value={toBucket}
                  disabled={reviewing || busy}
                  onChange={(event) => {
                    setToBucket(event.target.value as BucketKey);
                    setReviewing(false);
                  }}
                >
                  {buckets.map((key) => (
                    <option key={key} value={key}>
                      {labels[key].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {mode === "use" ? (
            <label className="field">
              <span>{c.usePurpose}</span>
              <select
                value={purpose}
                disabled={reviewing || busy}
                onChange={(event) => {
                  setPurpose(event.target.value as BucketUsePurpose);
                  setReviewing(false);
                }}
              >
                <option value="purchase">{c.purposePurchase}</option>
                <option value="goal">{c.purposeGoal}</option>
                <option value="gift">{c.purposeGift}</option>
                <option value="learning">{c.purposeLearning}</option>
              </select>
            </label>
          ) : null}

          <label className="field">
            <span>
              {mode === "bonus"
                ? c.bonusAmount
                : mode === "move"
                  ? c.moveAmount
                  : c.useAmount}
            </span>
            <span className="money-input">
              <span aria-hidden="true">$</span>
              <input
                inputMode="decimal"
                value={amount}
                disabled={reviewing || busy}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setReviewing(false);
                  setError(null);
                }}
              />
            </span>
          </label>

          {reviewing && amountMinor ? (
            <div className="review-strip" aria-live="polite">
              <strong>{formatUsdMinor(amountMinor)}</strong>
              <span>
                {mode === "bonus" || mode === "use"
                  ? labels[bucket].label
                  : `${labels[fromBucket].label} → ${labels[toBucket].label}`}
              </span>
            </div>
          ) : null}

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <p className="parent-note">
            <LockKeyhole aria-hidden="true" />
            {c.parentConfirms}
          </p>

          <div className="sheet__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
            >
              {c.cancel}
            </button>
            <button type="submit" className="button" disabled={busy}>
              {reviewing
                ? mode === "bonus"
                  ? c.confirmBonus
                  : mode === "move"
                    ? c.confirmMove
                    : c.confirmUse
                : c.continue}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
