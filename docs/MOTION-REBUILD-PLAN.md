# CARTUNEZ: camera-led 3D scroll rebuild

Planning and research pass, 22 October 2026. This specifies the next implementation; it does not claim these changes are already live.

## Audit of the present build

- The hero is a photograph animated with scale and translation. There is no Three.js renderer, loaded 3D vehicle, orbiting camera, or geometry-based parallax.
- The body sequence manifest has an empty frames array. The body chapter therefore shows a concept poster and drawn callouts, not an actual stock-to-custom transformation.
- Most timelines require prefers-reduced-motion: no-preference. The browser used for verification reported reduce, so those timelines never ran. Reduced-motion fallback worked, but the intended full experience was never visually verified.
- Mobile removes the hero scroll timeline and all pins. Its few remaining reveal effects do not deliver the requested sense of depth.
- Repeated copy/image chapter layouts create an editorial rhythm rather than a journey through a vehicle.
- Hover tilt and image scaling do not supply the missing 3D scene.

## Research and design conclusions

1. AQuest's Lamborghini STO account describes a 3D launch environment with an explorable vehicle and content hotspots. Apply the principle of feature discovery around the vehicle, while retaining a much shorter route to enquiry. https://stories.aquest.it/brand-virtualization-e-la-nuova-sfida-per-i-brand-di-domani
2. Unseen Studio's Crosswire case explains a connected 3D environment used to make product features understandable, including lighting decisions and performance tradeoffs. Apply one coherent world with purposeful scene changes and controlled lighting. https://tympanus.net/codrops/2023/04/04/case-study-crosswire/
3. Lusion's own account distinguishes interactive WebGL projects from Porsche: Dream Machine, which is a CG film. Borrow its cinematography and emotional progression; do not treat a film as proof of equivalent browser performance. https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/
4. GSAP provides scrubbing, pinning and timeline labels. Camera state and DOM text must follow the same scrubbed timeline. https://gsap.com/docs/v3/Plugins/ScrollTrigger/
5. Lenis documents integration through the GSAP ticker. Use one clock and native document scroll, with no independent scroll smoothing inside the 3D scene. https://github.com/darkroomengineering/lenis
6. R3F's performance guidance recommends on-demand rendering, resource reuse and adaptive quality. Render while scrolling, interacting or settling; stop when idle and invisible. https://r3f.docs.pmnd.rs/advanced/scaling-performance
7. Web.dev recommends transform/opacity animation and restrained will-change use. Keep layout calculations out of the per-frame update. https://web.dev/articles/animations-guide
8. MDN documents OS motion preferences and a custom animation toggle example. Resolve motion in one shared policy, with a visible visitor-controlled override. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

These are primary maker accounts and official implementation references. The choreography and budgets below are proposed decisions for CARTUNEZ, not claims about the references' exact implementations or measured conversion performance.

## Creative direction: Enter the garage. Build your signature.

The first scroll must change the camera's view of the car. Foreground, vehicle, floor and lighting must move with different depth relationships. Text stays readable in semantic HTML, arranged around the car rather than covering every important detail.

Keep the existing near-black canvas, warm white typography, red action accent and supplied blue/red logo. Use blue sparingly for identity and focus. Avoid a showroom that feels like a game or a sci-fi dashboard.

Every chapter has an entrance, a signature interaction, a reading interval and an outgoing handoff. Preview part of the next scene before the current one leaves. Use this visible progression to encourage exploration; do not require scrolling to reach contact.

## Proposed storyboard

The following desktop distances are initial total scene allocations, including their pinned intervals. They are tuning targets, not fixed requirements. Start around 12–15 viewport heights for the complete desktop narrative and validate the reading pace.

| Scene | Scroll allocation | Choreography | Next-scene invitation |
| --- | --- | --- | --- |
| Hero: ignition | 220vh | First 20%: lights reveal the silhouette. 20–65%: camera moves from low front three-quarter to a side-biased view, approximately 30–40 degrees. Floor markings recede; type moves behind the car on a separate plane. 65–85%: approach one detail. Final 15%: foreground shadow crosses the view. | A glimpse of warm cabin material and the next chapter label appears in the shadow. |
| Signature statement | 100vh | Large type resolves in words while a foreground rule travels faster than the background. Pause the camera for reading. The signature line takes red. | A detail image opens into the first chapter. |
| Interiors: crafted around you | 140vh | Camera-style push into a tactile cabin macro. A registered factory/custom wipe reveals the upgrade; stitching follows the seat geometry, and swatch cards lift on separate depth planes. | A moving stitch/light line becomes an exterior contour. |
| Body: change the silhouette | 200vh | Return to the same 3D vehicle. Orbit approximately 35–50 degrees. Named kit meshes separate slightly, settle into place, then finish in a complete stance. Labels follow projected mesh anchor points. | A reflected light streak becomes a dashboard screen edge. |
| Audio: bring the drive to life | 140vh | Screen rotates toward the viewer and boots. Speaker, screen and sound rings occupy different depth planes; scroll velocity affects the equalizer within a restrained range. Hold copy while the scene responds. | Circular sound rings align with the performance dial. |
| Performance: built for the road | 130vh | Gauge sweeps as a perspective road/grid advances. Product cutouts travel in depth and settle into a horizontal row. Numerical claims remain placeholders until verified. | Final product card expands into a build photograph. |
| Builds: the proof | 150vh | Gallery cards start offset in perspective, move forward and flatten into readable comparisons. Use shallow depth so photography remains trustworthy. Comparisons remain fully usable with touch and keys. | The last card settles beside the trust statement. |
| Trust: the craft behind the result | 90vh | Cards arrive on a shallow depth stack, settle flat and remain still for reading. A single detail image changes scale slowly behind them. | Red light line guides the eye to enquiry. |
| Enquiry: your next chapter | 100vh | Camera/world pulls back to a composed garage view. READY TO BUILD YOURS resolves; ambient motion subsides around the WhatsApp CTA. | Contact is the clear final action. |
| Footer | 70vh | Wordmark rises into view with restrained perspective, then settles. Address and navigation remain stable. | Return to top and direct contact. |

The door/interior transition requires separate cabin imagery or a real interior model. An exterior model alone cannot support a convincing camera move through the door into a detailed cabin. Use a deliberate dark transition at that boundary.

## Three coordinated layers

### 1. Persistent 3D world

Use Three.js through React Three Fiber in a dynamically imported client component. Keep a single renderer, loaded vehicle, environment and camera rig. Reuse that scene for hero, body and closing views. Stop rendering when its visible contribution ends.

The camera rig owns position, target and field of view. Vehicle parts are named nodes; kit parts have authored start/end transforms. Floor, light cards and foreground silhouettes supply depth. Use baked lighting/environment reflections before considering expensive live effects.

### 2. Semantic content layer

Headings, paragraphs, navigation, forms, swatches and comparisons remain HTML. CSS perspective provides shallow 3D transforms for editorial cards and dashboard layers. Text does not become a canvas texture.

### 3. Scroll director

Keep native document scroll as the source of truth. Lenis, when enabled, updates on the GSAP ticker. Scene-specific labelled GSAP timelines drive both the camera rig and DOM overlays. No competing scroll timeline in the R3F frame loop.

Measure scene boundaries on setup and ScrollTrigger.refresh(), including after asset/font readiness. Store animated values in refs or Three.js objects, not React state on every frame. Refresh timelines after resizing and clean up all triggers, renderer resources and listeners on route changes.

## Motion preference: fix the invisible-experience problem

Create one MotionProvider with three preferences: System, Full and Reduced. Resolve all JS, CSS, Lenis and WebGL behaviour from the same result.

- Default to System and honour the OS setting.
- If the result is Reduced, show a clear, non-blocking 'Enable 3D experience' action.
- Choosing Full enables the cinematic mode on this website only and remembers the visitor's choice.
- Keep the reduced-motion switch available in navigation and keyboard accessible.
- CSS reduced-motion rules must not continue overriding Full after the visitor opts in.
- In Reduced mode, retain readable content, static product states, comparison controls and direct enquiry.

Do not ask the visitor to alter operating-system settings. Do not silently override their preference just to make the demo look animated.

## Mobile gets real choreography

- Use a portrait camera composition and a smaller orbit, not the desktop crop.
- Keep one short hero sticky scene and one short body reveal if device testing supports them. Let the other chapters flow vertically.
- Keep native touch scrolling. No wheel interception, forced stepping or scroll snapping.
- Start with DPR 1, 1K textures, no realtime shadows, no full-screen blur/bloom and fewer transparent overlays.
- If WebGL fails or runtime quality remains poor, switch at a scene boundary to a genuine rendered angle sequence. A scaled photograph is only a final static fallback and should never be presented as a 3D orbit.
- Native horizontal swipe and comparison dragging take priority over cosmetic gallery motion.

## Asset requirements

The quality of the 3D model is a dependency, not something GSAP can replace.

- One licensed, preferably unbranded GLB vehicle. Separate body, glass, wheels, headlights and kit components. Ground-aligned origin, stable node names, sensible scale and authored part pivots.
- The exterior should match the campaign imagery. Do not switch between unrelated car silhouettes during an apparent continuous camera move.
- Optimised geometry with Meshopt/Draco compression as appropriate, KTX2 textures where supported, and a clear licence/credit record.
- A compact environment map or baked lighting assets and one fallback hero poster.
- Real matched factory/custom interior photos; optional cabin model only if the experience needs more than the macro transition.
- Registered real customer before/after pairs and clean product cutouts.
- If using a rendered fallback, export the exact planned camera positions rather than unrelated stock frames.

Prototype the scene and pipeline with a licensed model before choosing the final car asset. Do not claim customisable parts or detailed interiors that the model does not contain.

## Initial performance budgets

These are engineering targets to validate, not promises that a model will automatically meet them:

- Hero poster under approximately 150KB; visible before WebGL is ready.
- Primary compressed model and required textures approximately 2–3MB or less where achievable. Defer secondary assets.
- Desktop pixel ratio capped around 1.5; phone around 1.0 initially.
- Reuse materials/geometries; aim below roughly 100 draw calls desktop and 60 phone for the active scene, then tune from measurements.
- Adaptive rendering quality based on actual frame timing; no permanent downgrade based only on screen width.
- No continuous renders while the scene is idle or offscreen.
- Work toward 60fps on a named mid-range Android device. If representative testing cannot meet the target, use the prepared scene-sequence tier.
- Measure production Lighthouse and LCP on throttled mobile 4G after final assets are integrated. Do not certify scores from source inspection.

## Proposed implementation structure

```text
src/components/motion/
  MotionProvider.tsx        Shared system/full/reduced state
  MotionControl.tsx         Visible visitor control
  ScrollDirector.tsx        Timeline setup, scene lifecycle, cleanup
  SceneProgress.tsx         Chapter status and next-scene cues
src/components/world/
  GarageWorld.tsx           Single renderer and quality controller
  Vehicle.tsx               Named nodes, materials, kit assembly
  CameraRig.tsx             Position / target / FOV state
  GarageLighting.tsx        Floor, environment, light cards
src/lib/
  choreography.ts          Scene labels, positions, reading holds
  quality.ts               Measured quality tiers and fallback policy
```

Refactor HomeExperience, SiteChrome, SequenceCanvas and useScrollReveal to consume the shared policy and director. Preserve the working enquiry form and phone configuration.

## Implementation milestones and acceptance gates

1. **Prove the hero and motion policy.** Build the real car, orbit, floor depth, full/reduced toggle and first section handoff. Verify in a browser on both modes before extending the page.
2. **Complete one flagship category.** Prove the body chapter's kit assembly and projected labels, including reverse scrolling. This establishes the quality bar for the remaining chapters.
3. **Author the whole story.** Interiors, audio, performance, gallery, trust and CTA each receive distinct entry/hold/exit states, with typography and content tied to the same progress.
4. **Optimise and verify.** Test phone framing, quality tiers, WebGL failure, keyboard/touch, route cleanup, slow assets and final content. Measure frame timing and production mobile performance.

Release checks must include screenshots at 0/25/50/75/100% progress in hero and body scenes, a visible changed camera angle, a continuous full-page scroll recording, reverse scroll restoring the same states, and direct enquiry remaining reachable.

Test fast scrolling, reload in the middle of a pinned scene, resize/rotation, menu open during a scene, return navigation, and repeated route visits without duplicate canvases/triggers. Confirm Full works even when the OS reports Reduced, and confirm switching back restores the calm layout.

No further release should be described as an immersive 3D experience on the strength of a build passing or a single hero screenshot alone.
