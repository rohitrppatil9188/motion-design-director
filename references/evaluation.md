# Evaluation record — 2026-10-29

## Research verification

The package contains 50 distinct film studies, 50 unique source-stream hashes, source/watch links, 40,056 per-native-frame CSV rows, audio signal measurements and original craft observations. Two reposts were excluded and replaced. Every overview and selected transition sheet was visually inspected, totaling 4,009 review tiles with overlap. [Methodology](methodology.md) states the sampling and attribution limits. No source MP4, research still or creator soundtrack is included.

The main skill passed the skill-creator structural validator. Local Markdown links resolved. The shot plan passed full draft-2020-12 JSON Schema validation and semantic checks; an intentionally invalid plan was rejected. The 50 CSVs matched recorded frame counts and had monotonic presentation timestamps. These checks establish package consistency, not an independent verification of creator/model provenance.

## Original 15-second runnable demonstration

[OFFSET proof MP4](../assets/example/rendered/offset.mp4) · [Contact sheet](../assets/example/rendered/contact-sheet.jpg) · [Transition windows](../assets/example/rendered/transition-windows.jpg) · [Media report](../assets/example/rendered/media-verification.json)

- 1920 × 1080, 60 fps, exactly 900 decoded H.264 frames, 15.000 s, YUV420p.
- Stereo 48 kHz AAC, measured −15.37 LUFS integrated, −2.42 dBTP true peak, 1.60 LU loudness range.
- Full audio/video decode completed without reported errors; muted Chromium playback reached the end at 15 s.
- Font loads, 16 out-of-order frame hashes, stable ending and five full-coverage curtain boundaries passed.
- Scene overview, 25 encoded transition-window frames and a full-resolution gradient/type frame were visually inspected. A fractional strip seam was found and fixed; projected grid geometry was improved before the final render.
- The geometric volume, typography, masks, surface illustration and synthesized audio are original. The gradient body is an illustrated 2D treatment, not photoreal glass or chrome.
- Audio was numerically measured but not subjectively auditioned.

The final full render took about 140 s on the available Windows runtime. This is an observed run time, not a performance promise. Node 24.19.0 and Playwright 1.62.1 with installed Chromium were used; FFmpeg/FFprobe performed encoding and media checks. A lockfile is included, but a clean installation on every operating system was not tested.

## Independent model usability test

A fresh model context was given the skill package and a different brief: a finished 6-second, 960 × 540/30 fps film for fictional FIELD NOTES, cream/ink plus one accent, a letter-counter aperture, facet/module reassembly, original audio and a stable closing hold. It read the entry and selected references, used studies 35/48 and recipes 04/15/23, then created an editable project and playable film without additional clarification or external media.

[FIELD NOTES proof MP4](../assets/field-notes/rendered/field-notes.mp4) · [Contact sheet](../assets/field-notes/rendered/contact-sheet.png) · [Transition window](../assets/field-notes/rendered/transition-window.png) · [Media report](../assets/field-notes/rendered/media-verification.json)

The film contains 180 H.264 frames, 6.000 s, stereo 48 kHz AAC. Full decode and muted browser playback passed. Twelve repeated out-of-order comparisons matched, the closing 42 frames were static, and the aperture exceeded the farthest corner by 3 px. Root review inspected its overview and consecutive encoded transition frames. The module is deliberately planar vector geometry, not a shaded 3D mesh.

The test found real friction, which was addressed:

| Finding | Change | Retest evidence |
|---|---|---|
| Stills used fixed times from a 15 s example | samples now scale across the complete duration and include final frame; optional `--still-frames` | 13 samples of the 6 s film, including frame 179 |
| CLI could silently disagree with project timebase | compare declared `filmInfo` fps/duration/frame count and aspect ratio | deliberate 60-vs-30 fps mismatch rejected; no wrong video produced |
| AAC reconstruction could exceed a tight PCM peak target | add pre-encode headroom and verify saved mux | final test film measured −15.62 LUFS and −2.61 dBTP; decoded video unchanged |
| Richer plan needed carrier/freedoms/density fields | documented schema fields and `extensions` object | both example plans validated |
| Facets still required authoring geometry | added tested triangular mesh builder, cube primitive and exact reassembly helper | outward normals, surface area, finite poses and exact terminal vertices checked |

The FIELD NOTES source included here shares the supplied OFL fonts and the main renderer; it retains the independently authored film logic. No subjective audio listening was performed. Its final encode changes audio headroom, not visual quality.

## What this test does not establish

A separate baseline model, without this skill or the research, produced a strong deterministic 15-second plan and math specification; it was not rendered. Therefore there is no fair rendered baseline comparison, no known baseline failure and no quantitative improvement claim. One successful creative task demonstrates usability for that task. It does not prove consistent quality across models or automatic parity with the gallery. Typography, materials, sound and overall taste still need rendered review and iteration.
