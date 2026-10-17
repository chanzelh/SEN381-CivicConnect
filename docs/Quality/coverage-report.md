# CivicConnect Coverage Report Final
# Milestone Four - Final

**Source:** On the server the following ran - npx jest --runInBand --coverage. The same report is uploaded automatically by the CI as the coverage artifact on every run
CI Link  : https://github.com/chanzelh/SEN381-CivicConnect/actions/runs/38700281059/job/116306536012?pr=116 

## 1. Results (server)
| Module | % Lines | % Branches | Notes |
|---|---|---|---|
| **All files** | **50.4** | **35.6** | |
| `utils/statusRules.js` | 100 | 100 | Transition rules (FR-010) |
| `middleware/authMiddleware.js` | 84 | 76.2 | Authentication and roles (NFR-001/002) |
| `models/requestModel.js` | 74.2 | 28.3 | Request persistence, transactions |
| `controllers/requestController.js` | 41.9 | 40.3 | Request API |
| `models/notificationModel.js` | 50 | 20 | Notifications |
| `models/userModel.js` | 25 | 0 | Login/signup queries |
| `controllers/authController.js` | 16.7 | 0 | Login/signup |
| `controllers/notificationController.js` | 4.5 | 0 | Notification list / mark-read API |
| `routes/*.js`, `app.js` | 100 | 100 | See section 3 |
| `config/database.js` | 100 | 50 | Uncovered branches are environment defaults |

CLIENT: only under client/src/utils/overdue.js there are uit tests (TC-U02). Client pages are succesfully exercised by the E2E journeys (TC-E01 and TC-E02) which were not included in these numbers.

## 2. Interpretation by risk
The code behind the high risks has the strongest coverage which is important.
- **statusRules.js** 100% (FR-010, RISK-008 area): every allowed and forbidden move is asserted (TC-U01, TC-B05, TC-B06).
- **authMiddleware.js** 84% (RISK-002): the uncovered lines are a token-after-Bearer edge case, the "JWT_SECRET not configured" branch and requireRole without a user. The main paths (missing, forged, expired, wrong-role tokens) are covered by TC-I01/TC-I02.
- **requestModel.js** 74% of lines: the transactional status and assignment functions are covered, including the rollback path (TC-I05).

## 3. Weakly tested : coverage is not correctness
Example: `routes/notificationRoutes.js` shows 100% coverage but the `notificationController.js`` shows 4.5%.

Route files contains lines such as `router.get("/"), authenticateToken, getNotifications)`. Those lines will run when the app is successfully loaded by every test that imports the `app.js`. So consequently the file reports 100% even when no jest test ever calls a notification route.
The 100% then means that this file was loaded but not that these routes actually work. The same also applies to `requestRoutes.js` and `app.js`.


## 4. Low coverage, flagged:

| Area | Coverage | Why it's low | Risk | Covered elsewhere? | Action |
|---|---|---|---|---|---|
| Login (`authController.js`, `userModel.js`) | 17% / 25% | API tests create tokens directly instead of logging in | **Medium–High** (NFR-001): login is the entry point for every user | Login is used by every E2E journey (TC-E01/E02) through the real form, but E2E isn't in these numbers. **Signup has no test at all.** | Add an API test for login (valid, wrong password, unknown email) and signup (new, duplicate, short password) |
| Comments (`requestController.js` ~lines 518–785, `requestModel.js` 400–525) | not reached by Jest | No API test was planned for comments | Medium (FR-011) | Staff comment and requester view tested in TC-E02 | Add an API test for comment validation (empty, > 2000 characters) and ownership |
| Notifications API (`notificationController.js`) | 4.5% | Only notification **creation** was in scope (TC-U05); listing and mark-as-read weren't | Medium (FR-005, RISK-010) | The requester seeing the notification is tested in TC-E02 | Add an API test for listing and mark-as-read (own notifications only) |
| Optional submission fields (`requestController.js` ~399–436) | partly | Only title, description and category limits were tested (TC-B03) | Low (DEF-006 deferred) | — | Covered by the DEF-006 fix when it's done |

**Branches are lower than lines (35.6% vs 50.4%)** because many controller branches are error paths (`catch` → 500) that only run when the database fails. TC-I05 deliberately exercises one of these, the transaction failure; most others are untested.

## 5. Conclusion
All the highest-risk logic such as authantication, transactional history and status transitions were covered well and the tests caught real defects. The largest gap remaining is login and signup at API level which is shown to only be exercised through E2E. These are the first tests to add after M3 and are actively recroded as residual test gaps. The API test gaps are tracked as TD-007 and RISK-013.