# My First Money

My First Money is a mobile-first family practice loop for a child's first money choices. A parent and child agree on one synthetic week, distinguish unpaid family responsibilities from optional paid work, close an exact payday, split it across four jars, and use a short parent-reviewed Money Moment to talk about the choice.

> Build Week boundary: this repository is a synthetic judging demo. It does not connect to banks, move money, authenticate children, or claim readiness for real-family beta use.

## Free judge path

No account, OTP, API key, or private credential is required:

1. Create the demo child `Аян` and keep age band `8–12`.
2. Choose a weekly learning objective and confirm the family agreement.
3. Mark the responsibility and both paid tasks in Quick Check.
4. Verify `1,000 ₸ + 800 ₸ = 1,800 ₸` and the exact 70/10/10/10 split.
5. Close the week, inspect Week / Buckets / History, and request Money Moment.
6. Use “Start demo again” to reset the synthetic family state. Abuse allowances stay attached to the expiring session and are not refreshed by reset.

The fallback Money Moment is deterministic and fully functional without a model credential. The current live demo URL is intentionally left `pending` until a stable HTTPS deployment is verified.

## Local setup

Requirements: Git, Node.js `24.18.0`, and Corepack. Docker is optional.

```powershell
corepack pnpm@11.15.0 install --frozen-lockfile
corepack pnpm@11.15.0 dev
```

Open `http://127.0.0.1:3000`. The demo needs no environment file. `.env.example` intentionally contains no secret placeholder.

## Verification

```powershell
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

The E2E suite covers mobile and desktop judge flows, axe accessibility checks, fallback Money Moment, session isolation, payday idempotency, and correction history. Install its browser once with:

```powershell
corepack pnpm@11.15.0 --filter @my-first-money/web exec playwright install chromium
```

## Architecture and decisions

- One Next.js modular monolith and one same-origin `/api/v1/demo` boundary.
- Synthetic session state lives only in a 30-minute server-memory map behind an opaque `HttpOnly`, `SameSite=Lax` cookie; admission is capped at 500 active sessions and returns `503` when full, while valid existing sessions continue. CSRF uses an in-memory token and exact Host/Origin comparison.
- Money uses safe integers. The server alone calculates payday and deterministic largest-remainder allocation. Confirmation is idempotent; corrections are append-only records.
- The PWA service worker caches only versioned static assets. It never caches HTML, API/auth responses, family state, amounts, or mutations.
- Money Moment receives only enums, booleans, and fixed percentages. The live boundary may return only a strict allowlisted card ID; reviewed Russian/Kazakh copy is selected server-side and validated again. The weekly loop never depends on AI.
- The optional server adapter uses the Responses API with `gpt-5.6-sol`, `store: false`, no tools, a short timeout, a 12-call-per-minute process budget, a reset-resistant three-call session allowance, and deterministic fallback. No live call is claimed yet.

See [architecture](docs/ARCHITECTURE.md), [domain rules](docs/DOMAIN_MODEL.md), [security/privacy](docs/SECURITY_PRIVACY.md), [design system](docs/DESIGN_SYSTEM.md), and [deployment](docs/DEPLOYMENT.md).

## Privacy and security boundary

Use synthetic values only. The demo rejects free-form model input, stores no state in local/session storage or IndexedDB, returns private API responses with `Cache-Control: no-store`, and excludes identifiers/prompts/model output from structured logs. Secrets must remain server-only in a deployment secret store and never enter Git, Markdown, screenshots, browser bundles, or logs.

Real-family use remains blocked by the documented Kazakhstan legal/data-location, parental identity/consent, deletion, backup/restore, incident response, authorization, database, and security gates in [BETA_GATE.md](docs/launch/BETA_GATE.md).

## Build Week disclosure and Codex use

Before implementation, the project had product/strategy/UX/technical/security planning in the ILMIO pipeline. New work in this repository includes the implementation, tests, visual concepts, provider/fallback boundary, compatibility evidence, security controls, deployment contour, and submission assets.

Codex with GPT-5.6 Sol converted the approved prompt into the repository, encoded the integer-money and privacy invariants, generated the accepted UI concepts, implemented the complete flow, diagnosed compatibility/CSP/cookie issues from real browser runs, and produced automated verification. The app's separate, bounded GPT-5.6 use is the optional Money Moment adapter described above.

The authoritative competition log, scorecard, video storyboard, links, and remaining external actions live only in [docs/BUILD_WEEK.md](docs/BUILD_WEEK.md).

## License and dependencies

Project source is available under the [MIT License](LICENSE). Runtime dependencies are pinned exactly in `apps/web/package.json`; their upstream licenses and notices remain those of their respective projects. The main stack is Next.js, React, Tailwind CSS, Zod, Drizzle, PostgreSQL client tooling, Lucide icons, and the official OpenAI JavaScript SDK.
