# My First Money

My First Money is a mobile-first family practice loop for a child's first money choices. A parent and child agree on one synthetic week, distinguish unpaid family responsibilities from optional paid work, close an exact payday, allocate it across Spend / Save / Give / Grow, and use a short parent-reviewed Money Moment to discuss the choice.

> Build Week boundary: this repository is a synthetic judging demo. It does not connect to banks, move real money, authenticate children, or claim readiness for real-family beta use.

## Free judge path

No account, OTP, API key, or private credential is required:

1. Create the demo child `Ari` and keep age band `8–12`.
2. Choose a weekly learning objective and confirm the family agreement.
3. Mark the responsibility and both paid tasks in the completion review.
4. Verify `$10.00 + $8.00 = $18.00` and the exact 70/10/10/10 split.
5. Close the week and inspect Week / Jars / History.
6. Open Money Moment, add a parent bonus, move money between jars, and inspect the separate append-only events.
7. Open parent Settings to change EN/RU/KK, sound/motion, or the one Save goal. USD is fixed for this MVP.

The deterministic Money Moment fallback is fully functional without a model credential. The stable synthetic demo is available at `https://myfirstmoney.ilmio.space`.

## Local setup

Requirements: Git, Node.js `24.18.0`, and Corepack. Docker is optional.

```powershell
corepack pnpm@11.15.0 install --frozen-lockfile
corepack pnpm@11.15.0 dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The demo needs no environment file. `.env.example` intentionally contains no secret placeholder.

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

The E2E suite covers the full family ritual on 320px, 390px, 428px, and desktop; axe accessibility; local Money Moment; parent bonus/move review; settings; session isolation; CSP/CSRF/no-store; browser storage; and static-only PWA caching. Install its browser once with:

```powershell
corepack pnpm@11.15.0 --filter @my-first-money/web exec playwright install chromium
```

## Architecture and decisions

- One Next.js modular monolith and one same-origin `/api/v1/demo` boundary.
- Synthetic state lives only in a 30-minute server-memory session behind an opaque `HttpOnly`, `SameSite=Lax` cookie. Admission is capped at 500 active sessions; each append-only demo ledger is capped at 100 events.
- Money uses integer cents. The server calculates payday and deterministic largest-remainder allocation. Payday, bonuses, and bucket moves are idempotent append-only operations.
- English is the default. EN/RU/KK preferences and the editable Save goal stay in the server session; no family/auth state is stored in browser storage.
- The PWA service worker caches only versioned static assets. It excludes HTML, API/auth responses, family state, amounts, and mutations.
- Money Moment receives only enums, booleans, and fixed percentages. The live boundary may return only a strict allowlisted card ID; reviewed EN/RU/KK copy is selected server-side and validated again. The weekly loop never depends on AI.
- The optional server adapter uses the Responses API with `gpt-5.6-sol`, `store: false`, no tools, a short timeout, a process budget, a reset-resistant session allowance, and deterministic fallback. No live call is claimed yet.

See [architecture](docs/ARCHITECTURE.md), [domain rules](docs/DOMAIN_MODEL.md), [security/privacy](docs/SECURITY_PRIVACY.md), [design system](docs/DESIGN_SYSTEM.md), and [deployment](docs/DEPLOYMENT.md).

## Privacy and security boundary

Use synthetic values only. The demo rejects free-form model input, keeps family/auth state out of browser storage, returns private API responses with `Cache-Control: no-store`, and excludes identifiers/prompts/model output from structured logs. Secrets must remain server-only in a deployment secret store and never enter Git, Markdown, screenshots, browser bundles, or logs.

Real-family use remains blocked by the Kazakhstan legal/data-location, parental identity/consent, deletion, backup/restore, incident response, authorization, database, and security gates in [BETA_GATE.md](docs/launch/BETA_GATE.md).

## Build Week disclosure

Before implementation, the project had product/strategy/UX/technical/security planning in the ILMIO pipeline. New work in this repository includes the implementation, tests, visual concepts and generated jar assets, provider/fallback boundary, compatibility evidence, security controls, deployment contour, and submission assets.

## How Codex and GPT-5.6 were used

The core implementation was completed in the continuous primary Codex build task `firstmoney main`, using GPT-5.6 Sol. This was not a one-shot prompt or a generated prototype: the same task carried the product from an empty workspace through implementation, review, browser debugging, verification, Git history, and HTTPS deployment.

| Area                | Concrete Codex / GPT-5.6 contribution                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product translation | Converted the approved product, privacy, and safety pipeline into a narrow weekly family loop with explicit non-goals.                                                          |
| Domain engineering  | Encoded integer-money calculations, deterministic allocation, idempotent payday, append-only ledger events, and the unpaid-responsibility versus paid-extra boundary.           |
| Product design      | Explored and implemented the approved Family Table / Four Jars direction, responsive mobile composition, jar interactions, motion, multilingual copy, and accessible states.    |
| Safety architecture | Designed same-origin session boundaries, no-store responses, static-only PWA caching, structured validation, secret isolation, and synthetic-data-only judge behaviour.         |
| Verification        | Wrote and iterated unit, component, browser, accessibility, storage, CSP/CSRF, session-isolation, and live-deployment checks; diagnosed failures and re-ran the relevant gates. |
| Shipping evidence   | Prepared the pinned Docker/Coolify deployment contour, private-repository documentation, commit trail, Build Week evidence log, testing path, and video/submission storyboard.  |

The app also contains a separate bounded GPT-5.6 Money Moment adapter. It can select one reviewed conversation-card ID from allowlisted, non-identifying signals through a strict structured-output contract. The deterministic fallback is the deployed judge path, so the weekly product works without an API credential. The adapter is implemented, but no live model call is claimed unless BW2 verification is completed and recorded.

The authoritative competition log, scorecard, video storyboard, links, and remaining external actions live in [docs/BUILD_WEEK.md](docs/BUILD_WEEK.md).

## License and dependencies

This private competition repository does not grant a public source-code license. Runtime dependencies are pinned exactly in `apps/web/package.json`; their upstream licenses and notices remain those of their respective projects. The main stack is Next.js, React, Tailwind CSS, Zod, Drizzle, PostgreSQL client tooling, Lucide icons, and the official OpenAI JavaScript SDK.
