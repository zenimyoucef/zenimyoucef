# Project galleries implementation plan

**Goal:** Replace the split, stacked project presentation with two curated horizontal collections while retaining the approved field-journal identity.

**Architecture:** A reusable ProjectGallery owns native scroll snap, active position, arrow/keyboard navigation and mouse drag. Projects renders compact live slides and modular experiment cards; native details retains deeper content. Data determines ordering, metadata and future additions.

**Tech stack:** Existing React, CSS, Vite and Playwright; no new dependencies.

## Constraints

- Preserve warm ivory, charcoal, vermilion, serif typography, paper texture and collage artwork.
- Live order: AUREA, TKI TEC, ACENDI DZ. Preserve all six experiments and future placeholders.
- Each section occupies the project spread's full width. Mobile uses horizontal browsing too.
- Keep contact controls and external URLs; hide skip link except keyboard focus.
- Honor reduced motion, support keyboard navigation, retain accessible native scrolling without JavaScript.

## Implementation

1. Add `tests/galleries.mjs`: exercise live arrows/order/boundaries, keyboard navigation, mouse dragging, touch swipe, expansion and skip-link focus. Run against current implementation to confirm absent gallery behavior fails.
2. Add `src/components/ProjectGallery.jsx`: reusable scroll container, progress and controls; nearest-slide tracking, ResizeObserver, fine-pointer dragging with click suppression after a drag, native touch scrolling, keyboard navigation and reduced-motion-aware programmatic scroll.
3. Refactor `src/components/Projects.jsx`: shared gallery consumers; concise live summaries, optional native detail expansion, all six modular experiment cards and upcoming entries. Keep existing link and image helpers.
4. Refine `src/data/projects.js`: explicit experiment ordering and per-project visual tone/summary. Sort collections by order. Update image sizes in `Editorial.jsx` to match the new full-width layout.
5. Add `src/project-galleries.css`: full-width sections, partial neighboring slide, project-specific framing, consistent modular rail with tasteful crops, mobile one-card view and focus-only skip link. Remove obsolete refinement rules for stacked projects.
6. Update existing browser/refinement tests for the new navigation and layout contract. Run gallery tests, existing browser suite, build and build asset checks; inspect desktop/mobile screenshots.

No commit step: this workspace has no Git repository. Execute inline within the user's authorized refinement request.
