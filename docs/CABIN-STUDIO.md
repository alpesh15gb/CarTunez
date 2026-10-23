# Cabin studio

Story: interiors chapter → cabin studio → choose Matting or Ambient lighting → drag to compare → select lighting colour and intensity → open a prepared WhatsApp enquiry naming the selection. The visitor sends the message in WhatsApp.

The matting view compares two distinct images: basic black mats versus cocoa diamond-quilt fitted coverage. Lighting compares the unlit cocoa cabin against the selected blue, red or amber variant. Both images retain the same framing. These are generated concepts, not customer installation photographs. No fit, material specification, colour reproduction or product availability is promised.

## Files and assets

- `src/components/CabinStudio.tsx`: mode, colour, intensity, off/on state and contextual enquiry.
- `src/components/BeforeAfter.tsx`: native keyboard/touch range comparison. `muteBase=false` preserves the actual before image, `beforeLabel`/`afterLabel` describe each state, and `afterOpacity` blends the lighting variant over the unlit image.
- `src/app/cabin-studio.css`: responsive workbench. The global contact pill hides while this section is visible to avoid covering its controls.
- `public/images/cabin/{factory,matting-cocoa,lighting-blue,lighting-red,lighting-amber}.webp`: 1200×800, quality 85, 535,422 bytes combined. Lazy loaded. The image is not regenerated for brightness: only overlay opacity changes.
- `assets/source/cabin-concepts/*.png`: generated originals, 1536×1024.

The image brief: a neutral unbranded right-hand-drive Indian cabin, viewed from between the rear seats with both front footwells visible, dark charcoal seats and blank infotainment display. One factory base was generated, then edited into cocoa fitted matting and three restrained ambient-light variants. Camera and cabin geometry were preserved during edits. Built-in image generation was used, followed by Sharp WebP compression.

For production, supply matching locked-camera before/after installation photographs at 1800×1200 or larger, including the floor and centre tunnel. Keep seats, exposure, camera position and lens identical. Supply lighting-off and each offered lighting colour at the same exposure. Replace these assets and update the concept disclosure only when verified installation photographs are supplied.

## Tuning

The comparison starts at 52%; change `position` in `BeforeAfter.tsx`. Lighting intensity ranges from 20–100% and maps directly to the upgraded-image opacity; off sets opacity to zero. Colours and asset names are in `lights` at the top of `CabinStudio.tsx`. Images remain static in reduced motion, and all controls still work.

## Checks

Keyboard Home/End reached both comparison endpoints. Lighting selections changed the asset path, off set opacity to 0, and minimum intensity set it to 0.2. The WhatsApp URL included the selected lighting colour and workshop number. The before/after images and desktop/phone layouts were inspected in the browser. No physical installation, vehicle fit or phone display calibration has been tested.
