# Production: from direction to playable film

## Engine choice

Choose based on the hardest required shot, not familiarity alone. Canvas 2D is efficient for masks, type, repeated fields, projected points and illustrated gradients; SVG is useful for vector paths and text layouts. Actual chrome, refraction, complex mesh occlusion and physically plausible lighting benefit from WebGL/Three.js or a dedicated 3D renderer. A video composition framework can provide timeline/export facilities around either approach.

This package's example uses Canvas 2D with a projected point volume and an illustrated gradient body. It does not implement a photoreal material renderer or supply a universal shader library. Adapt the craft recipes to the selected engine. If using an external framework, consult its current official documentation for installation and render contracts.

## Portable time contract

Use one canonical clock. At `fps`, evaluate frame `n` at `n / fps`, with integer frame IDs 0 through `frameCount-1`. Use half-open intervals so a boundary belongs to exactly one scene. Do not use wall-clock time, incremental springs, accumulated canvas trails or per-frame randomness in the render path. The plan schema also supports `carrier`, `freedoms`, a normalized `densityCurve`, and an `extensions` object for project-specific details.

```js
const t = frame / fps;
const u = clamp((t - startSeconds) / durationSeconds);
const x = lerp(startX, endX, ease(u));
```

Precompute immutable seeds, contour samples, glyph point sets and simulation caches before rendering. If physics is necessary, integrate on a fixed time grid from a fixed initial state and cache it, then interpolate at arbitrary requested times. Seeking backwards must give the same output as forward playback. For selective motion blur, evaluate geometry at deterministic subframe offsets; do not blend a previous render's pixels.

Use local coordinates for reusable objects and one transform hierarchy for each spatial group. Separate content data from motion laws and rendering. Keep material state and typography measurements independent from the order scenes are visited.

## Workflow with review artifacts

1. **Brief and direction:** one sentence, carrier, invariants, palette/type roles and the remembered final message.
2. **Shot plan:** contiguous frame ranges with entrance/hold/exit, object list, law, outgoing handoff, inherited invariant and audio events. Copy `assets/example/shot-plan.json`, then change the actual content. Use `scripts/validate-plan.mjs` to check its timing contract.
3. **Style frames:** inspect at native and phone scales before animating every detail. Include one challenging transition midpoint, not only polished end states.
4. **Mechanism prototype:** implement the hardest morph/material/camera handoff first. If it cannot work convincingly in the engine, change the engine or deliberately change the treatment.
5. **Full timeline:** add simple shots and continuity, then sound and selective polish. Render early enough to discover tempo and readability problems.
6. **Finished render and QA:** decode the result, inspect a contact sheet and event windows, play the finished mux, fix concrete defects, and provide the editable source.

Keep a bounded review loop. “Looks premium” is not a useful bug report; “the last glyph lands two frames before the next wipe, so the word is unreadable” is actionable. Re-render a short changed section before a full expensive render when appropriate.

## Example's rendering interface

The supplied `assets/example/index.html` loads two local OFL fonts and `film.mjs`. It exports:

```js
await window.ready;
window.renderFrame(seconds); // full scene evaluation at absolute time
window.renderAt(frame);      // same at 60 fps
window.filmInfo;             // dimensions, fps, duration, frame count
```

The interactive preview uses requestAnimationFrame only to choose a display time. The composition itself is deterministic. Preview controls are removed in render mode. Browser preview plays visuals only; the exported MP4 contains the newly synthesized audio.

`render.mjs` serves the project temporarily on a random loopback port, opens a headless browser, waits for fonts/ready, captures exact frames and sends PNGs to FFmpeg. It closes the browser and server on completion/failure. It requires an even output size for YUV420 video, rejects an existing output unless `--overwrite` is explicit, and stores stills and a render report beside the output. An explicit `--module-root` can reuse an existing Playwright installation without changing the portable source.

If adapting the renderer to another project, keep the entry inside `--root`, expose the same absolute-time function and a first canvas, and make CSS render mode hide UI. The renderer captures that canvas; HTML-only compositions require a corresponding capture target change. Do not assume a headless screenshot tool is a generic video export for arbitrary web apps.

## Font and asset reliability

Bundle licensed assets or resolve supplied local files before rendering. Await real font loading and check browser network errors. Font fallback can change line breaks, glyph bounds and masks while still producing a valid video file. Use the packaged font manifest and OFL notices; new fonts/images/audio need their own provenance.

The example rasterizes at 1920 × 1080 and can be captured at a lower CSS size for review. To change aspect ratio, redesign composition/shot layouts and the actual canvas, not just output dimensions. The bundled fixed landscape composition will stretch if captured at a different aspect ratio; this is a review convenience, not an aspect-ratio adaptation engine.

## Resource budget

Start with a native 60 fps render only when the mechanism needs it or the brief asks. A 15 s film has 900 frames at 60 fps; a complex path/material can dominate render cost. Precompute geometry, cache font bounds, cull invisible points, avoid unnecessary full-screen filters, and inspect a lower-resolution review before final rendering. Optimize the expensive mechanism without weakening the visual direction.

The example has 1,900 persistent points, 55 grid modules and a few vector/type layers; it is intended to run on an ordinary desktop using a CPU-assisted browser capture. It is not a benchmark of real-time playback on all devices. The included numerical research is roughly a few megabytes; load individual studies rather than all CSVs into a model context.

## Delivery contents

Provide the final MP4, editable HTML/JS or chosen-engine project, shot plan, original/cleared audio and asset notices. Include a compact report stating measured format, what was visually inspected, what was listened to, and any limits. If a render fails, preserve source and diagnostics, fix what is possible, and describe the failure accurately rather than presenting a plan as a finished video.
