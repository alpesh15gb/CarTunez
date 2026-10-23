# CARTUNEZ — Inter and BMW refinement

The homepage uses one dynamically loaded Three.js renderer shared between the hero, body-kit study and closing scene. GSAP ScrollTrigger controls real camera motion. Inter is self-hosted through next/font and used throughout headings, body copy, navigation, buttons and forms. The supplied raster brand logo remains intact.

## Vehicle

The user supplied BMW M6 GT3 Shiny & Evil by Alex.Ka. The original 12,976,032-byte GLB is preserved in assets/source/bmw-m6-gt3-original.glb. The web copy, public/models/bmw-m6-gt3.glb, is 853,488 bytes after Draco geometry compression, texture deduplication and WebP textures capped at 1024px. Every mesh and original material/artwork is retained in the file. The file's own floor and shadow plane are hidden during display so the studio supplies a consistent stage. No artificial paint recolouring or extra Ferrari kit geometry is applied.

Embedded metadata lists CC BY-NC-ND 4.0. In this conversation the user explicitly confirmed separate commercial-use permission. Visible author/source/licence attribution is retained in the footer; archive that permission with production brand records. This is an independent visual study, not a claimed customer build or manufacturer endorsement.

A matching 26,742-byte BMW WebP poster renders while the model loads, in reduced motion, or after WebGL failure. It was captured from the actual 3D studio.

## Scenes and controls

- Hero: cinematic quarter view, real orbit/dolly, perspective text exits, discovery message and outgoing shutter. Pin distance +115% desktop, +75% smaller screens.
- Interiors: perspective image entry, scrubbed finish wipe, drawn stitching and material directions. Desktop pin +75%.
- Body kits: the same BMW returns in a close study. Camera buttons offer front, profile, rear and scroll orbit; projected labels follow the car. Desktop pin +130%.
- Audio: dashboard depth/boot, interface reveals, speaker/cone motion, rings and velocity-responsive equalizer. Silent throughout. Desktop pin +70%.
- Performance: angled gauge, scrubbed needle/RPM and subtle depth grid. Daily/touring copy replaces unverifiable numeric placeholders. Desktop pin +70%.
- Products: five original lightweight SVG studies and a horizontal product rail.
- Gallery/trust: depth entries, native keyboard/touch comparisons, gallery parallax and pointer-only tilt. Concept images remain explicitly labelled.
- Build process: three readable steps connect inspiration with an enquiry and workshop visit.
- Closing: shared BMW scene behind the enquiry CTA, marquee and oversized Inter footer.

## Tuning

Edit timeline distances/eases in src/hooks/useScrollDirector.ts. Camera radius, target height, studio lights, model normalisation and view interpolation live in GarageWorld.tsx. Entrance easing uses power3/expo; scrubbed state is linear with 0.65–0.7s catch-up. Responsive type/spacing are in src/app/refinement.css after the base globals.css. Both font aliases resolve to Inter.

The .view-options controls update world.view without React renders at frame frequency. The Three.js module loads only in Full mode. Rendering idles after scroll/pointer/view changes settle; DPR is capped at 1 for phones and 1.5 for desktop. Materials, textures, geometry, decoder and renderer are disposed on teardown. No live shadow maps, bloom or autoplay audio.

## Motion policy

Normal visits respect the OS setting unless a visitor saves a preference. Navigation controls explicitly switch between Full and Reduced. /?experience=full opens the immersive review; /?experience=reduced opens the calm layout. Reduced unmounts WebGL and removes pins, preserving all content and enquiries.

## Outstanding real content and measurements

Workshop address, Maps and Instagram are configurable in src/lib/site.ts and remain absent until verified. The phone and WhatsApp are +91 99496 95030. Replace gallery concepts with registered before/after customer photography when supplied. Physical mid-range Android frame rates and mobile Lighthouse/LCP still require measurement; no 60fps or 90+ score is certified.
