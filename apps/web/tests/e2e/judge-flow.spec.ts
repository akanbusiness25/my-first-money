import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function settleMotion(page: import("@playwright/test").Page) {
  await page.locator("main").evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished),
    );
  });
}

test("completes the first family money loop with safe local Money Moment", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Кто начинает первую неделю?" }),
  ).toBeVisible();
  await settleMotion(page);

  const setupAccessibility = await new AxeBuilder({ page }).analyze();
  expect(setupAccessibility.violations).toEqual([]);

  await page.getByLabel("Имя ребёнка").fill("Аян");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(
    page.getByRole("heading", { name: "Выберите цель недели" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Собрать миссию" }).click();
  await expect(
    page.getByRole("heading", { name: "Семейное соглашение" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Начать неделю" }).click();

  await page.getByTestId("open-quick-check").click();
  await page.getByRole("button", { name: "Готово: Убрать со стола" }).click();
  await page.getByRole("button", { name: "Готово: Полить растения" }).click();
  await page.getByRole("button", { name: "Готово: Разложить книги" }).click();
  await page.getByTestId("finish-check").click();

  await expect(page.getByText("1 800", { exact: false })).toBeVisible();
  await page.getByTestId("confirm-payday").click();
  await expect(
    page.getByRole("heading", { name: "Неделя закрыта" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Подготовить разговор" }).click();
  await expect(page.getByText("Локальная безопасная карточка")).toBeVisible();
  await expect(
    page.getByText("Покажите карточку родителю перед разговором."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Копилки" }).click();
  await expect(
    page.getByRole("heading", { name: "Четыре копилки" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "История" }).click();
  await page
    .getByRole("button", { name: "Показать безопасную поправку" })
    .click();
  await expect(page.getByText("Поправка родителя")).toBeVisible();
  await settleMotion(page);

  const closedAccessibility = await new AxeBuilder({ page }).analyze();
  expect(closedAccessibility.violations).toEqual([]);
});

test("keeps a second browser context isolated", async ({ browser }) => {
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const first = await firstContext.newPage();
  const second = await secondContext.newPage();

  await first.goto("/");
  await first.getByLabel("Имя ребёнка").fill("Демо А");
  await first.getByRole("button", { name: "Продолжить" }).click();
  await second.goto("/");

  await expect(
    first.getByRole("heading", { name: "Выберите цель недели" }),
  ).toBeVisible();
  await expect(
    second.getByRole("heading", { name: "Кто начинает первую неделю?" }),
  ).toBeVisible();

  await firstContext.close();
  await secondContext.close();
});

test("keeps the PWA and HTTP boundary private by default", async ({ page }) => {
  const documentResponse = await page.goto("/");
  expect(documentResponse?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(documentResponse?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(documentResponse?.headers()["x-frame-options"]).toBe("DENY");

  const apiResponse = await page.request.get("/api/v1/demo");
  expect(apiResponse.status()).toBe(200);
  expect(apiResponse.headers()["cache-control"]).toBe("no-store, private");
  expect(apiResponse.headers()["x-request-id"]).toBeTruthy();

  const rejectedMutation = await page.request.post("/api/v1/demo", {
    data: { action: "reset" },
  });
  expect(rejectedMutation.status()).toBe(403);
  await expect(rejectedMutation.json()).resolves.toEqual({
    error: { code: "ORIGIN_REJECTED" },
  });

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  const browserStorage = await page.evaluate(async () => {
    const cacheNames = await caches.keys();
    const cacheUrls = (
      await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          return (await cache.keys()).map((request) => request.url);
        }),
      )
    ).flat();
    return {
      localStorageEntries: localStorage.length,
      sessionStorageEntries: sessionStorage.length,
      indexedDbEntries:
        "databases" in indexedDB ? (await indexedDB.databases()).length : 0,
      cacheUrls,
    };
  });

  expect(browserStorage.localStorageEntries).toBe(0);
  expect(browserStorage.sessionStorageEntries).toBe(0);
  expect(browserStorage.indexedDbEntries).toBe(0);
  for (const cachedUrl of browserStorage.cacheUrls) {
    const pathname = new URL(cachedUrl).pathname;
    expect(
      pathname.startsWith("/_next/static/") || pathname === "/icon.svg",
    ).toBe(true);
  }
});
