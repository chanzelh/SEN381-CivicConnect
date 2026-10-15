# CivicConnect Dependency and Secret Scanning
## Milestone 3

For NFR-004 (a Must) it indicates that there must be 0 secrets in the repository. This records what was scanned and how each finding was handled.

### 1. What ran
| Check | Tool | Blocks a merge? |
|---|---|---|
| Secret scan of the full Git history | gitleaks (CI step in build-and-test) |  Yes |
| Audit of dev tools | npm audit --audit-level=high (CI, report only) | No: findings dispositioned below |
|  Weekly dependency updates | Dependabot that is stored in .github | Updates will arrive as PRs through 2 approvals and CI |
| Audi of shipped packages, server + client | npm audit --omit+dev --audit=level = high (CI) | Yes on any critical or high |
| Secret scanning and push protection | Github; public repo | Push protection will refuse pushes containing unknown secret types |

### 2. Findings
CI run : https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38689030850/job/116270418002?pr=107
| ID | Finding | Severity | Disposition |
|---|---|---|---|
| SEC-001 | braces via nodemon | High | Accepted. A dev tool only; no fixed version exists. The only 'fix' would be downgrading the nodemon to 1.14.10. Its monitored by dependabot |
| SEC-002 | Via a jest coverage tooling sprintf-js was found | Moderate | Accepted. Dev tool only and a 'fix' is downgrading to Jest 25.0.0. |
| SEC-003 | audit of shipped packages | - | 0 vulnerabilities |
| SEC-004 | Gitleaks full history scan | - | no leaks found |
| SEC-005 | Github secret scanning | - | 0 alerts. Push protection enabled on 14 october |
| SEC-006 | `createManagementUser.js` and `createStaffUser.js` was reviewd | Low | No hard coded secrets. The passwords are typed at runtime and hased with bcrypt |

### 3. Values that could get mistaken for passwords
- The ci-only_password and ci-only-not-a-real-secret in the ci.yml document. This only serves as unlocking a throwaway CI database container.
- The CivicTest#2026 in the seed.sql. This is a documented test-only password for fake seed accounts.