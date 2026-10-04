import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const name of ["quantum", "velora", "pulse"]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 950 },
  });
  const path =
    name === "pulse" ? "pulse/dist/index.html" : `${name}/index.html`;
  await page.goto(`https://zenimyoucef.github.io/zenimyoucef/${path}`, {
    waitUntil: "networkidle",
  });
  console.log(
    name,
    JSON.stringify(
      await page.evaluate(() => ({
        sections: [...document.querySelectorAll("section")].map((section) => ({
          id: section.id,
          class: section.className,
          heading: section.querySelector("h1,h2")?.textContent,
          top: section.getBoundingClientRect().top,
        })),
        buttons: [...document.querySelectorAll("button")]
          .slice(0, 14)
          .map((button) => ({
            text: button.textContent.trim(),
            label: button.getAttribute("aria-label"),
            class: button.className,
          })),
        images: [...document.images]
          .slice(0, 8)
          .map((image) => ({ src: image.src, loaded: image.naturalWidth })),
      })),
      null,
      2,
    ),
  );
  await page.close();
}
await browser.close();
