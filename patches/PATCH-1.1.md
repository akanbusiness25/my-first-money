# PATCH-1.1 — judge-flow clarity and supervised jar use

Status: implemented and locally verified

## Scope

Refine the approved Four Jars demo without widening the Build Week product:

- make the synthetic judge walkthrough explicit instead of presenting it as a real elapsed week;
- keep English default and maintain the existing EN/RU/KK contract;
- keep USD as the only competition-MVP currency;
- add reversible pre-payday navigation, editable optional base pocket money, and explicit learning-objective effects;
- require separate parent and child agreement marks;
- keep unpaid family responsibilities educational and non-punitive while only completed paid jobs affect payday;
- preserve the child, preferences, goal, balances, and append-only history when preparing another week;
- add parent-confirmed bucket-use records, newest-first history, and a small history filter;
- clarify Free versus future Plus and judge-demo reset in Settings;
- repair the focused-jar drag feedback and remove decorative spark/fork symbols that confused the flow.

## Decisions

- `4–7`, `8–12`, and `13+` remain the approved age bands. The requested `3–7` change conflicts with the pipeline's approved `4+` architecture and is not silently introduced during the deadline pass.
- Base pocket money is optional and unconditional once agreed. An incomplete unpaid family responsibility does not deduct or cancel it; the product avoids penalties, debt, shame, and coercive pay-for-basic-duty mechanics.
- Learning objective changes the bounded Money Moment/reflection emphasis only. It never silently changes the starter split or payday amount.
- Week progression remains parent-triggered for the competition MVP. Timezone scheduling and reminders stay post-submission so no unnecessary timezone surface is added.
- PostgreSQL schema/migrations remain committed, but live persistence/auth are post-submission beta work. The judge path stays isolated, synthetic, credential-free, and auto-expiring.
- Reset remains available behind Parent Settings because judges need a reliable fresh path; copy must identify it as a synthetic demo reset.

## Verification target

Run format, strict typecheck, lint, unit tests, production build, Drizzle/secret/client checks, and the full Playwright judge flow at 320/390/428/desktop. Re-check the current app in the in-app browser with motion enabled and reduced-motion behavior.

## Verification result

- `pnpm check`: passed, including format, strict typecheck, lint, 45 unit tests, production build, Drizzle schema check, secret scan, and client-bundle scan.
- `pnpm test:e2e`: 12/12 passed at 320px, 390px, 428px, and desktop; the main flow now asserts the focused jar visibly follows a side-to-side pointer drag.
- In-app browser: complete synthetic flow passed at 390 x 844; tab changes reset scroll to the top, and the refined Week/Jars screenshots were compared with the approved concepts.
- Security contour: same-origin/CSRF/no-store controls remain; amount and balance checks are server-side; ledger events and closed paydays are bounded; no key or live-model identifier entered the client bundle.
