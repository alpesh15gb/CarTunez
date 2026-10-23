# CARTUNEZ / Ignition 11.0

The existing supplied BMW GLB is retained byte-for-byte. This release improves the hero's opening, physical lighting and scroll camera.

## Opening direction

The first visible 3D frame starts with a readable dark car silhouette and a red edge reflection. Between .18 and .72 seconds, the model's named `HEADLIGHT` material and its existing emissive texture turn on. The lamp locations come from the transformed projector geometry, not fixed screen coordinates. Two spotlights illuminate the floor, with restrained optical glow and anamorphic streaks that fade as the camera leaves the frontal view.

Between .35 and 2.1 seconds, overhead garage strips and two rectangular area lights come up. A moving softbox sweeps a broad highlight over the bodywork. Four structural portals, side walls, a back wall and a matte floor provide actual perspective as the camera orbits. The floor has low specular response to keep its highlights subordinate to the car.

A 2.4-second opening camera move travels a short arc and dollies toward the car. Scrolling immediately blends this move out and takes over. There is no blocking preloader or scroll lock. The small keyboard-accessible Replay ignition button repeats the light event without resetting the page or saved build.

## Camera and timing controls

- `src/lib/hero-camera.ts`: three shots with cubic Hermite interpolation. Shared tangents make camera velocity continuous through the side shot, replacing the previous stop/restart. Adjust angle, radius, height, target and turn independently. `heroIgnition` controls the finite opening sequence in seconds.
- `src/hooks/useScrollDirector.ts`: hero scrub is `.7`; scroll length remains `innerHeight * 2.4`. Headline phases finish before the next copy enters, avoiding overlapping headings.
- `src/lib/garage-lighting.ts`: area-light sizes and intensities, physical garage geometry, real headlight emission, front-facing optical glow, glass opacity and rear light material. The projector geometry determines source positions. The scattering overlay fades with camera direction; the source core keeps depth testing.
- `src/components/GarageWorld.tsx`: environment intensity/rotation, exposure, opening dolly, render invalidation and shared workshop handoff.

## Runtime and fallbacks

One GLB decode and one renderer still serve both hero and workshop. No external HDR, video, image sequence or bloom post-processing is added. Two area lights and two unshadowed spots supplement the existing lighting. Pixel ratio remains capped at 1 on phones and 1.5 on larger screens, with adaptive reduction. Once ignition and scroll movement settle, scene rendering stops. The headlight emission, glass opacity, rear emissive texture and original material values restore when the canvas enters the workshop.

Reduced motion never mounts the renderer. It retains the reference image and readable headings, with no ignition animation or replay control. WebGL failure uses the existing image fallback. Turning motion off disposes the model, garage, sprite materials/textures, renderer and listeners. No audio starts automatically.

No new user-supplied assets are required. The existing 853,488-byte BMW GLB, local DRACO decoder and 1280 × 720 BMW poster remain in use. Runtime glow texture is a tiny procedural 128 × 128 gradient. Creator attribution and the user's confirmed commercial-use permission are retained.

## Validation

Production build and TypeScript pass. Seven existing build-domain checks pass. Mathematical checks cover finite poses, a monotonic orbit, endpoint clamping, velocity continuity on both sides of .48 progress and the ignition timing endpoints. Browser checks cover desktop, tablet, phone, forward/reverse scrolling, ignition replay, reduced motion and the workshop handoff. Public canvas attributes expose camera position, car rotation, headlight power, garage power and ignition state for verification. No Lighthouse or physical-device FPS result is claimed.

Primary references: [Three.js rectangular area lights](https://threejs.org/docs/pages/RectAreaLight.html), [area-light uniforms](https://threejs.org/docs/pages/RectAreaLightUniformsLib.html), [PBR materials](https://threejs.org/docs/pages/MeshStandardMaterial.html), and [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
