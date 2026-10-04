# Verification — 2026-10-04

Verified locally against the production build served at `http://127.0.0.1:4173/zenimyoucef/`.

## Build and deployment paths

`npm run build` succeeds and prerenders the complete document into `dist/index.html`. `npm run check:build` passes: all portfolio asset/font paths use `/zenimyoucef/`, and all 12 legacy demo files are copied unchanged into the build. `npm run test:deployment` serves all six original demos at their existing paths and successfully refreshes PULSE's `#/bmi` route.

The GitHub Pages workflow is prepared using the official configure/upload/deploy actions. No remote push or live deployment was performed; this workspace did not contain a Git checkout or configured remote.

## Browser and responsive verification

Playwright / headless Google Chrome passes at **375, 390, 430, 768, 1024, 1280, 1440 and 1728px**:

- No horizontal overflow; all portfolio images load.
- Exactly one production project and six experiments; original demo URLs preserved.
- Keyboard skip link focuses the main content.
- Full-screen mobile menu: focus containment, Escape, focus restoration, section-heading focus after navigation, scroll lock and restoration, desktop resize cleanup.
- All anchor links tested, including view-work and back-to-top.
- Reduced-motion mode runs no animations. Ordinary scroll reveals work, and changing the motion preference reveals any pending content.
- Production content and mobile navigation remain available without JavaScript; the inactive menu trigger is hidden in that mode.
- No uncaught errors, console errors, or failed local asset requests in the portfolio.

Automated axe checks for WCAG A/AA through WCAG 2.2 report **zero violations** at 390, 768 and 1440px, and with the mobile dialog open. This is automated coverage, not a claim of exhaustive accessibility certification. Desktop/mobile section screenshots were also visually inspected.

Raw reports and screenshots are in the ignored `artifacts/` directory; `artifacts/verification.json` contains the browser results.

## Lighthouse and assets

Local mobile Lighthouse, simulated throttling:

| Metric | Before image optimization | After image optimization |
| --- | --- | --- |
| Performance | 90 | 97 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest contentful paint | 3.4s | 2.4s |
| Total blocking time | 60ms | 0ms |
| Cumulative layout shift | 0 | 0 |

Three responsive image sizes, AVIF with WebP fallback, locally hosted WOFF2 fonts, no third-party runtime requests on the homepage, and a roughly **76KB gzip JavaScript / 6KB gzip CSS** production bundle. The old demo scripts are separate static files and are not included in the homepage bundle.

Lighthouse scores are local measurements and can vary with device, hosting and network conditions. Reports: `artifacts/lighthouse-mobile.json`, `artifacts/lighthouse-mobile-final.json`.

`npm audit` reports **zero known vulnerabilities** in the installed portfolio dependencies. Original archived demos retain their original dependencies and behavior.

## Source integrity correction

The old portfolio described Admin Pro as using Chart.js with editable products. The actual public demo labels itself a visual showcase and draws charts using the canvas API. The new project copy follows that implementation: a bilingual visual dashboard demo with native canvas charts, without product-editing claims.

## Field journal refinement

The second art-direction pass preserves the page structure, palette, typography families and verified project content. It adds an overlapping mountain plate, a single paper disc, a non-tiled grain surface, three sparse Caveat annotations, differently proportioned playground images, an editorial process list, a larger About statement and a small mountain fragment in the contact section. The TKI frame has a one-pixel border and no shadow.

The production browser suite passes at all eight widths listed above. New interaction checks confirm that fine-pointer print motion stays within 3.5px per axis with 1.015 scale, clears when reduced motion is enabled, and stays disabled on touch devices. The menu and automated accessibility checks still pass. All six original demos and PULSE route refresh pass again.

The refined mobile Lighthouse run scores **97 performance / 100 accessibility / 100 best practices / 100 SEO**, with **2.5s LCP, 10ms TBT and 0 CLS**. Report: `artifacts/lighthouse-refinement.json`. The added local annotation font is a 21KB character subset with its OFL license; the homepage still makes no third-party runtime requests. The refined bundle is about **76KB gzip JavaScript / 8KB gzip CSS**.

## Cinematic references — current implementation

The user supplied desktop and mobile cinematic portfolio references and explicitly selected an anonymous generated figure. The current version uses separate generated collage and paper assets, fully live HTML text and controls, a dark technology strip, compact desktop project and reflection spreads, and a dedicated mobile collage crop. Real URLs, production status and technology facts remain intact. Next.js is marked as learning. The working toolkit remains available through a native keyboard-accessible disclosure. PULSE's screenshot is its actual calculator screen with illustrative sample inputs, not personal measurements.

Production build and static-path checks pass, including all eight local technology logos and all responsive collage variants. The final browser suite passes at 375, 390, 430, 768, 1024, 1280, 1440 and 1728px. It additionally verifies the toolkit's keyboard disclosure, eight technology entries, and the learning label. Existing menu, touch, reduced-motion, pointer movement, automated accessibility, no-JavaScript and browser-error checks pass. All six legacy demos and the direct PULSE route refresh pass.

The latest local mobile Lighthouse run scores **92 performance / 100 accessibility / 100 best practices / 100 SEO**, with **3.1s LCP, 50ms TBT and 0 CLS**. This supersedes the preceding design's performance measurement. Report: `artifacts/lighthouse-cinematic-final.json`. The AVIF paper texture is 11KB; the homepage bundle is approximately **77KB gzip JavaScript / 10KB gzip CSS**. Responsive source artwork is in `docs/references/`, optimized assets in `public/images/`, and reviewed screenshots in `artifacts/review/`.
