# Contributing

Contributions should make a model's production choices clearer or its rendered output more reliable. Useful work includes a concrete effect recipe, an original example, a focused bug fix, a better measurement explanation, or a documented usability test.

## Local setup and checks

Follow [INSTALL.md](INSTALL.md), then run:

```sh
npm ci
npm test
npm run check
npx playwright install chromium
npm run verify
```

When changing rendering, audio, fonts or visual geometry, render the affected example in a new output directory and inspect it. Include actual dimensions, fps, frame count, decode result and what was visually inspected. State whether you listened to the audio. A source check or a successful encoder exit does not establish visual or auditory quality.

## Make a focused pull request

1. Open an issue when a larger change would benefit from alignment; small fixes can go straight to a pull request.
2. Create a branch in your fork and keep changes scoped to one problem.
3. Explain the concrete trigger and resulting behavior. Add regression coverage for executable behavior that could fail again.
4. Add or update the relevant guide and asset notices. Keep `SKILL.md` concise; put detailed recipes and mode-specific material in `references/`.
5. Run `npm run manifest` after all intended file changes, then `npm run check`. The manifest excludes Git metadata, dependencies and generated outputs.
6. Include validation and honest remaining limits in the PR. Do not claim model improvement from a single unpaired example.

## Reference and asset standards

- New visual examples must be original or have an explicit licence permitting their intended distribution. Include provenance and notices.
- External source-film links and original commentary are welcome; do not commit a creator's video, screenshots, prompt or soundtrack without appropriate rights.
- Label observations, measurements, inferred mechanisms and independent recommendations separately. Never present guessed font names or easing parameters as recovered facts.
- Give each effect a construction method, timing units, spatial/layering assumptions and a failure check. A list of aesthetic adjectives is not enough.
- Use deterministic absolute-time animation and stable object IDs when the example is intended for frame rendering.

## Privacy and execution

Do not commit credentials, tokens, private logs, machine paths, personal contact data, caches or research workspaces. `npm run check` scans the distributable files and reports locations without printing matched credential values. Scans are an aid; review the diff and staged file list yourself.

Only run example projects you trust. This is a developer toolchain, not a sandbox for untrusted HTML, JavaScript or media. See [SECURITY.md](SECURITY.md).

By submitting a contribution, you agree to provide your original contribution under the repository's MIT licence, while retaining and identifying any separately licensed third-party material. No separate contributor licence agreement is required.
