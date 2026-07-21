# PATCH-1.4 — active-week product home and release hardening

Status: implemented, deployed, and verified

## Scope

- replace the confusing six-step walkthrough presentation with three setup
  steps followed by the real Week / Jars / History product root;
- keep Quick Check and payday as explicit lifecycle actions inside the product;
- make stale in-memory deploy sessions recover visibly instead of leaving an
  apparently inert control;
- verify `Start next week` and active-week navigation end to end;
- remove the public MIT grant and keep the private competition repository under
  an explicit no-public-license posture;
- make type checking reproducible on a clean checkout by generating Next route
  types before TypeScript runs.

## Product behavior

- confirming the family agreement opens the active Week home with persistent
  Week / Jars / History navigation;
- Jars and History can be reviewed during the week, while balance-changing jar
  actions stay locked until the first confirmed payday;
- planned tasks use a neutral state until Quick Check records completion;
- a lost 30-minute or post-redeploy synthetic session receives a fresh bounded
  cookie and a localized explanation;
- completing a week and selecting `Start next week` returns to week focus step
  `2/3`, preserving cumulative jar balances through the same synthetic session.

## Verification

- full code gate passes: format, route type generation, strict typecheck, lint,
  50 unit/component tests, production build, Drizzle check, secret scan, and
  client-bundle scan;
- local production Playwright passes 16/16 across 320px, 390px, 428px, and
  desktop, including active-week roots, expired-session recovery, and the next
  week transition;
- preferred-origin production Playwright passes the same 16/16 suite after the
  Coolify release became stable;
- Chrome visual QA at 390x844 confirms the active Week product home follows the
  approved typography, color, spacing, border, navigation, and motion system.

## Release boundary

The public URL remains a synthetic competition demo, not a real-family beta.
PostgreSQL remains disconnected until parent authentication, consent/deletion,
ownership, backup/restore, legal, and security gates are approved.
