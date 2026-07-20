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

async function completeWeek() {
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
  await page.getByRole("button", { name: "Confirm and fill jars" }).click();
  await page.getByRole("heading", { name: "Week complete" }).waitFor();
}

async function settleImages() {
  await page.waitForFunction(() =>
    [...document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
}

try {
  await page.goto("http://127.0.0.1:3000/", {
    waitUntil: "networkidle",
  });
  await completeWeek();
  await settleImages();
  await page.getByRole("heading", { name: "Week complete" }).click();
  await page.screenshot({ path: evidencePath("week") });

  await page.getByRole("button", { name: "Jars", exact: true }).click();
  await settleImages();
  await page.getByRole("heading", { name: "Four jars" }).click();
  await page.screenshot({ path: evidencePath("jars") });

  await page.getByRole("button", { name: "Save jar" }).click();
  await settleImages();
  await page.getByRole("heading", { name: "Scooter goal" }).click();
  await page.screenshot({ path: evidencePath("jar-detail") });
} finally {
  await context.close();
  await browser.close();
}
