# Security and privacy

Classification: `Sensitive`. This document records the focused Build Week threat model and beta blockers; it is not evidence of production readiness.

## Sensitive-field inventory

Allowed minimum: parent email or validated Telegram identity, child nickname, age band, presentation token, display currency, weekly loop records, consent/audit metadata, and reminder preferences. Prohibited: exact birth date, child email/phone/Telegram, photo, school, address/location, contacts, IIN/documents, bank/card data, free-form sensitive notes, and real family data in demo/model/test/log/evidence systems.

Money Moment allowlist: age band, `kk|ru`, learning-objective enum, four basis-point percentages, and boolean/enum progress signals. It excludes names, identifiers, exact amounts, task/agreement/goal text, free text, contacts, and provider conversation state. A live response can select only one reviewed card ID; displayed RU/KK copy is curated locally and revalidated by the full conversation-card schema.

Build Week abuse controls are bounded per process: at most 500 active 30-minute demo sessions, three Money Moment requests per session across state resets, and 12 live-provider attempts per minute shared by all sessions. Capacity/budget exhaustion fails to `503`, `429`, or deterministic fallback as appropriate; the no-key fallback path consumes no live-provider budget.

## Focused threat model

| Threat                            | Required control                                                                                                                                        | Build Week evidence target                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Cross-parent/demo-session access  | Server session plus `parent_id` scope on every object; IDOR tests                                                                                       | two isolated synthetic sessions cannot read/mutate each other |
| Duplicate/uncertain payday        | transactional/idempotent command, calculation hash, uniqueness, original-result replay                                                                  | duplicate tap/retry/concurrency tests                         |
| Ledger tampering                  | immutable closed records; append-only corrections; non-negative/currency/source constraints                                                             | domain and PostgreSQL constraint tests                        |
| CSRF/session theft                | host-only HttpOnly Secure Lax cookie, origin/host and CSRF validation, expiry/revocation                                                                | route/header tests                                            |
| Telegram forgery/replay           | backend signature validation, five-minute freshness, single-use replay digest                                                                           | post-submission adapter tests                                 |
| Child data leakage                | minimization, strict length/enums, no browser persistence/analytics payloads, redacted logs                                                             | storage/log scan and payload tests                            |
| PWA cache leak                    | static-shell allowlist; private/API/auth/mutation exclusion; fail-closed network behavior                                                               | service-worker/cache tests                                    |
| Model data exfiltration/injection | enum-only input, server adapter, strict allowlisted card-ID selection, curated output, timeout/budgets, deterministic fallback, `store:false`, no tools | schema/safety/fallback/non-exposure tests                     |
| OTP/intent abuse                  | keyed digests, single use, short TTL, attempt/rate limits, generic responses                                                                            | beta auth test suite                                          |
| Deletion resurrection             | archive-first 30-day window, purge map, protected tombstones reapplied after restore                                                                    | isolated restore/deletion replay drill                        |
| Operator/deploy compromise        | named MFA accounts, least privilege, short-lived elevation, immutable deploy, secret scanning                                                           | release evidence and access review                            |
| Reminder privacy/duplication      | backend-owned opt-in/quiet hours, privacy-safe template keys, idempotent lease/ack/fail                                                                 | controlled failure and duplicate tests                        |

## Authorization matrix

| Object/action                        |                            Parent owner |                   Child |                    Synthetic judge |                              Operator/service |
| ------------------------------------ | --------------------------------------: | ----------------------: | ---------------------------------: | --------------------------------------------: |
| Read/update own open child/week/task |                                   allow | deny independent access | own isolated synthetic tenant only |                               deny by default |
| Confirm payday/allocation            | allow with lifecycle/idempotency checks |                    deny |          own synthetic tenant only |                                          deny |
| Read closed history                  |                       allow own records | shared-screen view only |          own synthetic tenant only |      reasoned short-lived support access only |
| Append correction                    |           allow own records with reason |                    deny |          demo-safe correction only |             critical audited repair path only |
| Change entitlement                   |                                    deny |                    deny |                               deny | named critical action with scope/expiry/audit |
| Archive/export/delete                |      allow own account with fresh proof |                    deny |                         reset only |        critical audited purge/restore tooling |
| Generate Money Moment                |       parent-triggered after allocation |  no independent trigger |   allowlisted synthetic input only |         provider service receives no identity |
| Reminder claim/ack/fail              |                                    deny |                    deny |                           disabled | dedicated least-privilege n8n credential only |

## Consent, retention, deletion

Before real child creation, record a versioned adult affirmation plus notice/consent version, purposes, categories, retention, processors/cross-border flow, time, and withdrawal/deletion path in Kazakh and Russian. State that the app tracks educational amounts and never holds, transfers, invests, or pays money.

Deletion is archive-first with a disclosed 30-day recovery window, then purge database rows/projections/caches/n8n jobs/analytics identifiers/exports/support attachments/child educational ledger. Protected deletion tombstones are reapplied after any restore before traffic resumes.

## Logging, backups, incidents

Logs contain safe event name, request/command id, outcome, latency/runtime, and pseudonymous parent reference only. Never log secrets, emails, Telegram payloads, child nickname, labels, amount history, reminders, model prompt/output, or full payloads.

Before real data: daily encrypted PostgreSQL backups, approved Kazakhstan primary/off-host locations, failure alerts, maximum 30-day rolling retention, isolated restore drill, deletion replay, ledger/payday reconciliation, and an incident runbook covering containment, revocation, evidence, recovery, communication, and Kazakhstan notification obligations.
