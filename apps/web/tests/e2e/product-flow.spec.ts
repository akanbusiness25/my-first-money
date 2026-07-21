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
  await page.getByRole("button", { name: "Start from scratch" }).click();
  await page.getByLabel("Child nickname").fill("Ari");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Review family agreement" }).click();
  await page.getByRole("button", { name: "Parent has reviewed it" }).click();
  await page.getByRole("button", { name: "Child understands it" }).click();
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
    page.getByRole("heading", { name: "How would you like to begin?" }),
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

  const focusedJar = page.getByRole("button", { name: "Save jar" });
  const jarBox = await focusedJar.boundingBox();
  expect(jarBox).not.toBeNull();
  await page.mouse.move(
    jarBox!.x + jarBox!.width / 2,
    jarBox!.y + jarBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    jarBox!.x + jarBox!.width / 2 + 36,
    jarBox!.y + jarBox!.height / 2,
  );
  await expect
    .poll(() =>
      focusedJar.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  await page.mouse.up();

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

  await page.getByRole("button", { name: "Use money from this jar" }).click();
  const use = page.getByRole("dialog", {
    name: "Use money from this jar",
  });
  await expect(use.getByLabel("Choose a jar")).toHaveValue("save");
  await expect(use.getByLabel("What was it used for?")).toHaveValue(
    "save_goal",
  );
  await expect(
    use.getByText(
      "This records money leaving the jar. To transfer money between jars, use Move money.",
    ),
  ).toBeVisible();
  await use.getByLabel("Choose a jar").selectOption("give");
  await expect(use.getByLabel("What was it used for?")).toHaveValue(
    "helped_someone",
  );
  await expect(
    use.getByRole("option", { name: "Bought the Save goal" }),
  ).toHaveCount(0);
  await use.getByLabel("Choose a jar").selectOption("save");
  await use.getByRole("button", { name: "Continue" }).click();
  await use.getByRole("button", { name: "Confirm jar use" }).click();
  await expect(use).toBeHidden();
  await expect(page.getByText("$2.80", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Family history" }),
  ).toBeVisible();
  const history = page.getByRole("list");
  await expect(
    history.getByText("Parent bonus", { exact: true }),
  ).toBeVisible();
  await expect(history.getByText("Money moved", { exact: true })).toBeVisible();
  await expect(history.getByText("Money used", { exact: true })).toBeVisible();
  await page.getByLabel("Filter history").selectOption("give");
  await expect(history.getByText("Week allocation · 1")).toBeVisible();
  await expect(history.getByText("+$1.80 · Give")).toBeVisible();

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
  await first.getByRole("button", { name: "Start from scratch" }).click();
  await first.getByLabel("Child nickname").fill("Demo A");
  await first.getByRole("button", { name: "Continue" }).click();
  await second.goto("/");

  await expect(
    first.getByRole("heading", { name: "Choose this week’s focus" }),
  ).toBeVisible();
  await expect(
    second.getByRole("heading", { name: "How would you like to begin?" }),
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
  if (documentResponse?.url().startsWith("https://")) {
    expect(documentResponse.headers()["strict-transport-security"]).toContain(
      "max-age=31536000",
    );
  }

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
