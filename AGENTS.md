# My First Money — project instructions

## Product contract

My First Money (`my-first-money`) helps a parent and child practise money habits through one weekly ritual: create a minimal child profile, set a mission, confirm a playful family agreement, record completed work, run payday, allocate into Spend / Save / Give / Grow, review, and voluntarily begin another week.

Primary promise: `Money habits kids can practice.` Secondary promise: `Pocket money. Real choices. Better habits.` The parent/caregiver is the only authenticated owner. A child is a supervised participant on the parent's shared screen and never has credentials, messaging, or independent mutation rights.

This is an educational tracker only: no bank account, custody, transfer, payment rail, investment, interest, crypto, debt, deduction, penalty, financial advice, or guaranteed return. The Build Week name is not cleared for commercial launch; trademark, domain/store/Telegram/social-handle, legal, and parent-confusion screening remain gates.

## Scope and privacy guardrails

- Keep the approved weekly loop narrow. Do not add child login, co-parent access, school mode, custom buckets, marketplace, token economy, broad dashboards, native apps, PWA push, offline mutation queues, or a marketing landing page.
- Use synthetic/demo data only until every beta gate passes. Never copy real family or child data into development, fixtures, screenshots, logs, analytics, or model inputs.
- Collect only parent identity plus child nickname, age band, presentation token, display currency, and data required by the loop. Never collect exact birth date, child contact details, photo, school, address, IIN/documents, bank/card data, or sensitive free-form notes.
- All money uses integer minor units. Closed payday/allocation/history records are immutable; corrections append compensating records.
- Grow is a fixed parent-funded challenge bonus posted directly to Grow, never interest, yield, investment, or a promised return.
- The only AI feature is the parent-triggered Money Moment. It accepts allowlisted enums/booleans/bucket percentages only, uses a provider interface and strict Zod output, has a deterministic fallback, and must never block the weekly loop. Do not request an API key until the server-side OpenAI adapter is ready for BW2 live verification.

## Read strategy

- Ordinary task: read this file and exact target files.
- Session continuation: read `BOOT.md`, `patches/CURRENT_SESSION.md`, the current patch, and `HANDOFF.md` only if it exists and is relevant.
- Implementation/release: read only the affected `ROADMAP.md`/`STATUS.md`, project docs, code, and config.
- Re-open `D:\brain\projects\product-pipeline\I006-kids-money\PIPELINE.md` only when an affected product decision is unclear. Historical patches are on demand.

## Architecture and runtime rules

- One TypeScript/Next.js modular monolith serves browser/PWA and later Telegram Mini App modes. Runtime differences are limited to authentication shell, safe areas/system controls, install affordance, BackButton, and reminder connection.
- Keep pages and route handlers thin. Put validation and lifecycle/money rules in framework-independent domain/application modules. Use same-origin `/api/v1/*` boundaries.
- Parent ownership (`parent_id`) is mandatory in every query/mutation. IDs are not authorization. Plus limits are transactional server-side checks.
- Browser auth is parent email OTP; Telegram auth later validates raw init data server-side. Both issue the same opaque first-party session cookie. No auth/family data in local/session storage, IndexedDB, Cache Storage, URLs, or client logs.
- The service worker caches versioned public shell assets only and excludes private HTML/RSC, `/api/*`, `/auth/*`, `/launch/*`, data, and mutations.
- PostgreSQL/Drizzle migrations are committed and reviewed. Payday confirmation is atomic and idempotent. Ledgers and corrections are append-only.
- n8n is post-submission stretch work. If added, it uses a least-privilege reminder credential, backend-owned eligibility/quiet hours, idempotent claim/ack/fail, bounded retries, privacy-safe copy, and the ILMIO error notifier.

## Security and release gates

My First Money is `Sensitive`. Critical actions include identity linking/recovery, entitlements, payday/correction, consent, archive/purge, restore, deployment, and credential changes. Real-family beta is prohibited until Kazakhstan counsel, primary database and backup location, cross-border processors, consent/privacy text, deletion, backup/restore, incident response, auth/authorization, and security verification are approved with evidence. The competition demo is not production-ready for children/families.

Use redacted structured logs only. Never log secrets, auth material, email, Telegram payloads, child nickname, task/agreement/goal text, amount history, model prompt/output, or full payloads. Private/auth responses use `no-store`; state-changing routes require same-origin/CSRF protection.

## Frontend, backend, deployment

- Mobile-first at 320–428px; WCAG 2.2 AA; semantic controls; visible focus; keyboard operation; non-color meaning; 44px touch targets; text reflow; safe areas; reduced motion.
- Visual direction: bright neutral `Family Table / Four Jars`, dark ink, restrained 6–8px radii, clear borders, limited shadow. Spend coral, Save blue, Give accessible gold, Grow leaf green, and a separate primary-action color. No glassmorphism, crypto/market imagery, decorative gradient orbs, or stock child photos.
- Validate all server inputs with Zod. Keep secrets server-only and environment-provided. Do not commit `.env*`, tokens, dumps, logs, screenshots containing private UI, production data, or backups.
- Deployment must use pinned runtime/dependencies, immutable builds, HTTPS/security headers, migrations, health checks, rollback/recovery notes, and a stable synthetic judge path. Coolify/container deployment is preferred; deployment is not evidence of beta readiness.

## Verification

Default gate after dependencies exist:

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm db:check
pnpm test:e2e
```

For UI changes also verify the complete judge flow in browser at 390px and 320px, desktop reflow, keyboard/focus, reduced motion, safe areas, and Kazakh/Russian long labels. For sensitive diffs run a scoped security review and record evidence. Never claim checks that were not run.

## Documentation and patch discipline

- `ROADMAP.md` is the canonical phased roadmap; `docs/BUILD_WEEK.md` is the sole competition source of truth.
- Keep accepted patch files append-only. New work uses the next incremental `patches/PATCH-*.md` and updates only affected roadmap/status items.
- Update `patches/CURRENT_SESSION.md` after meaningful cross-agent work. Create `HANDOFF.md`, `DECISIONS.md`, `DOC_ROUTER.md`, or `PROJECT_MANIFEST.md` only when they add real project truth.
- Explore mode discusses a material new direction before mutation. Execute mode completes explicit safe work end-to-end. Route capabilities only when useful. Any artifact the user must paste is one complete fenced block.
- One workspace is shared across Codex, Antigravity/Gemini, Claude Code, and claude.ai Project; do not create platform-specific project copies. Add platform pointer files only when that platform is actually used.

## Build Week contract

Track: `Apps for Your Life`. Official deadline: `2026-07-21 17:00 PDT` / `2026-07-22 05:00 Asia/Qyzylorda`; internal complete-submission cutoff: `2026-07-21 22:00 Asia/Qyzylorda`.

Use synthetic data only. Keep the majority of core implementation in the primary task `firstmoney main` using GPT-5.6 Sol. Akan runs `/feedback` in this task near submission and copies the exact Session ID into `docs/BUILD_WEEK.md` and Devpost. The public demo video must be on YouTube, include audio, be no longer than three minutes, and explain concrete Codex/GPT-5.6 use.

