---
name: motion-design-director
description: "Create polished short motion-design films: kinetic typography, transforming geometry, optical fields, dimensional particles, brand and product motion, deliberate transitions, and synchronized original audio. Use for bold 10–30 second showreels, studio idents, launch films, motion posters, or improving a flat or generic motion piece. Includes 50 source-attributed Opus 5.5 film studies, concrete effect recipes, deterministic animation math, and an original runnable 15-second example."
license: "MIT for original text and code; bundled fonts use SIL OFL 1.1. See LICENSE and assets/fonts/."
---

# Motion Design Director

Produce an authored motion film, with a clear visual proposition, changing density, convincing transformations, readable typography and a finished sound mix. The reference corpus is a vocabulary to reason with, not a storyboard to copy. A film can be editorial, geometric, material, playful or product-led.

## Load only the needed depth

1. Read [design-system.md](references/design-system.md) for direction, typography, colour and composition.
2. Select 2–4 relevant studies using [study-index.md](references/study-index.md); read those individual files. Each contains a chapter map, detailed observations, measurements and source links. Do not load all 50 by default.
3. Read the relevant sections of [effect-recipes.md](references/effect-recipes.md) before implementing the selected effects.
4. For sound, use [audio-direction.md](references/audio-direction.md). For implementation, use [production.md](references/production.md). Finish with [quality-review.md](references/quality-review.md).
5. If asked about the research or provenance, read [methodology.md](references/methodology.md). Measurements are in `references/measurements/`; they are supporting evidence, not prompt filler.

## 1. Establish the film

Infer sensible defaults when the brief is clear. Ask only for information that changes the result materially and cannot be inferred. For an open brief, default to 15 s, 1920 × 1080, 60 fps, a fictional or supplied brand, original geometric assets, and original synthesized audio. Respect requested dimensions, duration, engine, style and sound.

Write a compact direction before coding:

- One sentence: what changes, and what the viewer should remember.
- One carrier: a glyph, line, keyframe diamond, aperture, tile, card, path or product object. It can reappear or transform; a bouncing dot is optional.
- Three visual invariants: for example cap-height rhythm, a particular corner geometry, and a cobalt/cream polarity. Vary everything else with purpose.
- Typography roles, colour roles, compositional grid, material rules and the intended energy arc.
- Two or three showcase mechanisms and why they belong to this concept.

Choose a direction, rather than stacking unrelated effects:

| Direction | Start with these studies | Useful mechanisms |
|---|---|---|
| Swiss/editorial | 01, 30, 34, 37 | wide/italic contrast, grid-to-depth handoff, optical fields |
| Condensed kinetic poster | 03, 13, 24, 46 | cap-height mass, per-word laws, hard masks, decisive cadence |
| Procedural geometry | 11, 19, 25, 38 | point/line/plane, tessellation, sphere/torus, camera passage |
| Material/dimensional | 09, 21, 35, 47 | matched silhouettes, extrusion, faceted reassembly, refraction |
| Quiet expressive brand | 17, 31, 44, 48 | controlled seed, unusual serif/lowercase, shape identity, generous hold |
| Product/portfolio story | 18, 26, 32, 40, 45, 51, 52 | explain a transformation, consistent UI geometry, selected focus |

The numbers refer to IDs in the study index. Select for mechanism and intent, not claimed model superiority.

## 2. Design the timeline

Use absolute frame ranges `[start, end)` with no gaps. Make each shot declare entrance, readable hold, exit, dominant object, motion law, outgoing transition and inherited invariant. Use [the shot-plan schema](assets/templates/shot-plan.schema.json) and [example plan](assets/example/shot-plan.json) as concrete formats.

For a 15 s film, a useful starting structure is: an immediate clear gesture; 2–3 s of typographic proposition; a longer geometric or spatial development; one peak of density or material surprise; a resolving statement; a 1.5–2.5 s identity hold. This is a recommended starting structure, not a measured universal formula. Change it when the idea benefits.

Draw a density curve as well as a beat grid. Alternate large/empty, intricate/spatial, large/empty. Give each important word a stable reading interval. A rapid montage is most effective after the vocabulary is established. Use a deliberate cut when it provides clarity; continuity does not require constant morphing.

For each transition, state the geometry at the handoff: screen bounds, contour, colour, velocity, camera and layer order. A hole in a letter can become an aperture; a grid cell can grow to fill the frame; a line can become a depth plane. Prove full coverage before removing the previous scene.

## 3. Make the image strong before animating it

Render 3–5 still style frames: opening/proposition, most complex middle shot, maximum transition coverage, and final identity. Check them at native resolution and at phone size.

- Fit type from actual glyph bounds. Use licensed fonts already available or the bundled Barlow Condensed/Inter pair. Use two type roles intentionally; an italic serif is optional and must have its own licensed font.
- Use dominant typographic mass, subordinate useful information, and clear negative space. Avoid filling corners with meaningless labels to simulate sophistication.
- Define colours by function: ground, ink, primary accent, optional contrasting field. A flat cobalt background is a flat colour, not a gradient.
- Give dimensional surfaces an actual lighting/reflection model when the brief calls for chrome, glass or refraction. A blurred circle is not a substitute for every material.
- Align key edges and use repeatable modules. Design the closing mark from the established geometry when suitable.

## 4. Implement exact, inspectable motion

Choose the simplest engine that can convincingly render the chosen mechanism. Canvas/SVG are good for 2D typography and fields; WebGL or a 3D renderer is appropriate for genuine materials and occlusion. Remotion, GSAP or HyperFrames may host the composition if available; this skill does not require them. Follow their current contracts when using them.

Every visual property must be a function of absolute time and stable IDs. Use seeded randomness, persistent point correspondence, and fixed data. Render frame `n` at `n / fps`; the last frame is `(frameCount - 1) / fps`. Evaluate a whole scene afresh so seeking backwards or rendering in parallel cannot change it.

[motion-math.mjs](scripts/motion-math.mjs) supplies tested interpolation, cubic Bézier inversion, finite-duration springs, polar morphs, 3D projection, deterministic points and grid waves. Import or adapt it. It is not a full renderer. [The original example](assets/example/index.html) shows the rendering contract and layered composition.

[mesh-geometry.mjs](scripts/mesh-geometry.mjs) supplies stable triangular facets, a cube primitive and exact absolute-time explosion/reassembly. Use it for a starting mesh; choose a real 3D renderer when materials or occlusion require one.

For each effect, specify construction, timing and failure checks before adding polish. Give objects entrance, hold and exit phases. Preserve correspondence in morphs; maintain z-order and near clipping in depth shots. Make scale, rotation and shape change express the same force. Keep essential text crisp while selectively blurring fast geometry.

## 5. Compose sound with the film

Use original synthesis, cleared music or assets with an appropriate licence. Source-film audio is not included or cleared for reuse. Plan a bed, a few intentional impacts, transitions and an ending; silence and decay are part of the composition.

Map important visual events to audio time. Tempo detection is a hypothesis until listened to; an onset detector does not identify a kick, a beat or the intended accent. Render audio to an exact sample count, measure loudness/true peak, and audition the finished mux when listening is available. State any listening limitation honestly.

## 6. Render, inspect, fix

Use the bundled example to check the local toolchain, then create the requested film in the user's output directory. Copy needed helpers/assets rather than editing the installed skill for every project. See [INSTALL.md](INSTALL.md) for runnable commands and dependencies.

Render a low-resolution review if the scene is expensive, inspect it, then render the final deliverable. Check transition windows at native frame intervals, not only one still per scene. At minimum verify:

- exact duration/frame count, requested dimensions/fps, valid video and expected audio streams;
- actual loaded fonts, complete glyphs, intentional crop and readable holds;
- deterministic out-of-order seeking, continuous inherited geometry, complete mask coverage;
- depth sorting, coherent motion laws, no unexplained black frames or accidental flashes;
- finished sound with no clipping or unintended abrupt end;
- a playable final file, a contact sheet and an honest report of visual/audio inspection.

Use [quality-review.md](references/quality-review.md) to identify the largest concrete weakness, fix it and re-render the affected sequence. Stop repeating successful checks unless a change or unresolved concern justifies another run.

## Delivery

Lead with the playable render and exact path. Include editable project/source, assets and their notices, shot plan and any material limits. Report what was rendered and inspected separately from what was only planned or numerically checked. Strong results come from direction plus iteration; no skill guarantees a model will match every reference on a first attempt.
