# Public-release audit — 2026-10-29

This records a pre-publication review of version 1.0.0. It describes checks actually performed and their limits; it is not a guarantee that every vulnerability or secret format can be detected.

## Publication boundary and privacy

The public checkout was constructed from the existing distributable's explicit file/hash inventory. Private research directories, source-film frame sheets, unrelated video downloads, build outputs, caches, account tools and local conversation records were excluded. Git history starts with this reviewed export.

- The targeted credential/private-path scan found no matching values in the distributable source.
- **Gitleaks 8.30.1** scanned the release source with its standard detectors and found **no leaks**. Its executable was obtained from the official release and checked against both the release SHA-256 digest and published checksum file. The scanner and raw local logs are not shipped in the repository.
- npm's dependency audit reported **zero vulnerabilities** at review time. Dependency status can change after this date.
- The public files use relative project paths and public source links. No API key, service account, stored Git authentication, personal email, private-machine path or account credential is needed by the examples.
- A fresh package manifest and built-in source scanner check distributable file hashes and flag known credential/private-path patterns without printing matched values.

## Code findings and fixes

| Finding | Resolution and evidence |
|---|---|
| Preview helper could serve hidden project configuration or Git metadata | Deny hidden/key paths; tests verify `.env` and Git internals return 403 |
| Host header and HTTP method were unrestricted | Validate the loopback Host/port; allow only GET/HEAD; regression tests pass |
| Preview media seeking lacked proper range handling | Add bounded byte ranges, correct media MIME/content lengths and HEAD behavior; range/error tests pass |
| Nonnumeric expected media values could silently pass | Validate CLI numbers before probing and reject invalid/missing measured values; regression test reproduces and fixes the former false pass |
| Decode errors could be logged without a fatal process result | Use strict FFmpeg error handling and inspect decoder error output |
| Degenerate spring/volume parameters could yield invalid geometry | Reject invalid cycles, counts, IDs and radii; existing valid-input motion invariants continue to pass |
| Fractional font fitting selected different cached/fresh sizes on Linux | Search whole-pixel sizes within the measured ink bounds; retain exact repeated-frame comparisons and save diagnostics on failure |

The existing realpath boundary check for symlink escapes was retained. Windows denied creating a test symlink on the local account, so that local branch was not exercised; Linux CI includes the same test. The server is a development helper for trusted projects, not an arbitrary-code sandbox or public hosting service.

All child-process calls use argument arrays rather than shell-composed commands. The original example code and helper inputs were reviewed for external requests, filesystem/process operations and embedded account material. The supplied examples use local fonts and original sound; no remote-generation credential is required.

## Functional checks

- Clean `npm ci` installation of the locked dependencies succeeded.
- Math/mesh invariants and eight tooling regression groups passed locally.
- Browser checks passed font readiness, 16 out-of-order frame hashes, the static closing hold and five full-coverage transition boundaries for OFFSET.
- A new FIELD NOTES film was synthesized and encoded using the audited renderer: **6.000 s, 960 × 540, 30 fps, 180 H.264 frames, stereo 48 kHz AAC**.
- That saved mux passed complete strict decode and muted Chromium playback to the end. Audio measured **−15.62 LUFS integrated and −2.61 dBTP true peak**. No subjective listening was performed.
- Both shot plans, reference corpus counts/timestamps, JSON files, local documentation links and the release inventory are checked by the release tools.

GitHub CI provides separate, commit-specific results on Linux/Windows and supported Node versions, plus a Linux browser/render smoke test. Consult the [Actions page](https://github.com/rohitrppatil9188/motion-design-director/actions) for those results; local success does not imply an unobserved remote result.

## Licensing and provenance

The canonical MIT licence has a filled copyright year/name. Third-party exceptions were moved to [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), and both complete OFL font notices and hash/source records are retained. Creator films, source screenshots, prompts and music are excluded. Public source links and measurements do not establish permission to redistribute the linked media.

The repository explains that Opus 5.5 attribution comes from the gallery, that visual inspection was sampled, that audio analysis was numerical, and that a single model test does not establish general improvement. See [methodology](../references/methodology.md), [evaluation](../references/evaluation.md) and [security policy](../SECURITY.md).
