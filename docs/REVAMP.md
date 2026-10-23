# CARTUNEZ showroom revamp

The full homepage was rebuilt around distinct scenes instead of repeated left-copy/right-card chapters. Inter, the supplied logo, the supplied BMW model, the Pioneer preview and the aligned cabin images are retained.

## Design system

- Near-black `#0A0A0B`, warm paper `#E9E7E1`, muted blue-grey metadata. Action red `#D32338` keeps white button copy readable; cyan stays in the supplied logo and product previews.
- Inter is the only typeface. Headings use 550–750 weights, tight tracking and deliberate line breaks. Display sizes scale from roughly 32px on phones to 192px on desktop. Functional copy is 12–16px; smaller scene annotations remain secondary.
- Gutters: `clamp(22px, 5vw, 100px)`. Section spacing: 55–110px. Major controls have at least 44px target height; the expanded receiver is the primary touch interface.
- Entrances: 0.9–1.2s, `power3.out` / `expo.out`, 0.08–0.12s stagger. Scrub smoothing: 0.4–1.0. Transform and opacity are the principal animated properties.

## Narrative and interactions

1. BMW hero: oversized solid/outline Inter, genuine 3D camera dolly/orbit, restrained studio background, visible scroll cue and explicit WhatsApp action.
2. Editorial statement and a paper-coloured four-part upgrade directory.
3. Full-bleed interior scene with a three-detail selector. It reframes the same concept and changes explanatory copy; it does not pretend to change material specifications.
4. Cabin studio: actual separate standard/custom matting concepts, blue/red/amber lighting, intensity, off/on and contextual enquiry.
5. Full-width exterior stage: orbit plus front/profile/rear controls and projected part labels. This is a BMW design study, not a transformation of the visitor's car.
6. Larger Pioneer product stage with direct navigation/music/settings entry points. Expanded preview behavior, real music/EQ and labelled simulations are retained.
7. Performance/utility: scroll-driven RPM instrument labelled a design study, and four product illustrations with vehicle-fit enquiries. No unverified horsepower, speed or installation claims.
8. Horizontal design gallery with arrow and native touch/keyboard scrolling. Generated concepts are disclosed; the former filter-only before/after gallery is removed.
9. Practical fit/installation/options guidance, a three-step consultation process, full-screen closing action and contrasting oversized footer.
10. The enquiry route follows the same system and adds an optional budget direction to the prepared WhatsApp brief.

## Motion and tuning

`src/hooks/useScrollDirector.ts` owns scene choreography. Only hero and exterior are pinned on desktop (65% and 95% extra viewport distance). Phones use native vertical flow without pinned scenes. The cabin and receiver controls remain in normal flow. Reduced motion preserves content and interactions, skips WebGL and scene motion, and uses the BMW poster.

`src/components/GarageWorld.tsx` retains one renderer/model shared between hero, body and closing mounts. It renders on changes and settles when idle. Hero camera distance is 6.0 on narrow phones; pixel ratio is capped at 1 on small screens, and 1.5 elsewhere, with an adaptive fallback. Camera values, scene distances and easing are commented where they can be tuned.

`src/app/revamp.css` owns the new composition and responsive system. Existing base styles still support the shared menu, form, modal, cursor, route curtain and product controls. `InfotainmentDemo` accepts a typed request prop so the product-stage buttons can open the relevant app without autoplaying sound.

## Verification and limits

Production build and TypeScript pass. Browser review covers the 1280px desktop composition and a 390×844 phone viewport, menu navigation, camera selection, interior detail changes, direct receiver app entry, gallery movement, and the complete budget/category/visit WhatsApp URL. The form prepares a message; the visitor reviews and sends it in WhatsApp. No server stores the brief.

Lighthouse, mobile 4G LCP and physical Android/iOS frame rates have not been measured. Actual receiver firmware, live GPS, hardware pairing and phone integration are not implemented by this website. Address, city, Maps location and social links still require verified business information in `src/lib/site.ts`.

## Production assets and later details

Replace labelled generated concepts with locked-camera customer installation photographs: 1800×1200 or larger for matting/light comparisons; 2000px-wide landscape interior/exterior photography for scenes; same framing/exposure for every comparison variant. Keep the current original files as provenance. See `ASSETS.md` and `CABIN-STUDIO.md` for paths and dimensions.

Possible later additions: real workshop process footage on explicit play; manufacturer-approved model-specific receiver skins; a curated customer build journal using verified install photography and upgrade lists. Each should add product understanding before adding animation weight.
