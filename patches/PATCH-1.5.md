# PATCH-1.5 — post-submission dependency remediation

Status: implemented and locally verified

## Scope

- preserve the existing Next.js release and application behavior;
- override Next.js' optional `sharp` dependency from vulnerable `0.34.5` to
  patched `0.35.3`;
- retain the strict `pnpm audit --audit-level high` CI gate rather than
  suppressing or weakening it.

## Evidence

- GitHub Actions runs for commits `cc79265` through `1924b58` failed only at
  `pnpm audit --audit-level high` after advisory `GHSA-f88m-g3jw-g9cj` was
  published to the GitHub Advisory Database;
- the six earlier runs shown in notification history (`4316976`, `ef730b2`,
  `b162530`, `0b02f6b`, `3663a29`, and `79b4f1b`) were a separate clean-checkout
  route-type generation issue already resolved by `PATCH-1.4`;
- the lockfile now resolves exactly one `sharp` version, `0.35.3`, through
  Next.js;
- frozen install, formatting, route type generation, strict typecheck, lint,
  50 unit/component tests, production build, Drizzle check, high-severity
  dependency audit, and 16/16 Playwright tests pass locally.

## Boundary

This maintenance patch changes no product flow, data boundary, credential
handling, deployment configuration, or real-family beta posture.
