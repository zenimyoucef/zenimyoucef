import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts/review", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const url = process.env.TEST_URL || "http://127.0.0.1:5173/zenimyoucef/";
for (const width of [390, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 900 },
    reducedMotion: "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/review/hero-${width}.png` });
  for (const id of ["work", "playground", "about", "process", "contact"]) {
    await page.evaluate(
      (id) =>
        window.scrollTo(
          0,
          document.querySelector(`#${id}`).getBoundingClientRect().top +
            scrollY -
            20,
        ),
      id,
    );
    await page.waitForTimeout(200);
    await page.screenshot({ path: `artifacts/review/${id}-${width}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.screenshot({ path: `artifacts/review/menu-${width}.png` });
  await page.close();
}
await browser.close();
console.log("Saved desktop/mobile section screenshots in artifacts/review.");
