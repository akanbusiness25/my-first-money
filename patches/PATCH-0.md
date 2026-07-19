# PATCH-0 — contour, compatibility, and first work packet

Status: in progress

## Scope

Establish the implementation root, one canonical roadmap, Build Week evidence trail, modular-monolith boundary, domain invariants, focused threat model/authorization matrix, real-family beta blockers, version compatibility gate, and the first synthetic browser/PWA vertical slice.

## Exact files/services

- Root operating docs: `AGENTS.md`, `BOOT.md`, `STATUS.md`, `ROADMAP.md`.
- Competition: `docs/BUILD_WEEK.md`.
- Architecture/domain/security: `docs/ARCHITECTURE.md`, `docs/DOMAIN_MODEL.md`, `docs/SECURITY_PRIVACY.md`, `docs/launch/BETA_GATE.md`.
- Next implementation wave: root workspace config, `apps/web`, domain/application/provider modules, same-origin `/api/v1/*`, tests, PWA shell, migrations, and container config.

## Accepted decisions

- Root is `D:\app myfirstmoney`; no duplicate task or project folder.
- Build Week uses synthetic data only and is not a real-family beta.
- Browser/PWA vertical slice precedes Telegram/n8n/Plus work.
- The judge path is isolated, rate-limited, auto-reset, and does not require OTP.
- Money Moment is provider-based with strict structured input/output and deterministic fallback; live credentials are deferred until the adapter is ready.
- Grow bonus posts directly to Grow as a separate parent-funded ledger entry.

## Compatibility gate

Candidate exact versions: Node `24.18.0`, pnpm `11.15.0`, TypeScript `7.0.2`, Next.js `16.2.10`, React/React DOM `19.2.7`, Tailwind CSS `4.3.3`, Drizzle ORM `0.45.2`, Drizzle Kit `0.31.10`, Zod `4.4.3`, PostgreSQL `18.x`, and an exactly pinned official OpenAI JavaScript SDK version verified at scaffold time.

Required checks: registry/advisory verification, frozen install, strict typecheck, lint, unit smoke, production build, Drizzle schema/migration check against disposable PostgreSQL 18 when available, and production container build/smoke when Docker is available. Do not use `skipLibCheck`, broad `any`, suppressions, or a silent downgrade.

Local preflight at 2026-07-19 15:37 +05:00: Git `2.52.0.windows.1`, Node `24.18.0`, npm `11.16.0`, globally available pnpm `11.9.0`, Docker not found. Project Corepack will pin pnpm `11.15.0`; container smoke is expected to remain externally blocked unless a compatible local builder is available.

## Security/legal gates

No real-family data or beta claim until `docs/launch/BETA_GATE.md` is fully evidenced. High-risk areas: parent ownership, demo isolation, session/CSRF, payday idempotency/concurrency, immutable ledger/corrections, PWA cache exclusion, child-data minimization, logs, provider data flow, deletion replay, Kazakhstan primary/backup location, and incident response.

## Tests and expected results

- All configured checks exit 0.
- The complete synthetic judge flow can run twice without cross-session data leakage or duplicate payday/allocation.
- Money Moment fallback always returns schema-valid neutral content and the core loop completes with the provider disabled.
- Browser storage contains no session, family draft/data, amount history, API response, or mutation queue.

## Next 1–3 items

1. Create the first pre-feature Git commit, then scaffold/pin the compatibility surface.
2. Generate the complete mobile UI concept and extract tokens/component rules.
3. Implement and test BW1 plus the non-live BW2 contract.

