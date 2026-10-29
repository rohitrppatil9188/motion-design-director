# Review the rendered result

Use this as an inspection guide, not a word-matching test. A source file can look correct while the final video has a fallback font, bad z-order or missing audio.

## First assess the idea

Can a viewer explain the relationship between the opening, main development and ending? Does the carrier have a purpose? Does each showcase mechanism change something, or are shots interchangeable demonstrations? If the film feels generic, remove an unrelated effect and strengthen a visual consequence. More particles will rarely fix weak direction.

Compare the result to the intended direction and 2–4 selected studies. Compare hierarchy, transitions and density rather than demanding identical frames or branding. Keep the reference distinction: observation is evidence; proposed implementation is a creative choice.

## Typography and composition

- Pause at stable reading states. Check actual font faces, cap-height rhythm, kerning/tracking, baseline and optical alignment.
- View at approximately 360–480 pixels wide. Is essential copy readable? Count settled reading time after the final stagger, not from the first glyph's entrance.
- Check intended bleed versus accidental crop; include descenders, accents and long words in the review.
- Does the final identity get a clear, stable hold? Is the hierarchy still strong without movement?
- Remove tiny meaningless labels if they compete with the main form. Detail should reward attention rather than demand it.

## Motion and continuity

Inspect five-frame native windows around each designed handoff and around automated high-change peaks. At 60 fps, sample the adjacent frames as well as wider context; a 0.5 s contact sheet can miss a seam.

For a morph, check point/vertex count, winding, start phase and shared bounds. For a handoff, compare screen position, silhouette, colour, camera and velocity. For a full-frame wipe, test all corners at the replacement moment. For a depth shot, inspect near-plane crossings, far-to-near order, perspective consistency and alpha handling.

Render a few frames in reverse/random order and compare pixel hashes with the same frames rendered in order. This detects hidden accumulated state. Test first/last frame and boundary ownership. A stable ending should remain identical when the plan calls for a static hold.

Check physical intent: contact before rebound, no arbitrary energy gain, coherent force direction, appropriate overshoot and settling. Uniform travel may be linear; do not force springs onto everything. A camera should not change focal length or vanishing point accidentally during an inherited geometric transition.

## Colour, surface and delivery

Check flat fields for banding, gradient contours for seams, outlines for compression loss and patterns for shimmer. View moving chrome/glass, not only a still. A convincing material requires coherent light, reflection, depth and silhouette. If the chosen treatment is illustrated, evaluate it as illustration and describe it honestly.

Avoid accidental rapid full-field flashing. Test high-contrast optical patterns in actual motion; reduce their speed/contrast/density when they become uncomfortable. If delivering an interactive preview, respect reduced-motion preferences; a source's “reduced motion” joke is not an instruction to ignore accessibility.

## Audio and technical checks

Decode the final file from beginning to end with FFmpeg; a successful mux is not proof every frame decodes. Confirm frame count, fps, dimensions, duration and the expected audio stream. Measure integrated loudness and true peak on the saved output. Check tail/padding and sync on the finished mux.

Listen when available. Evaluate harshness, clicks, balance, meaningful accents and the ending. A numerical waveform/loudness check does not substitute for audition; record “listening review pending” if that is the actual state.

Example commands:

```sh
ffprobe -v error -count_frames -show_streams -show_format -of json out/offset.mp4
ffmpeg -v error -i out/offset.mp4 -f null -
ffmpeg -hide_banner -i out/offset.mp4 -vn -af loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json -f null -
```

The bundled `scripts/verify-media.mjs` combines saved-file format, complete decode, audio measurement and optional muted Chromium playback checks into a JSON report. It accepts expected width/height/fps/duration/frame count, `--require-audio` and `--max-true-peak=-1.5`. Run `node scripts/verify-media.mjs --input out/offset.mp4 --playback` for the basic check; supply an existing Playwright `--module-root` if necessary. Muted playback proves browser decoding, not that the sound was heard.

## Useful critique categories

| Symptom | Likely cause | Concrete next action |
|---|---|---|
| “It feels like a template” | same composition and movement law in every shot | change framing/density and make one transformation cause the next |
| “The type feels cheap” | fallback face, weak mass, poor fit or unplanned spacing | verify font, measure glyph bounds, redesign hierarchy and reading hold |
| “The shapes feel random” | unstable IDs, unrelated phase or too many channels | define one spatial delay field and preserve a stable channel |
| “The 3D feels flat” | no occlusion/parallax or inconsistent projection | use real shared camera geometry, depth sort and proper surface treatment |
| “The pace is exhausting” | constant peak density, no reading/settling interval | remove a shot, extend a hold, lower detail and use a purposeful cut |
| “The transition pops” | layer removed before coverage, mismatched endpoint | inspect adjacent frames; compute coverage and share endpoint geometry |
| “The sound feels pasted on” | uniform impacts and no phrase-level structure | choose fewer meaningful accents and align the sound arc with the density arc |

Record the three largest concrete issues, fix the largest first, and inspect the changed region. State remaining limitations. Do not invent a numerical “premium score” or claim controlled improvement from one example.
