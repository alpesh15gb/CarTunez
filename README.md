# Current release: Ignition / Cinematic Garage 11.0

## Deploy to cartunez.in

See [the VPS deployment and rollback commands](deploy/README.md). The production setup uses an isolated Docker project, previews on loopback port 3016, and replaces only the legacy frontend on port 3015. Existing system Nginx/TLS and Medusa routes are preserved.

The BMW now opens with an illuminated headlight sequence, a gentle camera dolly, moving softbox light, architectural garage portals and a matte floor. Its scroll orbit has continuous velocity through the side shot. See [lighting, timing and camera tuning](docs/IGNITION-11.md).

## Previous release: Cinematic BMW Hero 10.0

The supplied BMW GLB now loads in the hero. Scroll controls an actual Three.js camera orbit, dolly, camera target and mesh rotation through front, low side and rear shots. One renderer/model is shared with the workshop. See [camera tuning, research, architecture and verification](docs/CINEMATIC-HERO-10.md).

## Previous release: Scroll Experience 9.0

See [the v9 root-cause analysis, scroll map, research, tuning and verified flows](docs/SCROLL-EXPERIENCE-9.md). This release removes the desktop-width gate that excluded the reported 870px window. Three reversible scroll scenes now cover the car reveal, exterior and aligned cabin transformation, with stronger scroll choreography throughout the rest of the page. Inter, twelve campaign images, working Pioneer preview, saved build and enquiry are retained. Earlier design/asset reference: [After Hours 8.0](docs/AFTER-HOURS-8.md).

Run `npm run build` and `npm start -- 3001` for the production preview. Build-domain checks: `node scripts/test-build.mjs`. Regenerate responsive campaign assets with `node scripts/prepare-campaign.mjs`.

# CARTUNEZ — personal by design

A complete Next.js App Router + TypeScript automotive showroom, using Inter, GSAP, Lenis and the supplied BMW M6 GT3 GLB. The full revamp includes distinct layouts from hero to enquiry, rather than repeated category cards.

## Run

Requires Node.js 20.9+.

```sh
npm ci
npm run dev
```

Production static export:

```sh
npm run build
npm start -- 3001
```

Open http://localhost:3001. Deployable output is `out/`. The supplied hosting manifest preserves the existing private Sites project. Standard Next hosting is also possible after adjusting the export/start configuration.

## Explore

- `/?experience=full`: live 3D and scroll choreography.
- `/?experience=reduced`: static BMW poster, vertical exterior story and reduced motion; comparison, selection and enquiry features retained.
- `/#cabin-studio`: matting and ambient-light comparisons.
- `/?screen=connect#audio`: expanded Pioneer-style receiver preview.
- `/enquire/`: build brief and optional budget.
- `/enquire/?intent=visit`: workshop visit brief.

The supplied number is +91 99496 95030. Enquiries open a prepared WhatsApp message for the visitor to review and send. Vehicle/preferences save in the visitor's browser; no enquiry is submitted to a website backend.

## Source structure

```text
src/app/campaign.css                Current editorial composition, tokens and responsive system
src/app/scroll-experience.css       Current cinematic scroll layouts across viewport widths
src/app/midnight.css                Workshop, build and enquiry styles
src/app/infotainment.css            Receiver applications and accessible modal
src/app/pioneer.css                 Receiver / Android Auto visual languages
src/app/cabin-studio.css            Comparison workbench
src/components/HomeExperience.tsx   Complete homepage narrative
src/components/CampaignImage.tsx    Manifest-backed responsive AVIF/WebP pictures
src/components/SignatureStory.tsx   Exterior pin across widths / short and reduced fallback
src/components/CabinScrollStory.tsx Scroll-driven factory / matting / lighting transformation
src/components/GarageWorld.tsx      Deferred workshop-only renderer and supplied model
src/components/CabinStudio.tsx      Separate matting/lighting concepts and controls
src/components/InfotainmentDemo.tsx  Working preview flows and direct app requests
src/components/ReceiverDashboards.tsx
src/components/EnquiryForm.tsx      Build/visit brief and WhatsApp handoff
src/components/SiteChrome.tsx       Navigation, Lenis, menu, cursor, transitions
src/hooks/useScrollDirector.ts      Page reveals, word scrub and photographic depth
src/hooks/useAudioDeck.ts           Original audio playback, EQ and analyser
src/lib/site.ts                    Business details, contact and categories
public/images/cabin/               Five aligned 1200×800 WebP cabin concepts
public/images/campaign/            Twelve campaign subjects in responsive AVIF/WebP
public/models/bmw-m6-gt3.glb        Optimized supplied model (~853KB)
public/audio/                      Three original 24-second previews
assets/source/campaign-v8/          Campaign PNG originals and exact prompt ledger
scripts/prepare-campaign.mjs        Sharp asset pipeline and manifest generation
docs/AFTER-HOURS-8.md               Current research, asset facts, QA and timing guide
docs/SCROLL-EXPERIENCE-9.md          Current motion research, root cause, scroll map and QA
docs/REVAMP.md                     Design system, narrative, timing and limits
docs/INFOTAINMENT.md               Receiver functions, references and simulations
docs/CABIN-STUDIO.md               Image provenance and comparison behavior
docs/ASSETS.md                     Production asset replacement requirements
```

## What works

- Twelve distinct campaign images with matching portrait hero art direction and responsive AVIF/WebP derivatives. Hero car approach/headline split, exterior scene changes, aligned cabin transformation, word scrub, photographic depth, heading masks, menu focus management and route curtain.
- Deferred live BMW reference in the workshop: front/profile/rear/three-quarter cameras, explicit orbit mode, real rim material and studio lighting changes. One renderer, capped pixel ratio, change-driven rendering and poster fallback.
- Phones use native vertical scrolling with the same three cinematic pins. Very short landscape windows and reduced motion keep all chapters in flowing layouts. Reduced motion also skips WebGL while preserving the build brief.
- Genuine visual differences between basic matting, fitted cocoa quilt and three lighting variants. Native comparison sliders, intensity, off/on and upgrade-specific WhatsApp enquiries.
- Pioneer-style receiver and separate Android Auto-style dashboard. User-triggered original music, seek/track/volume/mute, actual three-band web EQ, destination validation/Google Maps handoff, local FM tuning presets and explicitly simulated pairing/calling.
- Shared saved build, snapshot/restore/reset/share, removable preferences and four-step enquiry with car/year, upgrade categories, optional budget, notes and workshop-visit intent. Visible focus states and touch-friendly primary actions.

## Tuning and content

See `docs/SCROLL-EXPERIENCE-9.md` for the current motion system and actual verification. Page timings are in `useScrollDirector.ts`; scene timings are in `SignatureStory.tsx` and `CabinScrollStory.tsx`; camera distances are in `GarageWorld.tsx`; current scene composition is in `scroll-experience.css`. Asset provenance and future ideas remain in `docs/AFTER-HOURS-8.md`. Earlier design documents remain as release history.

Imagery is labelled as generated design concepts rather than customer work. The BMW remains a design study with visible creator/source attribution. The user confirmed separate commercial-use permission. Pioneer model/firmware is not specified, so the receiver is a representative website preview. Hardware pairing, calls, FM and GPS are not live integrations.

Supply verified workshop address/city, Google Maps location and Instagram URL in `src/lib/site.ts`. Production photo dimensions and locked-camera comparison requirements are documented under `docs/`.

The production build and TypeScript checks pass. Desktop and phone browser flows were inspected. Lighthouse, 4G LCP, physical-phone FPS and actual head-unit integration remain unmeasured.
