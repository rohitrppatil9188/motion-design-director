# Architecture and extension guide

## Three layers

1. **Instructions:** `SKILL.md` routes the model to relevant design guidance, a few studies, effect recipes and production/QA procedures. Most reference material is loaded only when needed.
2. **Construction:** dependency-free math/mesh helpers, local fonts, example projects and a shot-plan schema provide concrete building blocks. They do not implement every effect or a universal material renderer.
3. **Execution:** Node.js starts a temporary local server and Playwright Chromium, evaluates a canvas composition at exact times, and pipes frames to FFmpeg. Verification checks the saved mux separately.

## Main scripts

| Script | Contract |
|---|---|
| `motion-math.mjs` | normalized progress, real cubic-Bézier inversion, finite springs, stable random IDs, contours, volume samples, projection and font fitting |
| `mesh-geometry.mjs` | triangular facets, outward cube geometry and absolute-time explosion/reassembly |
| `render-utils.mjs` | bounded loopback file serving, browser/font readiness and lifecycle cleanup |
| `render.mjs` | format/timebase validation, native-frame still sampling, optional two-pass audio processing and H.264/AAC encoding |
| `synth-audio.mjs` | original deterministic stereo PCM synthesis for the OFFSET example |
| `validate-plan.mjs` | semantic timing, contiguous shots, phase lengths, fonts and audio sample counts |
| `verify-example.mjs` | font loading, arbitrary-order seek hashes, static ending and transition coverage for OFFSET |
| `verify-media.mjs` | saved-file metadata, strict complete decode, loudness/true peak and optional muted browser playback |
| `check-package.mjs` | distributable inventory, privacy scanning, local links, evidence counts and manifest integrity |

## Canvas render interface

An entry project exposes `window.ready` and `window.renderFrame(seconds)`. Metadata in `window.filmInfo` can declare `width`, `height`, `fps`, `duration`/`durationSeconds`, and `frameCount`. The renderer compares timebase values with its CLI arguments and rejects an accidental mismatch or aspect-ratio stretch.

Each call must evaluate the complete scene from absolute time. Seeded IDs, precomputed paths and immutable geometry make backwards seeks and parallel frame rendering reliable. The bundled examples also expose `window.renderAt(frame)` for diagnostics. One frame per scene is not enough to validate transitions.

The Canvas 2D examples set `fontKerning = 'normal'` for measuring and drawing text, so layout does not depend on the browser's `auto` shaping choices. Use the same shaping settings for fitting, cached measurements and actual drawing. Pixel determinism is compared within the same browser session; recorded hashes are not portable golden images across operating systems or browser versions. A failed comparison saves both original frames for inspection.

The renderer captures the first canvas. A custom DOM-only or multi-canvas composition needs a deliberate capture-target adaptation. For actual refraction, chrome, complex occlusion or lighting, use a suitable 3D renderer; the supplied gradient example is a 2D illustration.

## Units and coordinates

Math helper angles are radians. Normalized progress is 0–1. The projection helper assumes a camera on negative z looking toward positive z, with screen y increasing downward. `focal`, positions and `distance` must use compatible units. Near/far clipping returns `null` instead of projecting through the camera.

Shot ranges are half-open `[startFrame, endFrame)`. At `fps`, frame `n` is evaluated at `n/fps`; the final displayed frame starts at `(frameCount-1)/fps`. Audio uses exact sample counts; encode padding and codec peak reconstruction are checked on the saved output.

## Add a new effect or example

Define the visual intent, geometry, stable correspondence, motion law, entrance/hold/exit and the outgoing handoff. Add the smallest reusable helper needed, retain source/licence evidence for assets, then render and inspect. Register useful guidance through an existing reference link so a model can discover it without loading the whole corpus.

Keep source analysis separate from original implementation recommendations. New numerical evidence should state sampling, resolution, timestamp source, algorithm and limitations. See [methodology](../references/methodology.md).

## Preview security

The helper is a local development file server, not a public hosting server or untrusted-code sandbox. It rejects hidden/key paths and symlink escapes and checks Host/method/range boundaries. It still runs project code you supply. Read [SECURITY.md](../SECURITY.md) before adapting it to untrusted inputs or network services.
