# Extractable components

## AppHeader

- Source: `apps/web/src/components/demo-app.tsx:275:336`
- Category: layout
- Description: Compact product mark, product name/tagline, and locale control.
- Extractable props: active locale, locale control disabled state.
- Hardcoded: product mark/icon treatment, product name, layout classes.

## StageShell

- Source: `apps/web/src/components/demo-app.tsx:484:506`
- Category: layout
- Description: Shared white mobile app frame with header, changing lifecycle content, and safety footer.
- Extractable props: active stage key.
- Hardcoded: shell hierarchy and CSS classes.

## BottomNav

- Source: `apps/web/src/components/demo-app.tsx:1250:1279`
- Category: layout
- Description: Three-root navigation for Week, Buckets, and History.
- Extractable props: active tab.
- Hardcoded: route labels and Lucide icon metaphors.

## PrimaryButton

- Source: `apps/web/src/components/demo-app.tsx:338:373`
- Category: basic
- Description: Full-width primary or quiet action with consistent touch target and focus behavior.
- Extractable props: variant and disabled state.
- Hardcoded: chevron icon and CSS classes.

## BucketRow

- Source: `apps/web/src/components/demo-app.tsx:389:417`
- Category: basic
- Description: Semantic Four Jars row with icon, label, purpose, amount, and percentage.
- Extractable props: bucket identity.
- Hardcoded: bucket icon family and semantic color mapping.
