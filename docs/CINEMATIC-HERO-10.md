# CARTUNEZ / Cinematic BMW hero 10.0

## Delivered behavior

The hero renders the user-supplied BMW M6 GT3 GLB immediately in full motion mode. It no longer uses the campaign photograph as the animated vehicle. The camera moves in world space, its look-at target changes, and the BMW group rotates independently. Reflections, the far side of the body, wheels, rear wing and diffuser change with the view.

The three shots are front three-quarter, low side profile and rear three-quarter. A 2.4-viewport native scroll interval drives them in either direction. Text introduces each shot; the scroll cue can skip directly to the introduction. The hero stays pinned at compact and short viewport sizes as well as desktop sizes.

## Implementation and tuning

- `src/lib/hero-camera.ts`: three camera keyframes. `at` is normalized scroll progress, `angle` and `turn` are radians, `radius` and `height` are world units, `target` is look-at height. Continuous smoothstep interpolation settles at the side shot without a cut.
- `src/hooks/useScrollDirector.ts`: `ctz-hero` pin length is `innerHeight * 2.4`; numeric scrub is `.4`. Change these to adjust travel duration and catch-up. `world.hero` is tweened by the GSAP animation, so the renderer follows the eased scrub clock, including its final frames after input stops.
- `src/components/GarageWorld.tsx`: aspect-aware framing, mobile pixel ratio capped at 1, desktop at 1.5, adaptive reduction after sustained slow frames. The canvas remains untransformed; its camera and model matrices do the work. The optical view offset leaves room for the headline and resolves toward center during the orbit.
- `src/app/hero-3d.css`: hero composition, phone car stage, short-window single-line heading and three shot labels. Inter and the existing near-black/red palette are retained.

Only one WebGL renderer and one model decode are used. The canvas moves between the visible hero and workshop slots. The workshop resets mesh rotation and restores its own camera angle, rim material and day/midnight setting. Hero lighting and original rim material are independent of saved workshop choices. Rendering stops when poses settle, when both slots are outside the viewport, or when the document is hidden. Cleanup disposes renderer, geometry, materials, textures, DRACO worker and listeners.

## Assets and fallbacks

- Runtime model: `public/models/bmw-m6-gt3.glb`, 853,488 bytes; existing optimized supplied asset, no replacement model.
- Local decoder: `public/draco/`; one decode worker.
- Immediate fallback: `public/images/bmw-studio-poster.webp`, 1280 × 720, 26,742 bytes, preloaded. It remains visible until a rendered BMW canvas occupies the hero. The generated silver-coupe campaign images are used elsewhere in the editorial story, not as this hero's car.
- No new photography or image sequence is required for the hero. Existing source provenance, creator attribution and the user's confirmed separate commercial-use permission are retained.

Reduced motion keeps the BMW poster and readable static text, removes hero pinning and never mounts this renderer. Context loss or loading failure retains the reference image. The global motion control can enable the live experience again. The hero has an accessible scene description; normal wheel, touch, Page Down and anchor navigation remain available. No audio starts automatically.

## Verification

Production export and TypeScript pass; seven existing build-domain checks pass. Browser checks cover 1280 × 900, 870 × 668, 390 × 844 and 615 × 524. Actual wheel input changes the public canvas camera/target/rotation attributes and visibly reveals different geometry; the canvas CSS transform remains `none`.

Examples measured at 390 × 844: at progress 0 the front camera angle is .680 and car rotation -.120; at .500 the camera angle is 1.425 and rotation .161. Reverse scrolling returns to the original pose. The final rear shot uses camera angle 2.350 and car rotation .300.

Workshop handoff uses the same single canvas, restores the saved bronze rim material, accepts manual rear angle 2.85 and day studio, and returns to the hero's original material on upward navigation. Reduced motion produces zero garage canvases and zero pin spacers, restores poster opacity to 1 and clears title transforms. Enquiry and receiver code are unchanged. No physical-device FPS or Lighthouse score is claimed.

## Primary technical references

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): numeric scrub, pinning, animation update timing and cleanup.
- [Three.js responsive design](https://threejs.org/manual/pages/responsive.html): canvas size, camera aspect and pixel budget.
- [Three.js glTF loading](https://threejs.org/manual/pages/load-gltf.html): use of runtime model geometry and bounds.
- [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html): invalidate rather than continuously render a settled scene.

Future additions could use authored headlight emissive maps, a higher-detail interior GLB for a door-to-cabin camera move, or an authored exploded accessory assembly. These require the corresponding model parts or texture assets; they are not simulated as nonexistent features of the supplied BMW.
