# 07-tequilafunks — @tequilafunks

[Watch gallery entry](https://prompt-motion.com/tequilafunks-97f6c9) · [Original post](https://x.com/tequilafunks/status/2103528644828127728)

**Source title:** Claude motion design reel

**Attribution:** The public gallery labels this film Claude Opus 5.5; checked 2026-10-29. This is source attribution, not a verified model session or independent authorship audit.

**Visual thesis.** A graph-editor opening earns a progression from flat typography through modular pattern into an isometric tile world, then releases that structure into particles before a typographic close.

## Measured evidence

- Source: 1920 × 1080; 30 fps; 451 decoded frames; 15.033 s of video. Container duration 15.104 s may include audio padding.
- Every native frame measured at 640 × 360; 31 overview tiles and 50 event-window tiles visually reviewed. Tiles can overlap. This is not individual visual inspection of every native frame.
- Quantized sampled palette: #0c0c0c (47.2%), #fc5c24 (2.9%), #f4f4e4 (2.4%), #2c2c34 (2.3%), #3c44fc (1.7%). Compression, quantization and coverage bias these bins; these are not recovered design tokens.
- Automated high-change event PTS in seconds: 2.000, 3.000, 3.700, 5.233, 6.300, 6.867, 7.867, 10.000, 11.233, 12.000. These flag energetic changes, including flashes and camera motion; they are not confirmed edit points.
- Reduced-resolution mean frame difference 0.035020; mean p90 flow 1.8680 small-image pixels/frame. Compare only with fps and cut behavior in mind.
- [All frame measurements](../measurements/frames/07-tequilafunks.csv) · [Audio measurements](../measurements/07-tequilafunks-audio.json).

## Visual chapter map

Approximate groups inferred from the sampled visual review; ranges describe design development, not frame-accurate cuts.

| Approx. seconds | Visible development |
|---|---|
| 0–1.95 | An orange animation curve is drawn on a sparse graph; its control handles and moving point make the motion-design premise explicit. |
| 1.95–3.7 | An orange iris reveals a heavy title. A short channel-offset glitch introduces the second word over an outline-text wallpaper. |
| 3.7–6.3 | Horizontal colour strips reveal a dense quarter-circle tile pattern. Cells rotate and then simplify into a square mosaic. |
| 6.3–7.9 | The same mosaic tips into an isometric floor and grows blocks vertically; a circular boundary and central extrusion establish a small architectural world. |
| 7.9–10 | The tile world recedes to a small object, then turns into a bright particle cluster, a curling flow and a coherent point sphere. |
| 10–12.05 | Brief large word cards demonstrate weight, width, spacing and flipping, changing the letterform behaviour rather than only its location. |
| 12.05–15.1 | A cream heavy wordmark resolves on black, with an orange dot, contrasting italic serif role and low-contrast production furniture. |

## Typography and hierarchy

A wide heavy uppercase sans is paired with an elegant narrow italic serif at the end. The principle cards deliberately contrast thin and heavy weights, expanded and compressed widths. This suggests using real font axes where available, rather than stretching every glyph indiscriminately.

## Composition and spatial structure

Dense full-bleed pattern is bracketed by sparse central studies. The isometric camera uses a consistent floor and circular footprint. Corner marks and timecode-like microtype continue across otherwise very different sections.

## Colour, gradients and material

Burnt orange, cobalt, cream and charcoal remain coherent from tile cells to type cards. A gentle orange vignette and bright particle centre add depth, while the tile field itself is sharply segmented flat colour.

## Motion mechanics and transitions

Five-frame windows show strip occlusion near 3.7s, a clear planar-to-isometric pivot near 6.3s, height changes near 6.87s and a scale-down match to a particle seed near 7.87s. The transformation reads because cell identity and grid positions persist while dimension and height change.

## Pace and density

The pattern-to-depth sequence receives around four seconds, allowing its continuity to register. Particle motion and type tests accelerate the second half; the final branding holds substantially longer than an individual test card.

## Audio evidence and limits

The complete decoded track contains 333,044 mono analysis samples at 22,050 Hz. It is non-silent. FFmpeg measured integrated loudness **-13.59 LUFS**, true peak **1.25 dBTP**, and loudness range **8.00 LU** on the source stream. These are measurements, not a mastering recommendation.

Autocorrelation tempo candidates: 120.19 BPM (score 4.115); 184.57 BPM (score 3.989); 161.5 BPM (score 3.824). None establishes the intended beat grid; half/double-time and transient ambiguity remain.

Positive spectral-flux onset candidates (seconds): 0.522, 0.987, 1.324, 1.765, 1.892, 2.055, 2.194, 2.554, 2.763, 3.053, 3.564, 3.750, 4.563, 5.062, 5.561, 5.817, 6.060, 6.560, 7.059, 7.558, 8.057, 9.056, 9.311, 10.054, 10.310, 10.565, 10.809, 11.064, 11.192, 11.320, 11.436, 11.564, 11.691, 11.807, 11.935, 12.063, 12.214, 12.341. No subjective listening was performed. Instrument identity, musical genre, exact beat accents, audio quality and perceived sync are not verified.

## Transferable construction

Build several scenes from one indexed grid: change cell shape, rotate the plane, extrude height, then use the same cell centres as particle seeds.

**Independent implementation proposal:** translate the visual mechanism above using the relevant recipes in [effect-recipes.md](../effect-recipes.md). Define your own lettering, motif, positions and sound. The recipe equations and parameter ranges are author recommendations; they do not reconstruct the creator’s source code, exact easing or exact fonts.

## Source-specific caution

Tiny graph coefficients and captions are not a reliable way to recover actual source easing or font-axis settings from the video.

Public visibility did not establish a download or reuse licence. Creator videos, stills, prompts and soundtracks are not included in this portable package. Use these links and original analytical notes as design references; separately clear any asset you intend to reuse.

**Tags:** easing-diagram, wide-type, outline-type, strip-wipe, quarter-circle-tiles, isometric-extrusion, particle-topology, font-axes, serif-contrast, logo-hold
