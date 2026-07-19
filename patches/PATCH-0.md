# PATCH-0 — contour, compatibility, and first work packet

Status: local implementation complete; final verification and external launch evidence in progress

## Scope

Establish the implementation root, one canonical roadmap, Build Week evidence trail, modular-monolith boundary, domain invariants, focused threat model/authorization matrix, real-family beta blockers, version compatibility gate, and the first synthetic browser/PWA vertical slice.

## Exact files/services

- Root operating docs: `AGENTS.md`, `BOOT.md`, `STATUS.md`, `ROADMAP.md`.
- Competition: `docs/BUILD_WEEK.md`.
- Architecture/domain/security: `docs/ARCHITECTURE.md`, `docs/DOMAIN_MODEL.md`, `docs/SECURITY_PRIVACY.md`, `docs/launch/BETA_GATE.md`.
- Implemented surface: root workspace config, `apps/web`, domain/application/provider modules, same-origin `/api/v1/*`, tests, static-only PWA shell, migrations, container config, README, and deployment/design documentation.

## Accepted decisions

- Root is `D:\app myfirstmoney`; no duplicate task or project folder.
- Build Week uses synthetic data only and is not a real-family beta.
- Browser/PWA vertical slice precedes Telegram/n8n/Plus work.
- The judge path is isolated, bounded to 500 active 30-minute sessions, resettable, and does not require OTP.
- Money Moment is provider-based with strict allowlisted input/card-ID selection, curated schema-valid output, a reset-resistant three-call session allowance, a 12/minute process-wide live-provider budget, and deterministic fallback. Live credentials remain deferred by explicit protocol.
- Grow bonus posts directly to Grow as a separate parent-funded ledger entry.

## Compatibility gate

Candidate exact versions: Node `24.18.0`, pnpm `11.15.0`, TypeScript `7.0.2`, Next.js `16.2.10`, React/React DOM `19.2.7`, Tailwind CSS `4.3.3`, Drizzle ORM `0.45.2`, Drizzle Kit `0.31.10`, Zod `4.4.3`, PostgreSQL `18.x`, and an exactly pinned official OpenAI JavaScript SDK version verified at scaffold time.

Compatibility evidence: registry lookup confirmed every candidate version exists. The clean peer gate then failed because `typescript-eslint 8.64.0` requires TypeScript `>=4.8.4 <6.1.0`, while the candidate was `7.0.2`; React/import/a11y ESLint plugins required ESLint `<=9`, while registry-current ESLint was `10.7.0`. TypeScript `6.0.3`, `5.9.3`, and Drizzle's own `5.6.3` baseline all exposed incompatible Drizzle declarations under `skipLibCheck:false`; Drizzle `0.44.7` produced the same errors, so an ORM downgrade was rejected. The Build Week program therefore uses TypeScript `6.0.3`, ESLint `9.39.5`, and approved Drizzle `0.45.2`; the currently unused beta DB source/config are outside the Next TypeScript program and are separately runtime/schema-validated by migration generation plus `drizzle-kit check`. Application/UI/domain code remains `strict:true`, `skipLibCheck:false`, with `noUncheckedIndexedAccess:true`. This is not beta persistence approval: compiling Drizzle runtime repository code without `skipLibCheck` remains an explicit beta blocker. No broad `any`, peer override, or silent suppression is used.

Required checks: registry/advisory verification, frozen install, strict typecheck, lint, unit smoke, production build, Drizzle schema/migration check against disposable PostgreSQL 18 when available, and production container build/smoke when Docker is available. Do not use `skipLibCheck`, broad `any`, suppressions, or a silent downgrade.

Local preflight at 2026-07-19 15:37 +05:00: Git `2.52.0.windows.1`, Node `24.18.0`, npm `11.16.0`, globally available pnpm `11.9.0`, Docker not found. Project Corepack pins pnpm `11.15.0`. pnpm 11 removed `onlyBuiltDependencies`; reviewed native/build dependencies are explicitly approved through `allowBuilds` (`esbuild`, `sharp`, `unrs-resolver`) while all unlisted install scripts fail closed. Container smoke is expected to remain externally blocked unless a compatible local builder is available.

## Security/legal gates

No real-family data or beta claim until `docs/launch/BETA_GATE.md` is fully evidenced. High-risk areas: parent ownership, demo isolation, session/CSRF, payday idempotency/concurrency, immutable ledger/corrections, PWA cache exclusion, child-data minimization, logs, provider data flow, deletion replay, Kazakhstan primary/backup location, and incident response.

## Tests and expected results

- Frozen install, formatting, strict typecheck, lint, 18 unit tests, Next production build, Drizzle migration check, secret/client-bundle scans, clean dependency audit, production health smoke, and 12 Playwright tests exit 0.
- The complete synthetic judge flow passes at 320px, 390px, 428px, and desktop without cross-session data leakage or duplicate payday/allocation.
- Money Moment fallback always returns schema-valid curated content and the core loop completes with the provider disabled.
- Browser local/session storage and IndexedDB contain no family/session state; Cache Storage entries are restricted to `/_next/static/*` and `/icon.svg`.
- Docker/PostgreSQL 18 runtime/container smoke was not run because Docker is unavailable on the verified workstation.

Scoped security scan covered 44/44 changed source files. Its two medium abuse-control findings (unbounded anonymous session admission and reset-multipliable provider allowance) were reproduced, fixed, and covered by focused tests. The semantic model-output boundary was additionally hardened to accept only curated IDs before any live verification.

## Next 1–3 items

1. Deploy the verified commit to stable HTTPS and repeat the judge path in an incognito browser.
2. Publish/share the repository and record the final URL/access evidence.
3. Record/upload the narrated video, run `/feedback`, and complete Devpost submission; live provider verification remains separate and must use a manually supplied server secret.
