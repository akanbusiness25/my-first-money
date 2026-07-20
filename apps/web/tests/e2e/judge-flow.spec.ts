import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function settleMotion(page: import("@playwright/test").Page) {
  await page.locator("main").evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished),
    );
  });
}

async function finishDemoWeek(page: import("@playwright/test").Page) {
  await page.getByLabel("Child nickname").fill("Ari");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Review family agreement" }).click();
  await page.getByRole("button", { name: "Start this week" }).click();
  await page.getByRole("button", { name: "Review the week" }).click();

  for (const groupName of [
    "Clear the table Family responsibility",
    "Water the plants +$5.00",
    "Put books in order +$3.00",
  ]) {
    await page
      .getByRole("group", { name: groupName })
      .getByRole("button", { name: "Completed", exact: true })
      .click();
  }

  await page.getByRole("button", { name: "Calculate payday" }).click();
  await expect(
    page.getByRole("heading", { name: "Family payday" }),
  ).toBeVisible();
  await expect(page.getByText("$18.00", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Confirm and fill jars" }).click();
  await expect(
    page.getByRole("heading", { name: "Week complete" }),
  ).toBeVisible();
}

test("completes the family ritual and records parent-confirmed jar actions", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Start a money week" }),
  ).toBeVisible();
  await settleMotion(page);

  const setupAccessibility = await new AxeBuilder({ page }).analyze();
  expect(setupAccessibility.violations).toEqual([]);

  await finishDemoWeek(page);

  await page.getByRole("button", { name: "Talk about this week" }).click();
  const moment = page.getByRole("dialog", {
    name: "Two minutes about your choices",
  });
  await expect(moment).toBeVisible();
  await expect(moment.getByText("Safe local conversation card")).toBeVisible();
  await moment.getByRole("button", { name: "Close" }).last().click();

  await page.getByRole("button", { name: "Jars", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Four jars" })).toBeVisible();
  await page.getByRole("button", { name: "Save jar" }).click();
  await expect(
    page.getByRole("heading", { name: "Scooter goal" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add parent bonus" }).click();
  const bonus = page.getByRole("dialog", { name: "Add parent bonus" });
  await expect(bonus.getByLabel("Choose a jar")).toHaveValue("save");
  await expect(bonus.getByLabel("Bonus amount in US dollars")).toHaveValue(
    "1.00",
  );
  await bonus.getByRole("button", { name: "Continue" }).click();
  await bonus.getByRole("button", { name: "Confirm parent bonus" }).click();
  await expect(bonus).toBeHidden();
  await expect(page.getByText("$2.80", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Move money" }).click();
  const move = page.getByRole("dialog", { name: "Move money" });
  await expect(move.getByLabel("Move from")).toHaveValue("spend");
  await expect(move.getByLabel("Move to")).toHaveValue("save");
  await expect(move.getByLabel("Amount in US dollars")).toHaveValue("0.50");
  await move.getByRole("button", { name: "Continue" }).click();
  await move.getByRole("button", { name: "Confirm move" }).click();
  await expect(move).toBeHidden();
  await expect(page.getByText("$3.30", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Family history" }),
  ).toBeVisible();
  await expect(page.getByText("Parent bonus", { exact: true })).toBeVisible();
  await expect(page.getByText("Money moved", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Open parent settings" }).click();
  const settings = page.getByRole("dialog", { name: "Parent settings" });
  await expect(settings.getByRole("radio", { name: "English" })).toBeChecked();
  await expect(
    settings.getByText("US dollar (USD) · fixed for this MVP"),
  ).toBeVisible();
  await settings.getByLabel("Goal name").fill("Bike");
  await settings.getByLabel("Target in US dollars").fill("90.00");
  await settings.getByRole("button", { name: "Save changes" }).click();
  await expect(settings).toBeHidden();

  await settleMotion(page);
  const closedAccessibility = await new AxeBuilder({ page }).analyze();
  expect(closedAccessibility.violations).toEqual([]);
});

test("keeps a second browser context isolated and defaults it to English", async ({
  browser,
}) => {
  const firstContext = await browser.newContext();
  const secondContext = await browser.newContext();
  const first = await firstContext.newPage();
  const second = await secondContext.newPage();

  await first.goto("/");
  await first.getByLabel("Child nickname").fill("Demo A");
  await first.getByRole("button", { name: "Continue" }).click();
  await second.goto("/");

  await expect(
    first.getByRole("heading", { name: "Choose this week’s focus" }),
  ).toBeVisible();
  await expect(
    second.getByRole("heading", { name: "Start a money week" }),
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
      sessionStorageKeys: Object.keys(sessionStorage),
      indexedDbEntries:
        "databases" in indexedDB ? (await indexedDB.databases()).length : 0,
      cacheUrls,
    };
  });

  expect(browserStorage.localStorageEntries).toBe(0);
  expect(
    browserStorage.sessionStorageKeys.every(
      (key) =>
        key.startsWith("__next_debug_channel:") ||
        key.startsWith("__next_scroll_"),
    ),
  ).toBe(true);
  expect(browserStorage.indexedDbEntries).toBe(0);
  for (const cachedUrl of browserStorage.cacheUrls) {
    const pathname = new URL(cachedUrl).pathname;
    expect(
      pathname.startsWith("/_next/static/") || pathname === "/icon.svg",
    ).toBe(true);
  }
});
