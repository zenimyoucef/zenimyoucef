import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

const base = process.env.TEST_URL || "http://127.0.0.1:4173/zenimyoucef/";
const browser = await chromium.launch({
  ...(process.env.BROWSER_CHANNEL === "chromium"
    ? {}
    : { channel: process.env.BROWSER_CHANNEL || "chrome" }),
  headless: true,
});
try {
  const page = await browser.newPage();
  const demos = [
    ["quantum/index.html", "Quantum"],
    ["velora/index.html", "Velora"],
    ["bistro/index.html", "Bistro Lumière"],
    ["pulse/dist/index.html", "PULSE"],
    ["nomad/index.html", "NOMAD"],
    ["admin-demo/index.html", "Admin Pro"],
  ];
  for (const [path, title] of demos) {
    const response = await page.goto(new URL(path, base).href, {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response.status(), 200, `Demo is served: ${path}`);
    assert.ok(
      (await page.title()).includes(title),
      `Original demo is served instead of portfolio fallback: ${path}`,
    );
    console.log(`PASS: original demo at /zenimyoucef/${path}`);
  }
  await page.goto(new URL("pulse/dist/index.html#/bmi", base).href, {
    waitUntil: "networkidle",
  });
  await expect(page.locator(".main-content")).toContainText("BMI");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".main-content")).toContainText("BMI");
  console.log("PASS: PULSE direct hash-route refresh.");
} finally {
  await browser.close();
}
