# My First Money Managed Product Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved Week / Jars / focused-jar redesign with English-default EN/RU/KK localization, USD-only money, parent Settings, one editable Save goal, append-only parent bonuses and bucket moves, safe Money Moment, and accessible jar gesture/sound.

**Architecture:** Keep the existing Next.js modular monolith and same-origin `/api/v1/demo` boundary. Domain modules own USD formatting, ledger projection, percentages, goal progress, and strict command validation; the bounded synthetic session owns preferences and append-only events. Split the oversized client component into focused screen/sheet modules while keeping `DemoApp` as orchestration.

**Tech Stack:** Node 24.18.0, pnpm 11.15.0, Next.js 16.2.10, React 19.2.7, TypeScript 6.0.3, Zod 4.4.3, Vitest 4.1.10, Playwright 1.61.1, Tailwind 4.3.3 plus project CSS, Lucide React 1.25.0, built-in Image Gen assets.

## Global Constraints

- Work in `D:\app myfirstmoney` and keep the primary task `firstmoney main`; do not create a new project or worktree.
- Synthetic/demo data only; do not request or create `OPENAI_API_KEY`.
- USD is the sole MVP display currency; every money value is a safe integer in cents and renders as `$0.00`.
- English is default; English, Russian, and Kazakh share one typed copy contract and language changes only through Settings.
- Persistent root navigation remains Week / Jars / History; Settings is a parent sheet.
- Payday is immutable and idempotent; parent bonuses and moves are append-only, idempotent, parent-confirmed events.
- Free allocation remains 70/10/10/10 and Free has one editable Save goal.
- Money Moment remains allowlisted, strict-Zod, provider-based, deterministic-fallback, and non-blocking.
- No child credentials, bank rail, currency conversion, interest, investment, XP, avatars, streaks, leaderboard, token economy, or real-family beta claim.
- Visual target is exactly `docs/design/redesign-week-approved.png`, `docs/design/redesign-jars-approved.png`, and `docs/design/redesign-jar-detail-approved.png`; code-native USD data supersedes KZT text inside the images.
- Verify 390×844 against the concepts, plus 320px, 428px, desktop, keyboard, reduced motion, safe area, long RU/KK copy, and no private browser storage.

---

## File Structure

### Domain and application

- Create `apps/web/src/domain/currency.ts`: USD-only schema and `formatUsdMinor`.
- Create `apps/web/src/domain/ledger.ts`: parent-bonus/move types, validation, balance projection, current-share percentages, and goal progress.
- Modify `apps/web/src/domain/demo.ts`: `en` locale, preferences, USD child currency, editable goal, append-only events.
- Modify `apps/web/src/domain/demo-contract.ts`: strict update-preferences, goal, bonus, and move commands.
- Modify `apps/web/src/server/demo/session-store.ts`: apply idempotent new commands and project balances.
- Modify Money Moment schema/providers: support `en` without adding amounts, names, goal text, or free-form fields.

### UI

- Create `apps/web/src/components/demo/copy.ts`: complete typed EN/RU/KK copy and task/bucket labels.
- Create `apps/web/src/components/demo/app-shell.tsx`: header, parent Settings trigger/sheet, bottom navigation, shared dialog shell.
- Create `apps/web/src/components/demo/jar-visual.tsx`: real generated jar assets, dynamic fill, pointer/keyboard gesture, accessible state.
- Create `apps/web/src/components/demo/closed-week.tsx`: approved Week, Jars, focused jar, History, Money Moment composition.
- Create `apps/web/src/components/demo/parent-actions.tsx`: parent bonus, move, and goal-edit review flows.
- Create `apps/web/src/components/demo/use-jar-sound.ts`: short user-triggered Web Audio signatures with safe no-audio fallback.
- Modify `apps/web/src/components/demo-app.tsx`: lifecycle orchestration and API commands; remove duplicated root markup/copy.
- Rewrite affected sections in `apps/web/src/app/globals.css` using approved tokens and responsive/accessibility states.

### Assets and verification

- Create `apps/web/public/jars/spend.png`, `save.png`, `give.png`, `grow.png`, and `scooter.png` from approved art direction.
- Modify unit/E2E tests and evidence capture for English default and new flows.
- Create/update `design-qa.md`, `STATUS.md`, `ROADMAP.md`, `patches/PATCH-1.md`, and `docs/BUILD_WEEK.md` only with verified facts.

---

### Task 1: USD, locale, preferences, and derived money helpers

**Files:**

- Create: `apps/web/src/domain/currency.ts`
- Create: `apps/web/src/domain/currency.test.ts`
- Create: `apps/web/src/domain/ledger.ts`
- Create: `apps/web/src/domain/ledger.test.ts`
- Modify: `apps/web/src/domain/demo.ts`
- Modify: `apps/web/src/domain/demo-contract.ts`

**Interfaces:**

- Produces: `CurrencySchema`, `formatUsdMinor(minor: number): string`.
- Produces: `DemoLedgerEvent`, `projectBucketBalances(state)`, `bucketShareBasisPoints(balances)`, `goalProgressBasisPoints(savedMinor, targetMinor)`.
- Produces strict commands `update_preferences`, `update_save_goal`, `add_parent_bonus`, and `move_money`.

- [ ] **Step 1: Write failing USD and ledger tests**

```ts
expect(formatUsdMinor(1_800)).toBe("$18.00");
expect(formatUsdMinor(1)).toBe("$0.01");
expect(() => formatUsdMinor(-1)).toThrow("INVALID_MONEY_MINOR");

const balances = projectLedgerBalances({
  payday: { spend: 1_260, save: 180, give: 180, grow: 180 },
  growBonusMinor: 100,
  events: [
    {
      id: "bonus",
      kind: "parent_bonus",
      bucket: "save",
      amountMinor: 100,
      createdAt: now,
    },
    {
      id: "move",
      kind: "bucket_move",
      fromBucket: "spend",
      toBucket: "give",
      amountMinor: 60,
      createdAt: now,
    },
  ],
});
expect(balances).toEqual({ spend: 1_200, save: 280, give: 240, grow: 280 });
expect(goalProgressBasisPoints(280, 8_000)).toBe(350);
```

- [ ] **Step 2: Run tests and verify RED**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/domain/currency.test.ts src/domain/ledger.test.ts`

Expected: FAIL because the new modules and exports do not exist.

- [ ] **Step 3: Implement minimal domain helpers and strict schemas**

```ts
export const CurrencySchema = z.literal("USD");
export function formatUsdMinor(minor: number): string {
  if (!Number.isSafeInteger(minor) || minor < 0)
    throw new Error("INVALID_MONEY_MINOR");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}
```

Define discriminated append-only events:

```ts
type DemoLedgerEvent =
  | {
      id: string;
      kind: "parent_bonus";
      bucket: BucketKey;
      amountMinor: number;
      createdAt: string;
    }
  | {
      id: string;
      kind: "bucket_move";
      fromBucket: BucketKey;
      toBucket: BucketKey;
      amountMinor: number;
      createdAt: string;
    };
```

Extend `LocaleSchema` to `["en", "ru", "kk"]`, default state to English, child currency to `"USD"`, preferences to `{ soundEnabled: true, motionEnabled: true }`, and goal to `{ title: "Scooter", targetMinor: 8_000 }`.

- [ ] **Step 4: Run focused tests and full unit suite**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/domain/currency.test.ts src/domain/ledger.test.ts`

Expected: PASS.

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test`

Expected: all tests PASS.

- [ ] **Step 5: Commit Task 1**

```powershell
git add apps/web/src/domain
git commit -m "feat: add USD and ledger domain contracts"
```

### Task 2: Idempotent session commands and append-only history

**Files:**

- Modify: `apps/web/src/server/demo/session-store.ts`
- Modify: `apps/web/src/server/demo/session-store.test.ts`
- Modify: `apps/web/src/app/api/v1/demo/route.ts`

**Interfaces:**

- Consumes: strict `DemoCommand` and ledger projection helpers from Task 1.
- Produces: idempotent `add_parent_bonus` and `move_money`, validated `update_preferences` and `update_save_goal`.

- [ ] **Step 1: Add failing command tests**

```ts
applyDemoCommand(session, {
  action: "add_parent_bonus",
  idempotencyKey: bonusId,
  bucket: "save",
  amountMinor: 100,
});
applyDemoCommand(session, {
  action: "add_parent_bonus",
  idempotencyKey: bonusId,
  bucket: "save",
  amountMinor: 100,
});
expect(session.state.ledgerEvents).toHaveLength(1);

expect(() =>
  applyDemoCommand(session, {
    action: "move_money",
    idempotencyKey: crypto.randomUUID(),
    fromBucket: "save",
    toBucket: "give",
    amountMinor: 10_000,
  }),
).toThrow("INSUFFICIENT_BUCKET_BALANCE");
```

Also test source equals destination, non-closed stage, preference update, trimmed goal title, goal bounds, and successful balance projection after a move.

- [ ] **Step 2: Run tests and verify RED**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/server/demo/session-store.test.ts`

Expected: FAIL on missing commands/state.

- [ ] **Step 3: Implement command handling**

For bonus/move, require closed stage and payday, deduplicate by idempotency key, validate against projected balance, and append exactly one event. Never mutate `payday.allocation`.

For preferences, assign only strict booleans and locale. For goal, assign trimmed title and integer target cents. Replace the fixed correction mutation path.

- [ ] **Step 4: Run focused and full tests**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/server/demo/session-store.test.ts`

Expected: PASS.

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test`

Expected: all tests PASS.

- [ ] **Step 5: Commit Task 2**

```powershell
git add apps/web/src/server/demo apps/web/src/app/api/v1/demo
git commit -m "feat: add supervised jar ledger actions"
```

### Task 3: English Money Moment and typed UI copy

**Files:**

- Create: `apps/web/src/components/demo/copy.ts`
- Create: `apps/web/src/components/demo/copy.test.ts`
- Modify: `apps/web/src/server/money-moment/fallback-provider.ts`
- Modify: `apps/web/src/server/money-moment/money-moment.test.ts`
- Modify: `apps/web/src/server/money-moment/schema.ts`

**Interfaces:**

- Produces: `CopyKey`, `copy: Record<Locale, CopyContract>`, `taskCopy`, `bucketCopy`.
- Money Moment accepts `en` and still exposes only allowlisted enums/booleans/basis points.

- [ ] **Step 1: Write failing copy parity and English fallback tests**

```ts
expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy.ru).sort());
expect(Object.keys(copy.en).sort()).toEqual(Object.keys(copy.kk).sort());
expect(copy.en.settingsTitle).toBe("Parent settings");
expect(
  (await service.createCard(englishInput)).card.title.length,
).toBeGreaterThan(0);
```

- [ ] **Step 2: Run tests and verify RED**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/copy.test.ts src/server/money-moment/money-moment.test.ts`

Expected: FAIL because English copy/fallback is missing.

- [ ] **Step 3: Implement the typed copy contract**

Move all current RU/KK strings out of `demo-app.tsx`, add complete English copy, and add new Settings, goal, bonus, move, history, jar-detail, validation, and sound strings. Add curated English Money Moment cards without names, exact amounts, goal text, or free-form input.

- [ ] **Step 4: Run focused and full tests**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/copy.test.ts src/server/money-moment/money-moment.test.ts`

Expected: PASS.

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web typecheck`

Expected: PASS.

- [ ] **Step 5: Commit Task 3**

```powershell
git add apps/web/src/components/demo/copy.ts apps/web/src/components/demo/copy.test.ts apps/web/src/server/money-moment
git commit -m "feat: add English-first product copy"
```

### Task 4: Generate and integrate the real jar asset family

**Files:**

- Create: `apps/web/public/jars/spend.png`
- Create: `apps/web/public/jars/save.png`
- Create: `apps/web/public/jars/give.png`
- Create: `apps/web/public/jars/grow.png`
- Create: `apps/web/public/jars/scooter.png`
- Create: `apps/web/src/components/demo/jar-visual.tsx`
- Create: `apps/web/src/components/demo/jar-visual.test.tsx`

**Interfaces:**

- Produces: `JarVisual({ bucket, fillBasisPoints, focused, interactive, onActivate })`.
- Uses semantic labels and a real raster shell asset; dynamic code-native fill is clipped inside the shell and never substitutes for the jar artwork.

- [ ] **Step 1: Write the failing JarVisual interaction test**

```tsx
render(
  <JarVisual
    bucket="save"
    fillBasisPoints={350}
    focused
    interactive
    onActivate={onActivate}
  />,
);
expect(screen.getByRole("button", { name: /Save jar/i })).toHaveAttribute(
  "aria-valuenow",
  "3.5",
);
await user.keyboard("{Enter}");
expect(onActivate).toHaveBeenCalled();
```

- [ ] **Step 2: Run the test and verify RED**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/jar-visual.test.tsx`

Expected: FAIL because `JarVisual` and assets do not exist.

- [ ] **Step 3: Generate and inspect five coordinated assets**

Use built-in Image Gen with the approved concepts as references. Create one empty transparent/chroma-key jar shell per bucket with the exact coral/blue/gold/green lid and semantic icon, plus one scooter goal icon. Remove chroma keys with the installed helper, validate alpha corners and consistent dimensions, and save final PNGs under `public/jars`.

- [ ] **Step 4: Implement JarVisual**

Use `next/image` or `img` with explicit intrinsic dimensions, a clipped semantic fill layer behind the real transparent shell, focus/pressed/selected states, pointer gesture hooks, keyboard activation, and non-color text. No handcrafted SVG or CSS-drawn jar is allowed.

- [ ] **Step 5: Run component test, typecheck, and asset validation**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/jar-visual.test.tsx`

Expected: PASS.

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web typecheck`

Expected: PASS.

Validate: all five PNGs have alpha, nonzero dimensions, and load in the browser.

- [ ] **Step 6: Commit Task 4**

```powershell
git add apps/web/public/jars apps/web/src/components/demo/jar-visual.tsx apps/web/src/components/demo/jar-visual.test.tsx
git commit -m "feat: add interactive jar artwork"
```

### Task 5: App shell, Settings, actions, and approved closed-week screens

**Files:**

- Create: `apps/web/src/components/demo/app-shell.tsx`
- Create: `apps/web/src/components/demo/parent-actions.tsx`
- Create: `apps/web/src/components/demo/closed-week.tsx`
- Create: `apps/web/src/components/demo/use-jar-sound.ts`
- Create: `apps/web/src/components/demo/closed-week.test.tsx`
- Modify: `apps/web/src/components/demo-app.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/manifest.ts`

**Interfaces:**

- `AppShell` owns header/settings/dialog/bottom-nav semantics.
- `ParentActions` emits strict API commands only after review confirmation.
- `ClosedWeek` owns root tab and selected-bucket UI state but receives server state and command callbacks.
- `useJarSound(bucket, enabled)` exposes `play(): void` and safely no-ops without Web Audio.

- [ ] **Step 1: Write failing component behavior tests**

Test English default header has no locale switch, Settings changes locale, currency row is fixed USD, parent bonus requires review, excessive move shows inline error, History owns events, focused jar opens by click/keyboard, and sound-disabled interaction does not construct AudioContext.

- [ ] **Step 2: Run tests and verify RED**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/closed-week.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement AppShell and Settings**

Use a semantic dialog with focus trap, Escape close, parent profile trigger, EN/RU/KK control, fixed `US dollar (USD)` row, sound/motion toggles, goal title/target edit, and reset action. Update `html lang` client-side from server locale while layout/manifest default to `en`.

- [ ] **Step 4: Implement parent action review flows**

Bonus: bucket + amount cents → review → UUID-confirmed command.

Move: source + destination + amount cents → review with educational-record boundary → UUID-confirmed command.

Do not collect notes. Preserve server errors as localized inline feedback.

- [ ] **Step 5: Implement approved Week, Jars, focused jar, and History**

Match the three accepted concepts:

- Week: restrained celebration, reviewed amount, allocation flow, four jars, Save goal, Money Moment CTA.
- Jars: four large jars, current balance shares, goal, Add parent bonus, Move money.
- Focus: bucket selector, large jar, Save goal journey, Drag to shake, sound cue, parent actions.
- History: payday, bonuses, and moves only; no fixed correction control.

- [ ] **Step 6: Run tests, typecheck, and lint**

Run: `corepack pnpm@11.15.0 --filter @my-first-money/web test -- src/components/demo/closed-week.test.tsx`

Expected: PASS.

Run: `corepack pnpm@11.15.0 typecheck`

Expected: PASS.

Run: `corepack pnpm@11.15.0 lint`

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

```powershell
git add apps/web/src/components apps/web/src/app/layout.tsx apps/web/src/app/manifest.ts
git commit -m "feat: build approved family jar experience"
```

### Task 6: Visual system, responsive behavior, and interaction polish

**Files:**

- Modify: `apps/web/src/app/globals.css`
- Modify: `docs/DESIGN_SYSTEM.md`

**Interfaces:**

- Consumes accepted component class names from Task 5.
- Produces the exact true-white/navy/indigo/coral/blue/gold/green system, 390×844 composition, safe-area behavior, focus, drag, and reduced-motion variants.

- [ ] **Step 1: Capture the unstyled/partially styled 390×844 screen**

Run the app and capture Week, Jars, and focused Save at 390×844. Record visible mismatches against the concepts before changing CSS.

- [ ] **Step 2: Implement design tokens and mobile composition**

Use true white `#ffffff`, ink `#08123f`, primary `#1837b7`, Spend `#f25452`, Save `#2f61d5`, Give `#d28a00`, Grow `#4d9d48`, 6–8px control radii, restrained elevation, and humanist system typography. Preserve open layouts and avoid nested card stacks.

- [ ] **Step 3: Add purposeful interaction motion**

Add 160–220ms state transitions, restrained Week marks, pointer-drag jar translation, release settle, fill change, and selected state. Under `prefers-reduced-motion: reduce`, render final states immediately and remove travel/shake.

- [ ] **Step 4: Stress responsive/accessibility states**

Verify 320px long RU/KK labels, 390×844 native, 428px, desktop centered reflow, 200% text, visible focus, 44px targets, keyboard dialogs, and safe-area bottom navigation.

- [ ] **Step 5: Run format/type/lint/unit/build**

Run:

```powershell
corepack pnpm@11.15.0 format:check
corepack pnpm@11.15.0 typecheck
corepack pnpm@11.15.0 lint
corepack pnpm@11.15.0 test
corepack pnpm@11.15.0 build
```

Expected: every command exits 0.

- [ ] **Step 6: Commit Task 6**

```powershell
git add apps/web/src/app/globals.css docs/DESIGN_SYSTEM.md
git commit -m "style: match approved jar redesign"
```

### Task 7: Production E2E, design QA, and evidence

**Files:**

- Modify: `apps/web/tests/e2e/judge-flow.spec.ts`
- Modify: `apps/web/scripts/capture-evidence.mjs`
- Create/Modify: `design-qa.md`
- Modify only with verified facts: `STATUS.md`, `ROADMAP.md`, `patches/PATCH-1.md`, `patches/CURRENT_SESSION.md`, `docs/BUILD_WEEK.md`

**Interfaces:**

- E2E owns the full English-default judge path plus Settings, bonus, move, focused jar, History, security/storage, and a11y evidence.
- `design-qa.md` is the blocking visual-fidelity ledger and must end with `final result: passed`.

- [ ] **Step 1: Rewrite E2E expectations before implementation verification**

Add tests for:

```ts
await expect(
  page.getByRole("heading", { name: "Who is starting their first week?" }),
).toBeVisible();
await page.getByRole("button", { name: "Parent settings" }).click();
await page.getByRole("radio", { name: "Русский" }).click();
await expect(
  page.getByRole("heading", { name: "Кто начинает первую неделю?" }),
).toBeVisible();
```

Add complete English flow, bonus-to-Save, move Save→Give, excessive-move rejection, focused jar click/keyboard, Settings sound off, History records, axe checks, session isolation, no-store/cache/storage/CSRF/security headers.

- [ ] **Step 2: Run production E2E and verify failures are relevant**

Run: `corepack pnpm@11.15.0 test:e2e`

Expected before final fixes: any failures point to missing/new behavior rather than test syntax.

- [ ] **Step 3: Fix failures and run the complete default gate**

Run:

```powershell
corepack pnpm@11.15.0 install --frozen-lockfile
corepack pnpm@11.15.0 format:check
corepack pnpm@11.15.0 typecheck
corepack pnpm@11.15.0 lint
corepack pnpm@11.15.0 test
corepack pnpm@11.15.0 build
corepack pnpm@11.15.0 db:check
corepack pnpm@11.15.0 security:secrets
corepack pnpm@11.15.0 security:client
corepack pnpm@11.15.0 test:e2e
```

Expected: every available command exits 0; unavailable Docker/PostgreSQL container verification remains explicitly unclaimed.

- [ ] **Step 4: Run browser fidelity QA**

Use the in-app browser at `http://127.0.0.1:3000/`. Capture Week, Jars, and focused Save at 390×844 and inspect each beside its corresponding approved concept with `view_image`. Check at least copy, layout, typography, palette, jar assets/fill, spacing/container model, icons, motion, and interactions.

Write the mismatch/fix ledger to `design-qa.md`, fix P0/P1/P2 findings, recapture, and repeat until the file says `final result: passed`.

- [ ] **Step 5: Update verified project evidence**

Record exact test counts, screenshot paths, commit hashes, and remaining external blockers. Do not claim stable HTTPS, live OpenAI, Docker/PostgreSQL runtime, repository publication, video, feedback, or Devpost completion without evidence.

- [ ] **Step 6: Commit final verified implementation**

```powershell
git add apps/web/tests apps/web/scripts design-qa.md STATUS.md ROADMAP.md patches docs/BUILD_WEEK.md
git commit -m "test: verify managed product redesign"
```

## Plan Self-Review

- Spec coverage: USD, EN/RU/KK, Settings, one goal, Week, Jars, focused jar, sound/motion, bonus, move, History, Money Moment, accessibility, privacy, and visual QA each map to a task.
- Placeholder scan: no `TBD`, `TODO`, `implement later`, or unspecified error/test step is permitted.
- Type consistency: commands and event names are fixed as `update_preferences`, `update_save_goal`, `add_parent_bonus`, `move_money`, `parent_bonus`, and `bucket_move`.
- Execution choice: inline execution in the existing primary task, as already requested by the user; no subagents, new task, project, or worktree.
