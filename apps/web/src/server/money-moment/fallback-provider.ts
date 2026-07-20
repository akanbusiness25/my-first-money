import type { ConversationCard } from "@/domain/demo";
import type { MoneyMomentProvider } from "./provider";
import {
  ConversationCardSchema,
  type MoneyMomentCardId,
  type MoneyMomentInput,
} from "./schema";

const cards: Record<MoneyMomentInput["locale"], ConversationCard> = {
  en: {
    title: "Two minutes about your choices",
    explanation:
      "Today one amount found four different jobs. Each choice now has a clear place.",
    questions: [
      "Which jar was easiest to choose, and why?",
      "What might change if you think about your goal first next time?",
      "How can you help someone else while keeping your own plan in mind?",
    ],
    familyAction: "Choose one jar and name its next small step together.",
  },
  ru: {
    title: "Две минуты о вашем выборе",
    explanation:
      "Сегодня вы разделили одну сумму на четыре цели. Так каждый выбор получил своё место.",
    questions: [
      "Какую копилку было проще всего выбрать — и почему?",
      "Что изменится, если в следующий раз сначала подумать о цели?",
      "Как можно помочь другому, не забывая о своих планах?",
    ],
    familyAction: "Выберите одну копилку и назовите следующий маленький шаг.",
  },
  kk: {
    title: "Таңдауыңыз туралы екі минут",
    explanation:
      "Бүгін бір соманы төрт мақсатқа бөлдіңіздер. Осылайша әр таңдаудың өз орны пайда болды.",
    questions: [
      "Қай құтыны таңдау оңай болды және неліктен?",
      "Келесі жолы алдымен мақсатты ойласақ, не өзгереді?",
      "Өз жоспарыңды ұмытпай, басқаға қалай көмектесуге болады?",
    ],
    familyAction: "Бір құтыны таңдап, келесі шағын қадамды атаңыздар.",
  },
};

const goalCards: Record<MoneyMomentInput["locale"], ConversationCard> = {
  en: {
    title: "Two minutes about a small step",
    explanation:
      "A goal feels clearer when a family notices one step already made and chooses the next one.",
    questions: [
      "Which small step has already happened?",
      "Which next step would your family like to notice?",
    ],
    familyAction: "Name one next step to notice this week.",
  },
  ru: {
    title: "Две минуты о маленьком шаге",
    explanation:
      "Цель становится понятнее, когда семья замечает один уже сделанный шаг и выбирает следующий.",
    questions: [
      "Какой маленький шаг уже получился?",
      "Какой шаг семья хочет попробовать дальше?",
    ],
    familyAction: "Отметьте один следующий шаг на этой неделе.",
  },
  kk: {
    title: "Кішкентай қадам туралы екі минут",
    explanation:
      "Отбасы бір жасалған қадамды байқап, келесі қадамды таңдағанда мақсат түсініктірек болады.",
    questions: [
      "Қай кішкентай қадам орындалды?",
      "Отбасы келесіде қай қадамды байқап көргісі келеді?",
    ],
    familyAction: "Осы аптаға бір келесі қадамды белгілеңіздер.",
  },
};

export function getCuratedMoneyMomentCard(
  locale: MoneyMomentInput["locale"],
  cardId: MoneyMomentCardId,
): ConversationCard {
  return ConversationCardSchema.parse(
    cardId === "goal_progress" ? goalCards[locale] : cards[locale],
  );
}

export class DeterministicMoneyMomentProvider implements MoneyMomentProvider {
  readonly name = "fallback" as const;

  async generate(
    input: MoneyMomentInput,
    signal: AbortSignal,
  ): Promise<ConversationCard> {
    void signal;
    return getCuratedMoneyMomentCard(input.locale, "choices_reflection");
  }
}
