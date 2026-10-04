import { chromium } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 950 },
    reducedMotion: "reduce",
  });
  await page.goto(
    "http://127.0.0.1:4173/zenimyoucef/pulse/dist/index.html#/bmi",
    { waitUntil: "networkidle" },
  );
  await page.getByPlaceholder("e.g. 75").fill("75");
  await page.getByRole("heading", { name: "BMI Calculator" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "docs/references/screenshots/pulse-bmi.png" });
  for (const width of [640, 960, 1280]) {
    const image = sharp("docs/references/screenshots/pulse-bmi.png").resize({
      width,
    });
    await image
      .clone()
      .avif({ quality: 58 })
      .toFile(`public/images/pulse-${width}.avif`);
    await image
      .clone()
      .webp({ quality: 82 })
      .toFile(`public/images/pulse-${width}.webp`);
  }
} finally {
  await browser.close();
}
