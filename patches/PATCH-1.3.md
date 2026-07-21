# PATCH-1.3 — private launch, HTTPS verification, and database boundary

Status: implemented and externally verified

## Scope

- grant the existing Coolify GitHub App access to the new private
  `akanbusiness25/my-first-money` repository without changing its existing
  repository access;
- deploy the standalone Next.js container in the isolated Coolify project;
- make the runtime image compatible with Coolify's HTTP health check;
- verify the same synthetic flow against the live HTTPS origin;
- provision a private PostgreSQL 18 resource for the later authenticated-parent
  lane while keeping Test Run ephemeral and database-free;
- preserve the real-family beta gates instead of presenting infrastructure as
  completed authentication, consent, or durable product behavior.

## Delivered resources

- Coolify application `my-first-money` (`c8s9zfhem3xh0vai0ury64d8`), one healthy
  container, Dockerfile build, port 3000, and `GET /api/health`;
- temporary verified HTTPS origin:
  `https://myfirstmoney.95.216.173.242.sslip.io`;
- preferred origin reserved in Coolify: `https://myfirstmoney.ilmio.space`;
  it becomes usable after an A record points to `95.216.173.242`;
- private PostgreSQL 18 resource `my-first-money-postgres`
  (`xxgwwxrdu17e24lky0zuk77i`), healthy and not publicly exposed;
- stopped empty setup artifact `unused-empty-postgres-delete-me`
  (`k7xminn2xjwah7ua6oq7rx4m`), pending owner-password deletion in Coolify.

## Product and data boundary

The competition Test Run continues to use only bounded, auto-expiring synthetic
server sessions and does not write to PostgreSQL. The PostgreSQL resource is
infrastructure readiness only. It is intentionally not connected to anonymous
traffic. Durable use requires parent email OTP, an opaque first-party session,
consent/deletion handling, ownership-scoped queries, reviewed migrations,
backup/restore evidence, and the remaining beta gates.

## Verification

- local full check passed: format, strict typecheck, lint, 48 unit/component
  tests, production build, Drizzle check, secret scan, and client-bundle scan;
- local Playwright passed 12/12 at 320px, 390px, 428px, and desktop;
- live Playwright passed the same 12/12 suite against the temporary HTTPS
  origin, including the complete family loop, isolated browser contexts,
  accessibility, PWA/cache, CSP/CSRF/no-store, and HSTS assertions;
- live HTTP redirects to HTTPS, `/` returns 200, `/api/health` returns 200 with
  `mode: synthetic-demo`, and Coolify reports the application and database as
  `running:healthy`.

## Preferred-domain activation

- Namecheap A record `myfirstmoney.ilmio.space -> 95.216.173.242` is visible
  through Cloudflare and Google public resolvers with an approximately 30-minute
  TTL;
- Coolify was redeployed after propagation so the preferred hostname now serves
  a trusted certificate, HSTS, the application shell, and the no-store health
  endpoint;
- the workstation's upstream DNS resolver still returns its earlier negative
  cache, so the full preferred-host browser matrix remains the next verification
  step after local propagation.
