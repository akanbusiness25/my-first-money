# PATCH-1 — managed product redesign and supervised jar actions

Status: approved design specification; implementation planning pending written-spec review

## Scope

Implement the approved Week / Jars / focused-jar visual system, English-default EN/RU/KK localization, parent Settings, USD-only display, one editable Save goal, parent bonus, supervised bucket moves, append-only History, and restrained jar gesture/sound.

## Accepted decisions

- The three approved visual targets live under `docs/design/redesign-*-approved.png`.
- USD is the only competition-MVP display currency; KZT, RUB, conversion, and currency selection are deferred.
- Header languages move into parent Settings.
- Week uses restrained completion celebration and Money Moment.
- Jars uses the four large interactive jars.
- Focused jar uses truthful goal progress plus deliberate drag/keyboard shake and optional short sound.
- Activity remains in History; Jars uses Add parent bonus and Move money.
- Parent bonus and move are separate append-only event types, not rewrites of payday and not bank transfers.

## Safety boundary

Synthetic/demo data only. No key, secret, live provider verification, real-family data, financial rail, investment feature, or beta-readiness claim is introduced.

## Verification target

Unit, type, lint, build, migration, security, and production E2E gates remain required. UI fidelity is checked at 390×844 against the approved concepts and stressed at 320px, 428px, desktop, keyboard, reduced motion, and long RU/KK labels.
