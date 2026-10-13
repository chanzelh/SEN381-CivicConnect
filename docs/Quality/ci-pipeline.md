# CivicConnect CI Pipeline & Quality Gate (NFR-010)

| Item | Value |
|---|---|
| Workflow | `.github/workflows/ci.yml` |
| Triggers | Pull requests to `main`, pushes to `main` |
| Required check | `build-and-test` (ruleset on `main`) |
| Merge rule | `build-and-test` passes **and** 2 non-author approvals |
| Issue | #74 [NFR-010] CI pipeline & quality gate |

## Steps

| Step | Purpose | Fails the gate if |
|---|---|---|
| `npm ci` (server, client) | Reproducible install from lockfiles | Lockfile/dependency mismatch |
| Client build (`vite build`) | Frontend compiles | Build error |
| PostgreSQL 16 service container | Isolated, disposable test database | DB not healthy |
| Apply `CivicConnectCode/server/db/schema.sql` + `seed.sql` | Same schema in every run; files must stay valid and portable | SQL error |
| Server tests + coverage (Jest) | Runs the automated suite | Any test fails |
| Coverage upload | Evidence artefact for #28 | Never (runs even on failure) |

## What a green run demonstrates
- The commit installs from its lockfiles, builds the client, applies the committed schema and seed to a clean PostgreSQL 16 database and passes the current automated suite.
- Nothing reaches `main` without passing these checks and 2 approvals.

## What a green run does NOT demonstrate
- Correctness beyond what the tests assert. A green run is only as strong as the suite behind it.
- Code quality and dependency/secret checks: added in #25 (ESLint) and #26 (audit, secret scanning).
- Client behaviour: no client unit tests run; user journeys are covered by E2E in #23.
- Performance: covered separately by TC-P01 (#34).
- Production parity: single Node version (22); local development uses PostgreSQL 18 while CI uses 16, so version-specific behaviour could differ. The CI container is not staging (#30).

## Configuration and secrets
- All values in `ci.yml` are disposable, CI-only values for a container that is destroyed after each run.
- Local development uses `server/.env` (gitignored); local tests use `server/.env.test` (gitignored), pointing at a separate `civicconnect_test` database.
- `server/db/seed.sql` contains test-only accounts. Only a bcrypt hash of a documented test password is stored. No real credentials are in the repository (NFR-004, see #26).
- The team's binary database export was deliberately not committed: it contained real account password hashes and used a PostgreSQL 18 format that CI cannot read.

## CI smoke test
`server/tests/ci/ci.smoke.test.js` checks that the DB is reachable, the schema is applied and the app loads. It verifies the pipeline itself and is **not** counted in the M3 test baseline.

## Gate evidence
A throwaway PR (#100, "DO NOT MERGE — CI gate evidence (#74)") added a deliberately failing test. `build-and-test` failed and merging into `main` was blocked. The PR was closed unmerged and kept as evidence.

**First real catch:** the CI run on PR #96 ("Rename of files") failed because `seed.sql` referenced the local `postgres` role, which does not exist in CI. The file worked locally but was not portable. CI blocked the change until it was fixed in PR #99 (DEF-001).

## Setup history (what went wrong and how it was controlled)

| PR | What happened | Outcome |
|---|---|---|
| #95 | Workflow, schema and seed added, but under `.github/Workflows` (capital W). GitHub only detects `.github/workflows`, so **no checks ran** and #95 merged without CI (DEF-002). | Merged; gap recorded |
| #__ ("Rename of files") | Folder renamed so the workflow was detected. First CI run failed on the seed role reference (DEF-001). | CI caught a real defect |
| #97 | Seed fix committed to the already-merged branch, which still had the old folder name, so no checks ran. | Closed unmerged |
| #__ | Seed fix applied on the correct branch. | Merged |
| #99 | Workflow path corrected; `build-and-test` passed. | Merged with 1 check passed + 2 approvals |
|#100 | Deliberate failure to evidence the gate. | Closed unmerged |

Interpretation: NFR-010 was not met for PR #95, because the merge happened before CI was detected. Since PR #99, `build-and-test` is a required check, so a missing or failing workflow now blocks every merge instead of passing silently.