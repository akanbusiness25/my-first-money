# PATCH-1.2 — product demo entry, contextual jar use, and launch contour

Status: local implementation verified; external launch in progress

## Scope

- remove internal competition/jury language from the customer-facing interface;
- offer a clear first choice between a prefilled test run and a blank start;
- make jar-use reasons specific to Spend, Save, Give, or Grow and explain that this action removes money while Move money transfers it;
- enforce the bucket-to-purpose mapping in the server domain, not only in the form;
- show each closed-week allocation in bucket-filtered History and use a truthful filtered-empty state;
- soften the History filter focus treatment while preserving a visible accessible focus indicator;
- align the future PostgreSQL child currency default with the approved USD-only MVP;
- prepare a separate private GitHub repository and isolated Coolify deployment without touching existing projects.

## Product boundary

The deployment is a production-built HTTPS competition demo using synthetic,
auto-expiring server-session data. It is not opened to real-family data. Durable
PostgreSQL persistence, parent authentication, Kazakhstan data-location approval,
consent/deletion, backup/restore, and remaining beta security gates stay in the
post-submission lane.

The current demo does not create an unused PostgreSQL resource. The reviewed
Drizzle schema and migrations remain ready for the durable beta implementation.

## Verification result

- format, strict typecheck, lint, and 48 unit/component tests pass;
- production Next.js build and Drizzle migration check pass;
- Playwright product flow passes 12/12 at 320px, 390px, 428px, and desktop, including axe checks;
- Chrome visual verification at 390 x 844 confirms the neutral entry screen, approved Four Jars composition, contextual Save/Give reasons, and absence of the removed banner.
