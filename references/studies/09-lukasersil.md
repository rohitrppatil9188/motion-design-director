# 09-lukasersil — @lukasersil

[Watch gallery entry](https://prompt-motion.com/lukasersil-0ed38e) · [Original post](https://x.com/lukasersil/status/2103742861971726495)

**Source title:** Motion techniques showreel

**Attribution:** The public gallery labels this film Claude Opus 5.5; checked 2026-10-29. This is source attribution, not a verified model session or independent authorship audit.

**Visual thesis.** A material journey moves from a luminous point and sliced type into primary-colour geometry, glossy three-dimensional objects, liquid marbling and particle swirls; the closing symbols recover the original simple shapes.

## Measured evidence

- Source: 1920 × 1080; 60 fps; 900 decoded frames; 15.000 s of video. Container duration 15.061 s may include audio padding.
- Every native frame measured at 640 × 360; 30 overview tiles and 50 event-window tiles visually reviewed. Tiles can overlap. This is not individual visual inspection of every native frame.
- Quantized sampled palette: #ecece4 (13.2%), #0c0c14 (12.4%), #0c0c0c (6.3%), #f4ece4 (5.0%), #141414 (4.6%). Compression, quantization and coverage bias these bins; these are not recovered design tokens.
- Automated high-change event PTS in seconds: 2.017, 2.817, 3.500, 5.650, 9.833, 10.567, 11.250, 12.200, 13.133, 14.850. These flag energetic changes, including flashes and camera motion; they are not confirmed edit points.
- Reduced-resolution mean frame difference 0.039742; mean p90 flow 2.8992 small-image pixels/frame. Compare only with fps and cut behavior in mind.
- [All frame measurements](../measurements/frames/09-lukasersil.csv) · [Audio measurements](../measurements/09-lukasersil-audio.json).

## Visual chapter map

Approximate groups inferred from the sampled visual review; ranges describe design development, not frame-accurate cuts.

| Approx. seconds | Visible development |
|---|---|
| 0–1.95 | A bright horizontal flare reveals a dotted word and then stretches into a thin luminous line on black. |
| 1.95–3.5 | Large cream letters are divided into horizontal bands, with alternating offsets producing a precise sliced-text distortion. |
| 3.5–5.65 | Primary-colour strips uncover a circle, square and triangle on cream. They reorder, briefly sit before a modular pattern, and return to a clean row. |
| 5.65–7.8 | The same shapes become shaded three-dimensional objects on a dark reflective floor. A glossy organic black form follows, with blue, red and yellow light reflections. |
| 7.8–9.83 | A marbled fluid colour field expands behind large outlined typography, then fills the screen with high-contrast metallic-looking folds. |
| 9.83–11.2 | The fluid field bursts into depth-stretched particles, then forms a multicolour swirling arrangement that converges into a readable word. |
| 11.2–13.13 | The word distorts in width and letter pose; brief callbacks to particles and the glossy object return to the original flare. |
| 13.13–15 | A cream iris reveals a strong title with three small primary shapes above it; the final frames contract back into the luminous point. |

## Typography and hierarchy

The lettering is broad and heavy, but its main effects are explicitly structural: horizontal clipping bands, outlines, dotted sampling and controlled width changes. The final title is plain and sharp, allowing the richer material studies to remain the climax.

## Composition and spatial structure

A central horizontal axis links flare, sliced words and the three-object row. Reflection and a gridded floor anchor the 3D section. Large fluid/particle fields deliberately remove those anchors before the closing row restores them.

## Colour, gradients and material

Cream and black are joined by saturated blue, red and yellow. Genuine gradients appear as reflections and fluid marbling, with directionally organised highlights. These are material/light cues, not interchangeable with a flat CSS background gradient.

## Motion mechanics and transitions

Transition windows confirm a silhouette-matched 2D-to-3D handoff near 5.65s, a rapid flow-to-particle depth burst near 9.83s and radial reveal/contraction at the end. Slice offsets should share a dominant direction and resolve; fresh random offsets each frame would produce a different, noisy effect.

## Pace and density

Material richness rises through the middle, then the action compresses into brief callbacks. The simple final title holds for about 1.5 seconds before a very short closing iris.

## Audio evidence and limits

The complete decoded track contains 332,095 mono analysis samples at 22,050 Hz. It is non-silent. FFmpeg measured integrated loudness **-12.31 LUFS**, true peak **-0.61 dBTP**, and loudness range **3.10 LU** on the source stream. These are measurements, not a mastering recommendation.

Autocorrelation tempo candidates: 129.2 BPM (score 3.91); 84.72 BPM (score 3.129); 172.27 BPM (score 2.335). None establishes the intended beat grid; half/double-time and transient ambiguity remain.

Positive spectral-flux onset candidates (seconds): 0.093, 1.207, 1.892, 2.357, 2.833, 3.065, 3.297, 3.541, 3.762, 4.238, 4.702, 5.642, 5.770, 5.944, 6.107, 6.583, 6.815, 7.047, 7.291, 7.454, 7.639, 7.755, 7.988, 8.220, 8.452, 8.684, 8.916, 9.160, 9.392, 9.636, 9.857, 10.101, 10.333, 10.565, 10.797, 11.041, 11.262, 11.738, 12.214, 12.469, 12.620, 12.934, 13.224, 13.363, 13.491. No subjective listening was performed. Instrument identity, musical genre, exact beat accents, audio quality and perceived sync are not verified.

## Transferable construction

Carry colour, silhouette and position through a change of material. Choose 3D/WebGL when reflections and fluid shading are the actual idea, rather than approximating them with unrelated glow.

**Independent implementation proposal:** translate the visual mechanism above using the relevant recipes in [effect-recipes.md](../effect-recipes.md). Define your own lettering, motif, positions and sound. The recipe equations and parameter ranges are author recommendations; they do not reconstruct the creator’s source code, exact easing or exact fonts.

## Source-specific caution

The exact fluid solver, renderer and shader are unverified. The proposed implementations are independent ways to achieve the observed visual behaviour.

Public visibility did not establish a download or reuse licence. Creator videos, stills, prompts and soundtracks are not included in this portable package. Use these links and original analytical notes as design references; separately clear any asset you intend to reuse.

**Tags:** flare, slice-type, primary-geometry, silhouette-match, glossy-3d, liquid-marble, particle-burst, iris, logo-hold
