# CivicConnect CI Pipeline & Quality Gate (NFR-010)

| Item | Value |
| --- | --- |
| Workflow | `.github/workflows/ci.yml` |
| Triggers | Pull requests to `main`, pushes to `main` |
| Required check | `build-and-test` (ruleset on `main`) |
| Merge rule | `build-and-test` passes **and** 2 non-author approvals |
| Issue | #74 [NFR-010] CI pipeline & quality gate |

## Steps

The job starts its database service before running the listed workflow steps.

| Step | Purpose | Fails the gate if |
| --- | --- | --- |
| PostgreSQL 16 service container | Isolated, disposable test database | DB not healthy |
| Secret scan (full Git history) | gitleaks checks every commit for leaked secrets (NFR-004) | Any secret found |
| `npm ci` (server, client) | Reproducible install from lockfiles | Lockfile/dependency mismatch |
| Audit dependencies (production) | `npm audit --omit=dev` on server and client: shipped packages only | Any high/critical vulnerability |
| Report dev dependency findings | `npm audit` on dev tools, for visibility; dispositions in `security-scanning.md` | Never (continue-on-error) |
| Lint server and client | ESLint checks both applications | Any lint error |
| Client build (`vite build`) | Frontend compiles | Build error |
| Client unit tests (Vitest) | Runs the client unit suite | Any test fails |
| Apply `CivicConnectCode/server/db/schema.sql` + `seed.sql` | Same schema in every run; files must stay valid and portable | SQL error |
| Server tests + coverage (Jest) | Runs the automated suite | Any test fails |
| Coverage upload | Uploads coverage even if earlier steps fail | Upload failure; `if: always()` controls execution, not failure tolerance |
| Install Playwright browsers | Installs Chromium, Firefox and Edge | Browser installation fails |
| E2E tests (Playwright) | Exercises requester, staff and management journeys and route guards | Any test fails |
| E2E report upload | Uploads browser reports even if earlier steps fail | Upload failure; `if: always()` controls execution, not failure tolerance |

## What a Green Run Demonstrates

- The commit installs from its lockfiles, builds the client, applies the committed schema and seed to a clean PostgreSQL 16 database and passes the current automated suite.
- Nothing reaches `main` without passing these checks and 2 approvals.

## What a Green Run Does Not Demonstrate

- Correctness beyond what the tests assert. A green run is only as strong as the suite behind it.
- Complete code quality or security: lint, dependency audit and secret scanning check their configured rules and known patterns only.
- All client behaviour: Vitest runs client unit tests and Playwright exercises critical journeys, but these do not cover every screen, input or failure path.
- Performance: covered separately by TC-P01 (#34).
- Production parity: single Node version (22); local development uses PostgreSQL 18 while CI uses 16, so version-specific behaviour could differ. The CI container is not staging (#30).
- That no secret could ever slip through: pattern-based scanners can miss simple passwords (see `security-scanning.md`).

## Configuration and Secrets

- All values in `ci.yml` are disposable, CI-only values for a container that is destroyed after each run.
- Local development uses `server/.env` (gitignored); local tests use `server/.env.test` (gitignored), pointing at a separate `civicconnect_test` database.
- `server/db/seed.sql` contains test-only accounts. Only a bcrypt hash of a documented test password is stored. No real credentials are in the repository (NFR-004, see #26).
- The team's binary database export was deliberately not committed: it contained real account password hashes and used a PostgreSQL 18 format that CI cannot read.
- Jest runs test files one at a time (`maxWorkers: 1`) because API tests share one database and reset it before each check.

## CI Smoke Test

`server/tests/ci/ci.smoke.test.js` checks that the DB is reachable, the schema is applied and the app loads. It verifies the pipeline itself and is **not** counted in the M3 test baseline.

## Gate Evidence

A throwaway PR (#100, "DO NOT MERGE — CI gate evidence (#74)") added a deliberately failing test. `build-and-test` failed and merging into `main` was blocked. The PR was closed unmerged and kept as evidence.

**First real catch:** the CI run on PR #96 ("Rename of files") failed because `seed.sql` referenced the local `postgres` role, which does not exist in CI. The file worked locally but was not portable. CI blocked the change until it was fixed in PR #99 (DEF-001).

## Setup History (What Went Wrong and How It Was Controlled)

| What happened | Outcome |
| --- | --- |
| Workflow, schema and seed added, but under `.github/Workflows` (capital W). GitHub only detects `.github/workflows`, so **no checks ran** and #95 merged without CI (DEF-002). | Merged; gap recorded |
| Folder renamed so the workflow was detected. First CI run failed on the seed role reference (DEF-001). | CI caught a real defect |
| Seed fix committed to the already-merged branch, which still had the old folder name, so no checks ran. | Closed unmerged |
| Seed fix applied on the correct branch. | Merged |
| Workflow path corrected; `build-and-test` passed. | Merged with 1 check passed + 2 approvals |
| Deliberate failure to evidence the gate. | Closed unmerged |

Interpretation: NFR-010 was not met for PR #95, because the merge happened before CI was detected. Since PR #99, `build-and-test` is a required check, so a missing or failing workflow now blocks every merge instead of passing silently.
