# CivicConnect Static Analysis
# Milestone Three

**See also:** `ci-pipeline.md` (where lint runs) and the `defect-register.md`

## 1. What runs and where

| Item | Server | Client |
|---|---|---|
| Tool | ESLint 10 (flat config) | ESLint 10 (flat config, Vite template) |
| Config | `server/eslint.config.js` | `client/eslint.config.js` |
| Command | `npm run lint` | `npm run lint` |
| Rule sets | `@eslint/js` recommended + module-boundary rules | `@eslint/js` recommended + `react-hooks` + `react-refresh` |
| In CI | Step "Lint server" in `build-and-test`, before the build and tests | Step "Lint client" in `build-and-test`, before the build and tests |
| Gate | Any **error** fails the job, so the PR cannot merge. Warnings are reported but do not fail. | Same |

## 2. Module-boundary rules (RISK-012)

The server follows the layered design (DEC-004, DEC-005): routes → controllers → models → database. The server uses CommonJS `require()`, which `no-restricted-imports` does not check, so boundaries are enforced with `no-restricted-syntax` selectors on `require("...")` calls.

| Layer (files) | May not require | Reason |
|---|---|---|
| `src/routes/**` | models, `config/database` | Routes go through controllers |
| `src/controllers/**` | `config/database`, routes | Persistence goes through models |
| `src/models/**` | controllers, routes, middleware | Lower layers don't depend on upper ones |
| `src/utils/**` | models, controllers, routes, middleware, config | Utils stay pure (e.g. `statusRules.js`) |

Verified when the rule was written: a deliberate route → model import was reported as an error, and the existing `authController` → database import was caught (SA-001).

## 3. Findings and how each was handled

Baseline run before fixes: **server 3 errors · client 9 errors, 3 warnings**. 

| ID | Where | Rule | Severity | Finding | Handling | Status |
|---|---|---|---|---|---|---|
| SA-001 | `server/src/controllers/authController.js:4` | boundary (no-restricted-syntax) | Error | Controller used the database pool directly, bypassing the model layer (RISK-012) | **Fixed:** queries moved to `src/models/userModel.js` (`findUserByEmail`, `emailExists`, `createRequester`). Login/signup behaviour unchanged (checked: correct login, wrong password 401, signup 201, duplicate 409) | Fixed |
| SA-002 | `server/src/controllers/requestController.js:347` | no-unused-vars | Error | `isValidDateOnly` defined but never called: optional date fields are not validated | **Fixed:** dead helper removed. Underlying gap logged as **DEF-006** (Minor, Deferred) | Fixed |
| SA-003 | `server/src/models/requestModel.js:4` | no-unused-vars | Error | `technicalRequestFields` constant never used | **Fixed:** dead constant removed, no behaviour change | Fixed |
| SA-004 | `client/src/App.jsx:10` | no-unused-vars | Error | `RequestDetails` page imported but never routed | **Fixed:** unused import removed. `pages/RequestDetails.jsx` is now unreferenced (candidate for removal, TD-003) | Fixed |
| SA-005 | `client/src/pages/Account.jsx:11` | no-useless-assignment | Error | Initial value of `user` is always overwritten before use | **Fixed:** initial value removed (`let user;`) | Fixed |
| SA-006 | `client/src/pages/ManagementDashboard.jsx:34` | no-useless-assignment | Error | Initial `{}` of `data` is always overwritten before use | **Fixed:** `let data;` | Fixed |
| SA-007 | `client/src/pages/RequesterRequestDetails.jsx:389` | no-unused-vars | Error | `createdAt` assigned but never used | **Fixed:** unused variable removed | Fixed |
| SA-008 | `Navbar.jsx:131`, `ManagementDashboard.jsx:596`, `RequesterRequestDetails.jsx:123`, `StaffDashboard.jsx:92`, `StaffRequestDetails.jsx:133` | react-hooks/set-state-in-effect | Error (×5) | Each page loads its data by calling a function that sets state from inside `useEffect` on mount. React 19's rule flags this because it can cause an extra render | **Accepted with a scoped exception:** `eslint-disable` / `eslint-enable` around each of the 5 effects only, with a reason comment. Not a defect: the pages work and are exercised by TC-E01/TC-E02. Refactoring 5 components without component tests under the M3 deadline risks regressions. Proper refactor tracked as **TD-003** | Accepted |
| SA-009 | `Navbar.jsx:132`, `RequesterRequestDetails.jsx:124`, `StaffRequestDetails.jsx:134` | react-hooks/exhaustive-deps | Warning (×3) | The load function isn't listed as an effect dependency | **Accepted:** intentional (run on mount / when `id` changes). Warnings don't fail CI. Resolved by the same refactor (TD-003) | Accepted |

## 4. What static analysis does and does not prove

| It proves | It does not prove |
|---|---|
| No unused or undefined variables, no useless assignments, no lint errors in either app | That the code behaves correctly (that's the test suite) |
| Server layers respect the boundaries above, on every PR | Boundaries in the client (no client boundary rules) |
| React hook usage follows the rules, except the 5 documented exceptions | Security vulnerabilities in dependencies (see #26 `npm audit`) |