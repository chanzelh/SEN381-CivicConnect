# CivicConnect CI Pipeline & Quality Gate (NFR-010)

| Item | Value |
|---|---|
| Workflow | `.github/workflows/ci.yml` |
| Triggers | Any PRs or pushes made to the `main` branch |
| Required check | `build-and-test` (branch protection on `main`) |
| Merge rule | `build-and-test` passes **and** 2 non-author approvals |
| Issue / PR | #74 [NFR-010] CI pipeline & quality gate |

## Steps

| Step | Purpose | Fails the gate if |
|---|---|---|
| `npm ci` (server, client) | Reproducible install from lockfiles | Lockfile/dependency mismatch |
| Client build (`vite build`) | Frontend compiles | Build error |
| Postgres 16 service | Isolated, disposable test database | DB not healthy |
| Apply `server/db/schema.sql` + `seed.sql` | Same schema in every run; schema file must stay valid | SQL error |
| Server tests + coverage (Jest) | Runs the automated suite | Any test fails |
| Coverage upload | Evidence artefact for #28 | Never (runs even on failure) |

## What a green run demonstrates
- That commit installs from its lockfiles, builds the client, applies the committed schema to a clean PostgreSQL 16 database and passes the current automated suite.
- Nothing reaches `main` branch without passing these checks and 2 approvals

## What a green run does NOT demonstrate
- Performance is up to standard (Addressed in TC-P01 instead).
- Correctness beyond what the tests assert
- Code quality and dependency/secret checks: added in #25 (ESLint) and #26 (audit, secret scanning).
- Client behaviour: no client unit tests run; user journeys are covered by E2E in #23.

## Configuration and secrets
- All values in `ci.yml` are disposable, CI-only values for a container that is destroyed after each run.
- Local development uses `server/.env` (gitignored); local tests use `server/.env.test` (gitignored), pointing at a separate `civicconnect_test` database.
- `server/db/seed.sql` contains test-only accounts. Only a bcrypt hash of a documented test password is stored. No real credentials are in the repository (NFR-004, see #26).

## CI smoke test
`server/tests/ci/ci.smoke.test.js` checks that the DB is reachable, the schema is applied and the app loads. It verifies the pipeline itself and is **not** counted in the M3 test baseline.

## Gate Evidence
A deliberate throwaway failing test was opened against the `main`. The CI failed and the blocking was blocked to the main branch. The PR was closed unmerged under the name "DO NOT MERGE - CI gate evidence (#74)".