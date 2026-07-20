# My First Money — managed product redesign system

This file is the Superdesign hard constraint for the competition MVP redesign. The active product source is `docs/DESIGN_SYSTEM.md`; the additions below clarify the approved managed-redesign direction without replacing the product contract.

## Product goal

Help a parent and child practise money habits through one calm weekly ritual. The shared-screen experience should make four ideas immediately legible: money is earned through agreed work, payday is reviewed together, each amount receives a purpose, and the child can see progress toward one goal.

## Approved redesign scope

- Mobile-first shared-screen web app, primary design viewport 390×844 and stress viewport 320px.
- English is the default locale; Russian and Kazakh remain available through parent Settings.
- USD is the sole competition-MVP display currency. There is no conversion or currency selector.
- Keep the persistent root navigation to Week, Jars, and History.
- Put Family Settings and language management behind a visible parent menu; do not create a fourth root tab.
- Distinguish an editable parent bonus from an immutable compensating correction.
- Free MVP: one editable Save goal and fixed 70/10/10/10 payday allocation. Plus editing and upsell UI are deferred from the competition-critical screens.
- Expose append-only History and a safe, parent-triggered Money Moment.
- Keep complete activity in History; Jars uses Add parent bonus and Move money.
- A focused jar supports deliberate drag/keyboard shake and optional short sound.
- Use playful jar filling, progress, and restrained ritual motion; no XP, avatars, collectibles, streak pressure, leaderboard, token economy, or casino-like feedback.

## Visual lock

- True white base, cool blue-white secondary surface, dark navy ink.
- Deep indigo primary action, Spend coral, Save blue, Give accessible gold, Grow leaf green.
- Humanist system typography, strong but compact headings, readable 14–16px product copy, tabular amounts.
- Restrained 6–8px radii, clear dividers, minimal elevation, open layouts instead of card stacks.
- One primary action per lifecycle screen; no decorative gradients, orbs, glassmorphism, stock child photos, crypto/market imagery, or fake financial charts.
- Rounded outline icons with consistent optical weight; reuse Lucide icons where they match.
- Keep at least 44px touch targets, visible keyboard focus, non-color meaning, safe areas, reduced motion, and long RU/KK label reflow.

## Interaction character

The app should feel like a bright family table with four tangible jars: inviting enough for a child, credible enough for a parent, and calm enough for a financial learning ritual. Motion should explain where money went or celebrate a completed week, then settle quickly.
