# Interactive infotainment — current checks

See INFOTAINMENT.md for the complete app-by-app evidence and boundaries. Production build, browser media playback/seek, saved settings, maps URL, pairing/call simulations, modal focus trapping/return, cleanup and the 390×844 layout have been exercised. Native Bluetooth/calls/GPS are deliberately simulated or handed off; no hardware integration is claimed.

# Current Inter / BMW verification

- Production build and TypeScript compilation pass. Dependency installation audit reports zero known vulnerabilities.
- Computed browser font is Inter for body, headline, buttons, navigation and enquiry h1/input/textarea/labels.
- BMW loads through the actual WebGL renderer. Front/profile/rear controls select the correct camera targets; Scroll orbit resumes progress-driven motion.
- Body camera progress changed from 0.215 to 0.579 during a real scroll and the visible vehicle view changed.
- Reduced mode has zero canvases and zero pin spacers, with matching BMW poster and readable content. Re-enabling Full mounts the renderer.
- Menu focus moves to its first chapter and Escape restores navigation. Enquiry route loads and tears down the homepage canvas/pins. Form fields and native category checkbox work.
- No horizontal page overflow at the inspected 1280px viewport. Phone composition inspected at 390×844 through a browser frame.
- The 13MB source model is preserved; the browser version is 853,488 bytes. Its matching fallback poster is 26,742 bytes.
- User confirmed separate commercial-use permission for the supplied BMW; embedded attribution retained.
- Physical Android fps, mobile Lighthouse, and 4G LCP remain unmeasured. No score or 60fps guarantee is claimed.

## Earlier verification history

# Verification

## Previous Ferrari rebuild — historical checks

- Production build and TypeScript compilation pass with Three.js 0.186.1.
- Full mode runs while the browser reports prefers-reduced-motion: reduce, after explicit site-level selection.
- Real WebGL canvas loads the Draco vehicle. Scrolling changes the recorded camera angle and the visible view of the car.
- One canvas is reused between scenes. Five desktop pins and one phone hero pin are created.
- Body parts assemble, projected labels follow the scene, and Carmine red changes the live vehicle material.
- Switching to Reduced removes the canvas and all pin spacers; the full-experience hero action is visible. Switching back rebuilds the experience.
- A shadow blending error observed in visual QA was corrected by enabling premultiplied alpha.
- The Windows graphics driver may emit shader precision warnings; these are distinct from application runtime errors.
- The updated 3D experience, its controls and remaining physical-device performance limits are described in 3D-IMPLEMENTATION.md.

The following sections describe the original version and its initial checks. The original full-motion verification gap has now been exercised in the rebuilt experience.

## Visitor story

Explore the car customisation homepage → navigate the four categories → compare concept finishes → choose upgrades → prepare a WhatsApp brief addressed to +91 99496 95030. No database or API is required for this flow; the visitor reviews and sends the message in WhatsApp.

## Checked

- Next.js production build and TypeScript compilation pass.
- The installed dependency audit reports zero known vulnerabilities after updating Sharp.
- Homepage serves HTTP 200 and both routes render.
- Desktop 1440×1000 and phone 390×844 compositions inspected in browser previews.
- Headline wrapping was corrected for the wide Syne display face.
- No horizontal page overflow at the inspected live viewport.
- The browser reports `prefers-reduced-motion: reduce`; the static reading fallback is visibly complete, and no pin spacers are created in that mode.
- Interior material controls and comparison sliders use native keyboard-accessible controls.
- Comparison keyboard ArrowRight changes the range from 52 to 53.
- Gallery Next changes horizontal scroll position and reveals the next card.
- Menu opens as a labelled dialog, focuses its first link, hides underlying content from focus, closes on Escape and restores the toggle.
- Enquiry fields, multiple category selection and workshop-visit checkbox work.
- A sample brief produces a WhatsApp URL containing the supplied name, car, category, notes and visit request, addressed to `wa.me/919949695030`. No message was sent.
- Same-route navigation avoids leaving the curtain over the page; query changes use normal navigation to initialise the visit intent.
- A server/browser SVG floating-point hydration mismatch was corrected by rounding instrument geometry to three decimals.
- Responsive hero images, local fonts, lazy images, metadata, Open Graph image, sitemap, robots and LocalBusiness subtype JSON-LD are present.

## Limits and final launch checks

Full-motion runtime choreography was not exercised while the browser requested reduced motion. The code defines four desktop pin timelines and lighter mobile scrub reveals, and cleans them up through `gsap.matchMedia`. Inspect this mode with reduced motion disabled on a test device before public launch.

Lighthouse, Core Web Vitals, physical-device 60fps, throttled 4G LCP and a complete automated WCAG audit were not measured. The 90+ mobile score, <2.5s LCP and 60fps are targets, not claimed results. Audit the production host with final assets and budget for the real frame sequence.

Real customer comparisons, production body frames, workshop address, Maps link and Instagram URL were not supplied. Current imagery is explicitly labelled as concept work, the sequence falls back to a poster, and unsupplied contact links are omitted. Warranty and performance facts need business verification.
