# Shared UI components

The current competition demo keeps its small reusable primitives inside `apps/web/src/components/demo-app.tsx`; there is no separate UI-library directory yet. The following source is the complete implementation of the primitives used across lifecycle screens.

Source: `apps/web/src/components/demo-app.tsx:275:388`

```tsx
function Brand({ locale }: { locale: Locale }) {
  return (
    <div className="brand-lockup" aria-label="My First Money">
      <span className="brand-mark" aria-hidden="true">
        <Coins size={21} strokeWidth={2.4} />
        <Leaf size={12} strokeWidth={2.6} />
      </span>
      <span>
        <strong>My First Money</strong>
        <small>{copy[locale].tagline}</small>
      </span>
    </div>
  );
}

function LanguageSwitch({
  locale,
  onChange,
  disabled,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  disabled: boolean;
}) {
  return (
    <div className="language-switch" aria-label="Language">
      {(["ru", "kk"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={locale === item ? "active" : ""}
          onClick={() => onChange(item)}
          disabled={disabled}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function AppHeader({
  locale,
  onLocale,
  busy,
}: {
  locale: Locale;
  onLocale: (locale: Locale) => void;
  busy: boolean;
}) {
  return (
    <header className="app-header">
      <Brand locale={locale} />
      <LanguageSwitch locale={locale} onChange={onLocale} disabled={busy} />
    </header>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
  variant = "primary",
  testId,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "quiet";
  testId?: string;
}) {
  return (
    <button
      className={`primary-button ${variant}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
    >
      <span>{children}</span>
      {variant === "primary" ? (
        <ChevronRight size={18} aria-hidden="true" />
      ) : null}
    </button>
  );
}

function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button className="back-button" type="button" onClick={onClick}>
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}

function StatusLine({ locale }: { locale: Locale }) {
  return (
    <footer className="security-note">
      <ShieldCheck size={16} />
      {copy[locale].secure}
    </footer>
  );
}

function BucketRow({
```
