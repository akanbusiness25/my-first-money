# Shared layouts

## RootLayout

Source: `apps/web/src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "My First Money",
  description: "Семейный тренажёр первых денежных привычек.",
  applicationName: "My First Money",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
```

## StageShell

Source: `apps/web/src/components/demo-app.tsx:484:506`

This is the common mobile app frame: product header, stage-keyed main content, and the educational safety footer.

```tsx
function StageShell({
  children,
  state,
  locale,
  onLocale,
  busy,
}: {
  children: ReactNode;
  state: DemoState;
  locale: Locale;
  onLocale: (locale: Locale) => void;
  busy: boolean;
}) {
  return (
    <div className="app-frame">
      <AppHeader locale={locale} onLocale={onLocale} busy={busy} />
      <main key={state.stage} className="screen-enter">
        {children}
      </main>
      <StatusLine locale={locale} />
    </div>
  );
}
```

The three persistent post-payday roots render their bottom navigation inside `ClosedWeek` in `apps/web/src/components/demo-app.tsx:1083:1280`.
