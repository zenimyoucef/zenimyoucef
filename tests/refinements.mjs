import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932]]) {
    await page.setViewportSize({ width, height });
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/zenimyoucef/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const stack = await page.locator('.tech-strip').boundingBox();
    const art = await page.locator('.hero-art').boundingBox();
    assert.ok(stack && art && stack.y >= art.y + art.height - 1, `Stack below artwork at ${width}px`);
    assert.equal(await page.locator('.tech-strip').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(23, 25, 23)');
    const contact = await page.locator('.hero-actions .button-primary').getAttribute('href');
    assert.equal(contact, '#contact');
    assert.equal(await page.locator('.tech-list li').count(), 8);
    assert.equal(await page.locator('#work [data-status="live"]').count(), 3);
    assert.deepEqual(await page.locator('#work [data-status="live"] h3').allTextContents(), ['AUREA Nails by Yasmine', 'TKI TEC', 'ACENDI DZ']);
    assert.equal(await page.locator('#work .feature-cta').first().getAttribute('href'), 'https://aureanails.vercel.app/');
    assert.equal(await page.locator('#work [data-status="upcoming"]').count(), 1);
    assert.deepEqual(await page.locator('#work .feature-cta').evaluateAll(links => links.map(link => link.getAttribute('href'))), ['https://aureanails.vercel.app/', 'https://tkitec.store/', 'https://acendi-dz.vercel.app/ar']);
    const liveEntries = await page.locator('#work [data-status="live"]').evaluateAll(entries => entries.map(entry => { const box = entry.getBoundingClientRect(); const image = entry.querySelector('img'); return { top: box.top, left: box.left, imageWidth: image.getBoundingClientRect().width }; }));
    const railWidth = await page.locator('#live-gallery .gallery-track').evaluate(el => el.clientWidth);
    assert.ok(liveEntries.every(entry => entry.imageWidth >= railWidth * .8), `Images fill the mobile rail at ${width}px`);
    assert.ok(liveEntries.slice(1).every((entry, index) => Math.abs(entry.top - liveEntries[0].top) < 2 && entry.left > liveEntries[index].left), 'Live projects continue horizontally in order');
    assert.equal(await page.locator('#playground [data-status="upcoming"]').count(), 2);
    assert.equal(await page.locator('[data-status="upcoming"] a').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  console.log('PASS: mobile stack below artwork with desktop styling/contact, upcoming cards and overflow.');
} finally {
  await browser.close();
}
