# Audio direction and synchronization

## Evidence boundary

All 50 source tracks were numerically analyzed. None was subjectively auditioned. Per-film RMS, loudness, true peak, transient candidates and tempo candidates are supplied, but no verified musical style or perceived synchronization rating is claimed. Use the source audio only through an authorized player for listening; it is not cleared or included for reuse.

The following is independent production guidance. The bundled example uses newly synthesized sound from the supplied script, not an extracted or imitated creator soundtrack.

## Design a sound arc with the image

Give audio the same structure as the film: an opening gesture, a bed that supports development, a few designed transitions, a peak, and a resolving tail. The best impact is often the one that establishes a new state, not the loudest sound attached to every object. A nine-cell stagger does not require nine identical clicks.

Map events with explicit times and roles:

| Role | Image relationship | Construction choices |
|---|---|---|
| Opening gesture | seed, first line or title arrival | soft transient plus short tonal body |
| Bed | establishes rhythm and continuity | original synthesis or licensed music; avoid masking essential speech |
| Accent | major reveal, topology change, statement | short impact with a defined start and decay |
| Transition | camera passage, wipe, release | shaped filtered noise, pitch movement, texture tied to direction |
| Resolution | stable identity | remove busy layers, let a chord or texture decay, clean final fade |

Choose which visual event aligns with which sonic feature: anticipation can precede a hit, contact can land on the transient, and a glow can follow the decay. These offsets are deliberate. “Everything on the beat” is not sufficient direction.

## Timebase and rhythm

Use audio sample time as a precise clock. At 48 kHz, sample index `s` maps to `s/48000`; frame `f` at 60 fps maps to `f/60`. A 15 s film contains 720,000 samples and 900 video frames. The final displayed frame starts at 14.983333 s; its display duration completes 15 s. Account for encoder padding when checking a compressed audio container.

For a known original tempo, beat time is `offset + beatIndex*60/BPM`. At 128 BPM, 15 s holds exactly 32 quarter-note beats. A beat usually falls between video-frame boundaries; round or schedule visual motion with a stated policy and keep the audio at its exact sample time. Millisecond precision in a CSV does not imply a listener notices that precision.

For an existing cleared track, inspect waveform, onset envelope and tempo candidates, then listen to confirm musical phrases and accents. Autocorrelation commonly produces half/double-time candidates. Do not choose a single algorithmic BPM and force all transitions to it without verifying the actual phrase. A sustained sound can have a visual accent without a sharp onset; a sharp onset may be a minor decorative transient.

## Original synthesis

The supplied [synth-audio.mjs](../scripts/synth-audio.mjs) renders a deterministic PCM WAV using basic oscillators, shaped noise and envelopes. It has no external audio dependency. It demonstrates a layered bed, bass/pulse, restrained high transients, section swells and a resolving tail. Use it as an editable starting point, not a universal music preset.

For percussion, combine a short pitch-decaying low oscillator with a fast amplitude envelope. Use shaped noise for airy motion and small high-frequency ticks. Keep frequencies and energy controlled; adding many layers can create harshness or clipping even when each source is quiet alone. Generate stereo differences deliberately; random hard panning on every hit distracts from the picture.

Sound should have entrance, body and tail. Apply a short attack to avoid unintended digital clicks, except where a click is the intended percussion. Fade the final few hundred milliseconds to avoid a truncated waveform. Preserve exact sample count after mixing. Keep a float mix until final quantization and use dither if the pipeline calls for it.

## Mixing and measurement

Measure the finished mix, not only each stem. Integrated LUFS describes average perceived loudness over the analyzed programme; true peak estimates intersample peaks. A short film's loudness range can be limited by its length and structure. Do not treat low loudness range as proof of good dynamics or copy the loudest source track.

A reasonable general review target for this example is approximately −16 to −14 LUFS integrated and true peak at or below −1.5 dBTP, then adjust for the intended delivery specification. These are author defaults, not universal platform requirements. The example renderer uses a −2.8 dBTP pre-encode ceiling to leave room for AAC reconstruction overshoot; the encoded output still needs measurement. When using FFmpeg loudnorm, prefer a measured two-pass process if hitting a target matters. Check the resulting sample rate and duration; a filter can change them unless explicitly controlled.

Example diagnostic commands (replace paths with actual output files):

```sh
ffmpeg -hide_banner -i finished.mp4 -vn -af loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json -f null -
ffprobe -v error -show_streams -show_format -of json finished.mp4
```

An analysis-only filter invocation does not normalize the saved file. For rendering, write a real output using the intended filter settings, then analyze that output. Peak normalization alone does not establish integrated loudness. Listen at a moderate level and verify the mix on a second output device when available.

## Final sync and listening checks

- Play the muxed final file from start to end; do not infer sync from separate preview windows.
- Inspect a few major hit/transition pairs frame by frame and listen around them.
- Confirm music supports rather than hides the identity hold; leave the final decay room.
- Check unintended digital clicks, harsh highs, pumping, stereo imbalance and abrupt truncation.
- If speech exists, test intelligibility; duck the bed with a smooth envelope rather than abruptly muting it.
- If no listening tool or human audition is available, say “numerically verified; listening review pending.” Do not invent auditory observations from a waveform.

The portable package includes no source music, source SFX or implied audio-reuse permissions. Keep an asset manifest for any additional cleared sound.
