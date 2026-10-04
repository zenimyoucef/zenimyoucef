import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const url = process.env.TEST_URL || "http://127.0.0.1:5174/zenimyoucef/";
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  const gallery = page.locator("#live-gallery");
  const track = gallery.locator(".gallery-track");
  await expect(gallery, "Live collection has horizontal browsing controls").toBeVisible();
  await expect(gallery.locator(".gallery-progress")).toHaveText("01 / 03");
  await expect(gallery.getByRole("button", { name: "Previous live project" })).toBeDisabled();
  const next = gallery.getByRole("button", { name: "Next live project" });
  await next.click();
  await expect(gallery.locator(".gallery-progress")).toHaveText("02 / 03");
  await expect(gallery.locator(".gallery-current-title")).toHaveText("TKI TEC");
  await next.click();
  await expect(gallery.locator(".gallery-current-title")).toHaveText("ACENDI DZ");
  await expect(next).toBeDisabled();
  await track.focus();
  await page.keyboard.press("Home");
  await expect(gallery.locator(".gallery-current-title")).toHaveText("AUREA Nails by Yasmine");
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator(".gallery-progress")).toHaveText("02 / 03");
  await page.keyboard.press("End");
  await expect(gallery.locator(".gallery-progress")).toHaveText("03 / 03");
  await page.keyboard.press("Home");
  const box = await track.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + 150);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .12, box.y + 150, { steps: 14 });
  await page.mouse.up();
  await expect(gallery.locator(".gallery-progress")).toHaveText("02 / 03");
  assert.equal(page.url(), url, "Dragging a linked screenshot does not open its site");
  await track.focus();
  await page.keyboard.press("Home");
  const details = gallery.locator('[data-project="aurea"] details');
  await expect(details).not.toHaveAttribute("open");
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(details).toContainText("WhatsApp");
  const archive = page.locator("#playground-gallery");
  await archive.scrollIntoViewIfNeeded();
  await expect(archive.locator('[data-status="experimental"]')).toHaveCount(7);
  await expect(archive.locator('[data-status="upcoming"]')).toHaveCount(2);
  const cards = archive.locator('[data-status="experimental"]');
  assert.deepEqual(await cards.locator("h3").allTextContents(), ["Velora","HZ Fashion","Bistro Lumière","Quantum","Nomad","PULSE","Admin Pro"]);
  const slugs = ["velora", "hz-fashion", "bistro", "quantum", "nomad", "pulse", "admin-demo"];
  for (let index = 0; index < slugs.length; index++) {
    const card = cards.nth(index);
    await expect(card.locator(".project-media")).toHaveAttribute("href", "/zenimyoucef/" + slugs[index] + "/");
    await expect(card.locator(".small-label").first()).toHaveText("Field study / " + String(index + 1).padStart(2, "0"));
    const img = card.locator("img");
    await img.evaluate(el => { el.loading = "eager"; });
    await img.evaluate(el => el.decode());
    const image = await img.evaluate(el => ({ position: getComputedStyle(el).objectPosition, fit: getComputedStyle(el).objectFit, source: el.currentSrc }));
    assert.equal(image.position, "50% 0%");
    assert.equal(image.fit, "cover");
    assert.ok(image.source.includes("-hero-"));
  }
  const partial = await archive.locator(".gallery-track").evaluate(track => {
    const right = track.getBoundingClientRect().right;
    return [...track.children].some(slide => { const box = slide.getBoundingClientRect(); return box.left < right - 2 && box.right > right + 2; });
  });
  assert.ok(partial, "Desktop keeps a partial next card visible");
  await archive.screenshot({ path: "artifacts/playground-updated-desktop.png" });
  await archive.getByRole("button", { name: "Next experiment" }).click();
  assert.ok(await archive.locator(".gallery-track").evaluate(el => el.scrollLeft > 0), "Playground controls reveal more entries");
  const archiveTrack = archive.locator(".gallery-track");
  await archiveTrack.focus();
  await page.keyboard.press("End");
  await expect(archive.getByRole("button", { name: "Next experiment" })).toBeDisabled();
  const archiveEnd = await archiveTrack.evaluate(el => el.scrollLeft);
  await archive.getByRole("button", { name: "Previous experiment" }).click();
  await expect.poll(() => archiveTrack.evaluate(el => el.scrollLeft)).toBeLessThan(archiveEnd - 20);
  await page.goto(url, { waitUntil: "networkidle" });
  const skip = page.getByRole("link", { name: "Skip to content" });
  assert.ok(await skip.evaluate(el => el.getBoundingClientRect().bottom <= 0), "Skip link stays off canvas in normal browsing");
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  assert.ok(await skip.evaluate(el => el.getBoundingClientRect().top >= 0), "Keyboard focus reveals skip link");
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const mobile = await context.newPage();
  await mobile.goto(url, { waitUntil: "networkidle" });
  const mobileTrack = mobile.locator("#live-gallery .gallery-track");
  await mobileTrack.scrollIntoViewIfNeeded();
  const touchBox = await mobileTrack.boundingBox();
  const cdp = await context.newCDPSession(mobile);
  const x = touchBox.x + touchBox.width * .85;
  const y = Math.max(100, touchBox.y + 140);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - i * 23, y }] });
    await mobile.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(mobile.locator("#live-gallery .gallery-progress")).toHaveText("02 / 03");
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Rails do not overflow the mobile document");
  const mobileArchive = mobile.locator("#playground-gallery");
  await mobileArchive.scrollIntoViewIfNeeded();
  const mobilePartial = await mobileArchive.locator(".gallery-track").evaluate(track => {
    const right = track.getBoundingClientRect().right;
    return [...track.children].some(slide => { const box = slide.getBoundingClientRect(); return box.left < right - 2 && box.right > right + 2; });
  });
  assert.ok(mobilePartial, "Mobile keeps a partial next card visible");
  await mobileArchive.screenshot({ path: "artifacts/playground-updated-mobile.png" });
  const playgroundTrack = mobileArchive.locator(".gallery-track");
  const playgroundBox = await playgroundTrack.boundingBox();
  const px = playgroundBox.x + playgroundBox.width * .85;
  const py = Math.max(100, playgroundBox.y + 140);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: px, y: py }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: px - i * 23, y: py }] });
    await mobile.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(mobileArchive.locator(".gallery-progress")).toHaveText("02 / 09");
  await context.close();
  console.log("PASS: gallery arrows, order, boundaries, keyboard, mouse drag, touch swipe, details and skip-link focus.");
} finally {
  await browser.close();
}
