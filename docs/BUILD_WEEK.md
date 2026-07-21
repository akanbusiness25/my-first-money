# OpenAI Build Week — My First Money

This is the sole competition evidence and submission checklist source.

## Competition facts

- Project: `My First Money`; technical slug: `my-first-money`.
- Track: `Apps for Your Life`.
- Official deadline: `2026-07-21 17:00 PDT` / `2026-07-22 05:00 Asia/Qyzylorda`.
- Internal complete-submission cutoff: `2026-07-21 22:00 Asia/Qyzylorda`.
- Owner: Akan / ILMIO.
- Rules: https://openai.devpost.com/rules
- FAQ: https://openai.devpost.com/details/faqs
- Boundary: synthetic demo only; not production-ready for real children/families.

## Before versus new work

Before Build Week implementation: product idea, naming exploration, Product/Strategy/UX/Tech/Security planning, and pipeline documents in `D:\brain\projects\product-pipeline\I006-kids-money\PIPELINE.md`.

New during the submission period: this repository, application code, tests, synthetic judge data/path, bounded GPT-5.6 feature, deployment, README, evidence log, screenshots/video, and submission assets. Do not attribute pre-existing planning to Build Week GPT-5.6 implementation.

## Append-only build log

| Time (Asia/Qyzylorda) | Objective/model                                          | Produced                                                                                                                                             | Checks/evidence                                                                               | Commit                        |
| --------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------- |
| 2026-07-19 15:37      | Start `firstmoney main` in Execute mode on GPT-5.6 Sol   | Confirmed empty root; began mandatory docs/security/domain contour                                                                                   | Root/Git/runtime preflight; sanitized start screenshot still requires Akan                    | pending first commit          |
| 2026-07-19 15:40      | Honest pre-feature BW0 baseline                          | Required operating, roadmap, competition, architecture, domain, security, and beta-gate documents                                                    | Commit exists before feature implementation                                                   | `ed194bd`                     |
| 2026-07-19 17:34      | BW1–BW3 local implementation checkpoint on GPT-5.6 Sol   | Complete synthetic family-week loop, PWA, Money Moment fallback/live adapter, tests, deployment contour, and local security remediation              | Focused security tests 14/14; fresh full verification in progress                             | pending implementation commit |
| 2026-07-19 17:47      | Production verification and curated evidence             | Dependency overrides, four reproducible 390px screenshots, 320/390/428/desktop judge and boundary tests                                              | Frozen install; format/type/lint; 18 unit; build; Drizzle; secret/client; clean audit; 12 E2E | pending implementation commit |
| 2026-07-19 17:52      | BW1–BW4 local implementation milestone                   | Committed the verified application, tests, security fixes, PWA/deployment contour, docs, and curated evidence                                        | Clean staged diff and secret scan passed                                                      | `1ceee06`                     |
| 2026-07-20 22:25      | Approved managed product redesign on GPT-5.6 Sol         | EN-default settings, USD, generated/live-fill jars, focused gesture/sound, editable goal, parent bonus/move, append-only history, refreshed evidence | 41 unit; build; Drizzle; secret/client; clean audit; 12 E2E; IAB 390px and RU/KK 320px QA     | `6ae7058`                     |
| 2026-07-21 13:34      | Judge-flow clarity and supervised jar use on GPT-5.6 Sol | Reversible setup, optional base, interactive agreement, cumulative weeks, jar use, newest-first filters, goal icons, refined motion and evidence     | 45 unit; build; Drizzle; secret/client; 12 E2E including pointer drag; IAB 390px comparison   | `218e3e6`                     |
| 2026-07-21 15:04      | Product-demo launch contour on GPT-5.6 Sol               | Neutral test-run entry, contextual jar use, allocation-aware History, private GitHub repository, isolated Coolify project                            | 48 unit/component; build; Drizzle; secret/client; 12 E2E; Chrome 390px product-flow QA        | `4316976`                     |
| 2026-07-21 16:10      | Private HTTPS launch on GPT-5.6 Sol                      | Healthy Coolify Docker deployment, temporary HTTPS origin, private PostgreSQL boundary, remote-testable Playwright configuration                     | Full local check; local 12/12 E2E; live HTTPS 12/12 E2E; health/CSP/HSTS verified             | `b162530`, `0b02f6b`          |

Append new rows; never rewrite prior evidence or invent results.

## Codex and GPT-5.6 narrative

Codex/GPT-5.6 Sol in this primary task turned the approved pipeline into a working modular Next.js/PWA vertical slice, encoded integer-money/idempotency/privacy invariants, generated and implemented the visual system, wrote automated tests, diagnosed compatibility and browser/security issues, and prepared deployment/submission evidence.

The in-product GPT-5.6 use is deliberately bounded: after synthetic allocation, the parent may request a two-minute Money Moment. Server input is an allowlisted non-identifying structure. The live model may select only one reviewed card ID through a strict Zod Structured Output contract; the server maps it to curated EN/RU/KK copy and validates the final card. A deterministic fallback covers the complete flow, so the weekly loop never depends on AI. The server adapter is implemented, but no key was requested or created and no live call is claimed; that external verification remains deferred by the current credential protocol.

## Judging scorecard

| Criterion                    | Evidence target                                                                                                                                               | Current gap                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Technological Implementation | primary Codex task, Git trail, complete vertical loop, Money Moment provider/fallback/live adapter, tests, architecture/security/deploy evidence, `/feedback` | local implementation complete; live provider/deploy/feedback pending |
| Design                       | coherent mobile family-week flow, polished states, 320–428px, keyboard/a11y/reduced motion, visual fidelity                                                   | concept and curated screenshots complete; external demo pending      |
| Potential Impact             | concrete 7–12 parent/caregiver problem and weekly ritual shown without invented traction                                                                      | product narrative ready; submission/demo proof pending               |
| Quality of Idea              | unpaid vs paid distinction, four buckets, parent-funded Grow, safe post-choice reflection; clearly not bank/chore tracker/token/AI tutor                      | working local demo ready; recorded demo pending                      |

## Evidence index

- Sanitized start screenshot: pending Akan capture. Show task `firstmoney main`, date, `D:\app myfirstmoney`, and GPT-5.6 Sol; hide email/account/usage/unrelated chats/secrets.
- Git milestones: pre-feature baseline `ed194bd`; verified implementation milestone `1ceee06`.
- Accepted UI concepts: `docs/design/redesign-week-approved.png`, `redesign-jars-approved.png`, and `redesign-jar-detail-approved.png`; earlier lifecycle concepts remain supporting references.
- Browser screenshots: `docs/design/implementation-week.png`, `implementation-jars.png`, `implementation-jar-detail.png`, `implementation-week-refined-390.png`, and `implementation-jars-refined-390.png`; generated from the production build with synthetic data only.
- Visual fidelity: `docs/design/comparison-*.png` and `docs/design/design-qa.md` record the same-viewport comparison, copy differences, intentional simplifications, and browser method.
- Playwright verification: 12/12 production E2E across 320px, 390px, 428px, and desktop, including axe, session isolation, CSP/CSRF/no-store, browser-storage, and static-only PWA cache assertions.
- Scoped security review: 44/44 changed files covered; two medium abuse-control findings locally remediated and regression-tested before the implementation commit.
- Private repository: `https://github.com/akanbusiness25/my-first-money`; verified commit is pushed to `main`.
- Live demo: `https://myfirstmoney.95.216.173.242.sslip.io` is running and verified with synthetic data. Preferred `myfirstmoney.ilmio.space` DNS, video, and Devpost remain pending.
- Primary `/feedback` Session ID: `PENDING — Akan must run /feedback in firstmoney main`.

## Links and access

- Repository URL/status: https://github.com/akanbusiness25/my-first-money — private; `main` pushed.
- Live synthetic demo: https://myfirstmoney.95.216.173.242.sslip.io — verified 2026-07-21 16:10 Asia/Qyzylorda.
- Public YouTube video: pending.
- Devpost submission: pending.
- Repository access option: public with appropriate license, or private shared with `testing@devpost.com` and `build-week-event@openai.com`.

## Video storyboard (target 2:35–2:50, hard limit 3:00)

1. `0:00–0:20` — Problem and boundary: pocket money becomes learning only through a shared ritual; no bank account, transfer, or child surveillance.
2. `0:20–1:30` — Synthetic judge flow: child setup, unpaid versus paid mission, agreement, Quick Check, transparent payday, four-bucket allocation.
3. `1:30–2:05` — Parent-triggered Money Moment, structured safe input, validated GPT-5.6 result, and visible fallback resilience.
4. `2:05–2:30` — Parent bonus/move review, append-only History, mobile/PWA polish, and security/privacy boundary.
5. `2:30–2:50` — Exact Codex/GPT-5.6 contribution, repository/demo access, and invitation to try the synthetic path.

Use public YouTube visibility, narration/audio, English or English translation, clean 1920x1080 capture, readable mobile zooms, and no private/account/secret data.

## Final submission checklist

- [x] Working free synthetic demo path requires no OTP/private credential and resets synthetic family state.
- [x] Frozen install, format, strict typecheck, lint, 45 unit tests, production build, migration structure, dependency/secret/client scans, 12 E2E/a11y/cache/header/storage/security tests, and local production health smoke are recorded; Docker/PostgreSQL 18 container smoke is explicitly unavailable locally.
- [x] Money Moment provider/fallback/strict-selection/safety/budget tests pass without credentials.
- [ ] One live `gpt-5.6-sol` verification is recorded without exposing a manually supplied server secret.
- [x] README covers setup/run/test, synthetic data, architecture, security/privacy, before/new disclosure, concrete Codex/GPT-5.6 use, license/dependencies, and demo access status.
- [ ] Private repository access is granted to the required judging accounts and the license decision is confirmed through judging.
- [x] Stable HTTPS demo passes the complete fresh-context 12-test judge flow at 320px, 390px, 428px, and desktop.
- [x] Curated production screenshots contain synthetic data only and no private data or secrets.
- [ ] Public YouTube video is <=3:00, has audio, shows the working app, and explains Codex/GPT-5.6 use.
- [ ] Akan runs `/feedback` in `firstmoney main` and copies the exact Session ID here and to Devpost.
- [ ] Devpost fields/links/video/demo/repository are verified incognito and submitted before internal cutoff.
