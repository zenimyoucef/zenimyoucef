# Editorial Portfolio Implementation Plan

> Execution: inline in this session, as explicitly requested by the user. No additional design approval gate.

**Goal:** Build Zenim Youcef's approved editorial field journal portfolio with real content and GitHub Pages support.

**Architecture:** React components render a single anchor-navigated document. Project and skill content live in data modules. Vite emits static assets under `/zenimyoucef/`; a postbuild render step produces crawlable HTML.

**Tech Stack:** React, Vite, native CSS, IntersectionObserver, Playwright verification, axe accessibility audit, Sharp responsive image processing.

## Global Constraints

- Preserve original demo and social URLs; only TKI TEC is live production.
- Warm ivory / charcoal / vermilion, editorial serif, mountain prints, subtle grain.
- Dedicated mobile composition, minimum 44px touch controls.
- Respect reduced motion, retain native scrolling, omit fabricated content.
- Local compressed responsive assets; no heavyweight motion dependency.

## Task 1: Recover content and establish references

- [x] Inspect empty workspace and retrieve the original portfolio and live storefront HTML.
- [x] Generate individual section references and mobile hero; inspect typography, spacing, colors, composition.
- [x] Capture actual screenshots of all projects and download mountain photography/fonts locally.
      Files: `docs/references/`, `public/images/`, `public/fonts/`, `docs/superpowers/specs/2026-10-04-portfolio-design.md`.

## Task 2: Build the publication

- [x] Configure package scripts and Vite `base: '/zenimyoucef/'`.
- [x] Create project/skills/social data and reusable components in `src/`.
- [x] Implement asymmetric hero, dominant live project, varied playground, about/tools, process, charcoal contact/footer.
- [x] Implement mobile composition and semantic metadata/static rendering.
      Files: `package.json`, `vite.config.js`, `index.html`, `src/App.jsx`, `src/components/`, `src/data/`, `src/styles.css`, `scripts/prerender.mjs`.

## Task 3: Interaction and motion

- [x] Write browser checks for closed/open dialog state, focus containment, Escape, link-close, and scroll-lock behavior before implementing the menu.
- [x] Run checks and confirm the missing behavior fails, then implement the menu and repeat.
- [x] Add entrance/reveal motion, pointer interactions only for fine pointers, reduced-motion fallback.
      Files: `tests/browser.mjs`, `src/components/Navigation.jsx`, `src/hooks/useReveal.js`.

## Task 4: Verification and delivery

- [x] Build and serve the production document at `/zenimyoucef/`.
- [x] Test all eight target widths for horizontal overflow and image failures.
- [x] Verify anchor navigation, mobile dialog, reduced motion, project status/links, metadata.
- [x] Run axe and inspect desktop/mobile screenshots; correct findings.
- [x] Add GitHub Pages workflow, README, and verification notes.
      Files: `.github/workflows/deploy.yml`, `README.md`, `docs/verification.md`, `tests/`, `artifacts/`.
