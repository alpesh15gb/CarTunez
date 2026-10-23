# CARTUNEZ — Midnight Workshop 7.0

## Audit of v6.4 before editing

The existing Next.js 16.4.2 static export has `/` and `/enquire/`, GSAP/ScrollTrigger, Lenis and one demand-driven Three.js renderer. Retained: the supplied logo and verified +91 99496 95030 contact, optimized BMW model and its attribution, camera presets, original playable audio, Web Audio EQ, Pioneer-inspired receiver/Android Auto modes, maps handoff, labelled simulated pairing/FM/calls, and aligned cabin comparisons.

The principal gaps were a blocking first-visit preloader, disconnected selection state, a single-page freeform enquiry form, no saved/shareable build, pale sections inconsistent with the midnight direction, and no verified customer project content. Body-camera controls had no visible result in reduced mode; they are now disabled when 3D is off. A 360px portfolio heading overflow was found and fixed during browser QA.

## What changed

- Midnight/graphite/gunmetal/silver/racing-red tokens in `src/app/midnight.css`; Inter retained, with system monospace technical labels. Responsive hero copy is “ORDINARY ENDS HERE.” Immediate poster, no mandatory preloader.
- A five-zone workshop: exterior, interior, lighting/electronics, audio, performance/utility. Native category sheet on narrow screens, keyboard-accessible comparisons and explicit orbit mode so ordinary touch scrolling stays native.
- Real front/profile/rear/three-quarter camera presets, keyboard/drag orbit, material-projected detail hotspots, day/midnight studio lighting, and three independently recoloured rim finishes. One renderer/model is reused across hero/workshop/body/closing. Camera state lives outside React's frame loop.
- Local build persistence, exclusive ambient/rim choices, removable summary items, explicit saved snapshots, restore, reset with undo, validated Unicode-capable share URLs.
- Four enquiry steps: vehicle → direction → review → prepared WhatsApp handoff. Name/goal/budget are form-only state; vehicle/preferences are browser-local. No booking, server submission or message is reported as completed.
- “BUILT DIFFERENT.” supports real project data through `src/lib/projects.ts` and `BuildPortfolio`. Its empty state is intentional. Existing generated studies remain labelled concepts.
- Mobile quote bar with safe-area spacing; real API-free WhatsApp link. Existing Pioneer and cabin controls remain functional; cabin colour previews share the build's preview colour.
- Data Saver/≤2GB devices use the lighter system experience where these browser hints exist. Explicit visitor choices take precedence. Reduced motion keeps the content and enquiry usable without WebGL.

## What the assets actually support

The 853,488-byte supplied BMW has 40 material-merged meshes and no part animation or authored wheel pivots. Exact `material_18` rim geometry was audited and contains four rim clusters; only that cloned material is recoloured. Tires, brake discs and calipers remain intact. The body material includes baked artwork, so no misleading full-paint or kit swap is offered. New vehicle geometry, paint masks, wheel designs or stock-to-widebody sequences need new assets.

Cabin previews are aligned **generated concepts**, not customer photographs or product-output measurements. Only factory floor → cocoa quilt and unlit → blue/red/amber assets are supported. No arbitrary materials, seat replacements or exact vehicle-fit claim is made. Receiver UI is representative, not exact Pioneer firmware; a specific receiver model was not supplied.

## Asset checklist

Already supplied/implemented:

| Asset | Runtime format / dimensions |
| --- | --- |
| Brand logo | Optimized WebP; original retained under assets/source |
| BMW M6 GT3 | Draco-compressed GLB, ~834 KiB; decoder served locally |
| Hero/fallback poster | WebP, 1280×720, ~26 KiB, preloaded |
| Cabin factory / cocoa / blue / red / amber | Five WebPs, 1200×800, ~100–108 KiB each |
| Interior/exterior design directions | Existing generated WebPs, explicitly labelled |
| Original preview tracks | Three 24-second MP3s; user Play only |

Needed to replace references with actual business content:

1. Approved completed-project photographs: preferably 1800×1200 (3:2) or larger, consistent crop, customer consent, vehicle identity, actual work and short story. Matching before/after: same camera, focal length and framing. Enter only verified records in `src/lib/projects.ts`.
2. Actual upholstery/material/finish product photographs (1200×1200), verified product names and applicable pricing/fitment/warranty details. No invented catalogue prices are present.
3. Independent vehicle/part models or painted-area masks if exact paint, wheel designs, parts swaps or kit transformations are required. Retain material names and supply commercial rights.
4. Exact Pioneer receiver model, approved reference screens and supported features for a product-specific preview.
5. Verified workshop address/city, maps URL, operating hours and social link. These remain absent rather than fabricated; configure known fields in `src/lib/site.ts`.

The user confirmed separate commercial-use permission for the supplied BMW. Attribution/source are preserved; the embedded licence reference is retained.

## State and sharing

`src/lib/build.ts` is the pure domain model. Only catalogue IDs and bounded vehicle fields are imported; unknown IDs/versions and malformed/oversized URLs are rejected. Ambient and rim finishes are exclusive groups. URL snapshots contain vehicle and upgrade preferences, so visitors are told anyone with the link can view them. Editing removes a stale imported snapshot parameter. Snapshot storage and automatic current-build storage are separate. Storage failures have a usable in-session/share fallback.

`BuildProvider` spans both routes. Camera angle, comparison divider position, temporary light on/off/intensity and form name/goal are not part of the saved quote configuration. A rim finish is a reference-wheel finish study; it is not a guarantee that those wheels fit the visitor's car. Lighting colour swatches labelled “preview” do not silently add a purchase preference; the adjacent add/remove controls do.

## Motion tuning

- `midnight.css`: `--mw-fast` (180ms), `--mw-ease`, `--mw-space`, colour and spacing tokens. The two lightweight category entrance animations respect reduced motion.
- `useScrollDirector.ts`: primary hero/body journeys, desktop pin distances and reveal timing. Mobile keeps normal vertical flow. Entrances use expo.out/power3.out; scrubs are linear.
- `GarageWorld.tsx`: camera distances/FOV, 0.12 camera interpolation, day lighting intensities and adaptive DPR. Rendering settles or stops offscreen/when the document is hidden. No per-frame React updates.
- `MotionProvider.tsx`: system, explicit full and lighter preferences. Head-unit audio starts only after a Play action.

Avoid adding a second renderer or attaching heavy scroll handlers to every element.

## Verification

Production build and TypeScript checks pass. Run `npm run build`, `npm run typecheck` and `node scripts/test-build.mjs`.

Seven pure-domain checks cover Unicode share round trips, exclusive options preserving unrelated selections, immutable removal/snapshots, malformed/oversized/versioned imports, sanitized/unknown IDs, complete quoted messages with encoded currency, and the empty-build advice path.

Browser checks use the actual built static export. Tested at 360, 390, 430, 768 and desktop widths: primary navigation, category sheet, real 3D view/material/light changes, lighting selection, comparison slider Home/End, local reload persistence, save/restore/reset/undo, share import, four-step enquiry and generated WhatsApp payload. Reduced mode has no WebGL canvas. Menu Escape returns focus. Pioneer regression checks: expand, real Play (audio readyState 4 / paused false / 24 seconds), seek, maps handoff, close pauses audio. No browser console errors were observed in the tested paths. No WhatsApp message was sent.

These are browser viewport tests, not physical-device or carrier tests. Lighthouse, lab/field LCP/INP/CLS and a sustained real-phone 60fps run are **not measured**. The requested Core Web Vitals remain targets, not claimed results. Missing assets, real fitment/product availability, backend scheduling and actual hardware/OS integration remain external requirements.

## Optional next details

- A properly art-directed set of vehicle-specific paint masks and replaceable parts, driven by the existing build state.
- Consistent customer before/after shoots with a short installation story for every completed build.
- A customer-triggered 3–5 second cinematic lighting reveal using the real studio model; keep the immediate image and reduced-motion route.
