# Deployment contour

## Build Week synthetic demo

The deployable unit is one Next.js standalone container on one HTTPS origin. It needs no database or secret for the deterministic judging path. The in-memory synthetic sessions expire after 30 minutes, are capped at 500 active sessions per process, and are intentionally not durable across restarts.

```powershell
docker build -t my-first-money:build-week .
docker run --rm -p 3000:3000 my-first-money:build-week
```

Health check: `GET /api/health`. Judge smoke: `GET /`, complete the free flow in a private window, verify response security headers, and confirm that reload/restart does not expose another session.

## Hosting contract

- Pin Node `24.18.0` and pnpm `11.15.0`; deploy an immutable image digest after the first successful external build.
- Terminate TLS at the platform and redirect HTTP to HTTPS. Add HSTS only at the verified HTTPS edge.
- Keep one instance for the in-memory synthetic demo so session and 12/minute live-provider budgets remain coherent. A multi-instance deployment requires shared bounded admission/rate infrastructure and is outside Build Week scope. Do not present this topology as real-family durability.
- Store any future OpenAI credential only in the hosting secret manager as a server-only environment value. The local fallback needs none.
- Run `pnpm check`, `pnpm security:secrets`, `pnpm security:client`, and E2E before traffic switch.
- Preserve `Cache-Control: no-store, private` on `/api/*`; never configure a CDN to cache demo API or HTML/RSC payloads.
- Use separate origins, identities, keys, logs, and data for local/staging/production. No real family data belongs in Build Week environments.

## External steps still requiring Akan

The isolated Coolify application is healthy and the full synthetic flow is
verified at `https://myfirstmoney.95.216.173.242.sslip.io`. HTTP redirects to
HTTPS; `/api/health`, CSP, HSTS, no-store API responses, and the complete 12-test
browser matrix pass.

Remaining operator steps:

1. The A record `myfirstmoney.ilmio.space -> 95.216.173.242` is published and
   trusted TLS/health pass. Wait for the local/ISP resolver to finish propagation,
   repeat the same live suite on the preferred origin, then remove the sslip.io
   fallback only after the preferred origin is independently stable.
2. In Coolify, delete the stopped empty resource
   `unused-empty-postgres-delete-me`; the final destructive confirmation
   requires the owner password. Do not delete `my-first-money-postgres`.
3. Keep `my-first-money-postgres` private. Do not attach `DATABASE_URL` to the
   anonymous demo. Before durable traffic, implement parent email OTP, reviewed
   migrations/ownership, consent/deletion, and backup/restore gates.

The durable Kazakhstan beta has a provisioned private PostgreSQL 18 resource,
but still requires explicit migration/release/backup controls, approved
Kazakhstan primary and backup locations, parental authentication/consent,
deletion and restore drills, and the complete `docs/launch/BETA_GATE.md`. None
is implied by the Build Week container.
