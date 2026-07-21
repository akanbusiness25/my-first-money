# My First Money roadmap

Updated: 2026-07-20

## Deadline-first Build Week lane

### BW0 — Evidence / compatibility (local gate complete)

- [x] Confirm `D:\app myfirstmoney` as the established empty implementation root.
- [x] Create the minimal project/security/domain documentation layer.
- [x] Initialize Git and create the first dated commit before feature implementation (`ed194bd`, 2026-07-19 15:40 +05:00).
- [ ] Akan captures the sanitized start screenshot with task, date, project path, and GPT-5.6 Sol selection.
- [x] Verify the candidate registry versions; record the TypeScript 7/ESLint 10 and Drizzle declaration incompatibilities without suppressions; isolate unused beta DB source while preserving migration checks.
- [x] Verify Node 24.18.0, pnpm 11.15.0, Next 16.2.10, React 19.2.7, Tailwind 4.3.3, Drizzle 0.45.2/Kit 0.31.10, Zod 4.4.3, and OpenAI SDK 6.48.0 through the local gate; PostgreSQL 18 runtime remains a beta/external gate.
- [x] Pass frozen install, strict typecheck, lint, unit smoke, production build, and migration structure check; record Docker/PostgreSQL container smoke as unavailable locally.

### BW1 — Working vertical slice

- [x] Isolated auto-reset synthetic judge session with no OTP or real credentials.
- [x] Child setup -> mission builder -> family agreement -> active week.
- [x] Tri-state Quick Check -> exact payday preview -> idempotent confirm.
- [x] Spend / Save / Give / Grow allocation -> closed-week review/history.
- [x] One editable Save goal, Grow explanation, parent-confirmed append-only bonus/move events, recent history, and no pre-payday paywall.
- [x] English-default typed EN/RU/KK copy, server-session Settings, USD-only display, and mobile-first PWA shell.

### BW2 — GPT-5.6 Money Moment

- [x] Provider interface, allowlisted structured input, strict Zod selection/output, curated cards, deterministic fallback, abuse budgets, timeout, and tests without credentials.
- [x] Server-only OpenAI Responses adapter using `gpt-5.6-sol`, `store: false`, no tools/background/persistence; it selects only a reviewed card ID.
- [ ] Only after adapter readiness: manually supplied server secret and one live verification.
- [x] Document model use and fallback boundary; automated secret/client-bundle non-exposure checks are configured.

### BW3 — Product quality / deploy

- [x] Complete loading/validation/session/offline-limitation/pending/recovery states for the synthetic loop.
- [x] Browser verification at 320px, 390px, 428px, and desktop; semantic keyboard/focus controls, reduced-motion/safe-area CSS, and automated axe checks.
- [x] Playwright full judge flow plus PWA/cache/header/storage/CSRF/session-isolation/expired-session checks (16/16 E2E), plus production-build health/evidence smoke.
- [x] Scoped security review and remediation; stable HTTPS synthetic deployment is running healthy in isolated Coolify infrastructure.
- [x] Local fresh-context judge-path verification passes 16/16 across 320px, 390px, 428px, and desktop; the previous live release passes 12/12 and the current live 16/16 rerun is part of release verification.
- [x] Approved managed product redesign implemented and visually compared at 390x844; long RU/KK copy reflow verified at 320px.

### BW4 — Submission

- [x] Competition-ready README and maintained `docs/BUILD_WEEK.md` scorecard/evidence.
- [x] Stable HTTPS synthetic demo deployed and verified without a database or secret dependency.
- [ ] Private no-public-license repository shared with both required Devpost addresses immediately before submission.
- [ ] Live demo, Devpost description, curated screenshots, and repository access verified.
- [ ] Public narrated YouTube video <=3:00 verified for audio/visibility.
- [ ] Akan runs `/feedback` in `firstmoney main`; exact Session ID is recorded.
- [ ] Final incognito verification and submission before the internal cutoff.

## Durable Kazakhstan beta lane (post-submission)

### Phase 0 — Product/security/legal contour

- [x] Preserve product scope, threat model, authorization matrix, critical actions, and release blockers in project docs.
- [ ] Approve Kazakhstan primary storage/backup topology, processors, counsel path, control owners, and evidence dates.

### Phase 1 — Contracts, persistence, parent identity

- [x] Provision a private PostgreSQL 18 resource without exposing it publicly or connecting anonymous Test Run traffic.
- [ ] PostgreSQL schema/migrations, consent foundation, parent email OTP/session, Telegram validation/linking contract, CSRF, and ownership tests.

### Phase 2 — Child and weekly agreement

- [ ] Minimal child profile, mission/task classification, agreement versioning, activation, and lifecycle projection.

### Phase 3 — Payday and ledger

- [ ] Quick Check, atomic/idempotent payday, exact allocation, append-only ledger, corrections, concurrency/recovery tests.

### Phase 4 — Product surfaces and adapters

- [ ] Buckets/goals/history, contextual Plus, static-only PWA cache, Telegram runtime adapter, and parent reminders/n8n.

### Phase 5 — Controlled beta readiness

- [ ] Accessibility/security suites, cross-parent IDOR coverage, deletion replay, isolated Kazakhstan backup restore, Telegram/PWA smoke, legal/infra approval, and release evidence.
