# Family Table / Four Jars design system

Active references generated through the built-in image path, with no API key:

- `docs/design/redesign-week-approved.png` — approved closed-week direction.
- `docs/design/redesign-jars-approved.png` — approved Four Jars direction.
- `docs/design/redesign-jar-detail-approved.png` — approved focused-jar direction.
- `docs/design/comparison-*.png` — same-viewport concept/implementation QA.

The earlier `concept-week.png` and `concept-payday.png` remain lifecycle references. App text and controls are code-native; tactile jars and the scooter are real generated transparent assets under `apps/web/public/jars/`. The approved currency amendment is USD-only, so KZT visible in early references is replaced by state-derived USD copy.

## Visual point of view

The screen feels like a clear family worksheet on a bright table: true white base, dark navy ink, small areas of useful color, open lists, and four recognizable jars. It should feel trustworthy to a parent and inviting to a child without becoming childish, fintech-like, or visually noisy.

## Locked tokens

| Token        | Value / rule                                                            |
| ------------ | ----------------------------------------------------------------------- |
| Background   | true white `#ffffff`; never cream/beige                                 |
| Soft surface | cool blue-white `#f5f7fd`                                               |
| Ink          | `#08123f`                                                               |
| Muted ink    | `#68718d`                                                               |
| Border       | `#dfe4f0`                                                               |
| Primary      | deep indigo `#2148d8`; hover `#1837b7`; visible focus `#8ba7ff`         |
| Spend        | coral `#f25452`                                                         |
| Save         | blue `#2f61d5`                                                          |
| Give         | accessible gold `#d28a00`                                               |
| Grow         | leaf green `#4d9d48`                                                    |
| Radius       | 6–8px controls and bands; jars keep their native outline shape          |
| Shadow       | none on rows; one subtle elevation shadow only where hierarchy needs it |
| Motion       | 160–220ms restrained feedback; instant equivalent under reduced motion  |

## Typography

- Family: Inter/Aptos/Segoe UI/system sans-serif; warm, compact, and Cyrillic-safe.
- Display: 34–48px, 780–840 weight, compact tracking and line height.
- Section heading: 18–21px, 700–780.
- Body/task: 14–17px, 500–650, 1.4–1.55 line height.
- UI controls: 14–16px, 700–760; never browser-default styling.
- Amounts: tabular numerals, 700; format from integer cents as `$12.60`.

## Container and component rules

- One centered app shell, maximum 428px; desktop uses quiet surrounding whitespace, not a dashboard.
- Header: compact four-jar brand mark and one parent-profile Settings control. Languages never occupy header space.
- Bottom navigation has exactly Week / Jars / History on the three persistent roots.
- Primary CTA is full width, at least 48px high, deep indigo, 8px radius, with one clear action per state.
- Task rows communicate kind/status through icon, label, and amount/status text; color is supplementary.
- Four-jar rows use the generated asset, semantic color, live fill, label, amount, and percentage.
- The focused jar is at least twice the small-jar visual size and keeps goal progress, gesture cue, bonus, and move actions reachable.
- Dialog sheets trap focus, close with Escape, and separate editing from the explicit review/confirm step.

## Icon inventory

Use Lucide's rounded outline family at approximately 1.8–2px stroke, `currentColor`, with filled semantic status only where approved.

- Brand/navigation: jar imagery, calendar, jar, history clock, parent profile.
- Money meaning: shopping bag, shield, helping hand, sprout.
- State/actions: check circle, gift, horizontal move, lock, volume, back arrow.
- No emoji, handcrafted SVG, crypto/market imagery, or stock child photography.

## Active copy contract

- English is the default; Russian and Kazakh are complete alternatives selected in parent Settings.
- Week: `Week complete`, `You made real choices together.`, `Talk about this week`, `Start next week`.
- Jars: `Four jars`, `Every amount has a job.`, `Add parent bonus`, `Move money`, `Parent confirms every change.`
- Focused Save: `Scooter goal`, exact USD amount/target, percentage, drag/keyboard cue.
- History: immutable week close plus separate Grow bonus, parent bonus, and money-move records.
- Money Moment: `Safe local conversation card`; never imply financial advice, investment, interest, or guaranteed return.

## Responsive and accessibility contract

- Stress at 320px with long Russian/Kazakh labels and large amounts; no horizontal scroll or clipped required CTA.
- 44px minimum targets, visible keyboard focus, semantic labels, non-color meaning, 200% text reflow, and safe-area padding.
- Fixed bottom navigation must not cover required actions; content may scroll when the viewport is shorter than the 844px design target.
- Reduced motion removes travel/celebration while preserving the final state instantly.
- Dark mode remains deferred; light mode must stay legible inside Telegram dark chrome.

## Scope boundary

New major card families, dashboards, nested analytics, custom jars, marketplace, child login, or extra root navigation are prohibited. The one Save goal is editable; extra goals and editable allocation percentages remain deferred.
