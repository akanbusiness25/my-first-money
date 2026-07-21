# Managed redesign visual QA

Date: 2026-07-20

Result: passed for the competition MVP

## Sources and method

- Approved concepts: `redesign-week-approved.png`, `redesign-jars-approved.png`, and `redesign-jar-detail-approved.png`.
- Final implementation captures: `implementation-week.png`, `implementation-jars.png`, and `implementation-jar-detail.png`.
- Same-input comparisons: `comparison-week.png`, `comparison-jars.png`, and `comparison-jar-detail.png`.
- Primary inspection: Codex in-app browser at `http://127.0.0.1:3000/`, 390 x 844 viewport, complete synthetic judge flow, and fresh DOM checks after every interaction.
- Reflow inspection: 320 x 844 for Russian and Kazakh long labels; measured document width stayed exactly 320px with no horizontal overflow.
- Reproducible evidence: production build served locally and captured by `apps/web/scripts/capture-evidence.mjs` at 390 x 844 with reduced motion.

## Five-point comparison

1. Composition: Week retains the centered completion ritual; Jars keeps the four-jar hero; the focused Save view keeps the jar, goal, gesture cue, and parent actions in one viewport.
2. Hierarchy: the dark-ink display heading, restrained blue primary action, compact parent profile control, and fixed three-item navigation match the approved hierarchy.
3. Jar system: all four ImageGen-derived transparent jar assets use the approved coral, blue, gold, and leaf-green semantics; their live fill and percentages come from projected ledger balances.
4. Product actions: Add parent bonus is primary, Move money is secondary, every change requires review/confirm, and History owns the resulting append-only activity.
5. Responsive and accessible behavior: 44px controls, visible focus, semantic tabs/progress bars/dialogs, keyboard jar activation, reduced-motion support, safe-area navigation, and 320px text reflow are preserved.

## Copy and intentional differences

- Concept amounts in KZT were replaced with USD because the approved MVP decision is USD-only. Money remains integer cents; no conversion or exchange-rate behavior was added.
- English is the default. Russian and Kazakh moved from the header into parent Settings, alongside fixed USD, sound/motion preferences, and the one editable Save goal.
- `View activity` became `Move money`; activity remains available through History.
- Week keeps the immutable 70/10/10/10 allocation, while Jars shows current ledger shares after bonuses and moves.
- Decorative desk props and broad confetti were reduced so the real controls, goal, and four jars stay readable on 320–390px screens.
- The focused goal path is expressed by the exact percentage and live jar fill instead of an ornamental dotted curve, keeping both parent actions visible at 390 x 844.

## Functional verification

- Full lifecycle: setup -> mission -> agreement -> active week -> completion review -> $18.00 payday -> immutable close.
- Parent bonus: default $1.00 to Save changed its balance from $1.80 to $2.80 and added a separate History event.
- Bucket move: $0.50 from Spend to Save changed Save to $3.30 and added a separate History event without rewriting payday.
- Money Moment: parent-triggered English deterministic local card opened without an API key and produced no console error.
- Language: EN/RU/KK saved through the server session; English was restored as the final active preference.
- Browser console: no errors or warnings during the completed judge flow and focused-jar keyboard interaction.

No unresolved P0, P1, or P2 visual-fidelity issue remains for the approved competition-MVP scope.

## 2026-07-21 judge-flow clarity refinement

- Compared `redesign-jars-approved.png` with `implementation-jars-refined-390.png` at the same 390px product width after completing a fresh synthetic week.
- Preserved the approved Four Jars composition, color semantics, goal card, primary parent bonus, secondary move action, and fixed bottom navigation.
- Added only product-clarifying surfaces: a compact synthetic-demo notice, explicit objective effects, interactive agreement marks, grouped unpaid/paid choices, and parent-confirmed jar use.
- Replaced ambiguous sparkle/fork decoration with a semantic completion check, restrained CSS confetti, and a conversation icon; no new decorative visual language was introduced.
- Fixed inherited scroll position when changing root tabs, verified `scrollY === 0`, and captured the final Jars screen with the complete header visible.
- The refined Playwright flow verifies the jar's computed transform changes during pointer drag on mobile and desktop; Enter/Space remain the accessible alternative.

## 2026-07-21 product-demo launch refinement

- The top internal demo notice was removed; the first screen now presents only two product-facing choices: a prefilled test run or a blank start.
- The 390 x 844 Chrome capture preserves the approved Four Jars composition, image assets, goal card, primary/secondary action hierarchy, and fixed navigation.
- Jar use now explains that money leaves the selected jar and limits reasons by context: Spend purchases, Save goal/planned purchase, Give help/gift, and Grow learning/book.
- Bucket-filtered History includes the immutable allocation from every closed week, so Give and other untouched jars no longer appear empty after payday.
- Automated axe verification identified and corrected the only new contrast regression on the highlighted test-run card before the 12/12 E2E pass.
