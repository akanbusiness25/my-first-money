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

1. Choose/connect a stable HTTPS host (Coolify/Hetzner or another approved platform), set the final origin, build the container, and record its immutable digest.
2. Verify `/api/health`, CSP/headers, the full incognito judge path, and deployment logs without secrets or identifiers.
3. Record the verified URL and timestamp in `docs/BUILD_WEEK.md`.

The durable Kazakhstan beta requires PostgreSQL 18, explicit migration/release/backup controls, approved Kazakhstan primary and backup locations, parental authentication/consent, deletion and restore drills, and the complete `docs/launch/BETA_GATE.md`. None is implied by the Build Week container.
