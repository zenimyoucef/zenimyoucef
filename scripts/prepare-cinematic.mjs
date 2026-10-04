import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
for (const width of [640, 1024, 1600]) {
  const image = sharp("docs/references/cinematic-collage.png").resize({
    width,
  });
  await image
    .clone()
    .avif({ quality: 58 })
    .toFile(`public/images/cinematic-${width}.avif`);
  await image
    .clone()
    .webp({ quality: 82 })
    .toFile(`public/images/cinematic-${width}.webp`);
}
await sharp("docs/references/paper-material.png")
  .resize(1200)
  .webp({ quality: 72 })
  .toFile("public/images/paper-material.webp");
await sharp("docs/references/paper-material.png").resize(960).avif({ quality: 40 }).toFile("public/images/paper-material.avif");
console.log("Prepared responsive cinematic collage and paper texture.");
