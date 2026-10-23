> Current implementation uses Inter exclusively and the user-supplied BMW. See 3D-IMPLEMENTATION.md for the refined system; original plan below is retained as design history.

# The midnight workshop

## Core idea

An automotive launch image opens the story. The page then moves from a personal statement into four distinct forms of customisation. Every chapter gives the visitor something specific to understand and an obvious route to discuss it. The tone is confident, quiet and tactile.

## Design system

| Token | Value / use |
| --- | --- |
| Canvas | #0A0A0B |
| Raised surfaces | #141416 / #101012 |
| Primary text | #F2F0EB |
| Secondary text | #A3A3A7 |
| Primary accent | #FF2D3D; CTAs, indices, detail lines |
| Logo accent | #00A9EE; supplied identity and focus rings |
| Hairlines | White at 13% opacity |
| Display | Syne 600–800; wide silhouette, tight tracking |
| Body | Manrope variable; self-hosted via next/font |
| Hero type | clamp(86px, 10vw, 165px); phone 14.2vw because Syne is very wide |
| Chapter type | Approximately 36–65px; 34–60px on phone |
| Body copy | 11–14px, 1.9 line height |
| Labels | Small, spaced technical captions; not used for long reading |
| Spacing | 8px rhythm; 5vw desktop gutters, 22px phone gutters |
| Shape | Square panels, fine borders; circles reserved for instruments and controls |
| Texture | Very light SVG grain, vignette, restrained headlight glow |

## Motion tokens

| Intent | Timing |
| --- | --- |
| Heading/section entrances | 1–1.2s, power3.out or expo.out |
| Element stagger | 0.08s |
| Scroll scrub smoothing | 0.8 |
| Desktop chapter pin | +75% viewport scroll |
| Micro-interaction return | 0.4–0.6s |
| Route curtain | 0.5s in, 0.65s out |
| Intro preloader | At most about 1.45s; once per session |

## Section order

1. Logo mask and creative counter; never waits for below-fold images.
2. MAKE IT / YOURS. Silver coupe, dark workshop, technical caption, clear exploration cue.
3. Word-revealed statement ending in red: Your car. Your signature.
4. Chapter index and four sections: touch/texture; exterior form; sound/connectivity; capability.
5. A labelled concept gallery with draggable comparisons. Real customer photography replaces concepts later.
6. Trust through a clear process: fitment, installation, pricing/coverage clarity and direct contact.
7. Large enquiry prompt with WhatsApp primary, visit and call secondary.
8. Contact footer and oversized scroll-revealed wordmark.

## Mobile and accessibility decisions

- Native touch scrolling, no pinned chapters below 1100px, no canvas frame loading below 1100px.
- Desktop-only cursor, magnetism and tilt. Motion preferences disable animated reveals and pins.
- Semantic headings and landmarks, descriptive image alternatives, one accessible statement rather than word-by-word screen-reader noise.
- Range inputs support keyboard and touch comparisons. Focus rings are electric blue.
- The full-screen menu traps focus, supports Escape and makes underlying content inert.
- No sound playback. The dashboard is a visual study, not a functioning entertainment system.
- Do not invent customer testimonials, build volumes, horsepower results, workshop addresses or warranty promises.

## Build order

Foundation and contact configuration → global chrome → hero and statement → individual category interactions → gallery → trust and CTA → enquiry route → responsive checks → production build and private preview.
