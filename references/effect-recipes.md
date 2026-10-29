# Effect construction recipes

These are independent construction proposals informed by the visible studies, not extracted creator code. All timing/parameter ranges below are recommended starting points at 60 fps and 1920 × 1080; convert to seconds or scale with resolution. Choose a few mechanisms that serve the direction. The presence of 24 recipes does not mean a short film should contain 24 effects.

For every recipe declare stable object IDs, absolute local time, entrance/hold/exit phases, layer order and the outgoing handoff. Use [motion-math.mjs](../scripts/motion-math.mjs) for the basic equations. Read each recipe's failure test before polishing it.

## 01 — Masked word or staggered glyph arrival

**References:** 01, 03, 13, 24, 46. **Use:** a decisive proposition, or movement that expresses the word's meaning.

Measure the word after fonts load. Render the word at its final coordinates inside a hard rectangular mask. For a single block, translate from `y + 1.05*capHeight` to `y` over 12–22 frames using a fast-out curve; move the mask only if it is the intended carrier. For glyph stagger, compute `u_i = clamp((frame-start-i*delay)/duration)`, with 2–4 frames delay and a bounded overshoot. Render per-glyph only after accounting for kerning/tracking. An independent mask per line prevents lower lines leaking during entrance.

Hold the important word for 24–45 frames after the final glyph settles. Exit by accelerating the group, slicing it or allowing the outgoing object to occlude it. Keep motion units intentional: one word as a slab feels more authoritative than every letter bouncing independently.

**Layer order:** ground → optional rule/seed → clipped text → occluding transition. **Failure test:** inspect at 25%, 50%, 75% arrival and phone size. Check descenders, mask seams, first/last glyph and the last glyph's actual hold. Do not hide a missing font with a smaller font size.

## 02 — Sliced type and restrained echo

**References:** 09, 13, 36, 46. **Use:** brief compression, speed or a graphic transition.

Render a complete word to an offscreen transparent surface. Divide it into 3–7 horizontal strips; each strip samples the same image region so no glyph geometry is invented. Offset strip x by a deterministic phase with alternating sign. Use 6–12 frames to converge into a clean word, hold the unbroken word, then 4–8 frames to disperse. A 1–3-frame shadow of a previous absolute time can emphasize travel; render `position(t-offset)` rather than retaining old pixels.

Small horizontal offsets often work better than a permanent glitch. Keep an unsliced dominant state. Chromatic fringes, if used, should have a reason and a brief life rather than reducing all type clarity.

**Failure test:** all strips reunite at exactly the same x/y; no one-pixel gaps at native scale; transparent surfaces are cleared every evaluation. Seek backwards and confirm echoes are identical.

## 03 — Weight, width and outline contrast

**References:** 07, 13, 21, 47. **Use:** expression through typography itself.

With a variable font, animate a documented weight/width axis while keeping the word optically aligned. Re-measure at the evaluated axis state or precompute sufficient bounds; the width can change. Use a 16–30-frame weight transition, not a per-frame random weight. If the font does not supply the axis, use designed discrete cuts or an outline-to-fill mask instead of pretending a scale transform is a font axis.

For outline/fill contrast, draw the same glyph path twice: a stable stroke role and a clipped solid fill. Keep a hierarchy—one foreground word, subordinate repetition behind it. This can become a type wall, then return to a clean word.

**Failure test:** no baseline drift or reflow pop; outlines survive compression; axis bounds are valid for the actual font. The bundled Inter exposes weight, not a universal width axis; Barlow Condensed Black is a static face.

## 04 — Letter-counter aperture

**References:** 24, 26, 34, 35, 41, 43. **Use:** a type-to-world transition with a geometric reason.

Find a deliberate counter or round opening in a chosen glyph. The target scene is drawn underneath. Above it, draw the current scene with an aperture aligned to the glyph counter; scale that aperture with the word/camera. Use even-odd fill or a destination-out mask on an offscreen layer. Make the aperture's initial contour agree with the visible glyph hole before expansion. Explore 16–32 frames, with fast growth near the end.

For a circle at `(cx,cy)`, full-frame coverage radius is `max(hypot(corner.x-cx, corner.y-cy)) + antialiasMargin`. Use all four corners, not just half the frame width. Keep the previous scene until coverage is proven. A noncircular aperture requires a corresponding coverage test or an oversized terminal mask.

**Failure test:** frame immediately before and after the handoff; no uncovered corners, black flash, sudden hole relocation or reversal of front/back layers. The portal should continue the glyph's geometry, not appear unrelated on a cut.

## 05 — Bounce with contact, stretch and ghosts

**References:** 03, 11, 15, 46, 51. **Use:** physical introduction or an explanation of force.

Define a trajectory first, including ground contact and arrival time. For a single impact, use a ballistic segment followed by a finite settling response. Compute stretch from velocity and squash from contact proximity. Preserve approximate area: if `sx = 1.25`, use `sy ≈ 1/sx` for a 2D circle, and adjust the center so its lowest point stays on the contact baseline. A small 3–7-frame contact squash followed by 10–20-frame release is a useful exploration range.

Ghosts are samples of the same path at earlier times with decreasing opacity/radius. They are explanatory trails, not an accumulated canvas smear. Position the ground, contact ticks and shadows consistently.

**Failure test:** the object does not penetrate the floor or float while squashed; energy decreases when settling; the final seed position matches the next scene. A spring is not automatically the best law for a falling object.

## 06 — Polar contour morph

**References:** 02, 13, 25, 38. **Use:** circle → square → triangle → star, or a related logo grammar.

Sample contours with the same `N` angles, often 64–160 for a large 2D silhouette. Keep start angle, center, winding and point count constant. A square radius along angle `a` is `halfSize / max(abs(cos a), abs(sin a))`; a regular polygon uses its apothem and periodic angular sector. Interpolate radii or corresponding perimeter points. Rotate the entire object separately from the morph so shape change and angular motion have clear roles.

Use 20–40 frames per major morph, then let the silhouette read. A short shape match can bridge circle → sphere or square → cube. Preserve the screen-space bounds at the transition to 3D.

**Failure test:** no crossing spikes, contour flips, unwanted twisting or unstable bounding box. A self-intersecting star may need an explicit concave path, not an arbitrary polygon formula.

## 07 — Quarter-circle tessellation

**References:** 07, 20, 30, 38. **Use:** modular pattern with strong negative-space rhythm.

Define a square cell whose motif uses a quarter disk, semicircle or diagonal pair. Draw in local cell coordinates and clip to the cell. Rotate by exact multiples of 90° for a deliberate tiling grammar. Stagger orientation changes by row/column, diagonal distance or radial distance from an event. Interpolate rotation over 12–24 frames while preserving cell centers; rotate the local motif, not its grid position.

Use 6–12 columns depending on aspect ratio and density. A few colour classes make the pattern legible. Transition by enlarging one chosen cell until its edge covers the frame, or tilt the whole plane into depth.

**Failure test:** cell edges meet without unintended gaps; clipped arcs do not bleed; simultaneous rotations do not create unplanned flicker. Compare the pattern before and after the wave to ensure a designed terminal state.

## 08 — Travelling lattice deformation

**References:** 15, 19, 33, 46. **Use:** coherent complexity from a simple field.

Assign each cell a stable `(row,col)` and center. Define distance `d` to a moving focus or an origin. Evaluate a travelling wave such as `w = sin(k*d - omega*t) * exp(-falloff*d)` or a bounded pulse `exp(-((d-speed*t)/width)^2)`. Map the same `w` to a restrained combination of rotation, scale, corner radius or colour. Keep at least one channel stable so the pattern remains a field rather than unrelated objects.

A wavefront crossing a grid over 1–2 s gives visible propagation. Use row/column phase offsets if direction should be planar. For a radial event, use spatial distance, not the arbitrary array index.

**Failure test:** no cell collision unless overlap is intended; negative scale and invalid radius are clamped or designed; a stateful noise source is absent. Inspect the quiet state as carefully as the most deformed state.

## 09 — Isometric height wave

**References:** 07, 30, 37, 44, 47. **Use:** flat grid becomes dimensional terrain.

Build square top faces in a shared 3D coordinate system. Project using orthographic isometric axes or a real camera. Height comes from a phase field; construct side faces from base height to top height. Set a coherent light direction and use different values for top/left/right faces. Sort cells by camera depth; face order matters when adjacent columns overlap.

For a travelling bump, use a smooth envelope plus spatial delay; cap height relative to cell spacing. If an accent ball travels over the surface, evaluate its contact height from the same field at its position. For the flat-to-depth handoff, begin at zero extrusion and a camera orientation matching the original grid.

**Failure test:** no reversed side faces, floating ball, abrupt camera switch or inconsistent shadows. If using a painter's algorithm, check crossing geometry where a full 3D renderer would be safer.

## 10 — Point-cloud sphere, torus and word

**References:** 01, 02, 19, 25, 33, 39. **Use:** topology and order emerging from complexity.

Create stable point IDs. A sphere can use a Fibonacci distribution; a torus uses `(u,v)` with `x=(R+r*cos v)*cos u`, `y=r*sin v`, `z=(R+r*cos v)*sin u`. Assign each ID deterministic parameter values and reuse the IDs across states. Interpolate 3D positions over 35–70 frames, rotate the volume with a common transform, project, clip and sort far-to-near. Size/alpha can respond to depth; avoid random sparkle on every frame.

For word targets, rasterize your own licensed text to an offscreen alpha mask, sample points deterministically, then match or order the source/target sets. A nearest-neighbor assignment or sorted space-filling correspondence can reduce tangled travel. Extend the smaller set deterministically so counts remain equal. Hold the assembled word long enough to read.

**Failure test:** deterministic point count, no near-plane explosion, coherent occlusion, balanced text density. A sphere-to-torus crossfade without correspondence is a different effect; do not describe it as a continuous morph.

## 11 — Flow field and contour lines

**References:** 06, 14, 25, 27, 43, 50. **Use:** continuous energy, topography or information flow.

For seek-safe trails, use analytic paths or precomputed trajectories with a fixed integration step and seed. A 2D vector field may be `v(x,y,t)=(cos(theta),sin(theta))`, with `theta` derived from smooth periodic functions or seeded noise. Integrate from stable seeds offline, or evaluate a finite fixed history independent of render order. Do not advance particles only on the frames the browser happens to draw.

For topographic lines, define a scalar field and draw isocontours with marching squares, or use a family of parameterized offset curves. Change the field smoothly; maintain line spacing and an intentional focal region. Use 20–50 contour levels for exploration, then reduce if compression turns them into moiré.

**Failure test:** no jumping trail history after seeking, no singularities, and no accidental visual claim that decorative noise is scientific data. Distinguish a true field visualization from an illustrated line sculpture.

## 12 — Flat metaball or fluid silhouette

**References:** 17, 42, 44, 49. **Use:** elastic grouping and organic negative space.

Define an implicit field `F(x,y)=sum(r_i^2 / (distance_i^2 + epsilon))`. Threshold it to produce a connected silhouette. Render at a deliberately chosen resolution and upscale with a contour path or clean shader edge. Animate centers/radii with low-frequency deterministic functions and designed arrival/departure. For flat-fluid work, keep the fill flat and let the silhouette carry the motion.

A cheaper stylized alternative uses a sum of polar sinusoids around a single center. This creates a blob, not arbitrary multi-object merging. Make that distinction in the design. Use 2–5 strong lobes rather than many twitching small ones.

**Failure test:** no edge alias shimmer, unexplained topology pop or clipped lobes. The fluid's mass and velocity should feel coherent. Avoid an expensive full-frame CPU field when a small offscreen surface or GPU shader meets the need.

## 13 — Gradient body with designed lighting

**References:** 08, 23, 33, 36. **Use:** a softer material interval after hard geometry.

Build a clear silhouette, then fill with a stable multi-stop field in object or screen coordinates. Choose a dominant base hue, one highlight and one shadow hue. Move the highlight with a designed light or rotate it with the object, depending on the intended material. Add a clipped narrow specular band only if the shape supports it. Distinguish the object edge from its background using value contrast or a restrained shadow.

For a 2D illustrated body, use clipping and several radial/linear gradients; this is an intentional illustration. For a deformed 3D body, use mesh normals and actual material lighting. Let it breathe for 1–2 s rather than reducing it to a decorative flash.

**Failure test:** no muddy central blend, visible gradient seams, banding or unreadable overlay text. Check that the perceived light direction does not jump while the surface deforms.

## 14 — Chrome, glass or refraction

**References:** 09, 21, 47. **Use:** a material surprise that the renderer can actually support.

Use a 3D engine with an environment map or deliberately constructed reflection strips. Chrome needs contrasting reflected regions, low roughness and coherent normals; it is not just gray fill plus white glow. Glass/refraction needs a background to distort, thickness or a stated stylized approximation, and proper transparency/depth handling. Fix exposure and colour management before animating the material.

Keep the silhouette matched to a preceding flat object for a clear transition. Animate camera or surface at a controlled rate so the reflection changes legibly. An original abstract reflection environment can avoid unlicensed HDR assets.

**Failure test:** stable highlights, no transparency sorting artifacts, no black missing environment, reasonable near/far planes. Render at delivery resolution and check the moving object; a still render is insufficient evidence for a refractive sequence. When the toolchain cannot produce the material convincingly, choose an explicit graphic treatment instead.

## 15 — Faceted explosion and reassembly

**References:** 35, 48. **Use:** transformation from a solid object into parts and back.

Start with a defined polyhedron or triangulated mesh. Store each facet's original local vertices, normal, centroid and stable ID. During explosion, translate its centroid along its normal plus a restrained tangential vector and rotate locally. Use a common envelope: 15–25-frame departure, a short separated hold, then 20–40-frame reassembly. Preserve vertex correspondence and evaluate from original positions every frame.

[mesh-geometry.mjs](../scripts/mesh-geometry.mjs) supplies `makeFacets(vertices, triangleIndices)`, a twelve-triangle `cubeFacets(size)`, and `facetPose(facet, separationAmount, {distance, spin, seed})`. Feed a single absolute-time separation envelope into every facet, then project and depth-sort or upload the mesh to a proper 3D renderer. Amount zero returns the exact source vertices. The helper does not triangulate arbitrary fonts, generate physically lit materials, or replace a depth buffer.

Keep the facets readable as one prior object. The maximum separation should fit the frame unless clipping is intentional. Use depth sorting or a real depth buffer. Reassembly should land on exactly the original geometry, perhaps transitioning to a smooth sphere only after it closes.

**Failure test:** no drift, unstable backfaces or cracks in the final object; the reassembled state is numerically identical to the initial mesh. Independent random triangles are a different visual story.

## 16 — Circular and cylindrical typography

**References:** 02, 04, 07, 21, 41, 43. **Use:** type becomes a spatial object or optical rhythm.

For circular text, place glyphs along an arc using actual advances; orient tangents to the path. Define whether glyphs rotate with the ring or remain upright. For a cylinder, map angular glyph positions to `x=R*sin(a)`, `z=R*cos(a)`, then project with perspective. Rotate the cylinder as one object; attenuate or occlude the rear half. Use multiple bands only when their spacing and angular phase are designed.

Keep a readable front-facing phase. A 24–40-frame revolution fragment can create energy without requiring a full spin. As a transition, align the central opening to the next aperture or let the bands extend beyond the frame.

**Failure test:** no mirrored rear letters drawn over the front, inconsistent baselines or overlapping glyphs from assumed fixed widths. A flat ellipse of text should not be claimed as a perspective cylinder.

## 17 — Camera corridor or nested tunnel

**References:** 21, 31, 33, 38, 46. **Use:** passage from a graphic plane into a world.

Place repeated frames/planes at known z intervals. Use one camera and a coherent vanishing point. Projection scale is `focalLength / depth`; clip before depth approaches zero. Fade or remove a plane as it crosses the near clip, rather than allowing it to invert or cover the screen with an enormous stroke. Sort far-to-near and choose stroke treatment—constant screen width or physical world width—deliberately.

A camera dolly can accelerate over 1–2 s, then settle on a target plane. Add modest roll or lateral parallax if it serves the direction. Make the first depth frame match the previous flat diagram through projected positions, not visual approximation.

**Failure test:** bounded screen coordinates, no inverted planes, no vanishing-point jump, no uncontrolled texture flicker. If the target becomes the next full scene, its projected coverage must include all corners before the cut.

## 18 — Angled panel wall and selected focus

**References:** 18, 22, 32, 40, 52. **Use:** show a portfolio, product family or parallel results.

Build all panels in one plane or coherent 3D group, with consistent card bounds and image fitting. A group camera rotation is more convincing than independent CSS tilts with inconsistent perspective origins. Populate rows/columns with a controlled delay field, then select a single card by enlarging or moving the camera to it. Dim or defocus secondary panels with a consistent hierarchy.

Use original generated placeholder artwork, supplied assets or cleared media. Plan at least 1.5–2 s for an image wall with meaningful copy; a 0.2 s glimpse can only communicate texture and variety.

**Failure test:** content stays inside masks, panel edges align, perspective is shared, selected card becomes genuinely readable. Product claims and creator artwork in references are not reusable assets.

## 19 — Data or technical diagram with hierarchy

**References:** 06, 14, 26, 28, 40, 45, 51. **Use:** explain a result, flow or comparison.

Decide whether the data is real or illustrative, and label it appropriately. Define scale, axes, units and the information hierarchy before animation. Reveal a line by path length, grow bars from a consistent baseline, and stagger groups by reading order. Numbers should resolve at a time when the viewer can read them; counters need a settled terminal value.

Keep one dominant relationship. Use accent colour for the selected branch or improvement, not every line. A technical panel can retain strong typography and motion without displaying dozens of meaningless numbers.

**Failure test:** no invented business/scientific claim presented as fact, misleading axis or changing denominator. Check the final static chart first. If it is illegible without animation, motion will usually make it worse.

## 20 — Stepped strip, bar curtain or diagonal wipe

**References:** 05, 13, 27, 29, 42, 51. **Use:** decisive scene replacement through the established grid.

Divide coverage into 5–12 strips. For each strip, evaluate local progress with a row/column delay, then grow its coverage from the intended edge. Use a maximum delay short enough to finish inside the allotted transition. Draw the next scene beneath the strips or draw it clipped inside their growing areas. Choose one spatial logic—diagonal progression, central opening or alternating direction—rather than random offsets.

Allow an antialias overlap of 1–2 output pixels between neighboring strips. At the terminal state, every pixel is covered and the transition layer can be removed without a seam. A 12–24-frame wipe with 1–3-frame phase steps is a practical starting point.

**Failure test:** full coverage including overscan; no stale prior-scene pixels between strips; the first clean frame matches the next scene's coordinates and palette.

## 21 — Radial fan, halftone and optical burst

**References:** 04, 24, 36, 39, 49. **Use:** a short energy peak or scale contrast.

Construct radial wedges from a common center, or build a dot grid whose radius responds to distance, angle or a field. For a fan, keep angular sectors exact so the circle closes; grow radius or angular coverage with one envelope. For halftone, use a stable grid and sample a fixed image/scalar field, not random new dots. Moiré should be deliberate and tested in motion at final delivery resolution.

Keep the strongest optical sequence brief and place it after a simpler composition. Retain a recognizable central anchor or direction. Some cuts can be hard; a blur is not required to hide the switch.

**Failure test:** check for rapid full-field flashing and uncomfortable flicker, aliasing, missing sector seams and compression shimmer. Slow the rotation, enlarge pattern spacing or reduce contrast when necessary; a static poster preview cannot reveal temporal flicker.

## 22 — Paper, annotation and gathering

**References:** 51, with product relatives 26 and 40. **Use:** an explanatory physical metaphor.

Define a common desktop plane. Give documents consistent paper tone, slight thickness or shadow, and small intentional rotation. Bring them in with a readable order, then annotate with paths that draw from actual endpoints. Handwritten-style marks can be original vector strokes; do not require a copied screenshot. If a seed gathers documents, its path and contact/occlusion should be physically coherent.

Use longer holds for content. A paper stack can turn into a network by preserving corner/node positions or through a deliberate light/dark cut; it does not require every edge to morph. Keep the final claim concise.

**Failure test:** readable text, no intersections that imply broken paper geometry, consistent shadows, and enough time for the intended message. Avoid faux scientific annotations that say nothing.

## 23 — Module-to-logo resolution

**References:** 11, 40, 48, 52. **Use:** make the ending feel inevitable.

Design a simple original mark from the film's module—tiles, diamonds, bars or arcs. Assign each source element a target position, rotation, scale and opacity. Use persistent IDs, minimal travel crossings and an easing family consistent with the rest of the film. Unused modules can leave along a shared direction or become subordinate detail; they should not all vanish arbitrarily on the last frame.

Complete the assembly before the name's final stable hold. Explore 24–45 frames for the assembly and at least 90 frames for the final readable composition in a 15 s film. A small final optical adjustment may be needed after mathematical centering.

**Failure test:** the mark remains crisp at phone size, the name is clear, and no ambient animation distracts from reading. The final frame must look intentional when paused.

## 24 — Match silhouette from 2D to 3D

**References:** 09, 11, 30, 35, 47. **Use:** an impressive change that remains understandable.

Choose a shape whose flat projection and 3D object can share a silhouette: disk/sphere, square/cube face, ring/torus, tile/extrusion, letter face/extruded letter. Compute the 3D object's initial camera and scale so its screen contour agrees with the 2D contour. Begin with zero or hidden extrusion; reveal depth by camera rotation, lighting or a growing side face. Keep the handoff center, edge and colour stable while the dimensional cue changes.

A common camera transform or a projected bounding-box solver is more reliable than eyeballing two unrelated layers. Give the viewer a brief matched state before the rotation accelerates. Keep material changes secondary to the shape change.

**Failure test:** compare the last 2D and first 3D frame with an image difference or overlay. Inspect corners and edge thickness. A crossfade may be appropriate, but if the goal is a match, a blurred dissolve does not prove the contours agree.
