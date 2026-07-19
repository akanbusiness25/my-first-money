# Architecture

## Shape

One deployable TypeScript/Next.js modular monolith serves the responsive browser/PWA demo and later Telegram Mini App runtime. Next.js App Router owns UI and same-origin `/api/v1/*`; framework-independent domain/application modules own lifecycle and money rules; Drizzle/PostgreSQL owns durable beta persistence. The Build Week judge path may use an isolated server-side synthetic store with short TTL so it needs no OTP or real data.

No separate API container, Redis, queue, object storage, admin app, or offline mutation layer is approved.

## Runtime boundaries

```text
Parent browser/PWA (synthetic judge session)
  -> HTTPS Next.js UI / same-origin route handlers
     -> Zod boundary validation
     -> application use-cases
     -> domain invariants
     -> synthetic TTL store (Build Week) or PostgreSQL/Drizzle (beta path)
     -> MoneyMomentProvider
        -> deterministic local fallback
        -> server-only OpenAI Responses adapter (BW2 live verification only)

Later Telegram WebView
  -> backend-validated raw init data
  -> same opaque session / same use-cases / same persistence
```

## Data and trust boundaries

- Browser receives code-native screen data but never credentials, raw Telegram init data, OpenAI keys, provider prompts, or cross-parent records.
- A host-only `HttpOnly`, `Secure`, `SameSite=Lax` cookie identifies a parent/demo session. State-changing routes require same-origin/CSRF checks.
- Every persistent query/mutation scopes by authenticated `parent_id`; public IDs/UUIDs never authorize.
- Private/auth responses are `Cache-Control: no-store, private`. The service worker caches public versioned shell assets only.
- Money Moment receives only age band, locale, learning objective, four percentages, and boolean/enum progress signals. No identifiers, names, exact amounts, or free text cross the provider boundary.

## Kazakhstan topology decision

Competition implementation and deployment use synthetic data only. The real-family beta topology is intentionally unresolved: primary personal-data storage and encrypted off-host backups must be in an approved Kazakhstan location, and every cross-border processor must be documented and approved by Kazakhstan counsel before beta. Current generic foreign-host deployment candidates are not approved for real family data.

## Operational boundaries

- Separate local/staging/production identities, data, providers, credentials, logs, and backups.
- Production deploys are immutable and version-pinned with migration, health, rollback, and restore evidence.
- n8n/Telegram reminders are post-submission adapters; backend owns eligibility and canonical actions.

