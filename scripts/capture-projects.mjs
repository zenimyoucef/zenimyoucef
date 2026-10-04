import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir("docs/references/screenshots", { recursive: true });
const allProjects = [
  ["aurea", "https://aureanails.vercel.app/"],
  ["acendi", "https://acendi-dz.vercel.app/ar"],
  ["tkitec", "https://tkitec.store/"],
  ["quantum", "https://zenimyoucef.github.io/zenimyoucef/quantum/index.html"],
  ["velora", "https://zenimyoucef.github.io/zenimyoucef/velora/index.html"],
  ["bistro", "https://zenimyoucef.github.io/zenimyoucef/bistro/index.html"],
  ["pulse", "https://zenimyoucef.github.io/zenimyoucef/pulse/dist/index.html"],
  ["nomad", "https://zenimyoucef.github.io/zenimyoucef/nomad/index.html"],
  ["admin", "https://zenimyoucef.github.io/zenimyoucef/admin-demo/index.html"],
];
const requested = process.argv.slice(2);
const projects = requested.length
  ? allProjects.filter(([name]) => requested.includes(name))
  : allProjects;
const results = [];
// Capture in small batches to avoid competing with image-heavy source pages.
for (let start = 0; start < projects.length; start += 2) {
  await Promise.all(
    projects.slice(start, start + 2).map(async ([name, url]) => {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 950 },
        deviceScaleFactor: 1,
      });
      try {
        const response = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        });
        await page
          .waitForLoadState("networkidle", { timeout: 18000 })
          .catch(() => {});
        await page.evaluate(async () => {
          await Promise.race([
            Promise.all([
              document.fonts.ready,
              ...[...document.images]
                .filter((img) => img.getBoundingClientRect().top < innerHeight)
                .map((img) => img.decode().catch(() => {})),
            ]),
            new Promise((resolve) => setTimeout(resolve, 8000)),
          ]);
        });
        await page.waitForTimeout(2200);
        const detailSection =
          name === "quantum"
            ? "#products"
            : name === "velora"
              ? "#collection"
              : null;
        if (detailSection) {
          await page
            .locator(detailSection)
            .evaluate((element) =>
              window.scrollTo({
                top: element.getBoundingClientRect().top + scrollY - 100,
                behavior: "instant",
              }),
            );
          await page.waitForTimeout(1500);
        }
        const screenshot = await page.screenshot({ animations: "disabled" });
        await writeFile(`docs/references/screenshots/${name}.png`, screenshot);
        for (const width of [640, 1280]) {
          await sharp(screenshot)
            .resize({ width })
            .webp({ quality: 84 })
            .toFile(`public/images/${name}-${width}.webp`);
        }
        results.push({
          name,
          url,
          status: response?.status(),
          title: await page.title(),
          screenshot: `${name}.png`,
        });
        console.log(`${name}: ${response?.status()} ${await page.title()}`);
      } catch (error) {
        results.push({ name, url, error: error.message });
        console.error(`${name}: ${error.message}`);
      } finally {
        await page.close();
      }
    }),
  );
}
await browser.close();
await writeFile(
  `docs/references/${requested.length ? "detail-" : ""}project-capture.json`,
  JSON.stringify(results, null, 2),
);
if (results.some((result) => result.error || result.status !== 200))
  process.exitCode = 1;
