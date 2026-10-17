# CivicConnect Final Release Baseline (#128)
# Milestone Four (Final)

| | |
|---|---|
| **Final product baseline** | Tag `v3.0-rc1`, commit `7804616` (`78046168e4996b9468478916c538af72606d15fa`) on `main` |
| **Tag** | https://github.com/chanzelh/SEN381-CivicConnect/releases/tag/v3.0-rc1 |
| **CI on the baseline commit** | https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/39028108910/job/117383002968 — `build-and-test` passed on 17 Oct 2026: secret scan, dependency audit, lint, build, all unit, black-box and API/integration tests, and E2E in Chromium, Firefox and Edge |
| **Code freeze** | From 17 Oct 2026: no code changes after this tag; documentation only |
| **Changes since the baseline** | Documentation only: https://github.com/chanzelh/SEN381-CivicConnect/compare/v3.0-rc1...main |
| **Deployment state** | Staging, no-go (`go-live-decision.md`) |

## Why the final version is called v3.0-rc1
This release candidate was created and verified on staging during Phase 3. No code changed afterwards, so it was kept as the final product baseline rather than re-tagging identical code under a new name.

## Reconfirmed evidence
The CI run above reruns every automated test on the exact baseline commit, so all test evidence in `test-evidence.md` applies to the final product. No test changed status since M3. Staging verification (#81), usability (#88) and backup/restore (#83) were performed on this same code.

**Annotations on the run:** the one "error" is the "Report dev dependency findings" step, which is deliberately non-blocking (`continue-on-error`) and reports the accepted dev-tool findings SEC-001/002 (`security-scanning.md`). The warnings are the 3 known `exhaustive-deps` lint warnings (SA-009, TD-003) and a GitHub notice that the Node 20 versions of the CI actions are deprecated (major updates deferred, TD-008). None fail the check.

## Known items not changed for the final release
DEF-006 (minor) remains deferred; see `defect-register.md`. Residual risks and debt: `risk-register.md`, `technical-debt-register.md`.