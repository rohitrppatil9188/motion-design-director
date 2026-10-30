# Use the complete package

Give another model this entire `motion-design-director` folder and tell it to read `SKILL.md`. A copy of `SKILL.md` alone can describe the workflow, but loses the studies, recipes, code, schema and fonts. The core instructions are engine-neutral; runnable tools require the dependencies below.

For Codex, place the folder in the configured skills directory (normally `~/.codex/skills/motion-design-director`) and start a new chat if discovery has already occurred. Invoke `$motion-design-director` or ask for a short typographic motion film. The package has no service credentials, API requirement or paid generation dependency. Other models can follow the Markdown files directly.

## Run the included original example

Requirements: Node.js 22 or later on a supported LTS release, FFmpeg/FFprobe available on PATH, Playwright and its Chromium browser. The package pins Playwright 1.62.1, which was exercised with the provided runtime. Install in the package directory:

```sh
npm install
npx playwright install chromium
npm test
node scripts/validate-plan.mjs assets/example/shot-plan.json
npm run verify
npm run demo
node scripts/verify-media.mjs --input out/offset.mp4 --width 1920 --height 1080 --fps 60 --duration 15 --frames 900 --require-audio --max-true-peak=-1.5 --playback
```

The final command creates `out/offset.wav`, `out/offset.mp4`, sampled stills and render reports. The WAV is newly synthesized, 15 seconds, stereo 48 kHz; the renderer performs measured two-pass loudness processing while encoding AAC. The MP4 is 1920 × 1080, 60 fps, 900 frames with audio. The renderer refuses to replace an existing MP4 by default. For an intentional rebuild, run the explicit render command with `--overwrite` after regenerating the WAV if needed.

A second original example in `assets/field-notes/` demonstrates a letter-counter aperture and facet reassembly in 6 s at 960 × 540/30 fps. Run `npm run demo:field-notes` to synthesize and render it. Both examples have ready-to-play proof MP4s in their respective `rendered/` folders; these are original demonstrations, not source-gallery downloads.

To reuse an existing Playwright installation, pass `--module-root /absolute/path/to/node_modules` to `scripts/render.mjs` and `scripts/verify-example.mjs`. This is optional; the standard commands use the package's installed dependency.

```sh
node scripts/render.mjs --entry assets/example/index.html --output out/review.mp4 --width 960 --height 540 --stills-only
node scripts/render.mjs --entry assets/example/index.html --audio out/offset.wav --output out/offset.mp4 --overwrite
```

`--stills-only` creates JPEG review frames without encoding video. Default samples span the complete requested duration and include the final frame. Use `--still-frames 0,112,113,114,281,450,619,788,899` for exact native-frame inspection. Run commands from the package root, or provide absolute entry/output paths. `--root` sets the served project directory for a different project. The defaults are 15 s at 60 fps; pass `--duration` and `--fps` for another timebase. When `window.filmInfo` is supplied, the renderer checks it against these arguments and rejects an accidental mismatch or stretched aspect ratio. All dependencies are local after installation; the example loads no remote media or fonts.

## Preview and edit

Serve the package root with any local static HTTP server, then open `/assets/example/index.html`. For example, with Python installed:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/assets/example/index.html`. The preview has play/scrub controls for visuals. Play `out/offset.mp4` to hear the finished mux; browser preview does not play the WAV. Stop the temporary server when finished. Do not open the HTML through `file://` and expect module/font loading to behave identically.

Edit a project copy of `assets/example/film.mjs`, the shot plan and audio script. Replace the concept and composition rather than changing only the studio name. Keep both OFL font notices when redistributing the supplied fonts. Original text/code/example use MIT; third-party films and music are not included or licensed by this package.

## Example prompt

> Use this skill to create a 15-second, 1080p60 original motion-design film for a fictional studio called SIGNAL. Direction: precise editorial typography becomes an expressive geometric system. Use cream, ink and a cobalt accent; two impressive transformations, a coherent carrier, readable holds, original audio and a stable closing identity. Select relevant studies, make a shot plan, render and inspect the result, fix concrete issues, and deliver the playable MP4 with editable source. Do not reproduce reference branding or use their soundtracks.

## Package map

| Location | Purpose |
|---|---|
| `SKILL.md` | concise entry and production workflow |
| `references/study-index.md`, `studies/` | 50 individual studies with watch/source links |
| `references/design-system.md`, `effect-recipes.md` | cross-film reasoning and 24 construction recipes |
| `references/audio-direction.md`, `production.md`, `quality-review.md` | sound, engine/render contract and review |
| `references/methodology.md`, catalogues and `measurements/` | provenance, counts, limitations and numerical evidence |
| `scripts/` | original motion math, tests, synthesis, rendering, verification and plan validation |
| `assets/example/` | original editable 15 s example and shot plan |
| `assets/field-notes/` | independently authored 6 s aperture/facet example and shot plan |
| `assets/templates/` | shot-plan JSON schema |
| `assets/fonts/` | two OFL fonts, licences and source/hash manifest |
| `agents/openai.yaml` | Codex display/discovery metadata |

The research media and private source-film contact sheets are outside this package. Original-example contact sheets and verification reports accompany their proof MP4s. See [the evaluation record](references/evaluation.md) for exactly which checks were completed in this run; installation on every operating system has not been tested.
