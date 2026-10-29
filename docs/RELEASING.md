# Release procedure

1. Review the complete diff, staged file list and asset provenance. Keep private research, generated outputs, credentials and Git metadata outside the distributable source.
2. Run `npm ci`, `npm test`, both shot-plan validators, `npm run verify` and `npm audit --audit-level=high`.
3. Render and inspect changed visual/audio behavior. Verify saved output and document listening limits.
4. Update the version and changelog when appropriate. Run `npm run manifest` after all intended source changes, then `npm run check`.
5. Commit, push, and wait for the GitHub checks. Investigate failures on their actual commit rather than assuming local success proves CI success.
6. Tag the verified commit, create a GitHub release, and describe the actual changes and validation. A tag does not substitute for testing.

Create a source archive from the committed tree, which excludes ignored dependencies and generated outputs:

```sh
git archive --format=zip --prefix=motion-design-director/ --output=../motion-design-director-source.zip HEAD
```

Verify the archive inventory and checksums before uploading it. The committed `PACKAGE-MANIFEST.json` describes source-file hashes, excluding itself and generated files. Preserve font notices and link the MIT licence and third-party notices in the release notes.

Do not publish a claim that all models improve, that source-film audio is cleared, or that listening/security checks happened when they did not. New release automation should use minimal permissions and pinned actions; this repository's CI has read-only repository permissions and does not publish packages or releases automatically.
