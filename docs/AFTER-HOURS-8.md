# CARTUNEZ — After Hours 8.0

Research, implementation and verification · 23 October 2026

## The creative problem

The previous release had useful depth: a supplied BMW reference model, a functioning receiver preview, matching cabin comparisons, saved preferences and an enquiry flow. Its presentation relied too heavily on a small set of images and repeated the BMW through several sections. The interface arrived before the visitor had developed a desire for the work.

This release gives the brand an editorial campaign. A large, readable car establishes the first impression. Each subsequent chapter changes subject and scale: profile, wheel, aero, warm cabin, stitching, speaker, utility, components, craft and a closing rear view. The interactive workshop follows that inspiration. Every new image is a generated concept, identified as such; none is presented as a customer installation or actual workshop photograph.

## Research and decisions

The references below are primary brand, framework and standards sources. Brand pages were used for their imagery/content hierarchy and product storytelling. This is an interpretation for CARTUNEZ, not a claim that their live animations were reproduced or measured frame by frame.

| Source | Useful principle | CARTUNEZ implementation |
| --- | --- | --- |
| [BRABUS Rocket GTS](https://www.brabus.com/en-int/cars/supercars/brabus-rocket-gts.html) | Move between the overall vehicle and specific exterior/interior materials. | Three exterior scenes, then a different warm cabin composition and a separate stitching macro. |
| [Automobili Pininfarina Battista](https://www.automobili-pininfarina.com/battista) | Treat the car as an emotional design object with generous photographic scale. | One full-bleed hero with restrained copy, a clear scroll invitation and a distinct portrait composition for smaller screens. |
| [Porsche Paint to Sample and configurator guide](https://www.porsche.com/stories/design/porsche-paint-to-sample-colours-and-configurator-guide/) | Inspiration and practical configuration serve different stages of a decision. | Visual chapters first; the working five-zone build planner later. Choices still carry into the enquiry. |
| [Garage Italia custom services](https://www.garage-italia.com/en/customs/garage-cars/services) | Personalisation has a material and craftsmanship story beyond a list of accessories. | Leather/stitching studies and a craft image, with practical copy about fit, finish and understanding the scope. |
| [Longbow](https://longbowmotors.com/) | A focused automotive brand can make the vehicle and concise narrative the main event. | Reduce repeated interface layouts; alternate photographic scale and keep each section focused. |

The technical research informed specific boundaries:

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) supports the scrubbed sequence and scroll-aware entrances. There is one pinned photographic sequence, with reading holds between transitions. Product controls remain in normal page flow.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) supplies breakpoint-specific contexts and automatic cleanup. The pin requires a fine pointer and a viewport at least 1100px wide and 620px high. Smaller screens show all three articles vertically.
- [GSAP React guidance](https://gsap.com/resources/react-basics/) informed scoped contexts and cleanup. The page reveal hook and exterior scene each own distinct elements. Animation frames do not drive React state; the scene indicator changes only when the active scene changes.
- The [Lenis integration guidance](https://github.com/darkroomengineering/lenis) informed the GSAP ticker connection, ScrollTrigger update sync and disabled lag smoothing. Chapter navigation and hash links share the scrolling controller. Native scrolling remains on narrow/coarse-pointer screens and in reduced mode.
- [web.dev LCP guidance](https://web.dev/articles/optimize-lcp) and [responsive images](https://web.dev/learn/images/responsive-images) informed immediate HTML image markup, matching responsive preload, priority on the hero, explicit dimensions, AVIF/WebP variants and lazy below-the-fold imagery. The 3D model is deferred until the workshop approaches the viewport.
- The [animation performance guide](https://web.dev/articles/animations-guide) informed transform/opacity choreography instead of animating layout properties. The existing comparison control still uses a clipping reveal because the user directly controls it.
- [WCAG animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) informed a static content fallback and visitor motion switch. Reduced mode removes pinning, parallax and WebGL while retaining comparisons, selections, receiver controls and enquiries.

## Design system

Inter is used throughout, including the small chapter labels. The legacy `--mw-mono` token now resolves to Inter so older workshop components follow the same type family.

| Token | Value / purpose |
| --- | --- |
| Base | `#07090c`, near-black with a cool undertone |
| Panels | `#101419`, `#151a20`, graphite/gunmetal |
| Main text | `#e8e7e1`, warm silver |
| Secondary text | `#a7adb5` |
| Accent | `#e8483f`, restrained racing red; the supplied logo is preserved |
| Hero type | Desktop `clamp(92px, 10.8vw, 192px)`; phone `clamp(72px, 22vw, 116px)`; tight tracking and two explicit lines |
| Chapter type | Responsive approximately 32–92px, with a separate scale for pinned scene copy |
| Body | Primarily 12–15px, line-height around 1.8–1.9; supporting labels are smaller |
| Main spacing | `clamp(72px, 8vw, 140px)`; asymmetric editorial image/copy layouts |
| Entrances | `expo.out`, approximately 1.05–1.2s; quieter elements use `power3.out` around 0.9s |
| Scrub | Hero 0.6–0.7s, photographic parallax 0.85s, exterior sequence 0.65s |

The photographic light treatment, warm cabin materials and silver/red exterior palette create continuity. No autoplay audio or mandatory loading screen blocks the first image.

## What is implemented

1. **First impression:** responsive garage hero, large “MAKE IT YOURS.”, masked text entrance, restrained image depth and two clear paths into the experience/workshop. The image and links exist before JavaScript. Portrait art direction extends through 950px.
2. **Introduction:** word-opacity scroll statement, followed by four direct chapter links.
3. **Exterior story:** profile → wheel/stance → aero. Desktop pins one stage for 2.6 viewport heights; image drift, scale and crossfade are scrubbed. Chapter buttons land in fully visible reading holds. Mobile/reduced mode shows every article in normal flow.
4. **Cabin:** large espresso/Alcantara image and a separate stitching macro, followed by the retained aligned matting and ambient-light comparison studio. Swatches, intensity, keyboard ranges and add/remove preferences work.
5. **Sound:** a dedicated speaker/door photograph precedes the Pioneer-style receiver. The receiver mounts on approach, with direct navigation/music/settings buttons. Audio plays only on user request. One audio engine serves the inline/expanded interface; closing the expanded view pauses playback.
6. **Purpose:** separate utility and component images with buttons that add actual shared build preferences. No unverified horsepower, acceleration or load claims.
7. **Craft:** an editorial hands/materials image and concise principles about fit, finish and informed choices. The image is not claimed as an actual employee or installation.
8. **Workshop:** the supplied BMW has its own place in the story. One renderer loads on approach, then renders on demand. Live rim material, day/midnight lighting, cameras, orbit, hotspots, preferences and browser-local saved builds remain available. It is explicitly reference geometry, not the visitor’s selected vehicle.
9. **Conversion:** a personal build brief invitation, native FAQ, new closing photograph, WhatsApp CTA, visit request and call. The four-step enquiry uses the saved build and opens a prepared message. No backend booking or sent-message confirmation is invented.
10. **Shared behavior:** Inter, supplied brand logo, responsive nav/menu, focus handling, progress line, magnetic buttons, cursor only for fine pointers, curtain route transition and reduced motion.

The verified project data structure remains available for future real customer work. The current empty state invites a build conversation without inventing projects or showing internal photography-production tasks to customers.

## Image library and provenance

All twelve new source images were created with the built-in image generator. The exact prompts, source paths, method and disclosure are preserved in `assets/source/campaign-v8/prompts.json`. The supplied logo and BMW are separate existing assets, not regenerated replacements.

| Asset key | Source dimensions | Purpose |
| --- | --- | --- |
| `hero` | 1672×941 | Silver coupe, architectural garage, desktop first screen |
| `hero-mobile` | 941×1672 | Portrait composition for phone/tablet |
| `profile` | 1672×941 | Entire vehicle silhouette |
| `stance` | 1536×1024 | Wheel, arch and carbon detail |
| `aero` | 1536×1024 | Front lip and body surface |
| `interior` | 1536×1024 | Espresso leather/Alcantara cabin |
| `stitch` | 1122×1402 | Portrait material/stitching macro |
| `audio` | 1536×1024 | Speaker and door trim |
| `utility` | 1536×1024 | SUV carrying/lighting direction |
| `performance` | 1536×1024 | Exhaust/intake component still life |
| `craft` | 1536×1024 | Hands aligning material at a workbench |
| `closing` | 1672×941 | Rear view, red taillights and garage threshold |

`node scripts/prepare-campaign.mjs` creates width-specific AVIF/WebP derivatives and the manifest `src/lib/campaign-assets.json`. Landscape widths are 640/960/1440; portrait widths are 480/768/1024 where the source is large enough. No derivative upscales the source. The phone hero has only 480/768 variants, and the markup/preload derive from the same manifest. Originals stay outside `public/`.

Measured file facts: 70 AVIF/WebP derivatives total **3,994,546 bytes** across the entire library, including alternative widths/formats that an individual browser does not all need. Hero 1440 AVIF is **55,968 bytes**; portrait hero 768 AVIF is **47,798 bytes**; portrait hero 480 AVIF is **25,187 bytes**. These are encoded asset sizes, not measured load-time or Core Web Vitals results.

## Verification performed

Production export and TypeScript completed successfully with Next.js 16.4.2. All seven existing build-domain checks passed: Unicode share round trip, exclusive selections, immutable snapshots, malformed shared data, validation, complete enquiry content and safe empty-build wording. All 70 manifest paths exist and their encoded sizes match the manifest.

Browser QA used the production export in the in-app browser:

| Story boundary | Evidence / result |
| --- | --- |
| Responsive first screen | 360, 390, 430, 768, 1191 and 1280px viewport checks; no horizontal document overflow in observed states. Phone headline corrected to two lines; tablet gets portrait art direction. Short desktop windows have a compact hero with the scroll cue inside the first screen. |
| Exterior sequence | Presence, Stance and Detail buttons produced the intended visible image; inactive panels had opacity 0/visibility hidden. Loaded images verified. |
| Pin breakpoint | Resized below 1100px: zero pin spacers, all three panels opacity 1. At 1060px, Detail navigation landed about 100px below the top using the shared scroll bridge. |
| 3D defer and controls | Zero canvas at the initial hero. Workshop became `data-webgl=ready`, one canvas. Midnight/bronze updated the rendered car and observable scene attributes. Profile camera reached angle 1.420. |
| Motion switch | From the active workshop: reduced mode removed the canvas and pin spacer, retained all panels, reset hero transform to none. Full mode reinitialised the live workshop. |
| Pioneer | Direct music button opened expanded screen. One audio element advanced with `paused=false`, readyState 4; EQ range accepted keyboard input. Escape closed the dialog and audio became paused. |
| Cabin | Both 1200px comparison images loaded. Keyboard comparison control worked; blue swatch and intensity range updated. Add to build replaced the exclusive ambient preference. |
| Shared preferences | Utility direction added to the same summary; snapshot saved. Car and five selections survived route navigation into the enquiry. |
| Enquiry | Vehicle → direction → review → prepared WhatsApp message completed. Correct car, all five preferences and `wa.me/919949695030` were present. No message was sent during QA. |
| Navigation/FAQ | Phone menu opened with focus on its first link; Escape returned focus to Open menu. Native FAQ expanded with the correct answer. |
| Runtime | No captured browser errors/warnings during the tested desktop interactions. No broken completed images in the final mobile document check. |

Fixes made from observation: narrow-phone headline wrapping, tablet car cropping, desktop secondary-link placement, low-contrast chapter label, the 1024–1099px navigation path that could bypass Lenis, and short-window hero/pin heights. The final short-window scene measured 668px high with its active copy ending at 566px and bottom navigation at 643px.

**Limits:** viewport emulation is not physical-device testing. A throttled Lighthouse run, measured mobile LCP/INP/CLS, a representative mid-range Android 4G test and a hardware FPS profile were not performed. No 90+ score, sub-2.5s LCP, 60fps guarantee, accessibility certification or award is claimed. The production build and tested interaction paths are working; the numbers above are asset sizes and observable browser states.

## Tune the motion

- `src/hooks/useScrollDirector.ts`: global entrances, hero travel, intro word timing, image drift and marquee. Reduce the desktop image scale/y ranges for a quieter experience. Keep text readable while scrubbing.
- `src/components/SignatureStory.tsx`: the pin's 2.6-screen distance, `.65` scrub and scene proportions. The timeline is 3.5 units; chapter targets `.12/.48/.84` currently land at `.42/1.68/2.94`. If scene timing changes, retest those holds and mobile cleanup.
- `src/app/campaign.css`: colors, type, spacing, photographic crops and responsive composition. Keep the hero source/preload breakpoint in `CampaignImage.tsx` and `layout.tsx` aligned.
- `src/components/SiteChrome.tsx`: Lenis `.9` duration and anchor `.85` duration. All scripted full-mode chapter scrolls should use `cartunez:scroll-to`.
- `src/components/GarageWorld.tsx`: on-demand render, camera distance and interpolation, pixel-ratio cap, lighting and rim material. Do not recolor the baked body texture or claim unavailable geometry changes.

## Real content to supply next

The site is usable with this campaign library. Replacing illustrative content with evidence of actual CARTUNEZ work is the most valuable next content investment:

1. Six to ten approved customer builds, 1800×1200 minimum; whole car plus two details. Before/after pairs should use the same camera, lens, position and lighting. Include vehicle/year, actual upgrades, short story and permission to publish. Use the existing verified project schema.
2. Real material/product macros, ideally 1600×1600 or larger, with verified names and availability. Campaign concepts do not establish inventory.
3. An actual workshop/craft shoot: 2400×1600 wide compositions and 1200×1600 portraits, with staff permission. A clean 2560×1440 hero and 1440×2560 phone composition would support future higher-density screens.
4. Exact Pioneer receiver model and approved interface references to replace the representative UI. Pairing, FM and calls remain labelled simulations; maps are illustrative with an external navigation path.
5. Confirmed workshop address/city, Maps link, hours and Instagram. These are not fabricated; location remains available by enquiry. The supplied contact is +91 99496 95030.

## Three later additions worth doing

- **An authored transformation:** a real stock-to-finished car sequence, 60–90 aligned frames at 1600×900 plus a lighter mobile subset. Match focal length/exposure and include clean hold frames. Use a bounded canvas sequence only after a measured memory/network test.
- **A material inspection lens:** real leather/quilt/Alcantara macro assets with a pointer/touch magnifier and a one-tap link into the saved brief. This adds product understanding as well as spectacle.
- **A real build handover chapter:** approved installation/process footage leading into the actual completed vehicle, with customer story and exact work list. Keep the poster immediate, the video optional or muted, and a static reduced-motion alternative.
