# Routes

## Browser routes

| URL | Entry file                  | Layout                        | Summary                                                                                                                                                                     |
| --- | --------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` | `apps/web/src/app/page.tsx` | `apps/web/src/app/layout.tsx` | Single synthetic judge experience. `DemoApp` renders setup, mission, agreement, active week, quick check, payday, closed week, Four Jars, history, and Money Moment states. |

## Same-origin API routes

| URL            | File                                    | Purpose                                            |
| -------------- | --------------------------------------- | -------------------------------------------------- |
| `/api/health`  | `apps/web/src/app/api/health/route.ts`  | Health check.                                      |
| `/api/v1/demo` | `apps/web/src/app/api/v1/demo/route.ts` | Synthetic session bootstrap and all demo commands. |

There is no React Router configuration. Next.js App Router file-based routing is used.
