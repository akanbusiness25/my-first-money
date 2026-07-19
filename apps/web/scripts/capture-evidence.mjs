import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const evidencePath = (name) =>
  fileURLToPath(
    new URL(`../../../docs/design/implementation-${name}.png`, import.meta.url),
  );

const browser = await chromium.launch();
const context = await browser.newContext({
  colorScheme: "light",
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();

try {
  await page.goto("http://127.0.0.1:3000/", {
    waitUntil: "networkidle",
  });
  await page.getByLabel("Имя ребёнка").fill("Аян");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await page.getByRole("button", { name: "Собрать миссию" }).click();
  await page.getByRole("button", { name: "Начать неделю" }).click();
  await page.screenshot({ path: evidencePath("week"), fullPage: true });

  await page.getByTestId("open-quick-check").click();
  for (const task of [
    "Готово: Убрать со стола",
    "Готово: Полить растения",
    "Готово: Разложить книги",
  ]) {
    await page.getByRole("button", { name: task }).click();
  }
  await page.getByTestId("finish-check").click();
  await page.screenshot({ path: evidencePath("payday"), fullPage: true });

  await page.getByTestId("confirm-payday").click();
  await page.screenshot({ path: evidencePath("closed"), fullPage: true });
  await page.getByRole("button", { name: "Подготовить разговор" }).click();
  await page.getByText("Локальная безопасная карточка").waitFor();
  await page.screenshot({
    path: evidencePath("money-moment"),
    fullPage: true,
  });
} finally {
  await context.close();
  await browser.close();
}
