# Domain model

## Aggregate lifecycle

`NO_CHILD -> NO_WEEK -> DRAFT -> ACTIVE -> PAYDAY_READY -> PAYDAY_PENDING -> CLOSED`

An audited correction appends to a closed week; it never reopens or mutates the original payday/allocation.

The `Week` root derives exactly one dominant parent action from lifecycle state: set up child, create/continue mission, confirm agreement, quick check, review payday, reconcile pending result, or review closed week/start next week.

## Core entities

- Parent: authenticated owner; Free/Plus entitlement is checked server-side.
- Child: nickname, age band (`4-7`, `8-12`, `13+`), presentation token, currency; parent-owned.
- Weekly mission/agreement: versioned draft, unpaid responsibilities, paid recurring tasks, optional extra jobs, optional base amount, payday rule, supervised marks.
- Task occurrence: `NOT_CHECKED`, `COMPLETED`, or `NOT_COMPLETED`; unpaid work never adds money.
- Payday: immutable calculation snapshot, agreement version/hash, idempotency key, exact integer-minor-unit inputs, total, status, and actor/time.
- Allocation: one immutable Spend/Save/Give/Grow split for one payday.
- Bucket ledger: append-only source entries, parent-confirmed uses, Grow bonus, and corrections; no negative balance or currency mixing.
- Save goal: one active goal per child on Free.
- Money Moment: allowlisted input plus validated parent-facing conversation card; not part of the financial ledger.

## Money invariants

- Amounts are non-negative integers in minor units; percentages are integers in basis points and total exactly `10000`.
- Free starter split is `7000 / 1000 / 1000 / 1000`.
- Payday earnings = optional base amount + each parent-confirmed paid occurrence exactly once. Unpaid responsibilities contribute `0`.
- Bucket allocation uses deterministic largest-remainder rounding so bucket minor units sum exactly to payday earnings.
- A fixed parent-funded Grow challenge bonus is a separate entry posted directly to Grow after allocation. It is not split and never described as interest/yield/investment.
- One mission has at most one successful payday and allocation. Same idempotency key replays the original result; conflicting keys cannot create a second payday.
- Closed source records are immutable. Corrections append actor, reason, source reference, and compensating entries while preserving non-negative balances.

## Entitlement boundary

Free completes one child's first week/payday/allocation, one Save goal, Grow explanation, corrections, reminders, and useful recent history. Plus is checked only when a parent attempts an approved Plus action and never blocks the first payday.
