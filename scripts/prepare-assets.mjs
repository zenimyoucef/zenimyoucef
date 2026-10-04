import sharp from "sharp";

for (const width of [640, 1200]) {
  await sharp("docs/references/mountain-peak.jpg")
    .resize({ width })
    .webp({ quality: 84 })
    .toFile(`public/images/mountain-${width}.webp`);
}

const cover = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#F1EBDD"/><path d="M55 91H1145M55 563H1145" stroke="#B6AFA1"/><text x="55" y="63" fill="#11110F" font-family="Georgia,serif" font-size="28" letter-spacing="4">ZENIM<tspan fill="#E6502E">.</tspan></text><text x="55" y="208" fill="#11110F" font-family="Georgia,serif" font-size="70">Crafting digital</text><text x="55" y="288" fill="#11110F" font-family="Georgia,serif" font-size="70">products with</text><text x="55" y="368" fill="#11110F" font-family="Georgia,serif" font-size="70">code &amp;</text><text x="55" y="453" fill="#E6502E" font-style="italic" font-family="Georgia,serif" font-size="82">intention.</text><text x="55" y="599" fill="#625E55" font-family="Arial,sans-serif" font-size="14" letter-spacing="2">ZENIM YOUCEF / WEB DEVELOPER &amp; DESIGNER</text></svg>`,
);
const mountain = await sharp("docs/references/mountain-peak.jpg")
  .resize(380, 438, { fit: "cover", position: "centre" })
  .modulate({ saturation: 0.45 })
  .toBuffer();
await sharp(cover)
  .composite([{ input: mountain, left: 765, top: 110 }])
  .jpeg({ quality: 88 })
  .toFile("public/images/social-cover.jpg");
console.log("Prepared responsive mountain imagery and social cover.");
