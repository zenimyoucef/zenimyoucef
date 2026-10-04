import sharp from "sharp";

const names = [
  "aurea",
  "acendi",
  "tkitec",
  "quantum",
  "velora",
  "bistro",
  "pulse",
  "nomad",
  "admin",
];
for (const name of names) {
  for (const width of [640, 960, 1280]) {
    const image = sharp(`docs/references/screenshots/${name}.png`).resize({
      width,
    });
    await Promise.all([
      image
        .clone()
        .webp({ quality: 80 })
        .toFile(`public/images/${name}-${width}.webp`),
      image
        .clone()
        .avif({ quality: 55, effort: 4 })
        .toFile(`public/images/${name}-${width}.avif`),
    ]);
  }
}
for (const width of [640, 960, 1200]) {
  const image = sharp("docs/references/mountain-peak.jpg").resize({ width });
  await Promise.all([
    image
      .clone()
      .webp({ quality: 80 })
      .toFile(`public/images/mountain-${width}.webp`),
    image
      .clone()
      .avif({ quality: 55, effort: 4 })
      .toFile(`public/images/mountain-${width}.avif`),
  ]);
}
console.log(
  "Optimized three responsive sizes per image, AVIF with WebP fallback.",
);
