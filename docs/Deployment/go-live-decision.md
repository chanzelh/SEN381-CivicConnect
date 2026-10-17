# CivicConnect Final Deployment & Go-Live Decision
# Milestone Four (Final)

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026/10/17 | Final deployment state declared and justified |

**See also:** `threat-review.md`, `security-scanning.md`, `test-evidence.md`, `staging.md`, `rollback-plan.md`, `availability.md`, `backup-restore.md`, `../Risk/risk-register.md`

## 1. Decision

| | |
|---|---|
| **Final deployment state** | **Staging: NO-GO for production** |
| **Release assessed** | `v3.0-rc1` (commit `7804616`): the release candidate tested on staging; documentation finalised afterwards (see `release-baseline.md`) |
| **Decided by** | Group L (Chanzél, Kaylee, Alyssa), 17/10/2026 |
| **In one sentence** | The product works and its core workflow is well evidenced, but releasing it to the public now would expose residents' personal information to known, unmitigated security risks, and the build can't yet run at a real address. |

## 2. Options considered

| Option | Why accepted or rejected |
|---|---|
| **Production** | Rejected. Four blocking concerns (section 4) would put stakeholder data at risk. Fixing them now would mean adding new security functionality at the deadline without time to verify it, which the M4 brief warns against |
| **Simulated production** | Rejected. It would demonstrate a deployment, but with the same blocking concerns still present; calling it "production-like" would overstate readiness |
| **Remain in staging (no-go)** | **Accepted.** The release candidate is verified on staging, and the concerns that prevent release are specific, evidenced and fixable (section 6) |

## 3. Evidence that supports the product (what is ready)

| Area | Evidence | Result |
|---|---|---|
| Core workflow | TC-E01, TC-E02 in Chromium, Firefox and Edge | All critical journeys pass: submit → assign → comment → resolve → close → requester feedback |
| Workflow integrity | TC-U01, TC-B05, TC-B06 | Only valid status changes are possible (DEF-003 fixed) |
| Data integrity | TC-I03, TC-I04, TC-I05 | Requests stored completely; status and history saved together or not at all (DEF-004 fixed) |
| Access control | TC-I01, TC-I02, TC-U03, REG-DEF-007 | Missing, forged and expired tokens rejected; 8 wrong-role scenarios blocked; staff pages guarded |
| Code review of access scope | `requestModel.js` | Requesters only see their own requests (`requester_id = $2`); staff only see and comment on requests assigned to them (`assigned_staff_id = $2`); all queries are parameterised |
| Error handling | TC-I01, TC-I02, TC-I05 | Users only see plain messages; no internal details |
| Secrets and dependencies | `security-scanning.md` | 0 secrets in Git history; 0 vulnerabilities in shipped packages |
| Performance | TC-P01 | 50 users: p95 52.92 ms (target < 2,000 ms), 0% failed |
| Staging verification | `rollback-plan.md`, `staging-verification-output.txt`, `EvidenceOk.png` (#81) | `/health` ok (17 Oct 2026); 4/4 E2E checks passed on staging in Edge (both journeys + DEF-007 regression) |
| Availability | `availability.md`, `availability-log.csv` (#89) | 120/120 checks up: 100% over 60 min on 17 Oct 2026 (target ≥ 99%) |
| Backup & restore | `backup-restore.md` (#83) | Backup and restore worked and all 5 tables matched; but the request tables were empty, so restoring real service data is **not yet demonstrated** |
| Usability | `usability-test.md` (#88) | 5/5 participants completed all key tasks unassisted (100%, target ≥ 80%) |
| Rollback | `rollback-plan.md` | Rolled back to a previous commit and forward again; the API restarted both times. Only partly verified: the older commit had no `/health` endpoint to check |
| Defects | `defect-register.md` | 9 found, 8 fixed, 1 minor deferred (DEF-006), 0 open, 0 critical |

## 4. Blocking concerns (why we are not releasing)

| # | Concern | Evidence (from code review and testing) | Affected requirement / risk | Consequence if released now |
|---|---|---|---|---|
| B1 | **The build only works on `localhost`** | The client calls `http://localhost:5000` directly (e.g. `NewRequest.jsx`, `Navbar.jsx`), and the API only accepts requests from `http://localhost:5173` (`app.js`, CORS). There is no configuration for a real address | RISK-014 (deployment differs) | The app cannot be reached by real users without changing code. Releasing would mean deploying an unverified, modified build |
| B2 | **No HTTPS** | No TLS configuration or hosting setup exists; staging runs over plain HTTP | **NFR-003 (Must):** "All production communication shall use HTTPS" | Passwords and login tokens would travel unencrypted and could be intercepted |
| B3 | **Unlimited login attempts** | `/api/auth/login` (`authRoutes.js`, `app.js`) has no rate limiting or lockout | RISK-015 | Accounts, including management accounts, can be taken over by password guessing |
| B4 | **Login tokens can't be revoked** | Tokens last 2 hours (`authController.js`), are stored in `sessionStorage`, and logout only deletes them in the browser (`Navbar.jsx`); the server has no revocation | RISK-016 | A stolen token keeps working for up to 2 hours, even after the user logs out |

**Why these block release:** CivicConnect stores residents' **personal information** (names, email addresses, and request details that can include locations and security incidents). Releasing it publicly with B2–B4 would not provide appropriate protection for that information, which is also a legal expectation in South Africa (POPIA). B1 means a production release is not yet technically possible without unverified changes.

## 5. Accepted limitations (known, but not blocking)

| Limitation | Evidence | Why not blocking |
|---|---|---|
| Two staff can overwrite each other's change (RISK-009, TD-004) | No version check; TC-I07 not applicable | Rare with a small team; the history table still records every change. Should be fixed soon after release |
| Failed notifications are lost (RISK-010, TD-005) | `sendNotificationSafely` only logs failures | The request itself is never affected (TC-U05); the requester can still see the status on screen |
| Reject feedback unavailable (FR-005 partial) | No Rejected status (DEC-007, TD-006) | Requests are still tracked and updated; a design change, not a fault |
| Signup reveals whether an email is registered | `authController.js` returns "An account with this email already exists" | Low impact on its own, but worth fixing together with B3 |
| Request list has no pagination | `getAllRequests` returns every request | Fast at the tested volume (TC-P01); will slow down as data grows |
| Optional dates not validated (DEF-006) | `incidentDate`, `dateLost` passed through unchecked | The UI date picker only sends valid dates; worst case is an error message |
| Recovery of real data not demonstrated | Backup drill restored empty request tables (#83) | The mechanism works; a drill with real data is needed before release (section 6) |

## 6. What must happen before go-live

| # | Action | Resolves | Size |
|---|---|---|---|
| 1 | Move the API address and allowed CORS origin into configuration (e.g. `VITE_API_URL`, `CORS_ORIGIN`) | B1 | Small |
| 2 | Deploy behind HTTPS (hosting platform certificate or reverse proxy) and verify it | B2, NFR-003 | Small–medium |
| 3 | Add login rate limiting (e.g. 5 failed attempts per 15 minutes) and a generic signup response | B3, RISK-015 | Small |
| 4 | Shorten token life and add server-side revocation on logout (or move to httpOnly cookies) | B4, RISK-016 | Medium |
| 5 | Add a version check to updates | RISK-009 (recommended, not blocking) | Medium |
| 6 | Repeat the backup/restore drill with request data, and rehearse a rollback to a tag that has `/health` | NFR-014, rollback evidence | Small |
| 7 | Rerun the full CI suite and the E2E journeys against the production-like environment, with a backup taken first | Release verification | Small |

**Go-live criteria:** actions 1–4 and 6 done; each change covered by a test; CI green on the release tag; E2E journeys pass on the HTTPS environment; backup and rollback rehearsed. When all are met, the team can responsibly approve a production release.

## 7. Conclusion

The no-go is not caused by unfinished work: every committed core journey works and is verified. It is a deliberate decision to protect residents' data and the integrity of the service, based on four specific, evidenced concerns and a clear, small list of fixes required before release.