# CARTUNEZ scroll experience 9.0

23 October 2026. This release corrects the missing experience at the user's actual viewport and replaces subtle entrances with reversible scroll choreography.

## Cause found on the live site

The reported page was open at **870×668** with `data-motion=full`. The exterior sequence required a width of 1100px, height of 620px and a fine pointer. At 870px it had no pin, all three panels had opacity 1, and their images had no transform. This reproduced the user's complaint. Other image motion was deliberately small and heading entrances played only once. The previous desktop-only verification did not establish that the intended experience reached this window size.

## Research applied

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): pin a bounded scene while a scrubbed timeline follows actual scroll distance. Numeric scrub smooths the pose; scrolling upward reverses the same timeline. These scenes add page distance without intercepting the wheel or snapping the user to a destination.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): responsive queries should adapt composition and clean up prior animations. The new width queries choose an image/copy composition; they do not remove the narrative from narrow screens. Only viewports shorter than 560px avoid pinning so reading areas remain usable, and their image motion still follows scroll.
- [Lenis official integration](https://github.com/darkroomengineering/lenis): retain one RAF owner, synchronize ScrollTrigger with the Lenis scroll event, pass ticker time in milliseconds, and disable GSAP lag smoothing. Lenis remains for desktop wheel smoothing; the same scenes also run on ordinary native scrolling at 870px and on phones.
- [web.dev animation performance](https://web.dev/articles/animations-guide): use transform and opacity for the scene changes, image approach, typography and depth. Frame poses stay outside React. React state changes only when a chapter changes. The aligned cabin images reuse the existing compressed assets.

## Complete scroll map

| Area | Scroll-driven behavior | Practical boundary |
| --- | --- | --- |
| Hero | Car approaches at 1→1.32 scale on wide screens or 1→1.23 on compact screens. Headline lines split in opposite directions. Initial copy clears; a second statement appears. Red progress line follows the scene. | Pin for 1.15 viewport heights. Main CTA remains available in the initial pose. |
| Introduction/directory | Words brighten and lift in reading order. Category links rise into view with scrub. | Reversible and available at every width. |
| Exterior | Profile → wheel/stance → aero, with scale, lateral drift, rotation, crossfade and scene meter. | Pin for 2.8 viewport heights. Three chapter buttons use the same scroll controller. |
| Interior | Larger image travel/zoom, perspective arrival and independent material-image depth. Headings reveal with scroll. | No pin; copy remains in page flow. |
| Cabin transformation | Factory floor → cocoa quilt → warm amber lighting in the same aligned cabin. Phase captions and stitching accent follow the timeline. | Pin for 2.2 viewport heights. Explicitly generated concepts. |
| Cabin controls | Existing draggable comparison, lighting swatches, intensity and saved choices. | Page scroll does not alter these controls or saved preferences. |
| Audio | Speaker photograph moves in depth; sound rings expand with scroll; a decorative frame arrives with perspective. | Receiver and app-launch buttons are stationary. Expanded dialog remains a body portal. No autoplay audio. |
| Performance | Two product photographs enter with opposing lateral/rotational poses and settle while scrolling. | Add/remove buttons stay stationary and usable. No fabricated performance statistics. |
| Craft | Photo depth plus sequential perspective/opacity changes in trust copy. | Reversible; no hover requirement. |
| Workshop | Heading arrival and the real BMW camera travel from .25 to 1.30 radians as the workshop approaches. | First pointer or keyboard interaction in the workshop hands camera ownership to the visitor. Rim/lighting/orbit controls retain priority. |
| Build/closing/footer | Build typography rises, closing car zooms out, copy settles, footer wordmark uncovers. Marquee follows scroll distance rather than an autoplay loop. | CTAs stay stationary; WhatsApp and four-step enquiry are preserved. |

The three pinned scenes run at ordinary desktop, tablet and phone widths. For reduced motion they revert to normal flow with all content visible and no WebGL. Very short landscape viewports retain a flowing layout.

## Source and tuning

- `src/hooks/useScrollDirector.ts`: hero, page-wide scrub, photography, audio rings, camera arrival, closing and footer. `refreshPriority` 20 on the hero ensures it is measured before the downstream pins.
- `src/components/SignatureStory.tsx`: exterior pin, 3.5 timeline units, width-specific composition and .45 scrub. Targets .12/.48/.84 land inside reading holds. Refresh priority 10.
- `src/components/CabinScrollStory.tsx`: aligned cabin sequence, 3.3 units, .4 scrub and .15/.49/.85 chapter targets. Refresh priority 5.
- `src/app/scroll-experience.css`: all responsive scene layouts and progress meters. It follows the v8 stylesheet, so current behavior is explicit without deleting older design assets.
- `src/components/SiteChrome.tsx`: the shared anchor/chapter scroll bridge and existing Lenis integration. Controls never create a second smooth-scroll engine.

The page refresh sorts triggers after setup and after font/receiver layout changes. Cleanup removes pin spacers, inline poses, observers and manual camera listeners when motion mode or media queries change. Hero height is the same before and after hydration.

## Verification record

Verified against the production export through actual browser scrolling:

- **870×668**, the reported size: three pins present; hero scroll at 334px changed image scale to 1.1001 and moved the two headline lines in opposite directions, both at opacity .1213. Continued scroll showed the second statement.
- At the same size, exterior progress 13→52 changed the visible panel from Presence to Stance. Scrolling upward restored Presence. The Detail button reached progress 84 and the correct aero image.
- The cabin's three 1200×800 images loaded. Scrolling showed factory, cocoa quilt and amber-lit poses in sequence with the intended captions.
- **390×844**: three pins remained. Exterior progress 44 showed Stance; progress 85 showed Detail. Document horizontal overflow was 0. The cabin's Factory chapter also fit with the mobile quote bar visible.
- **360×640**: hero height 640px, initial CTA bottom 498px and scroll-cue bottom 552px; both fit above the mobile quote bar. Three pins present.
- Reduced motion toggle: zero pin spacers; all exterior and cabin panels opacity 1; hero image transform `none`.
- Restored full motion at **1280×900**: exactly three pins. Menu → Audio navigation reached the section with its top about 80px below the viewport top. Three sound rings had distinct scale poses, confirming their staggered scroll state.
- Testing exposed a moving-click-target issue in the first receiver entrance. The whole UI was replaced with a decorative animated halo; the app buttons, product action buttons and closing CTAs remain stationary. After that fix, the Music shortcut opened the correct Your soundtrack screen.
- Real audio then reached `paused=false`, readyState 4. Escape closed the modal and paused playback. No warning/error logs were captured in the final tested session.
- Workshop reached `data-webgl=ready`; the camera arrival reached 1.300 radians. Profile selection remained active while scrolling again (rendered angle 1.557 on its way to 1.57), confirming that manual interaction takes ownership.
- The saved Hyundai i20 2022 and five upgrade preferences carried through all four enquiry steps. The final prepared message contained all five and the correct `wa.me/919949695030` target. No message was sent during testing.
- **870×500** short landscape: zero pins, all exterior/cabin panels opacity 1, no horizontal overflow. Returning to the normal viewport rebuilds the appropriate scenes.
- Published-site check at **870×668**: three pins active; normal wheel scroll reached hero progress 48 with image scale 1.11, then revealed the second statement. A final compact-desktop spacing correction leaves the hero description ending at 380px and the CTA starting at 443px.

Production export/TypeScript and the seven existing build-domain checks pass. Browser viewport tests are not a physical-phone FPS, network-throttled Lighthouse or WCAG certification. No performance score or award is claimed.
