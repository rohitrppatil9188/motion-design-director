# Art direction and the design system

## What makes this corpus useful

The strongest recurrent relationship is between **typographic mass, a constrained shape grammar, and changes in spatial complexity**. A large word establishes a visual scale; its geometry becomes a grid, field, aperture or volume; a quieter identity resolves it. The same films also show how easily a repeated dot → word → particles sequence can become generic. Preserve the reasoning behind a mechanism and choose a different carrier when the brief benefits.

Analyst-assigned tags in this selected corpus include closing logo holds in 49/50 studies, wide type in 18, data design in 18, point clouds in 17, shape lattices in 15 and serif contrast in 14. These are positive annotations, not exhaustive absence labels, objective quality scores or statistical claims about all motion design. See the [tag counts](corpus-statistics.json). A high frequency is not an instruction to include the effect.

## Start from a visual argument

State a transformation with a reason. “A route becomes direct” supports the loop-to-line and corridor mechanism in study 31. “Ideas gather into a result” supports the paper/network progression in 51. “A module becomes an identity” supports 52. “Precise timing creates expression” supports 03 and 13. If removing the copy leaves no visual relation between shots, the film probably needs a stronger carrier.

Define three invariants and two freedoms. For example: preserve square corners, a left-aligned baseline, and cream/ink contrast; allow camera angle and object count to change. This makes a dramatic middle section belong to the same film. A motif need not appear in every frame; a measured absence can give its return meaning.

Choose an emotional direction using concrete visual choices:

| Intention | Decisions that support it | Studies |
|---|---|---|
| Precise/editorial | strong margins, restrained palette, clear type hierarchy, small decisive moves, long settling holds | 01, 30, 34, 37 |
| Energetic/poster-like | condensed cap-height mass, hard polarity cuts, compressed reaction gaps, selective overshoot | 03, 13, 24, 46 |
| Curious/spatial | simple geometry before depth, coherent camera, persistent point IDs, scale contrast | 11, 19, 25, 38 |
| Tactile/material | silhouette continuity, appropriate reflections, contour deformation, sparse supporting type | 09, 21, 35, 47 |
| Friendly/quiet | lowercase or expressive serif, rounded forms, limited velocity, generous identity hold | 17, 31, 44, 48 |
| Useful/product-led | a readable task/result, annotations, exact UI alignment, selective focus, believable data | 26, 40, 45, 51, 52 |

## Typography is the main geometry

### Roles and mass

Use a display role, a support role and optional functional annotations. A broad grotesk fills width with a low number of letters; a condensed face produces tall density without requiring a tiny point size. Their motion should express these proportions. Study 03 uses tall compressed lettering as a vertical poster mass; 01 uses broad type and an italic contrast; 44 uses friendly lowercase. They are distinct directions, not interchangeable font substitutions.

Start with a dominant word covering roughly 55–85% of the intended safe width and a cap-height appropriate to its shot. Those are recommended exploration ranges. Test actual glyph bounds; uppercase font-size does not equal visible cap height. If a long word cannot fit, change the line break, choose an appropriate width axis/face, reduce tracking modestly, or rewrite the copy. Horizontal scaling is a deliberate graphic treatment, not a default repair for poor fitting.

Measure text after fonts load. Canvas `measureText()` returns advance width and glyph bounds. Center visible bounds with `actualBoundingBoxLeft/Right/Ascent/Descent`; preserve descenders and accents unless the crop is intentional. For tracked text, include letter spacing and verify word shapes optically. Kerning and tracking are not equivalent: a monospaced per-glyph renderer may disable the font's kerning pairs. Use native whole-word rendering when kerning is central, or explicitly measure pairs.

### A typographic motion law

Choose the unit of movement: line, word, glyph, slice, outline, particle samples or a whole surface. Match it to meaning. A word entering as one block feels different from per-letter stagger. Study 13 assigns distinct behaviour to different principles; using one overshoot on every word would erase that distinction.

Use entrance/hold/exit phases. For a one-word accent at 60 fps, explore 10–24 frames of arrival, 18–45 frames of stable reading and 6–14 frames of departure. Longer or unfamiliar text needs more time. These are author starting ranges, not recovered source timings. Test with a viewer who has not memorized the copy. Motion can continue in nonessential surroundings while the word holds.

Reveal type through a stable mask to give a sense of construction. Crop a moving word at a baseline, through horizontal slices, inside a counter, or behind a rotating plane. Define what remains legible at the midpoint. For outlines, use a clear stroke at the final delivery size; compression can destroy very thin lines. Do not rely on outlined tiny type for an essential message.

### Pairing and ending

An italic serif can make a single phrase feel conversational against a heavy sans. It is effective when the contrast has a role: editorial aside, human signature, a change of tone. It should not be added to every frame as decoration. The bundle supplies Barlow Condensed Black and Inter variable under OFL; a serif requires a separately obtained licensed font.

Give the ending typographic restraint. Derive its alignment and mark proportions from the opening. Let the main name hold while sound decays. The end can be small if the composition supports it, but it must remain readable at phone size. A deliberate two-second ending is often more persuasive than squeezing in another effect.

## Composition at four scales

1. **Frame scale:** decide whether the shot is a poster, an object on a stage, a full field, or a view through space. Change this deliberately across the sequence.
2. **Group scale:** align repeated shapes to a grid, radius or perspective plane. Keep correspondence when the group transforms.
3. **Object scale:** consistent corner radii, stroke ratios, tilts, highlights and spacing make a family.
4. **Detail scale:** labels, grain and tiny dots support the main structure; they should not rescue an empty composition.

Use negative space as a moving element. A dense lattice followed by a single centered name creates a strong release. If every shot has a central title plus corner labels plus particles, the viewer never experiences a change of composition even when colours change.

For landscape films, try a 12-column guide and 6–8% side margins. A giant word may intentionally bleed while the final identity stays safe. Portrait pieces need a redesigned axis, not a landscape crop. Study 10 builds a radial portrait collage and 23 stacks poster elements vertically. Preserve readable role relationships when adapting aspect ratio.

## Shape grammar and correspondence

Start from a small family: circle, square, quarter-circle, line, diamond, capsule, arc. Their shared dimensions let a circle become a ring, a ring become a torus, a tile become a camera plane. The rich result comes from their relationships and motion, not the number of primitives.

For a contour morph, use the same point count, winding and phase. Re-sample by perimeter or a consistent polar parameter. A rotating start index can create a twist even if both silhouettes look correct. For repeated cells, preserve IDs, use row/column or radial delay fields and vary phase coherently. Random per-frame changes look like noise rather than choreography.

For volumes, define a common point parameterization. Interpolate sphere → torus with stable indices; redistribute samples deliberately if density matters. Depth-sort before drawing translucent points, clip near the camera and attenuate size/alpha with distance. A rotating flat ellipse is not a three-dimensional torus. Studies 19, 25 and 33 show why changing the spatial topology creates more variety than simply changing point colour.

## Colour and material

Assign colour roles before picking hex values: ground, ink, active accent and optional contrasting field. Change the field at a structural moment—entry into depth, a statement, a climax. The high contrast cream/ink/coral/cobalt vocabularies in many studies make cuts decisive without requiring texture.

Distinguish four different effects:

- **Flat colour:** a uniform field; often the cleanest support for type.
- **Gradient:** a designed spatial transition of hue/luminance. Give it a direction, focus and reason. Avoid a rainbow on every object.
- **Lighting:** diffuse/specular changes consistent with surface normals and light/environment position.
- **Material/refraction:** reflection or background distortion tied to geometry, roughness, thickness and viewing angle.

Study 08's soft blob, 09's glossy object and liquid marbling, and 49's flat-fluid silhouettes require different construction. Use a proper 3D engine/environment for convincing chrome, or honestly choose an illustrated metallic treatment. A radial gradient with a white spot can be a good graphic ball; do not describe it as physically correct glass.

Gradients work best with a clear silhouette and room to show the colour field. Put a focal highlight near the visual action. Keep text on a stable contrast surface; if it crosses bright and dark material, use a designed plate, mask or change of role. Consider banding and delivery compression; very subtle 8-bit gradients may need small stable dither, not animated random noise.

## Pace is more than speed

Think in gestures, holds and consequences. A fast entrance earns a readable hold. Anticipation sets direction, acceleration creates force, overshoot demonstrates elasticity, and a settle creates authority. Linear motion remains appropriate for a conveyor, uniform orbital rotation or direct mechanical sweep; a source slogan such as “never linear” is not a universal motion law.

At 60 fps, explore 2–5 frames of group stagger for a tight ripple and 5–10 frames for a deliberately cascading event. Limit total stagger so the final object gets a hold. A nine-cell scene with an eight-frame stagger consumes 64 frames before the last cell starts; account for that rather than truncating it accidentally.

Use a density curve: low → legible statement → intricate development → short peak → resolution. Material or camera novelty needs more viewing time than a familiar single word. In the applied references, documents, interfaces and before/after comparisons receive longer holds than abstract cards. Respect information complexity rather than forcing every shot onto equal lengths.

## Originality through recombination

Select one layout lesson, one mechanism and one pacing lesson from different references. Change the carrier, copy, composition and purpose. For example: combine 37's disciplined blue/cream hierarchy, 35's stable faceted reassembly and 51's longer explanatory holds to make an original film about collaboration. Do not copy a creator's branding or a complete sequence and call the output a new design.
