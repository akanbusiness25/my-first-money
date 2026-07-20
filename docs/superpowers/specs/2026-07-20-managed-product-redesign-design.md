# My First Money managed product redesign

Status: approved visual direction; written specification awaiting final review before implementation planning.

Date: 2026-07-20

## Outcome

Redesign the existing synthetic Next.js demo into a polished mobile-first family ritual that makes one weekly money loop understandable and enjoyable without becoming a bank, investment product, or game economy.

The implementation combines three approved visual targets:

- `docs/design/redesign-week-approved.png` — closed-week celebration and Money Moment entry.
- `docs/design/redesign-jars-approved.png` — the Four Jars overview and parent actions.
- `docs/design/redesign-jar-detail-approved.png` — a focused jar, goal progress, and shake/sound interaction.

The images are geometry, hierarchy, illustration, and interaction references. The user approved a later currency amendment, so all code-native amounts use USD rather than the KZT labels visible in the generated concepts.

## Product decisions

### Display currency

- Competition MVP uses one display currency only: US dollar (`USD`).
- No currency selector, exchange rate, conversion, RUB, or KZT is implemented.
- All domain amounts remain safe integers in minor units (cents).
- UI formatting is deterministic and locale-independent: `$10.00`, `$5.00`, `$3.00`, `$18.00`.
- Existing synthetic values keep their minor-unit meaning:
  - weekly base: `1_000` = `$10.00`
  - paid tasks: `500` = `$5.00`, `300` = `$3.00`
  - completed payday: `1_800` = `$18.00`
  - default Save goal: `8_000` = `$80.00`
  - default Grow bonus: `100` = `$1.00`
  - default parent bonus preset: `100` = `$1.00`

### Language and settings

- English is the default locale.
- English, Russian, and Kazakh are supported through one typed i18n contract.
- The header contains only the product lockup and parent profile/settings control.
- Language selection lives in the parent Settings sheet, never in persistent navigation or the header.
- Settings also contains:
  - display currency row: `US dollar (USD)`, fixed for MVP
  - Sound effects toggle, enabled by default
  - Motion gestures toggle, enabled by default
  - one editable Save goal
  - reset synthetic demo
- Preferences are stored only in the opaque server-side demo session. No family or preference state goes to localStorage, sessionStorage, IndexedDB, Cache Storage, URLs, or client logs.

### Navigation and scope

- Persistent roots remain exactly Week, Jars, and History.
- Settings is a parent sheet reached from the top-right profile control, not a fourth tab.
- Free payday allocation remains fixed at 70/10/10/10.
- One editable Save goal is included. Extra goals and editable allocation are deferred Plus work.
- No child login, co-parent access, custom buckets, marketplace, badges, XP, avatars, collectibles, streak pressure, leaderboard, token economy, or broad dashboard is added.

## Screen design

### Week

The closed-week state follows `redesign-week-approved.png`:

- compact four-jar brand lockup and parent settings control
- restrained check-and-paper-mark celebration
- reviewed total and a visible flow into the four jars
- one compact Save goal
- primary action: Money Moment
- secondary action: start the next synthetic week
- Week selected in bottom navigation

The Week allocation diagram shows the immutable payday split. The separate parent-funded Grow bonus is explained without calling it interest, yield, or investment.

### Jars

The root follows `redesign-jars-approved.png`:

- four large tactile jars are the primary visual object
- each jar shows label, balance, and its current share of the total bucket balance
- fill levels and percentages recalculate after a parent bonus or bucket move
- one Save goal connects directly to the Save jar
- primary action: Add parent bonus
- secondary action: Move money
- full activity is not duplicated here; it remains in History
- Jars selected in bottom navigation

The screen starts in an unselected overview. Tapping a jar opens its focused detail.

### Focused jar

The focused state follows `redesign-jar-detail-approved.png`:

- Back to jars control
- compact Spend / Save / Give / Grow selector
- one foreground jar with semantic color and icon
- Save shows exact goal progress; after a `$1.00` parent bonus the synthetic reference state is `$2.80 of $80.00` = `3.5%`
- horizontal drag gesture shakes the jar
- Enter or Space provides the equivalent keyboard interaction
- the jar plays one short signature sound after a deliberate gesture
- primary action: Add parent bonus
- secondary action: Move money
- parent-confirmation note
- no recent-activity panel

Sound character is restrained:

- Spend: light paper click
- Save: soft coin clink
- Give: warm chime
- Grow: gentle wooden bell

There is no autoplay. Sound can be disabled in Settings. DeviceMotion is not required for MVP; it may be added later only as permission-gated progressive enhancement.

### History

History is the sole full activity timeline:

- immutable payday close
- append-only parent bonuses
- append-only bucket moves
- exact source and destination for moves
- exact USD amount and timestamp

The existing one-click fixed `+$1.00 Save` correction control is removed. A parent bonus is not presented as a correction.

## Product actions

### Add parent bonus

1. Parent selects one of Spend / Save / Give / Grow.
2. Parent enters or chooses a positive USD amount.
3. A review state shows destination and formatted amount.
4. Parent confirms.
5. The server appends one idempotent parent-bonus record.
6. Balances, percentages, jar fill, goal progress, and History update.

Input is strict Zod-validated integer cents from `1` through `10_000` (`$0.01` through `$100.00`). The idempotency key is a UUID. No note or other free-form sensitive field is collected.

### Move money

1. Parent selects a source jar, destination jar, and positive amount.
2. Source and destination must differ.
3. Amount is an integer from `1` through `10_000` cents and cannot exceed the computed source balance.
4. A review state explains that this is an educational record, not a bank transfer.
5. Parent confirms.
6. The server appends one idempotent move event; the original payday remains immutable.
7. Both balances, fill levels, percentages, goal progress, and History update atomically.

The child may propose the choice on the shared screen, but only the parent confirmation mutates state.

### Save goal

- Exactly one Save goal exists in Free.
- Parent may edit its short title and positive target amount from Settings.
- Title is trimmed, 1–40 characters, and never logged. Target is an integer from `100` through `1_000_000` cents (`$1.00` through `$10,000.00`).
- Default synthetic goal is Scooter at `$80.00`.
- Goal text never enters Money Moment model input, analytics, or logs.

## Architecture

The existing TypeScript/Next.js modular monolith remains in place.

- Pages and route handlers remain thin.
- Zod command schemas live at the same-origin `/api/v1/demo` boundary.
- Framework-independent domain/application helpers own money math, USD formatting, ledger effects, goal progress, and validation.
- The in-memory synthetic session remains bounded, expiring, resettable, and isolated by opaque cookie.
- Parent bonus and bucket move commands carry idempotency keys.
- Balances are projections of immutable payday allocation plus append-only bonus and move events.
- Money Moment retains its provider interface, strict allowlisted input/output, deterministic fallback, server-only adapter, and failure isolation.

The current monolithic `demo-app.tsx` should be split only along the affected UI boundaries:

- typed i18n copy
- app shell/settings
- Week root
- Jars overview/focused jar
- parent action sheets
- History
- jar sound/gesture hook

This is targeted decomposition, not an unrelated rewrite.

## Error and recovery behavior

- Invalid bonus/move/goal input stays in its sheet with an inline, localized error.
- Insufficient source balance never appends a move.
- Duplicate idempotency keys return the existing result without adding another record.
- Offline mutations remain disabled and explain that reconnection is required.
- A Money Moment failure returns the deterministic local card and never blocks the loop.
- Reduced motion removes celebration travel and jar shaking while preserving the final state.
- If Web Audio is unavailable or disabled, jar interaction remains visual and functional without an error banner.

## Accessibility and privacy

- 320–428px first; 390×844 is the native design comparison viewport.
- Desktop reflows into a quiet centered app surface, not a dashboard.
- 44px minimum targets, semantic buttons/dialogs, focus trapping, Escape close, visible focus, keyboard jar interaction, non-color meaning, and 200% text reflow.
- Jar sound is optional, short, and never the only feedback.
- No real family or child data is introduced. Fixtures, screenshots, history, and logs stay synthetic.
- No secrets or API key work is part of this redesign.

## Verification contract

Implementation is complete only when:

- focused unit tests cover USD formatting, allocation, parent bonus, move validation, idempotency, balances, percentages, and goal progress
- Money Moment schema/fallback tests cover English, Russian, and Kazakh
- E2E completes the full English-default judge flow
- E2E changes language through Settings
- E2E adds a parent bonus to a chosen jar
- E2E moves money with parent confirmation and rejects an excessive move
- E2E opens a jar with pointer and keyboard, and verifies sound-disabled behavior without relying on audio hardware
- History shows payday, bonus, and move records without rewriting payday
- axe passes on setup, Week, Jars, focused jar, Settings, action review, and History
- responsive checks pass at 320px, 390px, 428px, and desktop
- reduced-motion, safe-area, storage/cache, CSRF, session isolation, and secret/client-bundle checks remain green
- the accepted concepts and same-state browser captures are inspected side by side and `design-qa.md` ends with `final result: passed`

## Deferred

- KZT, RUB, exchange rates, conversion, and a currency selector
- editable allocation in Free
- additional goals
- physical DeviceMotion as a required interaction
- real-family persistence, authentication, or beta readiness
- live OpenAI verification until the existing server-side credential gate is intentionally entered
