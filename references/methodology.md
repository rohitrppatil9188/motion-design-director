# Corpus, method and evidence limits

## What was studied

Fifty distinct public short films attributed to Claude Opus 5.5 by [Prompt Motion](https://prompt-motion.com/), checked on 2026-10-29. Each study links both the gallery entry and the associated original post. The gallery is a curation and attribution source. Model session logs, creator identity, original source code and end-to-end production provenance were not independently verified. Some films include product imagery or other media whose creation method is not established.

The selection targets the user's approximately 15-second typographic/geometric showreel reference, with a few applied brand/product films to broaden the motion vocabulary. These are not generic character-animation references. Selection is qualitative, not a ranking of all public motion design or an exhaustive discovery of every Opus-created film.

The initial 50 candidates contained two reposts: Stephan Livera's film and RoundtableSpace's were byte/pixel identical; Himanshu's and ChatGptAstra's matched to a mean absolute 8-bit pixel difference of approximately 0.0004 despite different encoding. The duplicate entries were replaced by ik_builds and quickdesignio. Four additional films were processed while selecting replacements; only those two entered the final 50. Study IDs therefore skip 12 and 16 and include 51 and 52. ID order is an archive key, not a quality ranking.

## Coverage

| Evidence | Final corpus |
|---|---:|
| Distinct films | 50 |
| Native video frames decoded and numerically measured | 40,056 |
| Decoded video time | 750.033331 s |
| Native frame rates | 39 at 60 fps; 11 at 30 fps |
| Decoded video duration range | 14.866667–15.116667 s |
| Visually reviewed overview/event tiles | 4,009, including overlapping samples |
| Mono audio analysis samples at 22,050 Hz | 16,607,647 |
| Tracks containing non-silent audio | 50 |
| Subjectively auditioned tracks | 0 |

Full-frame numerical measurement is different from visual interpretation of every frame. The review used approximately 0.5-second overview samples, plus five native frames around each of ten high-change events per film (offsets −4, −2, 0, +2, +4 frames). Tile counts can overlap; they do not mean 4,009 unique frames. Those sheets were visually inspected, and the resulting chapter maps and craft observations were written individually. A very short event between overview samples and outside the selected change windows can be missed. Chapter time ranges are approximate visual groupings.

## Numerical video method

All native frames were decoded with FFmpeg without uniform-frame resampling; decoder presentation timestamps are preserved in CSV. Images were reduced to 640 pixels wide for mean luma, saturation, histogram entropy, quantized palette and image-change measurements. Optical flow used much smaller 160 × 90 grayscale images with Farneback flow; p90 summarizes motion magnitude at that scale. This is an approximate screen-motion diagnostic, not a recovery of object velocity, easing parameters or physical camera motion. Cuts, flashes, occlusion and compression affect it.

Palette bins are coarse quantized sampled colours, not exact creator tokens. Pixel coverage overrepresents long flat holds and does not indicate semantic importance. Gray differences include colour/luma changes as well as motion. The first 16 processed files used a Canny edge estimate; later files used adjacent-pixel NumPy gradients after a native-library failure. Edge fractions are retained for local inspection but should not be compared as one uniform cross-corpus metric. No inference in the skill depends on an aggregate edge ranking.

## Numerical audio method

The complete audio track was decoded to mono 22,050 Hz for RMS envelopes, positive spectral-flux onset candidates and autocorrelation tempo candidates. FFmpeg loudness analysis measured the source stream's integrated LUFS, true peak and loudness range. Track padding can exceed video duration. The median integrated source loudness was −13.57 LUFS, with a wide −23.66 to −7.27 LUFS range. This distribution is descriptive; it is not a platform target or proof that louder tracks work better.

No subjective listening was performed. There is no verified instrument annotation, genre label, lyrical transcription, perceived sync rating or listening-quality judgment. Onsets are candidate transients, not confirmed beats. Suggested sound design in this skill is an independent production recommendation. Listen and refine when the host environment supports audio audition.

## Access and reuse

The encoded source media was temporarily received into RAM to decode it, served on a short-lived loopback connection to the decoder, and discarded at process completion. No source MP4 or extracted soundtrack was retained. This is still receipt of media data; it is not a claim that streaming avoids copyright or site terms. Private research stills remain outside this distributable skill. The portable package contains source links, original commentary, factual measurements, original helper code, original example assets and separately licensed fonts.

Public access did not establish permission to redistribute the creator's video, screenshots, prompts, brand marks or music. The gallery footer says videos/prompts belong to their creators. This research does not clear rights for reuse or give a legal opinion. Make new compositions, original copy and geometry; obtain appropriate rights for any external asset you use.

## Meaning of the craft guidance

- **Observed:** the visible layout, shapes, type behaviour, colour relationship and approximate sequence described in a study.
- **Measured:** decoded counts/timestamps and explicitly named signal metrics.
- **Inferred:** a likely construction such as masking, mesh projection or stagger. Several implementations may produce the same visible result.
- **Recommended:** the independent equations, parameter ranges, blueprint and quality checks supplied here.

Exact fonts, easing curves, shaders, code, prompts and the causal contribution of a model cannot be recovered from these samples. Similarity across films may reflect shared prompts, conventions, reposting or human choices. It does not prove a model-specific visual signature. The skill has been exercised with an original runnable example and a separate model task; no controlled statistical improvement claim is made.

For auditability see [source-attributions.json](source-attributions.json), [corpus-statistics.json](corpus-statistics.json), [catalogue.csv](catalogue.csv) and the per-film CSV/audio records. All source checks are dated and may become stale as public pages change.
