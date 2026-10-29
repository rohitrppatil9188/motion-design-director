# Security policy

## Supported release

Security fixes are applied to the current `main` branch and the latest released version. This project has no promised response-time SLA. Dependency and browser updates should be reviewed and retested with the supplied examples.

## Report a vulnerability privately

Use the repository's **Security → Report a vulnerability** option when enabled. Include affected version/commit, reproduction steps, expected impact and a minimal example. Do not include real credentials or private user data. If private reporting is unavailable, open an issue asking for a private reporting channel without publishing exploit details or secrets.

Do not put credentials or sensitive findings in ordinary public bug reports. If a real key was exposed, revoke/rotate it through its issuer; removing a committed file alone does not invalidate the credential.

## Execution boundary

The examples execute local JavaScript through Node.js and Chromium and decode media through FFmpeg. Run projects and inputs you trust. This repository does not sandbox arbitrary third-party code, enforce a network firewall, or isolate the host filesystem from a process you choose to launch.

The built-in preview helper binds to `127.0.0.1` on a temporary port, validates its Host header, permits GET/HEAD, rejects hidden configuration/key paths and path/symlink escapes, and supports bounded byte-range media reads. It serves the explicitly selected project directory. These checks reduce accidental exposure; use an isolated environment for untrusted projects and never expose the preview helper as a public web service.

The bundled examples load fonts locally and do not require API credentials or remote generation services. Custom examples can introduce their own network requests or dependencies; review those before running them.

## Release checks

`npm test` covers motion invariants, preview-server access boundaries and invalid CLI values. `npm run check` verifies source inventory, local links, corpus consistency, privacy patterns and the package manifest. Dependency advisories are checked separately with `npm audit`.

The release audit records the checks actually performed. It is not a guarantee that all vulnerabilities, malicious media or secret formats can be detected. No third-party penetration test or subjective audio review is claimed.
