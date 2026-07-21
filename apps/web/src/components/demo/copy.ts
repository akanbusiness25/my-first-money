import type { Locale, TaskId } from "@/domain/demo";
import type { BucketUsePurpose } from "@/domain/ledger";
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
  childProfile: string;
  currentPlan: string;
  freePlan: string;
  plusComingSoon: string;
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
  goalIcon: string;
  iconScooter: string;
  iconBike: string;
  iconBooks: string;
  iconGame: string;
  iconTrip: string;
  iconCustom: string;
  targetAmount: string;
  saveChanges: string;
  resetDemo: string;
  resetHelp: string;
  runChoiceTitle: string;
  runChoiceBody: string;
  testRun: string;
  testRunHelp: string;
  startFresh: string;
  startFreshHelp: string;
  backToRunChoice: string;
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
  objectiveFirstHelp: string;
  objectiveSavingHelp: string;
  objectiveSharingHelp: string;
  defaultChoice: string;
  weeklyBase: string;
  weeklyBaseHelp: string;
  buildMission: string;
  agreementTitle: string;
  agreementBody: string;
  parentMarked: string;
  childMarked: string;
  agreementMarksHelp: string;
  responsibilities: string;
  paidJobs: string;
  baseNotPenalty: string;
  startWeek: string;
  thisWeek: string;
  weekReady: string;
  activeWeekDemoBody: string;
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
  useFromJar: string;
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
  useAmount: string;
  usePurpose: string;
  useHelp: string;
  confirmBonus: string;
  confirmMove: string;
  confirmUse: string;
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
  bucketUse: string;
  filterHistory: string;
  allActivity: string;
  growBonus: string;
  noActivity: string;
  noMatchingActivity: string;
  weekAllocation: string;
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
    childProfile: "Child profile",
    currentPlan: "Current plan",
    freePlan: "Free · one child and one Save goal",
    plusComingSoon:
      "Plus · more children, goals and editable splits · coming soon",
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
    goalIcon: "Goal icon",
    iconScooter: "Scooter",
    iconBike: "Bicycle",
    iconBooks: "Books",
    iconGame: "Game",
    iconTrip: "Family trip",
    iconCustom: "Something else",
    targetAmount: "Target in US dollars",
    saveChanges: "Save changes",
    resetDemo: "Restart test run",
    resetHelp: "Clears this test run and starts again.",
    runChoiceTitle: "How would you like to begin?",
    runChoiceBody:
      "Try the flow with a sample profile or start with a blank one.",
    testRun: "Try a test run",
    testRunHelp:
      "Starts with the sample nickname Alex. You can change every choice.",
    startFresh: "Start from scratch",
    startFreshHelp: "Begin with a blank profile and make your own choices.",
    backToRunChoice: "Back to start options",
    startTitle: "Start a money week",
    startBody:
      "A simple weekly family routine for earning, choosing, and reflecting together.",
    childNickname: "Child nickname",
    nicknamePlaceholder: "Alex",
    ageBand: "Age band",
    continue: "Continue",
    missionTitle: "Choose this week’s focus",
    missionBody: "Keep it small: one habit, one week, four clear choices.",
    objectiveFirstChoices: "Make first money choices",
    objectiveSavingPatience: "Practice saving patiently",
    objectiveBalancedSharing: "Balance self and sharing",
    objectiveFirstHelp:
      "Balanced reflection prompts for a first money week. The jar split stays the same.",
    objectiveSavingHelp:
      "Reflection prompts focus on patience and the Save goal. The jar split stays the same.",
    objectiveSharingHelp:
      "Reflection prompts compare personal choices with giving. The jar split stays the same.",
    defaultChoice: "Default",
    weeklyBase: "Weekly base",
    weeklyBaseHelp:
      "Optional pocket money agreed in advance. It is not taken away for an unfinished family responsibility.",
    buildMission: "Review family agreement",
    agreementTitle: "A simple family agreement",
    agreementBody:
      "Responsibilities help the family. Paid extras are agreed before the work begins.",
    parentMarked: "Parent has reviewed it",
    childMarked: "Child understands it",
    agreementMarksHelp:
      "Tap both cards together before the week starts. These are playful marks, not legal signatures.",
    responsibilities: "Family responsibilities · unpaid",
    paidJobs: "Optional paid jobs",
    baseNotPenalty:
      "Family responsibilities build belonging. Only completed paid jobs change payday; the agreed base is not a penalty tool.",
    startWeek: "Start this week",
    thisWeek: "This week",
    weekReady: "Your family mission is ready.",
    activeWeekDemoBody:
      "This is your active-week home. Return here during the week, then review what was completed together.",
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
    useFromJar: "Use money from this jar",
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
    useAmount: "Amount used in US dollars",
    usePurpose: "What was it used for?",
    useHelp:
      "This records money leaving the jar. To transfer money between jars, use Move money.",
    confirmBonus: "Confirm parent bonus",
    confirmMove: "Confirm move",
    confirmUse: "Confirm jar use",
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
    bucketUse: "Money used",
    filterHistory: "Filter history",
    allActivity: "All activity",
    growBonus: "Grow challenge bonus",
    noActivity: "Complete a week to begin the history.",
    noMatchingActivity: "No activity matches this filter yet.",
    weekAllocation: "Week allocation",
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
    childProfile: "Профиль ребёнка",
    currentPlan: "Текущий план",
    freePlan: "Free · один ребёнок и одна цель Save",
    plusComingSoon: "Plus · больше детей, целей и гибкие доли · скоро",
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
    goalIcon: "Иконка цели",
    iconScooter: "Самокат",
    iconBike: "Велосипед",
    iconBooks: "Книги",
    iconGame: "Игра",
    iconTrip: "Семейная поездка",
    iconCustom: "Другая цель",
    targetAmount: "Цель в долларах США",
    saveChanges: "Сохранить",
    resetDemo: "Перезапустить тестовый прогон",
    resetHelp: "Очищает этот тестовый прогон и начинает заново.",
    runChoiceTitle: "Как вы хотите начать?",
    runChoiceBody: "Пройдите путь с примером или начните с чистого профиля.",
    testRun: "Тестовый прогон",
    testRunHelp:
      "Начинается с тестового имени Алекс. Все решения можно изменить.",
    startFresh: "Начать с нуля",
    startFreshHelp: "Создайте чистый профиль и выберите всё самостоятельно.",
    backToRunChoice: "Назад к выбору старта",
    startTitle: "Начните денежную неделю",
    startBody:
      "Простая еженедельная семейная привычка: заработать, выбрать и обсудить вместе.",
    childNickname: "Имя ребёнка для экрана",
    nicknamePlaceholder: "Аян",
    ageBand: "Возрастная группа",
    continue: "Продолжить",
    missionTitle: "Выберите фокус недели",
    missionBody: "Просто: одна привычка, одна неделя и четыре понятных выбора.",
    objectiveFirstChoices: "Сделать первые денежные выборы",
    objectiveSavingPatience: "Тренировать терпеливое накопление",
    objectiveBalancedSharing: "Балансировать своё и помощь другим",
    objectiveFirstHelp:
      "Сбалансированные вопросы для первой денежной недели. Доли копилок не меняются.",
    objectiveSavingHelp:
      "Вопросы направлены на терпение и цель Save. Доли копилок не меняются.",
    objectiveSharingHelp:
      "Вопросы помогают сравнить личный выбор и помощь другим. Доли копилок не меняются.",
    defaultChoice: "По умолчанию",
    weeklyBase: "Основа недели",
    weeklyBaseHelp:
      "Необязательные карманные деньги, согласованные заранее. Их не отнимают за невыполненную семейную обязанность.",
    buildMission: "Проверить семейное соглашение",
    agreementTitle: "Простое семейное соглашение",
    agreementBody:
      "Обязанности помогают семье. Платные задания согласуются заранее.",
    parentMarked: "Родитель всё проверил",
    childMarked: "Ребёнок всё понимает",
    agreementMarksHelp:
      "Нажмите обе карточки вместе до начала недели. Это игровые отметки, а не юридические подписи.",
    responsibilities: "Семейные обязанности · без оплаты",
    paidJobs: "Необязательные платные задания",
    baseNotPenalty:
      "Семейные обязанности формируют участие. На выплату влияют только выполненные платные задания; согласованная основа не служит наказанием.",
    startWeek: "Начать неделю",
    thisWeek: "Эта неделя",
    weekReady: "Семейная миссия готова.",
    activeWeekDemoBody:
      "Это главный экран активной недели. Возвращайтесь сюда в течение недели, а затем вместе отметьте выполненное.",
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
    useFromJar: "Использовать деньги из копилки",
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
    useAmount: "Использованная сумма в долларах США",
    usePurpose: "Для чего использовали?",
    useHelp:
      "Это списание из копилки. Для перевода между копилками используйте «Переместить деньги».",
    confirmBonus: "Подтвердить бонус родителя",
    confirmMove: "Подтвердить перемещение",
    confirmUse: "Подтвердить использование",
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
    bucketUse: "Использование денег",
    filterHistory: "Фильтр истории",
    allActivity: "Все события",
    growBonus: "Учебный бонус «Расти»",
    noActivity: "Завершите неделю, чтобы появилась история.",
    noMatchingActivity: "По этому фильтру пока нет операций.",
    weekAllocation: "Распределение недели",
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
    childProfile: "Бала профилі",
    currentPlan: "Қазіргі жоспар",
    freePlan: "Free · бір бала және бір Save мақсаты",
    plusComingSoon: "Plus · көбірек бала, мақсат және икемді үлестер · жақында",
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
    goalIcon: "Мақсат белгішесі",
    iconScooter: "Самокат",
    iconBike: "Велосипед",
    iconBooks: "Кітаптар",
    iconGame: "Ойын",
    iconTrip: "Отбасылық сапар",
    iconCustom: "Басқа мақсат",
    targetAmount: "АҚШ долларындағы мақсат",
    saveChanges: "Сақтау",
    resetDemo: "Тестік жүрісті қайта бастау",
    resetHelp: "Осы тестік жүрісті тазалап, қайта бастайды.",
    runChoiceTitle: "Қалай бастағыңыз келеді?",
    runChoiceBody: "Үлгі профильмен көріңіз немесе таза профильден бастаңыз.",
    testRun: "Тестік жүрісті көру",
    testRunHelp: "Alex үлгі атымен басталады. Әр таңдауды өзгертуге болады.",
    startFresh: "Басынан бастау",
    startFreshHelp: "Таза профильден бастап, таңдауларды өзіңіз жасаңыз.",
    backToRunChoice: "Бастау таңдауына оралу",
    startTitle: "Ақша аптасын бастаңыз",
    startBody:
      "Бірге табу, таңдау және талқылауға арналған қарапайым апталық отбасылық әдет.",
    childNickname: "Баланың экрандағы аты",
    nicknamePlaceholder: "Аян",
    ageBand: "Жас тобы",
    continue: "Жалғастыру",
    missionTitle: "Апта бағытын таңдаңыз",
    missionBody: "Қарапайым: бір әдет, бір апта және төрт түсінікті таңдау.",
    objectiveFirstChoices: "Алғашқы ақша таңдауын жасау",
    objectiveSavingPatience: "Сабырмен жинауды үйрену",
    objectiveBalancedSharing: "Өзіңе және өзгеге көмекті тең ұстау",
    objectiveFirstHelp:
      "Алғашқы ақша аптасына арналған теңгерімді сұрақтар. Құты үлестері өзгермейді.",
    objectiveSavingHelp:
      "Сұрақтар сабыр мен Save мақсатына бағытталады. Құты үлестері өзгермейді.",
    objectiveSharingHelp:
      "Сұрақтар жеке таңдау мен бөлісуді салыстырады. Құты үлестері өзгермейді.",
    defaultChoice: "Әдепкі",
    weeklyBase: "Апталық негіз",
    weeklyBaseHelp:
      "Алдын ала келісілген міндетті емес қалта ақшасы. Ол орындалмаған отбасылық міндет үшін алынбайды.",
    buildMission: "Отбасылық келісімді тексеру",
    agreementTitle: "Қарапайым отбасылық келісім",
    agreementBody:
      "Міндеттер отбасына көмектеседі. Ақылы тапсырмалар алдын ала келісіледі.",
    parentMarked: "Ата-ана тексерді",
    childMarked: "Бала түсінді",
    agreementMarksHelp:
      "Апта басталмай тұрып екі карточканы бірге басыңыз. Бұл заңды қолтаңба емес, ойын белгісі.",
    responsibilities: "Отбасылық міндеттер · ақысыз",
    paidJobs: "Міндетті емес ақылы тапсырмалар",
    baseNotPenalty:
      "Отбасылық міндеттер қатысуды үйретеді. Төлемге тек орындалған ақылы тапсырмалар әсер етеді; келісілген негіз жаза құралы емес.",
    startWeek: "Аптаны бастау",
    thisWeek: "Осы апта",
    weekReady: "Отбасылық миссия дайын.",
    activeWeekDemoBody:
      "Бұл белсенді аптаның басты экраны. Апта бойы осында оралып, соңында орындалған істерді бірге белгілеңіз.",
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
    useFromJar: "Құтыдағы ақшаны пайдалану",
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
    useAmount: "Пайдаланылған сома, АҚШ доллары",
    usePurpose: "Не үшін пайдаланылды?",
    useHelp:
      "Бұл — құтыдан алынған ақша. Құтылар арасында аудару үшін «Ақшаны ауыстыру» әрекетін қолданыңыз.",
    confirmBonus: "Ата-ана бонусын растау",
    confirmMove: "Ауыстыруды растау",
    confirmUse: "Құтыдан пайдалануды растау",
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
    bucketUse: "Ақшаны пайдалану",
    filterHistory: "Тарих сүзгісі",
    allActivity: "Барлық әрекет",
    growBonus: "«Өсу» оқу бонусы",
    noActivity: "Тарихты бастау үшін аптаны аяқтаңыз.",
    noMatchingActivity: "Бұл сүзгі бойынша әзірге әрекет жоқ.",
    weekAllocation: "Апталық бөлу",
    moneyMomentTitle: "Ақша сәті",
    questions: "Әңгіме сұрақтары",
    familyAction: "Бірге байқап көріңіз",
    localCard: "Қауіпсіз жергілікті карточка",
    goalSaved: "Жинақ мақсаты жаңартылды",
    settingsSaved: "Баптаулар жаңартылды",
    requestFailed: "Өзгеріс сақталмады. Қайталап көріңіз.",
  },
} satisfies Record<Locale, CopyContract>;

export const bucketUsePurposeCopy = {
  en: {
    everyday_purchase: "Everyday purchase",
    fun_purchase: "Something fun",
    save_goal: "Bought the Save goal",
    planned_purchase: "A planned purchase",
    helped_someone: "Helped someone",
    gift: "Bought a gift",
    learning_activity: "A learning activity",
    book: "Bought a book",
  },
  ru: {
    everyday_purchase: "Повседневная покупка",
    fun_purchase: "Покупка для удовольствия",
    save_goal: "Купили цель накопления",
    planned_purchase: "Запланированная покупка",
    helped_someone: "Помогли кому-то",
    gift: "Купили подарок",
    learning_activity: "Обучение или занятие",
    book: "Купили книгу",
  },
  kk: {
    everyday_purchase: "Күнделікті сатып алу",
    fun_purchase: "Көңілге арналған сатып алу",
    save_goal: "Жинақ мақсатын сатып алды",
    planned_purchase: "Жоспарланған сатып алу",
    helped_someone: "Біреуге көмектесті",
    gift: "Сыйлық сатып алды",
    learning_activity: "Оқу әрекеті",
    book: "Кітап сатып алды",
  },
} satisfies Record<Locale, Record<BucketUsePurpose, string>>;

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

export const taskCopy = {
  en: {
    clear_table: { label: "Clear the table", detail: "Family responsibility" },
    tidy_space: {
      label: "Tidy a shared space",
      detail: "Family responsibility",
    },
    water_plants: { label: "Water the plants", detail: "+$5.00" },
    sort_books: { label: "Put books in order", detail: "+$3.00" },
    help_laundry: { label: "Help fold laundry", detail: "+$2.00" },
  },
  ru: {
    clear_table: { label: "Убрать со стола", detail: "Семейная обязанность" },
    tidy_space: {
      label: "Навести порядок в общей зоне",
      detail: "Семейная обязанность",
    },
    water_plants: { label: "Полить растения", detail: "+$5.00" },
    sort_books: { label: "Разложить книги", detail: "+$3.00" },
    help_laundry: { label: "Помочь сложить бельё", detail: "+$2.00" },
  },
  kk: {
    clear_table: { label: "Үстелді жинау", detail: "Отбасылық міндет" },
    tidy_space: { label: "Ортақ орынды реттеу", detail: "Отбасылық міндет" },
    water_plants: { label: "Өсімдіктерді суару", detail: "+$5.00" },
    sort_books: { label: "Кітаптарды реттеу", detail: "+$3.00" },
    help_laundry: { label: "Киімді бүктеуге көмектесу", detail: "+$2.00" },
  },
} satisfies Record<Locale, Record<TaskId, { label: string; detail: string }>>;
