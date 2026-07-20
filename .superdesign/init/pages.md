# Page dependency trees

## / — synthetic family-money demo

Entry: `apps/web/src/app/page.tsx`

Dependencies:

- `apps/web/src/components/demo-app.tsx`
  - `apps/web/src/components/pwa-register.tsx`
  - `apps/web/src/domain/demo-contract.ts`
    - `apps/web/src/domain/demo.ts`
    - `apps/web/src/server/money-moment/schema.ts`
  - `apps/web/src/domain/demo.ts`
    - `apps/web/src/domain/money.ts`
    - `apps/web/src/server/money-moment/schema.ts`
  - `apps/web/src/domain/money.ts`
  - external UI dependency: `lucide-react`
- layout: `apps/web/src/app/layout.tsx`
  - stylesheet: `apps/web/src/app/globals.css`

Actual render branches:

- lifecycle routing: `apps/web/src/components/demo-app.tsx:591:704`
- persistent Week/Buckets/History roots: `apps/web/src/components/demo-app.tsx:1083:1280`
- Money Moment: `apps/web/src/components/demo-app.tsx:1283:1344`

The target redesign is the persistent post-payday mobile root at 390×844, while preserving the same lifecycle and information architecture.
