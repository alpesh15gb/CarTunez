# Interactive infotainment screen

The visitor story is: Audio chapter → embedded Pioneer-style receiver → expanded receiver → choose a source or switch to an Android Auto-style dashboard → complete an app flow → close and return to the same chapter. Direct link: /?experience=full&screen=connect#audio. Closing removes the screen query parameter. This is a website preview, not running Pioneer firmware, Android OS or an actual Android Auto session. The exact Pioneer model/firmware is unspecified; the interface is representative.

## Working flows

- Receiver: blue native-style wallpaper, large clock, media widget and six favourite sources. Receiver/Android Auto switches stay available. Sources include Radio, Bluetooth Audio, Android Auto, USB Audio, Phone and Settings. App drawer includes navigation and recently used apps. Clock shows India time and updates each minute.
- Android Auto dashboard: right-hand-drive layout with map nearest the right-side navigation bar, music and phone cards alongside. Tapping a card opens its full app; the dashboard button returns to the split view. Navigation and media state carry between views. Phone layout stacks cards without shrinking touch targets.
- FM: local frequency tuning 87.5–108MHz in 0.1 steps, FM1/FM2 banks and six presets per bank. Switching to radio pauses preview music. Explicit tuner simulation, no terrestrial broadcast playback.
- Music: three original 24-second MP3 previews; explicit Play only, pause, previous/next, track selection, seek, volume, mute and actual Web Audio bass/mid/treble filters with presets. The spectrum uses an AnalyserNode; reduced motion uses a static display. No media is autoplayed. Closing or leaving the demo stops playback; entering a demo call pauses it.
- Maps: destination validation, an explicitly illustrative route preview, start/stop preview, and an encoded real Google Maps directions URL. No invented distance or ETA and no GPS permission. A live embedded map is not implemented.
- Bluetooth: explicit simulation, discover sample phones, pair/disconnect, switch Bluetooth off/on and carry the connected state into the system bar. No hardware Bluetooth access.
- Phone: keypad and editable number, delete digit, validation, simulated call/timer, mute and end call. No microphone or real call. A separate labelled tel link calls the workshop using the visitor's phone.
- Settings: real preview volume/EQ, brightness scrim, key illumination colour preference, demo Wi-Fi indicator, reset. Native receiver and Android Auto retain their own blue/green visual languages. The simplified three-band web EQ is not a claim about hardware EQ band count. Only sound/display preferences persist locally under cartunez-headunit-v1. Destinations, typed phone numbers and pairing state are not stored. Storage denial falls back to session state.

## Main files

- src/components/InfotainmentDemo.tsx — launcher, app flows, accessible expanded dialog, focus return, inert background, Escape/Tab handling and cleanup.
- src/components/ReceiverDashboards.tsx — Pioneer-style receiver home, Android Auto split dashboard and illustrative SVG map.
- src/hooks/useAudioDeck.ts — native audio playback, lazy Web Audio graph, playback race cancellation, seeking and teardown.
- src/app/infotainment.css — embedded physical device, responsive apps and expanded screen.
- src/app/pioneer.css — separate receiver and phone-projection visual systems and responsive layouts.
- scripts/prepare-demo-audio.mjs — deterministic original instrumental previews. Requires FFmpeg to regenerate, not to run the site.
- public/audio/*.mp3 — around 241KB each, loaded on user playback. No third-party music recordings.
- scripts/serve.mjs — local static preview supports audio/mpeg and valid HTTP byte ranges for seeking. Production uses Sites static hosting.

## Verification

Production compilation and TypeScript pass. Browser checks confirmed native audio playback with duration 24 seconds, pause, seek to 0.1 seconds, next-track source change and playback, saved EQ/volume after reload, reset, map validation and encoded directions link, pairing, call validation/mute/end, audio pause during calls, Escape close with playback paused, focus return and scroll unlock. Shift-Tab wraps inside the dialog. Background content becomes inert. Phone layout inspected at 390×844 and works in Reduced mode.

The local audio response returned HTTP 206, Content-Type audio/mpeg, Content-Range bytes 0-99/240893 and exactly 100 bytes. Physical phone speaker quality, Safari hardware behavior and actual Android head-unit integration remain untested.

Reference: https://developers.google.com/maps/documentation/urls/get-started — directions handoff format.
Reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode — media-to-EQ/analyser graph.

## Manufacturer and platform references

Pioneer was supplied by the user. The receiver/source/widget structure was informed by the official DMH-ZF9350BT / ZS9350BT / Z6350BT manual, home menu on printed page 15 and sources on page 43: https://pioneer-india.in/media/product/car-entertainment/DMH-ZS9350BT/OPM_DMHZS9350BTGS_EG_B%20%281%29.pdf . Current product feature reference: https://pioneer-india.in/consumer/display-audio-solutions/car-stereos/dmh-zf9650bt/ . These are references, not claims that the workshop stocks those specific models.

Android Auto dashboard and right-hand-drive navigation placement: https://developers.google.com/cars/design/android-auto/product-experience/system-ui/content-area and https://developers.google.com/cars/design/android-auto/product-experience/system-ui/nav-bar . Maps remain illustrative and calling/pairing/FM remain simulations, explicitly disclosed in the UI. Native receiver settings and phone projection are separate experiences.
