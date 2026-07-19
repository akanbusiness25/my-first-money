"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coins,
  HandHeart,
  History,
  House,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  PiggyBank,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  WalletCards,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { DemoCommand } from "@/domain/demo-contract";
import type {
  DemoState,
  DemoTask,
  LearningObjective,
  Locale,
  TaskStatus,
} from "@/domain/demo";
import type { BucketKey } from "@/domain/money";
import { PwaRegister } from "./pwa-register";

interface DemoSnapshot {
  state: DemoState;
  csrfToken: string;
  expiresAt: string;
}

type RootTab = "week" | "buckets" | "history";

const copy = {
  ru: {
    tagline: "Тренируем денежные привычки вместе",
    secure: "Семейное демо · без банковских счетов",
    loading: "Готовим семейную неделю…",
    loadError: "Не удалось открыть демо.",
    retry: "Попробовать снова",
    offline:
      "Вы офлайн. Просмотр открыт, но новые действия подождут подключения.",
    childTitle: "Кто начинает первую неделю?",
    childBody:
      "Только имя для показа в этой демо-сессии. Никаких телефонов и счетов.",
    name: "Имя ребёнка",
    nameHint: "Например, Аян",
    age: "Возрастная группа",
    continue: "Продолжить",
    missionTitle: "Выберите цель недели",
    missionBody: "Одна понятная идея, которую семья потренирует вместе.",
    objectives: {
      first_choices: [
        "Первые осознанные выборы",
        "Замечать: потратить сейчас или оставить на цель",
      ],
      saving_patience: [
        "Копить с терпением",
        "Видеть маленький прогресс каждую неделю",
      ],
      balanced_sharing: [
        "Баланс и забота",
        "Оставлять место для себя, цели и помощи другим",
      ],
    },
    buildMission: "Собрать миссию",
    agreementTitle: "Семейное соглашение",
    agreementBody:
      "Проговорите правила вслух. Здесь нет оценок и соревнования.",
    base: "Базовая сумма недели",
    responsibilities: "Семейные обязанности",
    paidTasks: "Дополнительные платные дела",
    responsibilityNote: "Не оплачиваются — это вклад в семью",
    bothMarked: "Родитель и ребёнок согласны",
    startWeek: "Начать неделю",
    weekEyebrow: "ЭТА НЕДЕЛЯ",
    weekTitle: "Первая денежная миссия",
    weekBody:
      "Сначала ответственность, затем выбор. Проверка займёт меньше минуты.",
    progress: "Прогресс недели",
    readyCheck: "Готовы к быстрой проверке?",
    checkNow: "Проверить неделю",
    notChecked: "Не проверено",
    completed: "Готово",
    notCompleted: "Не сделано",
    quickTitle: "Быстрая проверка",
    quickBody: "Отметьте каждое дело. Ответственность не меняет выплату.",
    allRequired: "Нужен выбор для каждого пункта",
    calculate: "Посчитать выплату",
    paydayEyebrow: "ДЕНЬ ВЫПЛАТЫ",
    paydayTitle: "Всё сходится",
    paydayBody: "Проверьте расчёт вместе до того, как закрыть неделю.",
    baseLine: "База недели",
    extraLine: "Выполненные платные дела",
    total: "Итого",
    splitTitle: "Разделение по четырём копилкам",
    closeWeek: "Подтвердить и разделить",
    closedTitle: "Неделя закрыта",
    closedBody: "Первый цикл завершён. Все суммы — учебные и синтетические.",
    weekTab: "Неделя",
    bucketsTab: "Копилки",
    historyTab: "История",
    bucketsTitle: "Четыре копилки",
    bucketsBody: "Каждая сумма получила своё назначение.",
    historyTitle: "История недели",
    calculation: "Проверяемый расчёт",
    correction: "Поправка родителя",
    correctionBody:
      "+100 ₸ в «Копить» — отдельная запись, исходная выплата не переписана.",
    addCorrection: "Показать безопасную поправку",
    corrected: "Поправка уже записана",
    momentTitle: "Money Moment",
    momentBody:
      "Двухминутная беседа по итогам недели — только после подтверждения родителем.",
    createMoment: "Подготовить разговор",
    fallback: "Локальная безопасная карточка",
    live: "Серверная карточка OpenAI",
    familyAction: "Маленькое действие",
    parentReview: "Покажите карточку родителю перед разговором.",
    reset: "Начать демо заново",
    saveGoal: "Цель: Самокат",
    learningBonus: "Учебный бонус",
    resetConfirm: "Текущая синтетическая неделя будет очищена.",
  },
  kk: {
    tagline: "Ақша әдеттерін бірге үйренеміз",
    secure: "Отбасылық демо · банк шоттары жоқ",
    loading: "Отбасылық аптаны дайындап жатырмыз…",
    loadError: "Демоны ашу мүмкін болмады.",
    retry: "Қайта көру",
    offline: "Сіз офлайнсыз. Көруге болады, жаңа әрекеттер интернетті күтеді.",
    childTitle: "Алғашқы аптаны кім бастайды?",
    childBody:
      "Тек осы демо-сессияда көрсетілетін есім. Телефондар мен шоттар жоқ.",
    name: "Баланың есімі",
    nameHint: "Мысалы, Аян",
    age: "Жас тобы",
    continue: "Жалғастыру",
    missionTitle: "Апта мақсатын таңдаңыз",
    missionBody: "Отбасы бірге жаттықтыратын бір түсінікті ой.",
    objectives: {
      first_choices: [
        "Алғашқы саналы таңдау",
        "Қазір жұмсау немесе мақсатқа сақтау",
      ],
      saving_patience: ["Сабырмен жинау", "Әр аптадағы шағын ілгерілеуді көру"],
      balanced_sharing: [
        "Теңгерім және қамқорлық",
        "Өзіңе, мақсатқа және өзгеге орын қалдыру",
      ],
    },
    buildMission: "Миссия құру",
    agreementTitle: "Отбасылық келісім",
    agreementBody: "Ережелерді дауыстап айтыңыз. Мұнда баға мен жарыс жоқ.",
    base: "Аптаның негізгі сомасы",
    responsibilities: "Отбасылық міндеттер",
    paidTasks: "Қосымша ақылы істер",
    responsibilityNote: "Төленбейді — бұл отбасыға қосқан үлес",
    bothMarked: "Ата-ана мен бала келісті",
    startWeek: "Аптаны бастау",
    weekEyebrow: "ОСЫ АПТА",
    weekTitle: "Алғашқы ақша миссиясы",
    weekBody:
      "Алдымен жауапкершілік, содан кейін таңдау. Тексеру бір минуттан аз.",
    progress: "Апта барысы",
    readyCheck: "Жылдам тексеруге дайынсыз ба?",
    checkNow: "Аптаны тексеру",
    notChecked: "Тексерілмеді",
    completed: "Дайын",
    notCompleted: "Орындалмады",
    quickTitle: "Жылдам тексеру",
    quickBody: "Әр істі белгілеңіз. Міндет төлемді өзгертпейді.",
    allRequired: "Әр тармаққа таңдау керек",
    calculate: "Төлемді есептеу",
    paydayEyebrow: "ТӨЛЕМ КҮНІ",
    paydayTitle: "Барлығы сәйкес",
    paydayBody: "Аптаны жаппас бұрын есепті бірге тексеріңіз.",
    baseLine: "Апта негізі",
    extraLine: "Орындалған ақылы істер",
    total: "Барлығы",
    splitTitle: "Төрт құтыға бөлу",
    closeWeek: "Растау және бөлу",
    closedTitle: "Апта жабылды",
    closedBody: "Алғашқы цикл аяқталды. Барлық сома оқу үшін жасалған.",
    weekTab: "Апта",
    bucketsTab: "Құтылар",
    historyTab: "Тарих",
    bucketsTitle: "Төрт құты",
    bucketsBody: "Әр сома өз мақсатына ие болды.",
    historyTitle: "Апта тарихы",
    calculation: "Тексерілетін есеп",
    correction: "Ата-ана түзетуі",
    correctionBody: "+100 ₸ «Жинау» құтысына — бастапқы төлем өзгермеді.",
    addCorrection: "Қауіпсіз түзетуді көрсету",
    corrected: "Түзету жазылды",
    momentTitle: "Money Moment",
    momentBody:
      "Апта қорытындысы бойынша екі минуттық әңгіме — ата-ана растағаннан кейін.",
    createMoment: "Әңгіме дайындау",
    fallback: "Жергілікті қауіпсіз карточка",
    live: "OpenAI серверлік карточкасы",
    familyAction: "Шағын әрекет",
    parentReview: "Әңгіме алдында карточканы ата-анаға көрсетіңіз.",
    reset: "Демоны қайта бастау",
    saveGoal: "Мақсат: Самокат",
    learningBonus: "Оқу бонусы",
    resetConfirm: "Қазіргі синтетикалық апта тазартылады.",
  },
} as const;

const taskCopy = {
  ru: {
    clear_table: ["Убрать со стола", "Семейная обязанность"],
    water_plants: ["Полить растения", "+500 ₸"],
    sort_books: ["Разложить книги", "+300 ₸"],
  },
  kk: {
    clear_table: ["Үстелді жинау", "Отбасылық міндет"],
    water_plants: ["Өсімдіктерді суару", "+500 ₸"],
    sort_books: ["Кітаптарды реттеу", "+300 ₸"],
  },
} as const;

const bucketCopy = {
  ru: {
    spend: ["Тратить", "На выбор сейчас"],
    save: ["Копить", "На ближайшую цель"],
    give: ["Делиться", "На заботу о других"],
    grow: ["Расти", "На обучение и любопытство"],
  },
  kk: {
    spend: ["Жұмсау", "Қазіргі таңдау үшін"],
    save: ["Жинау", "Жақын мақсат үшін"],
    give: ["Бөлісу", "Басқаларға қамқорлық"],
    grow: ["Өсу", "Оқу мен қызығушылыққа"],
  },
} as const;

const bucketMeta: Record<
  BucketKey,
  { Icon: typeof WalletCards; percent: number }
> = {
  spend: { Icon: WalletCards, percent: 70 },
  save: { Icon: PiggyBank, percent: 10 },
  give: { Icon: HandHeart, percent: 10 },
  grow: { Icon: Sprout, percent: 10 },
};

function money(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "kk" ? "kk-KZ" : "ru-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(value);
}

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
  bucket,
  amount,
  locale,
  detail,
}: {
  bucket: BucketKey;
  amount: number;
  locale: Locale;
  detail?: string;
}) {
  const { Icon, percent } = bucketMeta[bucket];
  const labels = bucketCopy[locale][bucket];
  return (
    <article className={`bucket-row bucket-${bucket}`}>
      <span className="bucket-icon">
        <Icon size={21} />
      </span>
      <div>
        <strong>{labels[0]}</strong>
        <small>{detail ?? labels[1]}</small>
      </div>
      <div className="bucket-amount">
        <strong>{money(amount, locale)}</strong>
        <small>{percent}%</small>
      </div>
    </article>
  );
}

function TaskRow({
  task,
  locale,
  controls,
  onStatus,
  busy,
}: {
  task: DemoTask;
  locale: Locale;
  controls?: boolean;
  onStatus?: (status: TaskStatus) => void;
  busy?: boolean;
}) {
  const labels = taskCopy[locale][task.id];
  return (
    <article className={`task-row ${task.kind}`}>
      <span className="task-icon">
        {task.kind === "responsibility" ? (
          <House size={19} />
        ) : (
          <Sparkles size={19} />
        )}
      </span>
      <div className="task-copy">
        <strong>{labels[0]}</strong>
        <small>{labels[1]}</small>
      </div>
      {controls ? (
        <div className="task-actions" aria-label={`${labels[0]} status`}>
          <button
            type="button"
            className={task.status === "completed" ? "yes selected" : "yes"}
            onClick={() => onStatus?.("completed")}
            disabled={busy}
            aria-label={`${copy[locale].completed}: ${labels[0]}`}
          >
            <Check size={18} />
          </button>
          <button
            type="button"
            className={task.status === "not_completed" ? "no selected" : "no"}
            onClick={() => onStatus?.("not_completed")}
            disabled={busy}
            aria-label={`${copy[locale].notCompleted}: ${labels[0]}`}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <span className={`task-status ${task.status}`}>
          {task.status === "completed" ? (
            <Check size={15} />
          ) : (
            <Clock3 size={15} />
          )}
          {
            copy[locale][
              task.status === "completed" ? "completed" : "notChecked"
            ]
          }
        </span>
      )}
    </article>
  );
}

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

export function DemoApp() {
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [tab, setTab] = useState<RootTab>("week");

  async function bootstrap() {
    setError(null);
    try {
      const response = await fetch("/api/v1/demo", { cache: "no-store" });
      if (!response.ok) throw new Error("BOOTSTRAP_FAILED");
      setSnapshot((await response.json()) as DemoSnapshot);
    } catch {
      setError("BOOTSTRAP_FAILED");
    }
  }

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    queueMicrotask(() => void bootstrap());
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  async function send(command: DemoCommand) {
    if (!snapshot || busy || !online) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": snapshot.csrfToken,
        },
        body: JSON.stringify(command),
      });
      if (!response.ok) {
        const payload = (await response.json()) as {
          error?: { code?: string };
        };
        throw new Error(payload.error?.code ?? "REQUEST_REJECTED");
      }
      setSnapshot((await response.json()) as DemoSnapshot);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "REQUEST_REJECTED");
    } finally {
      setBusy(false);
    }
  }

  if (!snapshot) {
    const locale: Locale = "ru";
    return (
      <div className="app-frame loading-frame">
        <Brand locale={locale} />
        {error ? (
          <div className="empty-state">
            <CircleDollarSign size={36} />
            <h1>{copy[locale].loadError}</h1>
            <PrimaryButton onClick={() => void bootstrap()}>
              {copy[locale].retry}
            </PrimaryButton>
          </div>
        ) : (
          <div className="loading-state">
            <LoaderCircle className="spin" size={32} />
            <p>{copy[locale].loading}</p>
          </div>
        )}
      </div>
    );
  }

  const { state } = snapshot;
  const locale = state.locale;
  const t = copy[locale];
  const onLocale = (next: Locale) =>
    void send({ action: "set_locale", locale: next });
  let content: ReactNode;

  if (state.stage === "child_setup")
    content = (
      <ChildSetup
        locale={locale}
        busy={busy}
        onSubmit={(displayName, ageBand) =>
          void send({ action: "create_child", displayName, ageBand })
        }
      />
    );
  else if (state.stage === "mission_builder")
    content = (
      <MissionBuilder
        locale={locale}
        busy={busy}
        onSubmit={(objective) =>
          void send({
            action: "create_mission",
            objective,
            baseAmountMinor: 1_000,
          })
        }
      />
    );
  else if (state.stage === "agreement" && state.mission)
    content = (
      <Agreement
        state={state}
        locale={locale}
        busy={busy}
        onStart={() => void send({ action: "confirm_agreement" })}
      />
    );
  else if (state.stage === "week" && state.mission)
    content = (
      <Week
        state={state}
        locale={locale}
        busy={busy}
        onCheck={() => void send({ action: "open_quick_check" })}
      />
    );
  else if (state.stage === "quick_check" && state.mission)
    content = (
      <QuickCheck
        state={state}
        locale={locale}
        busy={busy}
        onBack={() => void send({ action: "back_to_week" })}
        onStatus={(taskId, status) =>
          void send({ action: "set_task_status", taskId, status })
        }
        onFinish={() => void send({ action: "finish_check" })}
      />
    );
  else if (state.stage === "payday" && state.mission)
    content = (
      <Payday
        state={state}
        locale={locale}
        busy={busy}
        onClose={() =>
          void send({
            action: "confirm_payday",
            idempotencyKey: crypto.randomUUID(),
          })
        }
      />
    );
  else
    content = (
      <ClosedRoot
        state={state}
        locale={locale}
        tab={tab}
        setTab={setTab}
        busy={busy}
        onMoment={() => void send({ action: "request_money_moment" })}
        onCorrection={() => void send({ action: "apply_demo_correction" })}
        onReset={() => {
          if (window.confirm(t.resetConfirm)) {
            setTab("week");
            void send({ action: "reset" });
          }
        }}
      />
    );

  return (
    <>
      <PwaRegister />
      {!online ? (
        <div className="offline-banner" role="status">
          {t.offline}
        </div>
      ) : null}
      {error ? (
        <div className="error-banner" role="alert">
          {error}
        </div>
      ) : null}
      <StageShell state={state} locale={locale} onLocale={onLocale} busy={busy}>
        {content}
      </StageShell>
    </>
  );
}

function ChildSetup({
  locale,
  busy,
  onSubmit,
}: {
  locale: Locale;
  busy: boolean;
  onSubmit: (name: string, age: "4-7" | "8-12" | "13+") => void;
}) {
  const t = copy[locale];
  const [name, setName] = useState("Аян");
  const [age, setAge] = useState<"4-7" | "8-12" | "13+">("8-12");
  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(name.trim(), age);
  }
  return (
    <section className="narrow-screen setup-screen">
      <div className="hero-symbol coral">
        <Leaf size={28} />
      </div>
      <p className="eyebrow">01 · FAMILY SETUP</p>
      <h1>{t.childTitle}</h1>
      <p className="lead">{t.childBody}</p>
      <form className="stack-form" onSubmit={submit}>
        <label>
          {t.name}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.nameHint}
            maxLength={24}
            autoComplete="off"
            required
          />
        </label>
        <fieldset>
          <legend>{t.age}</legend>
          <div className="segmented">
            {(["4-7", "8-12", "13+"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setAge(item)}
                className={age === item ? "selected" : ""}
                aria-pressed={age === item}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <PrimaryButton type="submit" disabled={busy || !name.trim()}>
          {busy ? <LoaderCircle className="spin" size={18} /> : t.continue}
        </PrimaryButton>
      </form>
    </section>
  );
}

function MissionBuilder({
  locale,
  busy,
  onSubmit,
}: {
  locale: Locale;
  busy: boolean;
  onSubmit: (objective: LearningObjective) => void;
}) {
  const t = copy[locale];
  const [objective, setObjective] =
    useState<LearningObjective>("first_choices");
  const icons = {
    first_choices: WalletCards,
    saving_patience: Target,
    balanced_sharing: HandHeart,
  };
  return (
    <section className="narrow-screen">
      <p className="eyebrow">02 · WEEK MISSION</p>
      <h1>{t.missionTitle}</h1>
      <p className="lead">{t.missionBody}</p>
      <div className="choice-list">
        {(Object.keys(t.objectives) as LearningObjective[]).map((item) => {
          const Icon = icons[item];
          const labels = t.objectives[item];
          return (
            <button
              type="button"
              className={
                objective === item ? "choice-card selected" : "choice-card"
              }
              onClick={() => setObjective(item)}
              key={item}
            >
              <span>
                <Icon size={21} />
              </span>
              <div>
                <strong>{labels[0]}</strong>
                <small>{labels[1]}</small>
              </div>
              <span className="radio-dot" />
            </button>
          );
        })}
      </div>
      <div className="amount-card">
        <span>
          <Coins size={20} />
          {t.base}
        </span>
        <strong>{money(1_000, locale)}</strong>
      </div>
      <PrimaryButton onClick={() => onSubmit(objective)} disabled={busy}>
        {t.buildMission}
      </PrimaryButton>
    </section>
  );
}

function Agreement({
  state,
  locale,
  busy,
  onStart,
}: {
  state: DemoState;
  locale: Locale;
  busy: boolean;
  onStart: () => void;
}) {
  const t = copy[locale];
  const mission = state.mission!;
  return (
    <section className="narrow-screen">
      <p className="eyebrow">03 · AGREEMENT</p>
      <h1>{t.agreementTitle}</h1>
      <p className="lead">{t.agreementBody}</p>
      <div className="paper-card">
        <div className="agreement-person">
          <span className="avatar">
            {state.child?.displayName.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{state.child?.displayName}</strong>
            <small>{t.objectives[mission.objective][0]}</small>
          </div>
        </div>
        <div className="summary-row">
          <span>{t.base}</span>
          <strong>{money(mission.baseAmountMinor, locale)}</strong>
        </div>
        <div className="summary-row">
          <span>{t.responsibilities}</span>
          <strong>1</strong>
        </div>
        <div className="summary-row">
          <span>{t.paidTasks}</span>
          <strong>2</strong>
        </div>
        <p className="responsibility-note">
          <House size={17} />
          {t.responsibilityNote}
        </p>
      </div>
      <div className="agreement-check">
        <span>
          <Check size={19} />
        </span>
        <strong>{t.bothMarked}</strong>
      </div>
      <PrimaryButton onClick={onStart} disabled={busy}>
        {t.startWeek}
      </PrimaryButton>
    </section>
  );
}

function Week({
  state,
  locale,
  busy,
  onCheck,
}: {
  state: DemoState;
  locale: Locale;
  busy: boolean;
  onCheck: () => void;
}) {
  const t = copy[locale];
  const mission = state.mission!;
  const completed = mission.tasks.filter(
    (task) => task.status === "completed",
  ).length;
  return (
    <section className="root-screen">
      <div className="week-hero">
        <div>
          <p className="eyebrow">{t.weekEyebrow}</p>
          <h1>{t.weekTitle}</h1>
          <p>{t.weekBody}</p>
        </div>
        <span className="avatar large">
          {state.child?.displayName.slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="mission-band">
        <div>
          <small>{state.child?.displayName}</small>
          <strong>{t.objectives[mission.objective][0]}</strong>
        </div>
        <div>
          <small>{t.base}</small>
          <strong>{money(mission.baseAmountMinor, locale)}</strong>
        </div>
      </div>
      <section className="section-block">
        <div className="section-heading">
          <h2>{t.progress}</h2>
          <span>{completed}/3</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${Math.max(8, (completed / 3) * 100)}%` }} />
        </div>
        {mission.tasks.map((task) => (
          <TaskRow key={task.id} task={task} locale={locale} />
        ))}
      </section>
      <div className="callout-card">
        <span>
          <Clock3 size={24} />
        </span>
        <div>
          <strong>{t.readyCheck}</strong>
          <small>{t.quickBody}</small>
        </div>
      </div>
      <PrimaryButton
        onClick={onCheck}
        disabled={busy}
        testId="open-quick-check"
      >
        {t.checkNow}
      </PrimaryButton>
    </section>
  );
}

function QuickCheck({
  state,
  locale,
  busy,
  onBack,
  onStatus,
  onFinish,
}: {
  state: DemoState;
  locale: Locale;
  busy: boolean;
  onBack: () => void;
  onStatus: (id: DemoTask["id"], status: TaskStatus) => void;
  onFinish: () => void;
}) {
  const t = copy[locale];
  const tasks = state.mission!.tasks;
  const complete = tasks.every((task) => task.status !== "not_checked");
  return (
    <section className="narrow-screen">
      <BackButton onClick={onBack} label={t.weekTab} />
      <p className="eyebrow">04 · QUICK CHECK</p>
      <h1>{t.quickTitle}</h1>
      <p className="lead">{t.quickBody}</p>
      <div className="legend-row">
        <span>
          <Check size={15} />
          {t.completed}
        </span>
        <span>
          <X size={15} />
          {t.notCompleted}
        </span>
      </div>
      <div className="task-check-list">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            locale={locale}
            controls
            busy={busy}
            onStatus={(status) => onStatus(task.id, status)}
          />
        ))}
      </div>
      {!complete ? (
        <p className="validation-hint">
          <Clock3 size={16} />
          {t.allRequired}
        </p>
      ) : null}
      <PrimaryButton
        onClick={onFinish}
        disabled={busy || !complete}
        testId="finish-check"
      >
        {t.calculate}
      </PrimaryButton>
    </section>
  );
}

function Payday({
  state,
  locale,
  busy,
  onClose,
}: {
  state: DemoState;
  locale: Locale;
  busy: boolean;
  onClose: () => void;
}) {
  const t = copy[locale];
  const mission = state.mission!;
  const paid = mission.tasks
    .filter((task) => task.kind === "paid" && task.status === "completed")
    .reduce((sum, task) => sum + task.amountMinor, 0);
  const total = mission.baseAmountMinor + paid;
  const allocation = useMemo(
    () => ({
      spend: Math.floor(total * 0.7),
      save: Math.floor(total * 0.1),
      give: Math.floor(total * 0.1),
      grow: total - Math.floor(total * 0.7) - Math.floor(total * 0.1) * 2,
    }),
    [total],
  );
  return (
    <section className="narrow-screen payday-screen">
      <div className="celebration-mark">
        <Sparkles size={26} />
      </div>
      <p className="eyebrow">{t.paydayEyebrow}</p>
      <h1>{t.paydayTitle}</h1>
      <p className="lead">{t.paydayBody}</p>
      <div className="calculation-card">
        <div>
          <span>{t.baseLine}</span>
          <strong>{money(mission.baseAmountMinor, locale)}</strong>
        </div>
        <div>
          <span>{t.extraLine}</span>
          <strong>+ {money(paid, locale)}</strong>
        </div>
        <div className="calculation-total">
          <span>{t.total}</span>
          <strong>{money(total, locale)}</strong>
        </div>
      </div>
      <h2 className="subhead">{t.splitTitle}</h2>
      <div className="bucket-list">
        {(["spend", "save", "give", "grow"] as const).map((bucket) => (
          <BucketRow
            key={bucket}
            bucket={bucket}
            amount={allocation[bucket]}
            locale={locale}
          />
        ))}
      </div>
      <PrimaryButton onClick={onClose} disabled={busy} testId="confirm-payday">
        {t.closeWeek}
      </PrimaryButton>
    </section>
  );
}

function ClosedRoot({
  state,
  locale,
  tab,
  setTab,
  busy,
  onMoment,
  onCorrection,
  onReset,
}: {
  state: DemoState;
  locale: Locale;
  tab: RootTab;
  setTab: (tab: RootTab) => void;
  busy: boolean;
  onMoment: () => void;
  onCorrection: () => void;
  onReset: () => void;
}) {
  const t = copy[locale];
  const payday = state.payday!;
  const balances = {
    ...payday.allocation,
    grow: payday.allocation.grow + payday.growBonusMinor,
    save:
      payday.allocation.save +
      state.corrections.reduce((sum, item) => sum + item.amountMinor, 0),
  };
  return (
    <section className="root-screen closed-root">
      {tab === "week" ? (
        <div className="closed-week">
          <div className="success-seal">
            <Check size={28} />
          </div>
          <p className="eyebrow">{t.weekEyebrow}</p>
          <h1>{t.closedTitle}</h1>
          <p className="lead">{t.closedBody}</p>
          <div className="closed-total">
            <span>{t.total}</span>
            <strong>{money(payday.totalMinor, locale)}</strong>
            <small>
              {new Intl.DateTimeFormat(locale === "kk" ? "kk-KZ" : "ru-KZ", {
                dateStyle: "long",
              }).format(new Date(payday.closedAt))}
            </small>
          </div>
          <div className="bucket-mini-grid">
            {(["spend", "save", "give", "grow"] as const).map((bucket) => {
              const Icon = bucketMeta[bucket].Icon;
              return (
                <button
                  key={bucket}
                  type="button"
                  className={`bucket-mini bucket-${bucket}`}
                  onClick={() => setTab("buckets")}
                >
                  <Icon size={20} />
                  <span>{bucketCopy[locale][bucket][0]}</span>
                  <strong>{money(balances[bucket], locale)}</strong>
                </button>
              );
            })}
          </div>
          <MoneyMoment
            state={state}
            locale={locale}
            busy={busy}
            onMoment={onMoment}
          />
          <PrimaryButton variant="quiet" onClick={onReset} disabled={busy}>
            <RotateCcw size={17} />
            {t.reset}
          </PrimaryButton>
        </div>
      ) : null}
      {tab === "buckets" ? (
        <div>
          <p className="eyebrow">FOUR JARS</p>
          <h1>{t.bucketsTitle}</h1>
          <p className="lead">{t.bucketsBody}</p>
          <div className="bucket-list expanded">
            {(["spend", "save", "give", "grow"] as const).map((bucket) => (
              <BucketRow
                key={bucket}
                bucket={bucket}
                amount={balances[bucket]}
                locale={locale}
                detail={
                  bucket === "grow"
                    ? `${bucketCopy[locale][bucket][1]} · +${money(payday.growBonusMinor, locale)} ${t.learningBonus.toLowerCase()}`
                    : undefined
                }
              />
            ))}
          </div>
          <div className="goal-card">
            <div>
              <span>
                <Target size={18} />
                {t.saveGoal}
              </span>
              <strong>
                {money(balances.save, locale)} /{" "}
                {money(state.saveGoal.targetMinor, locale)}
              </strong>
            </div>
            <progress value={balances.save} max={state.saveGoal.targetMinor} />
          </div>
          <MoneyMoment
            state={state}
            locale={locale}
            busy={busy}
            onMoment={onMoment}
          />
        </div>
      ) : null}
      {tab === "history" ? (
        <div>
          <p className="eyebrow">AUDITABLE HISTORY</p>
          <h1>{t.historyTitle}</h1>
          <div className="timeline">
            <article>
              <span className="timeline-dot">
                <Check size={16} />
              </span>
              <div>
                <small>{t.calculation}</small>
                <h2>{t.closedTitle}</h2>
                <div className="history-math">
                  <span>{money(payday.baseAmountMinor, locale)}</span>
                  <span>+ {money(payday.paidTaskMinor, locale)}</span>
                  <strong>= {money(payday.totalMinor, locale)}</strong>
                </div>
                <p>
                  {new Date(payday.closedAt).toLocaleString(
                    locale === "kk" ? "kk-KZ" : "ru-KZ",
                  )}
                </p>
              </div>
            </article>
            {state.corrections.map((correction) => (
              <article key={correction.id}>
                <span className="timeline-dot correction">
                  <BookOpen size={15} />
                </span>
                <div>
                  <small>{t.correction}</small>
                  <h2>
                    + {money(correction.amountMinor, locale)} ·{" "}
                    {bucketCopy[locale].save[0]}
                  </h2>
                  <p>{t.correctionBody}</p>
                </div>
              </article>
            ))}
          </div>
          <PrimaryButton
            variant="quiet"
            onClick={onCorrection}
            disabled={busy || state.corrections.length > 0}
          >
            {state.corrections.length ? t.corrected : t.addCorrection}
          </PrimaryButton>
          <PrimaryButton variant="quiet" onClick={onReset} disabled={busy}>
            <RotateCcw size={17} />
            {t.reset}
          </PrimaryButton>
        </div>
      ) : null}
      <nav className="bottom-nav" aria-label="Primary">
        <button
          type="button"
          className={tab === "week" ? "active" : ""}
          onClick={() => setTab("week")}
        >
          <House size={20} />
          <span>{t.weekTab}</span>
        </button>
        <button
          type="button"
          className={tab === "buckets" ? "active" : ""}
          onClick={() => setTab("buckets")}
        >
          <WalletCards size={20} />
          <span>{t.bucketsTab}</span>
        </button>
        <button
          type="button"
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          <History size={20} />
          <span>{t.historyTab}</span>
        </button>
      </nav>
    </section>
  );
}

function MoneyMoment({
  state,
  locale,
  busy,
  onMoment,
}: {
  state: DemoState;
  locale: Locale;
  busy: boolean;
  onMoment: () => void;
}) {
  const t = copy[locale];
  const moment = state.moneyMoment;
  if (!moment)
    return (
      <section className="moment-card pending">
        <span className="moment-icon">
          <Sparkles size={22} />
        </span>
        <div>
          <h2>{t.momentTitle}</h2>
          <p>{t.momentBody}</p>
          <PrimaryButton onClick={onMoment} disabled={busy}>
            {busy ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              t.createMoment
            )}
          </PrimaryButton>
        </div>
      </section>
    );
  return (
    <section className="moment-card ready">
      <div className="moment-heading">
        <span className="moment-icon">
          <Sparkles size={21} />
        </span>
        <div>
          <small>{moment.source === "openai" ? t.live : t.fallback}</small>
          <h2>{moment.card.title}</h2>
        </div>
      </div>
      <p>{moment.card.explanation}</p>
      <ol>
        {moment.card.questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
      {moment.card.familyAction ? (
        <div className="family-action">
          <strong>{t.familyAction}</strong>
          <span>{moment.card.familyAction}</span>
        </div>
      ) : null}
      <p className="parent-review">
        <LockKeyhole size={15} />
        {t.parentReview}
      </p>
    </section>
  );
}
