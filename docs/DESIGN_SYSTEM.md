# Family Table / Four Jars design system

Accepted internal implementation references (generated with the built-in Image Gen path, no API key):

- `docs/design/concept-week.png` — 853×1844 source for the active Week root.
- `docs/design/concept-payday.png` — 853×1844 source for Payday Review and allocation.

These concepts preserve the approved pipeline flow and are an implementation specification, not production UI assets. App text, controls, icons, and jar graphics remain code-native.

## Visual point of view

The screen feels like a clear family worksheet laid on a bright table: true white base, dark navy ink, small areas of useful color, open lists separated by rules, and four recognizable jars. It must feel trustworthy to a parent and inviting to a child without becoming childish, fintech-like, or gamified.

## Locked tokens

| Token        | Value / rule                                                                               |
| ------------ | ------------------------------------------------------------------------------------------ |
| Background   | true white `#ffffff`; never cream/beige                                                    |
| Soft surface | cool blue-white `#f4f6ff`                                                                  |
| Ink          | `#08123f`                                                                                  |
| Muted ink    | `#5b6177`                                                                                  |
| Border       | `#d9dce8`                                                                                  |
| Primary      | deep indigo `#1837b7`; hover `#102a94`; focus `#2f6df6`                                    |
| Spend        | coral `#f25452`                                                                            |
| Save         | blue `#2f61d5`                                                                             |
| Give         | accessible gold `#d28a00`                                                                  |
| Grow         | leaf green `#4d9d48`                                                                       |
| Radius       | 6px controls/rows, 8px major bands; jars may use their native outline shape                |
| Shadow       | none on rows; one subtle `0 8px 24px rgba(8,18,63,.08)` only where elevation is meaningful |
| Motion       | 160–220ms state transitions; instant equivalent under reduced motion                       |

## Typography

- Family: `Aptos`, `Segoe UI`, system sans-serif; warm/humanist and Cyrillic-safe.
- Display: 36–44px desktop/mobile concept equivalent, 750–800 weight, 1.05–1.12 line height.
- Screen heading: 30–36px, 750, compact tracking.
- Section heading: 18–21px, 700.
- Body/task: 16–18px, 450–600, 1.4–1.55.
- UI controls: 15–17px, 650–750; never browser-default styling.
- Amounts: tabular numerals, 700; KZT formatting uses spaces and `₸`.

## Container and component rules

- One centered app shell, max 480px for the shared mobile experience; desktop uses quiet surrounding whitespace, not a dashboard.
- Open lists with dividers are preferred to card stacks. One mission band may use the soft surface.
- Header: compact four-jar brand mark, text brand, locale switch, and parent token/menu.
- Bottom navigation appears only on the three persistent roots. Contextual setup/check/payday/Money Moment flows use a back control and no bottom nav.
- Primary CTA is full-width, >=52px high, deep indigo, 6–8px radius, obvious focus ring, and one per lifecycle screen.
- Task rows communicate type/status through icon, label, and amount/status text; color is supplementary.
- Jar rows use a consistent outline jar, semantic accent rail/icon, label, integer amount, and percentage.

## Icon inventory

Use one consistent rounded outline family at approximately 1.8–2px stroke, `currentColor`, with filled semantic status only when the concept uses it.

- Brand: four compact jar outlines; Grow jar includes a leaf.
- Header/menu: user token and downward chevron.
- Mission: target.
- Unpaid responsibility: house/plate; explicit `Без оплаты`.
- Paid work: briefcase; task examples use plant/books icons.
- Status: square unchecked, checked square, incomplete minus.
- Estimate and buckets: jar.
- Safety boundary: lock/shield.
- Navigation: calendar/week, jar/buckets, clock/history.
- Contextual flow: arrow-left/back and check-circle/confirm.

## Allowed primary-screen copy

No extra above-the-fold hero, eyebrow, badge, metric, or marketing claim may be added.

Week reference: `My First Money`, `RU / KZ`, `Аян`, `Эта неделя`, `Учимся выбирать`, `3 из 5 проверено`, `Семейные обязанности`, `Убрать со стола`, `Без оплаты`, `Оплачиваемая работа`, `Полить растения`, `Разобрать книги`, `Ожидается:`, `Быстрая проверка`, `Не банк. Без переводов. Решения принимает родитель.`, `Неделя`, `Копилки`, `История`.

Payday reference: `Назад`, `My First Money`, `День выплаты`, `Проверьте вместе до подтверждения`, calculation rows and exact integer amounts, `Итого`, `Семейные обязанности: 0 ₸`, four bucket labels/amounts/percentages, Grow explanation, `Подтвердить и закрыть неделю`, `Назад к проверке`, and the educational-record boundary.

## Responsive and accessibility contract

- Stress at 320px with long Russian/Kazakh labels and large amounts; no horizontal scroll or clipped CTA.
- 44px minimum targets, visible keyboard focus, semantic labels, non-color meaning, 200% text reflow, and safe-area padding.
- Fixed actions must remain reachable with a mobile keyboard; bottom nav does not cover content.
- Reduced motion removes travel/celebration while preserving the final four-bucket state instantly.
- Dark mode is deferred from the competition-critical path; light mode must remain legible inside Telegram dark chrome.

## State extension

Unshown setup/agreement/check/history/Money Moment states must extend the same header, open-list, divider, button, typography, icon, and semantic-color families. New major component families, dashboards, nested cards, charts, badges, or additional root navigation are prohibited.
