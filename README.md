# Zenim Youcef — Editorial field journal

A rebuilt portfolio with warm paper, editorial typography, mountain photography and open magazine compositions. React + Vite, local responsive AVIF imagery with WebP fallback and WOFF2 fonts, native CSS motion, static prerendering, and a single anchor-navigated page.

## Run locally

Requires Node.js 22.12+ or 24.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/zenimyoucef/`. In Windows PowerShell where script execution is restricted, use `npm.cmd` instead of `npm`.

```sh
npm run build
npm run check:build
npm run preview
```

The production preview is at `http://localhost:4173/zenimyoucef/`. Vite's base is configured in `vite.config.js`. The build prerenders all content into `dist/index.html`, then the browser hydrates it. Content and links remain readable without JavaScript; the mobile menu has a no-JavaScript navigation fallback.

## Content and components

- `src/data/projects.js`: eight real projects, preserved URLs, production/experimental status, descriptions and screenshot metadata.
- `src/data/skills.js`: toolkit from the original portfolio. Next.js is identified as learning.
- `src/data/socialLinks.js`: WhatsApp, LinkedIn, GitHub and navigation links. No email address was published in the original.
- `src/components/`: masthead/menu, hero, project features/cards, about/tools, process, contact/footer and shared editorial elements.
- `src/hooks/useReveal.js`: small IntersectionObserver reveal system, with reduced-motion support.
- `src/hooks/usePrintMotion.js`: restrained desktop print motion, disabled for touch and reduced motion.
- `src/styles.css`: responsive composition, tokens, texture and motion.
- `src/cinematic.css`: the approved cinematic reference composition, compact spreads and mobile collage crop.
- `src/components/TechStrip.jsx`: locally hosted technology logos, with Next.js explicitly marked as learning.
- `src/data/techStack.js`: shared eight-tool list for the desktop and mobile stack strip.
- `src/refinements.css`: mobile first-screen hierarchy, prominent contact actions, and upcoming project cards.

### Adding projects

Add a record to `projects` in `src/data/projects.js` with a unique `id`, `title`, `category`, `description`, `stack`, `image`, `imageAlt`, `liveUrl`, and `status` (`live` or `experimental`). Use `featured: false` for secondary live projects; keep TKI TEC as the single `featured: true` flagship. Secondary live cards flow into their own responsive grid. A playground record can use `layout: "featured"` for a wide mobile card; other entries flow into the repeatable grid.

For screenshots, supply matching `public/images/<image>-640`, `-960`, and `-1280` AVIF and WebP files. Add or remove upcoming records in `upcomingProjects`, using `collection: "live"` or `"playground"`. Remove the corresponding upcoming record when its real project launches. Upcoming cards deliberately have no links or image requirements.

The mobile tech stack sits directly below the artwork, using the same dark background, colored logos and typography as desktop in a responsive two-row grid. Contact remains the primary hero action. Contact appears first in the mobile menu, and a fixed conversation shortcut opens the configured WhatsApp link. Update contact destinations in `src/data/socialLinks.js`; an email link can be added there when an address is provided.

TKI TEC is the flagship commercial project. ACENDI is the secondary featured institutional / economic organization website, linked to its Arabic homepage. One numbered upcoming live project follows. Quantum, Velora, Bistro Lumière, PULSE, Nomad and Admin Pro are explicitly experiments. The actual screenshots were captured from their public pages; their displayed demo data are not Zenim's business metrics.

The hero collage uses an anonymous generated figure as decorative artwork, as requested, rather than a portrait of Zenim. Source artwork lives in `docs/references/`; optimized responsive variants are in `public/images/`. Run `node scripts/prepare-cinematic.mjs` to regenerate the compressed assets. PULSE’s current screenshot shows its real BMI screen with illustrative sample inputs, captured with `node scripts/capture-pulse-detail.mjs` while the production preview runs.

## Preserve the original demos

`public/quantum`, `public/velora`, `public/bistro`, `public/nomad`, `public/admin-demo` and `public/pulse/dist` contain the original public demo files. Vite copies these unchanged into `dist`, preserving the existing URLs when GitHub Pages is rebuilt. Quantum/Velora admin pages and their buy-now scripts are included. PULSE retains its existing hash routing, so refreshing demo routes works on static hosting.

These archived demo applications keep their original styles, behavior and external assets. The new portfolio uses local images/fonts and does not load those applications until the visitor follows a demo link. The homepage redesign does not claim to audit or rewrite the old demos.

## Verification

The browser checks use Playwright and an installed Google Chrome:

```sh
npm test
npm run test:menu
npm run test:refinements
```

Keep the dev server running. To test production, start `npm run preview` and set `TEST_URL=http://127.0.0.1:4173/zenimyoucef/` and `STATIC_BUILD=1` before running `npm test`. To use Playwright's bundled Chromium instead of installed Chrome, set `BROWSER_CHANNEL=chromium` and install it with `npx playwright install chromium`.

Checks cover eight viewport widths, horizontal overflow, local image loading, category integrity, navigation, mobile focus containment/restoration, Escape, scroll lock, desktop resize, reduced motion, metadata, browser errors, automated WCAG checks, and no-JavaScript production content. Screenshots and JSON reports are written to ignored `artifacts/`.

`scripts/check-build.mjs` verifies prerendered HTML, deployed asset/font paths, and preservation of all legacy demo files. `scripts/review-screenshots.mjs` captures desktop/mobile sections. To refresh authentic public screenshots, run `node scripts/capture-projects.mjs` (requires network access), then `node scripts/optimize-images.mjs` to regenerate every AVIF/WebP variant.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds on `main` or manual dispatch and uploads `dist`. In the repository's Settings → Pages, choose **GitHub Actions** as the source. The workflow follows the [official GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Target URL: `https://zenimyoucef.github.io/zenimyoucef/`. Keep this repository name, or update `vite.config.js`, the canonical/social metadata, sitemap and project URLs for a different hosting path. No deployment has been pushed from this local workspace.

## Visual references and credits

The approved design and implementation plan live in `docs/superpowers/`. Individual design studies and their analysis are retained under `docs/references/`; generated storefront studies are layout references, not project screenshots.

Mountain photograph: [original Unsplash asset](https://images.unsplash.com/photo-1454496522488-7a8e488e8606). Cormorant Garamond and Manrope are hosted locally; see `public/fonts/LICENSES.md` for licensing.
