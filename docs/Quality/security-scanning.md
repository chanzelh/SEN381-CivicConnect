# CivicConnect Dependency and Secret Scanning

## Milestone Four — Final

NFR-004 requires that secrets are not committed to the repository. This document records the scans, manual reviews and handling of findings for the assessed baseline.

## 1. What Ran

| Check | Tool | Blocks a merge? |
| --- | --- | --- |
| Secret scan of the full Git history | gitleaks (CI step in build-and-test) | Yes |
| Audit of dev tools | `npm audit --audit-level=high` (server dev tools; CI, report only) | No: findings dispositioned below |
| Weekly dependency updates | Dependabot configured in `.github/dependabot.yml` | Updates will arrive as PRs through 2 approvals and CI |
| Audit of shipped packages, server + client | `npm audit --omit=dev --audit-level=high` (CI) | Yes on any critical or high |
| Secret scanning and push protection | GitHub; public repo | Push protection will refuse pushes containing known secret types |

## 2. Findings

These are historical findings recorded during M3 and carried into the M4 closure on 17 October 2026. Counts, dependency dispositions and account-setting observations describe that review; they are not a fresh audit or verification of current GitHub settings.

**Recorded scan evidence:** https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850/job/116270418002?pr=107

| ID | Finding | Severity | Disposition |
| --- | --- | --- | --- |
| SEC-001 | `braces` via `nodemon` | High | Accepted for the recorded baseline: development tooling only. The recorded audit proposed a downgrade to `nodemon` 1.14.10 rather than an upgrade; dependency updates remain monitored through Dependabot. |
| SEC-002 | `sprintf-js` via Jest coverage tooling | Moderate | Accepted for the recorded baseline: development tooling only. The recorded audit proposed a downgrade to Jest 25.0.0; reassess with a fresh audit before updating. |
| SEC-003 | audit of shipped packages | - | 0 vulnerabilities |
| SEC-004 | Gitleaks full history scan | - | no leaks found |
| SEC-005 | GitHub secret scanning | - | 0 alerts. Push protection enabled on 14 October 2026 |
| SEC-006 | `createManagementUser.js` and `createStaffUser.js` were reviewed | Low | No hard-coded secrets found in these scripts. Passwords are entered at runtime and hashed with bcrypt |
| SEC-007 | JWT login token committed in a k6 results file (commit `230d947`) | Medium | Caught by the gitleaks CI gate; merges blocked. The commit was only on a feature branch, which was deleted, so the token never reached main (later runs: no leaks found). Test account only; token expired 2 h after creation. k6 script fixed to strip setup data before writing results. |

## 3. Values That Could Be Mistaken for Secrets

- The `ci_only_password` and `ci-only-not-a-real-secret` in the `ci.yml` document. This only serves as unlocking a throwaway CI database container.
- The `CivicTest#2026` in the `seed.sql`. This is a documented test-only password for fake seed accounts.
