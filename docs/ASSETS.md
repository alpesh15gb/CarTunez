# Current BMW asset

The supplied original GLB is archived at assets/source/bmw-m6-gt3-original.glb. Web runtime: public/models/bmw-m6-gt3.glb (853,488 bytes). Matching poster: public/images/bmw-studio-poster.webp (26,742 bytes). Rebuild with node scripts/prepare-bmw.mjs followed by the absolute source GLB path. Existing generated gallery concepts are retained and labelled. See 3D-IMPLEMENTATION.md for attribution and permission context.

# Production assets to supply

The active exterior experience now uses the licensed 3D vehicle and illustrative kit described in [3D implementation](3D-IMPLEMENTATION.md). The frame manifest below belongs to the retained optional sequence component; it is not the current active body renderer.

Supply clean original files without text overlays. Keep labels and callouts in HTML for accessibility and responsive positioning. The page currently uses generated concepts and your original supplied logo.

| Asset | Preferred master | Web delivery | Notes |
| --- | --- | --- | --- |
| Hero garage | 2400×1600 or larger | Desktop 1600w; mobile 900×1200; WebP/AVIF | Car in lower half, empty dark top third, whole car in desktop crop |
| Flat logo | SVG preferred; transparent PNG ≥1000w | SVG or WebP 450w | Original supplied PNG is preserved in assets/source; a flat transparent mark improves small-size contrast |
| Factory cabin | 1800×1400 | 1000–1400w WebP | Same lens, crop, light and camera position as custom cabin |
| Custom cabin | 1800×1400 | 1000–1400w WebP | Show actual seating, stitching, materials; exact registration for wipe |
| Material macros | 600×600 each | 300×300 WebP | Leather, Alcantara, diamond quilting |
| Body transformation | 60–120 frames at 1600×1000 | Prefer 1280×800 WebP, target ≤50KB/frame | Locked exposure, no camera jumps, stable background; stock → kit, gentle controlled orbit |
| Sequence mobile poster | 900×1000 | WebP ≤100KB | One clear final frame; mobile does not download sequence |
| Dashboard | 1800×1400 | 1200w WebP | Actual installed screen and cabin, screen UI separate where possible |
| Speaker close-up | 1000×1000 | 700w WebP | Centre-aligned cone for subtle scale pulse |
| Product photos | 1000×1000 each | 500w WebP | Exhaust, intake/filter, roof rack, lighting; consistent dark background |
| Customer comparisons | At least 3 before/after pairs at 1800×1200 | 1000w WebP | Camera-aligned, written permission, verified model and scope; no number plates or people without consent |
| Craft details | 1600×1600 | 800w WebP | Stitching, wheel finish, trim, clean installation |
| Social card | 1200×630 | JPEG/WebP | Current generated OG image is provided |

## Replace the current concepts

`public/images/hero-1600.webp`, `hero-1000.webp`, `hero-mobile.webp`, `interior-1000.webp`, `hero-detail.webp`, and `og.jpg` are the active assets. Source PNGs live in `assets/source/`. `npm run assets` regenerates the current variants using Sharp.

`BeforeAfter.tsx` currently uses one image twice, with a muted base treatment. For genuine before/after, pass independent `beforeImage` and `afterImage` props and set `concept={false}`. This removes the muted base filter and switches the labels to BEFORE / AFTER. Replace the two interior wipe images with a matched factory/custom pair too. Do not label the present generated images as customer work.

## Enable the real body sequence

Put frames in `public/images/body-sequence/` and fill the ordered manifest:

```json
{
  "frames": [
    "/images/body-sequence/frame-000.webp",
    "/images/body-sequence/frame-001.webp",
    "/images/body-sequence/frame-002.webp"
  ]
}
```

Use all 60–120 ordered paths. The loader only accepts this local directory, caps the list at 120, loads on approach, prioritises the requested frame and neighbours, and retains a maximum of 14 decoded frames. Images with missing paths fall back to the nearest loaded image/poster. Set callout positions in `globals.css` and timeline timing in `HomeExperience.tsx` to match the real sequence. The four callouts currently enter in order; no supplied geometry or frame numbers are assumed.

## Verified business content

Still supply: street address, city, correct Google Maps location URL, Instagram profile URL, actual product lines, installation scope, applicable warranties, and verified performance figures if you want numerical claims. Phone and WhatsApp use the supplied 9949695030 with Indian country code +91.

## Generated image provenance

Built-in image generation was used; no external stock photography or customer images were represented as real builds.

### Hero prompt

Use case: ads-marketing. Cinematic automotive website hero photograph, landscape 1536×1024. An unbranded silver low-slung modified sports coupe, front three-quarter view, nose facing left, across the lower middle of a vast almost black industrial garage. Entire car and wheels visible, approximately 70% of image width; dark negative space in upper 35%; concrete floor with restrained reflections. Silver bodywork, graphite wheels, tasteful widebody and splitter, white headlights, subtle red underlight reflection. One overhead strip light, fine roof and hood highlights, high contrast with visible contours and subtle haze. Photorealistic. No people, text, logos or watermark.

### Interior prompt

Use case: product-mockup. Landscape 1536×1024. Close cinematic view from the passenger door into a bespoke right-hand-drive cabin. Cognac tan leather seats, diamond quilting, contrast stitching, black dashboard and Alcantara roof, restrained red ambient strip. Editorial automotive photography; intimate, premium, dark workshop outside, soft directional light, deep shadows, tactile leather. Front seat foreground, steering wheel visible in background. No people, logos, text, watermark or graphic overlays.

Saved originals: `assets/source/hero-source.png` and `assets/source/interior-source.png`. Your supplied logo is preserved as `assets/source/cartunez-logo-original.png`.
