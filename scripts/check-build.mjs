import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const html = await readFile("dist/index.html", "utf8");
assert.ok(
  html.includes("Crafting") &&
    html.includes("Bistro Lumière") &&
    html.includes("Admin Pro"),
  "Complete portfolio is prerendered",
);
assert.equal((html.match(/<h1\b/g) || []).length, 1, "Only one main heading");
assert.ok(
  html.includes("https://zenimyoucef.github.io/zenimyoucef/"),
  "Canonical deployed URL is present",
);
for (const reference of [
  ...html.matchAll(/(?:src|href)="(\/zenimyoucef\/[^"?#]+)"/g),
]) {
  await access(`dist/${reference[1].replace("/zenimyoucef/", "")}`);
}
const preserved = [
  "quantum/index.html",
  "quantum/admin.html",
  "quantum/buynow.js",
  "velora/index.html",
  "velora/admin.html",
  "velora/buynow.js",
  "bistro/index.html",
  "nomad/index.html",
  "admin-demo/index.html",
  "pulse/dist/index.html",
  "pulse/dist/assets/index-9iMo3Kl5.js",
  "pulse/dist/assets/index-DPoCl0--.css",
];
for (const path of preserved) {
  const source = await readFile(`public/${path}`);
  const deployed = await readFile(`dist/${path}`);
  assert.ok(
    source.equals(deployed),
    `Legacy demo is preserved byte-for-byte: ${path}`,
  );
}
const cssFile = [
  ...html.matchAll(/href="(\/zenimyoucef\/assets\/[^" ]+\.css)"/g),
][0]?.[1];
assert.ok(cssFile, "Production stylesheet exists");
const css = await readFile(
  `dist/${cssFile.replace("/zenimyoucef/", "")}`,
  "utf8",
);
for (const font of ["cormorant-roman", "cormorant-italic", "manrope"]) {
  assert.ok(
    css.includes(`/zenimyoucef/fonts/${font}.woff2`),
    `Font uses correct base path: ${font}`,
  );
}
assert.ok(css.includes("/zenimyoucef/fonts/caveat-notes.ttf"));
await access("dist/fonts/caveat-notes.ttf");
await access("dist/fonts/Caveat-OFL.txt");
for (const icon of [
  "javascript",
  "typescript",
  "react",
  "nextdotjs",
  "nodedotjs",
  "express",
  "python",
  "openapiinitiative",
]) {
  await access(`dist/icons/${icon}.svg`);
}
for (const width of [640, 1024, 1600]) {
  await access(`dist/images/cinematic-${width}.avif`);
  await access(`dist/images/cinematic-${width}.webp`);
}
assert.ok(css.includes("/zenimyoucef/images/paper-material.webp"));
console.log(
  "PASS: prerendered content, base-path assets, local fonts, and all 12 preserved demo files.",
);
