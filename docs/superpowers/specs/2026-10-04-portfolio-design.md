# Zenim Youcef — Editorial field journal

Approved by the user on 2026-10-04, with explicit authorization to implement without further design gates.

## Identity

Warm paper `#F1EBDD`, darker paper `#EAE2D3`, ink `#11110F`, charcoal `#1B1B18`, vermilion `#E6502E`, muted blue-grey photographic fields. Cormorant Garamond for editorial display, Manrope for body and navigation. Fine rules, subtle SVG grain, orange italic annotations, and a mountain print establish the field journal motif. No invented portrait or biography.

## Composition

Desktop hero is asymmetric: large four-line serif statement left, mountain print right, quiet navigation above. Mobile uses its own four-line type composition, full-width primary action, secondary text action, then a landscape print. Main sections follow the publication index: intro, live work, playground, about/tools, process, contact. TKI TEC has a dominant screenshot feature. The six experiments have alternating wide/narrow media and visible descriptions/links; on mobile each occupies the content width. Process is horizontal on desktop, vertical on mobile. Contact reverses to charcoal.

## Content integrity

Original public HTML is retained in `docs/references/original-portfolio.html`. TKI TEC is the only production project. Quantum, Velora, Bistro Lumière, PULSE, Nomad, Admin Pro are experiments. Use their existing GitHub Pages URLs, not new local copies. Social links: `https://www.linkedin.com/in/zenim-youcef`, `https://wa.me/213540753528`. No published email was found. GitHub profile is derived from the supplied hosting account. Next.js is explicitly learning. No fictional results, clients, metrics, or case studies.

## Architecture and deployment

React/Vite single document with anchor navigation and reusable content-driven components. Local optimized responsive project screenshots, local fonts and mountain photography. Static build base `/zenimyoucef/`. Prerender the document at build time for crawlable content and hydrate on the client. GitHub Pages workflow uploads `dist`; no client-side routes to break refresh.

## Interaction and verification

Accessible native dialog mobile menu: escape, focus containment, restored trigger focus, locked background scrolling. Restrained masked page entrance, IntersectionObserver reveals, desktop image drift and arrow movement. No continuous canvas or scroll hijacking; reduced motion disables decorative transforms. Test mobile menu, anchors, image loading, project categories, reduced motion, and horizontal overflow at 375, 390, 430, 768, 1024, 1280, 1440, 1728px. Verify production assets under the base path. Run accessibility audit and inspect desktop/mobile screenshots.
