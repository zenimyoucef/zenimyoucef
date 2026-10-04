import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const url = process.env.TEST_URL || "http://127.0.0.1:5173/zenimyoucef/";
const menuOnly = process.argv.includes("--menu-only");
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  ...(process.env.BROWSER_CHANNEL === "chromium"
    ? {}
    : { channel: process.env.BROWSER_CHANNEL || "chrome" }),
  headless: true,
});
const report = {
  widths: [],
  menu: {},
  accessibility: [],
  consoleErrors: [],
  failedAssets: [],
};

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") report.consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      response.url().startsWith(new URL(url).origin)
    )
      report.failedAssets.push({
        url: response.url(),
        status: response.status(),
      });
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const open = page.getByRole("button", { name: "Open menu" });
  await expect(open).toBeVisible();
  await open.click();
  const menu = page.getByRole("dialog", { name: "Navigation" });
  await expect(menu).toBeVisible({ timeout: 2000 });
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
    "Open menu locks background scrolling",
  );
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => !!document.activeElement.closest("dialog")),
    true,
    "Backwards tab stays within the menu",
  );
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await page.evaluate(() => !!document.activeElement.closest("dialog")),
      true,
      "Tab stays within the menu",
    );
  }
  const menuAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    menuAxe.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
    ),
    [],
    "Open menu has no automated WCAG violations",
  );
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(open).toBeFocused();
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "",
    "Escape restores scrolling",
  );
  await open.click();
  await menu.getByRole("link", { name: /03.*Playground/ }).click();
  await expect(menu).not.toBeVisible();
  await expect(page.locator("#playground-heading")).toBeFocused();
  assert.equal(new URL(page.url()).hash, "#playground");
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "",
    "Navigation restores scrolling",
  );
  await open.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(menu).not.toBeVisible();
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "",
    "Desktop resize closes the menu and restores scrolling",
  );
  report.menu = {
    keyboard: "pass",
    focusTrap: "pass",
    escape: "pass",
    anchorNavigation: "pass",
    scrollLock: "pass",
    resize: "pass",
    accessibility: "pass",
  };
  console.log(
    "PASS: menu keyboard, focus, Escape, anchor navigation, scroll lock, desktop resize and accessibility.",
  );
  if (!menuOnly) {
    for (const width of [375, 390, 430, 768, 1024, 1280, 1440, 1728]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      assert.equal(await page.locator('#work [data-status="live"]').count(), 3);
      assert.equal(
        await page.locator('#playground [data-status="experimental"]').count(),
        6,
      );
      assert.equal(
        await page.locator('#playground [data-status="live"]').count(),
        0,
      );
      for (const id of ["work", "playground", "about", "process", "contact"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(50);
      }
      // Browse every rail item before checking lazily loaded screenshots.
      for (const rail of await page.locator('.gallery-track').all()) {
        await rail.scrollIntoViewIfNeeded();
        for (const slide of await rail.locator('.gallery-slide').all()) {
          await slide.evaluate(el => el.parentElement.scrollTo({ left: el.offsetLeft, behavior: 'instant' }));
          await page.waitForTimeout(70);
        }
        await rail.evaluate(el => el.scrollTo({ left: 0, behavior: 'instant' }));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      assert.ok(
        dimensions.document <= dimensions.viewport + 1,
        `No horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`,
      );
      await page.evaluate(async () =>
        Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        ),
      );
      const broken = await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.src),
        );
      assert.deepEqual(broken, [], `All images load at ${width}px`);
      const animations = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      );
      assert.equal(
        animations,
        0,
        "Reduced-motion mode has no running animations",
      );
      await page.screenshot({
        path: `artifacts/portfolio-${width}.png`,
        fullPage: true,
      });
      if ([390, 768, 1440].includes(width)) {
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        report.accessibility.push({ width, violations: axe.violations });
        assert.deepEqual(
          axe.violations.map(
            (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
          ),
          [],
          `No automated WCAG violations at ${width}px`,
        );
      }
      report.widths.push({
        width,
        overflow: "none",
        images: "loaded",
        reducedMotion: "pass",
      });
      console.log(
        `PASS: ${width}px, no overflow, all images loaded, correct project categories, reduced motion.`,
      );
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle" });
    const toolkit = page.locator(".tools-section");
    await toolkit.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(toolkit).toHaveAttribute("open", "");
    await expect(toolkit.locator(".tools-grid")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(toolkit).not.toHaveAttribute("open");
    assert.equal(await page.locator(".tech-list li").count(), 8);
    await expect(
      page.locator(".tech-list li").filter({ hasText: "Next.js" }),
    ).toContainText("learning");
    await page.getByRole("link", { name: "View my work" }).click();
    assert.equal(new URL(page.url()).hash, "#work");
    await expect(page.locator(".project-feature").first()).toBeInViewport();
    await page.locator(".back-to-top").click();
    assert.equal(new URL(page.url()).hash, "#top");
    await expect(page.locator(".site-header")).toBeInViewport();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://zenimyoucef.github.io/zenimyoucef/",
    );
    await expect(page.locator("a.feature-cta").first()).toHaveAttribute(
      "href",
      "https://aureanails.vercel.app/",
    );
    assert.ok(
      (await page.locator("title").textContent()).includes("Zenim Youcef"),
    );
    const links = await page
      .locator("#playground .project-media")
      .evaluateAll((links) => links.map((link) => link.href));
    assert.equal(
      new Set(links).size,
      6,
      "All demos have distinct preserved URLs",
    );
    assert.ok(
      links.every((link) =>
        link.startsWith("https://zenimyoucef.github.io/zenimyoucef/"),
      ),
    );
    // Crawlable content remains available with JavaScript disabled.
    if (process.env.STATIC_BUILD === "1") {
      const staticPage = await browser.newPage({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      await staticPage.goto(url, { waitUntil: "networkidle" });
      await expect(
        staticPage.getByRole("heading", { name: /Crafting/ }),
      ).toBeVisible();
      assert.equal(
        await staticPage.locator('[data-status="experimental"]').count(),
        6,
      );
      await expect(staticPage.locator(".mobile-fallback-nav")).toBeVisible();
      await expect(
        staticPage.getByRole("button", { name: "Open menu" }),
      ).not.toBeVisible();
      await staticPage.close();
      const html = await readFile("dist/index.html", "utf8");
      assert.ok(
        html.includes("Bistro Lumière") && html.includes("Admin Pro"),
        "Production HTML includes all project content",
      );
    }
    assert.deepEqual(report.consoleErrors, [], "No uncaught browser errors");
    assert.deepEqual(report.failedAssets, [], "No failed local asset requests");
    console.log(
      "PASS: anchors, metadata, real demo URLs, browser errors and assets.",
    );
    // Verify the ordinary motion path as well as the reduced-motion path.
    const animatedContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: "no-preference",
    });
    const animatedPage = await animatedContext.newPage();
    await animatedPage.goto(url, { waitUntil: "networkidle" });
    await animatedPage.waitForTimeout(1100);
    assert.equal(
      await animatedPage
        .locator(".hero-title")
        .evaluate((element) => getComputedStyle(element).opacity),
      "1",
    );
    const print = animatedPage.locator(".featured-media").first();
    await print.scrollIntoViewIfNeeded();
    const printBounds = await print.boundingBox();
    await animatedPage.mouse.move(
      printBounds.x + printBounds.width * 0.8,
      printBounds.y + printBounds.height * 0.6,
    );
    const movement = await print.evaluate((element) => ({
      x: parseFloat(element.style.getPropertyValue("--pointer-x")),
      y: parseFloat(element.style.getPropertyValue("--pointer-y")),
      scale: element.style.getPropertyValue("--pointer-scale"),
    }));
    assert.ok(Math.abs(movement.x) <= 3.5 && Math.abs(movement.y) <= 3.5);
    assert.equal(
      movement.scale,
      "1.015",
      "Fine pointer gently moves the print",
    );
    await animatedPage.locator("#about").scrollIntoViewIfNeeded();
    await expect(animatedPage.locator(".about-intro")).not.toHaveClass(
      /reveal-pending/,
    );
    await animatedPage.locator("#contact").scrollIntoViewIfNeeded();
    await expect(animatedPage.locator(".contact-composition")).not.toHaveClass(
      /reveal-pending/,
    );
    await animatedPage.emulateMedia({ reducedMotion: "reduce" });
    await expect(animatedPage.locator(".reveal-pending")).toHaveCount(0);
    await expect(print).not.toHaveAttribute("style");
    assert.equal(
      await animatedPage
        .locator(".mountain-print")
        .evaluate((element) =>
          element.style.getPropertyValue("--mountain-shift"),
        ),
      "",
    );
    await animatedContext.close();
    const touchContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      reducedMotion: "no-preference",
    });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(url, { waitUntil: "networkidle" });
    await touchPage.locator(".featured-media").first().scrollIntoViewIfNeeded();
    await expect(touchPage.locator(".featured-media").first()).not.toHaveAttribute(
      "style",
    );
    assert.equal(
      await touchPage
        .locator(".mountain-print")
        .evaluate((element) =>
          element.style.getPropertyValue("--mountain-shift"),
        ),
      "",
    );
    await touchContext.close();
    console.log(
      "PASS: ordinary scroll reveals and live reduced-motion preference changes.",
    );
  }
} finally {
  await writeFile(
    "artifacts/verification.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
