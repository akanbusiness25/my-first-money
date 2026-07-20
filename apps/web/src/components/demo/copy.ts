import type { Locale } from "@/domain/demo";
import type { BucketKey } from "@/domain/money";

export interface CopyContract {
  brandTagline: string;
  syntheticDemo: string;
  loading: string;
  loadError: string;
  retry: string;
  navWeek: string;
  navJars: string;
  navHistory: string;
  parentMenu: string;
  settingsTitle: string;
  close: string;
  language: string;
  english: string;
  russian: string;
  kazakh: string;
  currency: string;
  usdOnly: string;
  sound: string;
  soundHelp: string;
  motion: string;
  motionHelp: string;
  saveGoal: string;
  goalName: string;
  targetAmount: string;
  saveChanges: string;
  resetDemo: string;
  resetHelp: string;
  startTitle: string;
  startBody: string;
  childNickname: string;
  nicknamePlaceholder: string;
  ageBand: string;
  continue: string;
  missionTitle: string;
  missionBody: string;
  objectiveFirstChoices: string;
  objectiveSavingPatience: string;
  objectiveBalancedSharing: string;
  weeklyBase: string;
  buildMission: string;
  agreementTitle: string;
  agreementBody: string;
  parentMarked: string;
  childMarked: string;
  startWeek: string;
  thisWeek: string;
  weekReady: string;
  quickCheck: string;
  quickCheckTitle: string;
  completed: string;
  notCompleted: string;
  finishCheck: string;
  back: string;
  paydayTitle: string;
  paydayBody: string;
  baseAmount: string;
  paidExtras: string;
  confirmPayday: string;
  weekComplete: string;
  weekCompleteBody: string;
  familyReviewed: string;
  talkAboutWeek: string;
  startNextWeek: string;
  fourJars: string;
  fourJarsBody: string;
  addParentBonus: string;
  moveMoney: string;
  parentConfirms: string;
  scooterGoal: string;
  goalProgress: string;
  goalComplete: string;
  jarDetail: string;
  backToJars: string;
  currentBalance: string;
  currentShare: string;
  dragToShake: string;
  keyboardShake: string;
  chooseJar: string;
  bonusAmount: string;
  fromJar: string;
  toJar: string;
  moveAmount: string;
  confirmBonus: string;
  confirmMove: string;
  cancel: string;
  bonusRecorded: string;
  moveRecorded: string;
  invalidAmount: string;
  invalidGoal: string;
  insufficientBalance: string;
  sameJarError: string;
  historyTitle: string;
  historyBody: string;
  weekClosed: string;
  parentBonus: string;
  bucketMove: string;
  growBonus: string;
  noActivity: string;
  moneyMomentTitle: string;
  questions: string;
  familyAction: string;
  localCard: string;
  goalSaved: string;
  settingsSaved: string;
  requestFailed: string;
}

export const copy = {
  en: {
    brandTagline: "Money habits kids can practice.",
    syntheticDemo: "Family demo · no bank account",
    loading: "Setting the family table…",
    loadError: "The demo could not be opened.",
    retry: "Try again",
    navWeek: "Week",
    navJars: "Jars",
    navHistory: "History",
    parentMenu: "Open parent settings",
    settingsTitle: "Parent settings",
    close: "Close",
    language: "Language",
    english: "English",
    russian: "Russian",
    kazakh: "Kazakh",
    currency: "Display currency",
    usdOnly: "US dollar (USD) · fixed for this MVP",
    sound: "Jar sounds",
    soundHelp: "Play a short sound after a deliberate jar gesture.",
    motion: "Celebration motion",
    motionHelp: "Use restrained motion for success and jar feedback.",
    saveGoal: "Save goal",
    goalName: "Goal name",
    targetAmount: "Target in US dollars",
    saveChanges: "Save changes",
    resetDemo: "Reset demo",
    resetHelp: "Clears this synthetic family week and starts again.",
    startTitle: "Start a money week",
    startBody:
      "A short family ritual for earning, choosing, and reflecting together.",
    childNickname: "Child nickname",
    nicknamePlaceholder: "Alex",
    ageBand: "Age band",
    continue: "Continue",
    missionTitle: "Choose this week’s focus",
    missionBody: "Keep it small: one habit, one week, four clear choices.",
    objectiveFirstChoices: "Make first money choices",
    objectiveSavingPatience: "Practice saving patiently",
    objectiveBalancedSharing: "Balance self and sharing",
    weeklyBase: "Weekly base",
    buildMission: "Review family agreement",
    agreementTitle: "A simple family agreement",
    agreementBody:
      "Responsibilities help the family. Paid extras are agreed before the work begins.",
    parentMarked: "Parent has reviewed it",
    childMarked: "Child understands it",
    startWeek: "Start this week",
    thisWeek: "This week",
    weekReady: "Your family mission is ready.",
    quickCheck: "Review the week",
    quickCheckTitle: "What was completed?",
    completed: "Completed",
    notCompleted: "Not completed",
    finishCheck: "Calculate payday",
    back: "Back",
    paydayTitle: "Family payday",
    paydayBody: "Review the amount before it is locked into the four jars.",
    baseAmount: "Weekly base",
    paidExtras: "Completed paid extras",
    confirmPayday: "Confirm and fill jars",
    weekComplete: "Week complete",
    weekCompleteBody: "You made real choices together.",
    familyReviewed: "Family reviewed amount",
    talkAboutWeek: "Talk about this week",
    startNextWeek: "Start next week",
    fourJars: "Four jars",
    fourJarsBody: "Every amount has a job.",
    addParentBonus: "Add parent bonus",
    moveMoney: "Move money",
    parentConfirms: "Parent confirms every change.",
    scooterGoal: "Scooter goal",
    goalProgress: "Goal progress",
    goalComplete: "Goal reached",
    jarDetail: "Jar details",
    backToJars: "Back to all jars",
    currentBalance: "Current balance",
    currentShare: "Current share",
    dragToShake: "Drag the jar side to side to hear it",
    keyboardShake: "Press Enter or Space to shake",
    chooseJar: "Choose a jar",
    bonusAmount: "Bonus amount in US dollars",
    fromJar: "Move from",
    toJar: "Move to",
    moveAmount: "Amount in US dollars",
    confirmBonus: "Confirm parent bonus",
    confirmMove: "Confirm move",
    cancel: "Cancel",
    bonusRecorded: "Parent bonus added",
    moveRecorded: "Money moved between jars",
    invalidAmount: "Enter an amount from $0.01 to $100.00.",
    invalidGoal: "Enter a goal from $1.00 to $10,000.00.",
    insufficientBalance: "That jar does not have enough money.",
    sameJarError: "Choose two different jars.",
    historyTitle: "Family history",
    historyBody: "A clear record of every confirmed change.",
    weekClosed: "Week closed",
    parentBonus: "Parent bonus",
    bucketMove: "Money moved",
    growBonus: "Grow challenge bonus",
    noActivity: "Complete a week to begin the history.",
    moneyMomentTitle: "Money Moment",
    questions: "Questions to ask",
    familyAction: "Try together",
    localCard: "Safe local conversation card",
    goalSaved: "Save goal updated",
    settingsSaved: "Settings updated",
    requestFailed: "That change was not saved. Please try again.",
  },
  ru: {
    brandTagline: "Денежные привычки, которые дети могут тренировать.",
    syntheticDemo: "Семейное демо · без банковского счёта",
    loading: "Накрываем семейный стол…",
    loadError: "Не удалось открыть демо.",
    retry: "Попробовать снова",
    navWeek: "Неделя",
    navJars: "Копилки",
    navHistory: "История",
    parentMenu: "Открыть настройки родителя",
    settingsTitle: "Настройки родителя",
    close: "Закрыть",
    language: "Язык",
    english: "Английский",
    russian: "Русский",
    kazakh: "Казахский",
    currency: "Валюта отображения",
    usdOnly: "Доллар США (USD) · фиксировано для MVP",
    sound: "Звуки копилок",
    soundHelp: "Короткий звук после осознанного жеста с копилкой.",
    motion: "Анимация праздника",
    motionHelp: "Сдержанное движение для успеха и отклика копилки.",
    saveGoal: "Цель накопления",
    goalName: "Название цели",
    targetAmount: "Цель в долларах США",
    saveChanges: "Сохранить",
    resetDemo: "Начать демо заново",
    resetHelp: "Очищает эту синтетическую семейную неделю.",
    startTitle: "Начните денежную неделю",
    startBody:
      "Короткий семейный ритуал: заработать, выбрать и обсудить вместе.",
    childNickname: "Имя ребёнка для экрана",
    nicknamePlaceholder: "Аян",
    ageBand: "Возрастная группа",
    continue: "Продолжить",
    missionTitle: "Выберите фокус недели",
    missionBody: "Просто: одна привычка, одна неделя и четыре понятных выбора.",
    objectiveFirstChoices: "Сделать первые денежные выборы",
    objectiveSavingPatience: "Тренировать терпеливое накопление",
    objectiveBalancedSharing: "Балансировать своё и помощь другим",
    weeklyBase: "Основа недели",
    buildMission: "Проверить семейное соглашение",
    agreementTitle: "Простое семейное соглашение",
    agreementBody:
      "Обязанности помогают семье. Платные задания согласуются заранее.",
    parentMarked: "Родитель всё проверил",
    childMarked: "Ребёнок всё понимает",
    startWeek: "Начать неделю",
    thisWeek: "Эта неделя",
    weekReady: "Семейная миссия готова.",
    quickCheck: "Подвести итоги",
    quickCheckTitle: "Что получилось выполнить?",
    completed: "Выполнено",
    notCompleted: "Не выполнено",
    finishCheck: "Рассчитать выплату",
    back: "Назад",
    paydayTitle: "Семейная выплата",
    paydayBody: "Проверьте сумму до её фиксации в четырёх копилках.",
    baseAmount: "Основа недели",
    paidExtras: "Выполненные платные задания",
    confirmPayday: "Подтвердить и наполнить копилки",
    weekComplete: "Неделя завершена",
    weekCompleteBody: "Вы вместе сделали настоящие выборы.",
    familyReviewed: "Сумма проверена семьёй",
    talkAboutWeek: "Обсудить эту неделю",
    startNextWeek: "Начать следующую неделю",
    fourJars: "Четыре копилки",
    fourJarsBody: "У каждой суммы есть своё дело.",
    addParentBonus: "Добавить бонус родителя",
    moveMoney: "Переместить деньги",
    parentConfirms: "Каждое изменение подтверждает родитель.",
    scooterGoal: "Цель: самокат",
    goalProgress: "Прогресс цели",
    goalComplete: "Цель достигнута",
    jarDetail: "Детали копилки",
    backToJars: "Ко всем копилкам",
    currentBalance: "Текущий баланс",
    currentShare: "Текущая доля",
    dragToShake: "Покачайте копилку из стороны в сторону",
    keyboardShake: "Нажмите Enter или пробел, чтобы потрясти",
    chooseJar: "Выберите копилку",
    bonusAmount: "Сумма бонуса в долларах США",
    fromJar: "Из копилки",
    toJar: "В копилку",
    moveAmount: "Сумма в долларах США",
    confirmBonus: "Подтвердить бонус родителя",
    confirmMove: "Подтвердить перемещение",
    cancel: "Отмена",
    bonusRecorded: "Бонус родителя добавлен",
    moveRecorded: "Деньги перемещены между копилками",
    invalidAmount: "Введите сумму от $0.01 до $100.00.",
    invalidGoal: "Введите цель от $1.00 до $10,000.00.",
    insufficientBalance: "В этой копилке недостаточно денег.",
    sameJarError: "Выберите две разные копилки.",
    historyTitle: "Семейная история",
    historyBody: "Понятная запись каждого подтверждённого изменения.",
    weekClosed: "Неделя закрыта",
    parentBonus: "Бонус родителя",
    bucketMove: "Перемещение денег",
    growBonus: "Учебный бонус «Расти»",
    noActivity: "Завершите неделю, чтобы появилась история.",
    moneyMomentTitle: "Денежный момент",
    questions: "Вопросы для разговора",
    familyAction: "Попробуйте вместе",
    localCard: "Безопасная локальная карточка",
    goalSaved: "Цель накопления обновлена",
    settingsSaved: "Настройки обновлены",
    requestFailed: "Изменение не сохранилось. Попробуйте снова.",
  },
  kk: {
    brandTagline: "Балалар жаттықтыра алатын ақша әдеттері.",
    syntheticDemo: "Отбасылық демо · банк шотынсыз",
    loading: "Отбасылық үстелді дайындап жатырмыз…",
    loadError: "Демоны ашу мүмкін болмады.",
    retry: "Қайталап көру",
    navWeek: "Апта",
    navJars: "Құтылар",
    navHistory: "Тарих",
    parentMenu: "Ата-ана баптауларын ашу",
    settingsTitle: "Ата-ана баптаулары",
    close: "Жабу",
    language: "Тіл",
    english: "Ағылшын",
    russian: "Орыс",
    kazakh: "Қазақ",
    currency: "Көрсету валютасы",
    usdOnly: "АҚШ доллары (USD) · MVP үшін бекітілген",
    sound: "Құты дыбыстары",
    soundHelp: "Құтымен саналы әрекеттен кейін қысқа дыбыс ойнату.",
    motion: "Мерекелік қозғалыс",
    motionHelp: "Жетістік пен құты жауабына ұстамды анимация.",
    saveGoal: "Жинақ мақсаты",
    goalName: "Мақсат атауы",
    targetAmount: "АҚШ долларындағы мақсат",
    saveChanges: "Сақтау",
    resetDemo: "Демоны қайта бастау",
    resetHelp: "Осы синтетикалық отбасылық аптаны тазалайды.",
    startTitle: "Ақша аптасын бастаңыз",
    startBody:
      "Бірге табу, таңдау және талқылауға арналған қысқа отбасылық рәсім.",
    childNickname: "Баланың экрандағы аты",
    nicknamePlaceholder: "Аян",
    ageBand: "Жас тобы",
    continue: "Жалғастыру",
    missionTitle: "Апта бағытын таңдаңыз",
    missionBody: "Қарапайым: бір әдет, бір апта және төрт түсінікті таңдау.",
    objectiveFirstChoices: "Алғашқы ақша таңдауын жасау",
    objectiveSavingPatience: "Сабырмен жинауды үйрену",
    objectiveBalancedSharing: "Өзіңе және өзгеге көмекті тең ұстау",
    weeklyBase: "Апталық негіз",
    buildMission: "Отбасылық келісімді тексеру",
    agreementTitle: "Қарапайым отбасылық келісім",
    agreementBody:
      "Міндеттер отбасына көмектеседі. Ақылы тапсырмалар алдын ала келісіледі.",
    parentMarked: "Ата-ана тексерді",
    childMarked: "Бала түсінді",
    startWeek: "Аптаны бастау",
    thisWeek: "Осы апта",
    weekReady: "Отбасылық миссия дайын.",
    quickCheck: "Аптаны қорытындылау",
    quickCheckTitle: "Не орындалды?",
    completed: "Орындалды",
    notCompleted: "Орындалмады",
    finishCheck: "Төлемді есептеу",
    back: "Артқа",
    paydayTitle: "Отбасылық төлем",
    paydayBody: "Соманы төрт құтыға бекітпес бұрын тексеріңіз.",
    baseAmount: "Апталық негіз",
    paidExtras: "Орындалған ақылы тапсырмалар",
    confirmPayday: "Растау және құтыларды толтыру",
    weekComplete: "Апта аяқталды",
    weekCompleteBody: "Сіздер бірге нақты таңдау жасадыңыздар.",
    familyReviewed: "Отбасы тексерген сома",
    talkAboutWeek: "Осы аптаны талқылау",
    startNextWeek: "Келесі аптаны бастау",
    fourJars: "Төрт құты",
    fourJarsBody: "Әр соманың өз міндеті бар.",
    addParentBonus: "Ата-ана бонусын қосу",
    moveMoney: "Ақшаны ауыстыру",
    parentConfirms: "Әр өзгерісті ата-ана растайды.",
    scooterGoal: "Самокат мақсаты",
    goalProgress: "Мақсат ілгерілеуі",
    goalComplete: "Мақсат орындалды",
    jarDetail: "Құты мәліметтері",
    backToJars: "Барлық құтыға оралу",
    currentBalance: "Қазіргі баланс",
    currentShare: "Қазіргі үлес",
    dragToShake: "Дыбысын есту үшін құтыны екі жаққа қозғаңыз",
    keyboardShake: "Сілку үшін Enter немесе бос орын басыңыз",
    chooseJar: "Құтыны таңдаңыз",
    bonusAmount: "АҚШ долларындағы бонус",
    fromJar: "Қай құтыдан",
    toJar: "Қай құтыға",
    moveAmount: "АҚШ долларындағы сома",
    confirmBonus: "Ата-ана бонусын растау",
    confirmMove: "Ауыстыруды растау",
    cancel: "Бас тарту",
    bonusRecorded: "Ата-ана бонусы қосылды",
    moveRecorded: "Ақша құтылар арасында ауыстырылды",
    invalidAmount: "$0.01–$100.00 аралығындағы соманы енгізіңіз.",
    invalidGoal: "$1.00–$10,000.00 аралығындағы мақсатты енгізіңіз.",
    insufficientBalance: "Бұл құтыда ақша жеткіліксіз.",
    sameJarError: "Екі түрлі құтыны таңдаңыз.",
    historyTitle: "Отбасылық тарих",
    historyBody: "Әр расталған өзгерістің түсінікті жазбасы.",
    weekClosed: "Апта жабылды",
    parentBonus: "Ата-ана бонусы",
    bucketMove: "Ақша ауыстыру",
    growBonus: "«Өсу» оқу бонусы",
    noActivity: "Тарихты бастау үшін аптаны аяқтаңыз.",
    moneyMomentTitle: "Ақша сәті",
    questions: "Әңгіме сұрақтары",
    familyAction: "Бірге байқап көріңіз",
    localCard: "Қауіпсіз жергілікті карточка",
    goalSaved: "Жинақ мақсаты жаңартылды",
    settingsSaved: "Баптаулар жаңартылды",
    requestFailed: "Өзгеріс сақталмады. Қайталап көріңіз.",
  },
} satisfies Record<Locale, CopyContract>;

interface BucketCopyItem {
  label: string;
  description: string;
  soundLabel: string;
}

export const bucketCopy = {
  en: {
    spend: {
      label: "Spend",
      description: "Choices for now",
      soundLabel: "paper click",
    },
    save: {
      label: "Save",
      description: "A goal for later",
      soundLabel: "soft coin clink",
    },
    give: {
      label: "Give",
      description: "Care for others",
      soundLabel: "warm chime",
    },
    grow: {
      label: "Grow",
      description: "Learning and curiosity",
      soundLabel: "wooden bell",
    },
  },
  ru: {
    spend: {
      label: "Тратить",
      description: "Выборы на сейчас",
      soundLabel: "щелчок бумаги",
    },
    save: {
      label: "Копить",
      description: "Цель на потом",
      soundLabel: "мягкий звон монет",
    },
    give: {
      label: "Делиться",
      description: "Забота о других",
      soundLabel: "тёплый перезвон",
    },
    grow: {
      label: "Расти",
      description: "Учёба и любопытство",
      soundLabel: "деревянный колокольчик",
    },
  },
  kk: {
    spend: {
      label: "Жұмсау",
      description: "Қазіргі таңдау",
      soundLabel: "қағаз дыбысы",
    },
    save: {
      label: "Жинау",
      description: "Кейінгі мақсат",
      soundLabel: "жұмсақ тиын үні",
    },
    give: {
      label: "Бөлісу",
      description: "Өзгеге қамқорлық",
      soundLabel: "жылы әуен",
    },
    grow: {
      label: "Өсу",
      description: "Оқу мен қызығушылық",
      soundLabel: "ағаш қоңырау",
    },
  },
} satisfies Record<Locale, Record<BucketKey, BucketCopyItem>>;

type TaskId = "clear_table" | "water_plants" | "sort_books";

export const taskCopy = {
  en: {
    clear_table: { label: "Clear the table", detail: "Family responsibility" },
    water_plants: { label: "Water the plants", detail: "+$5.00" },
    sort_books: { label: "Put books in order", detail: "+$3.00" },
  },
  ru: {
    clear_table: { label: "Убрать со стола", detail: "Семейная обязанность" },
    water_plants: { label: "Полить растения", detail: "+$5.00" },
    sort_books: { label: "Разложить книги", detail: "+$3.00" },
  },
  kk: {
    clear_table: { label: "Үстелді жинау", detail: "Отбасылық міндет" },
    water_plants: { label: "Өсімдіктерді суару", detail: "+$5.00" },
    sort_books: { label: "Кітаптарды реттеу", detail: "+$3.00" },
  },
} satisfies Record<Locale, Record<TaskId, { label: string; detail: string }>>;
