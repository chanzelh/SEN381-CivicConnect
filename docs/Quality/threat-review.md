# CivicConnect Security Threat Review
# Milestone Four - Final

This review actively  identifies where CivicConnect could be attacked, what is protected today and the evidence for each protection and the risk remaining.**It is not claiming that the system is fully secure**

## 1. Trust Boundaries
Trust Boundary : Where data crosses from something we don't control into something we do. Every boundary is a place to actively check input and identity. 

| # | Boundary | What crosses it | Main control |
|---|---|---|---|
| TB1 | **Browser ↔ API** | Login details, JWT tokens, request data, comments | `authenticateToken`, `requireRole`, input validation, transition rules |
| TB2 | **API ↔ PostgreSQL** | SQL queries, user data, history | Parameterised queries (`$1`), transactions, credentials from `.env` |
| TB3 | **Developer / GitHub ↔ CI** | Code, workflow file, CI-only credentials | Protected `main`, 2 approvals, required `build-and-test` check, secret scanning |
| TB4 | **npm registry ↔ project** | Third-party packages | Lockfiles + `npm ci`, `npm audit`, Dependabot, malware alerts |

## 2. Key threats (STRIDE)

One key threat per STRIDE category, chosen by impact on CivicConnect.

| STRIDE | Threat | Mitigation | Evidence | Residual risk |
|---|---|---|---|---|
| **S**poofing | Guessing passwords on the login page | bcrypt slows each guess; one generic login error message | `authController.js` | **Medium:** no rate limiting or lockout → **RISK-015** |
| **T**ampering | Changing a request's status out of order, or saving a status without its history | Transition rules (409); status + history in one transaction | TC-U01, TC-B06, TC-I05; DEF-003 and DEF-004 fixed | **Low**, but stale overwrites remain possible (no version check, RISK-009) |
| **R**epudiation | A user denies making a change | Every status change and assignment records who, what and when | TC-I04, TC-B05 | **Low:** direct database access could still alter history |
| **I**nformation disclosure | Leaking internals in errors, or secrets in the repository | Plain error messages; `.gitignore`; secret scanning of the full history | TC-I01, TC-I02 (no internal details); SEC-004, SEC-005 | **Low.** HTTPS is required in production but not used in development; to verify on staging (#80) |
| **D**enial of service | Flooding the API or the login endpoint | Request body size limit (Express default) | — | **Medium:** TC-P01 passed for 50 users (p95 52.92 ms), but there's no rate limiting |
| **E**levation of privilege | A requester reaching staff or management functions, e.g. with a forged "management" token | Signed tokens; `requireRole` on every route; page route guards | TC-I01 (forged token), TC-I02 (8 scenarios), DEF-007 fixed | **Medium:** the token sits in `sessionStorage` and isn't revoked on logout, so a stolen token works until it expires (2 h) → **RISK-016** |

**Also considered, lower risk:** SQL injection (all queries are parameterised), vulnerable packages (`security-scanning.md`), debug logging (DEF-008 fixed).

## 3. New risks for the Risk Register

| Risk ID | Risk | Probability | Impact | Mitigation now | Next action |
|---|---|---|---|---|---|
| RISK-015 | Brute-force password guessing on `/api/auth/login` (no rate limiting or lockout) | Medium | High | bcrypt cost 12; generic login error | Add rate limiting (e.g. `express-rate-limit`) on login before production |
| RISK-016 | Session token theft or reuse: token in `sessionStorage` (XSS-readable) and not revoked on logout | Low | High | 2-hour expiry; React escaping; no debug logging | Consider httpOnly cookies and server-side token revocation |

Existing risks updated by this review: **RISK-002** (unauthorised access) is mitigated, with evidence in the Spoofing and Elevation rows; **RISK-009** (concurrent overwrite) is confirmed as residual (Tampering row); **RISK-008** (status without history) is mitigated and evidenced (Tampering row).

## 4. Summary

The most damaging threats (forged tokens, privilege escalation, workflow tampering, partial writes, error leakage and committed secrets) are mitigated and evidenced by tests or scans. The remaining risks are password guessing (RISK-015), token reuse (RISK-016), stale overwrites (RISK-009), no rate limiting, and HTTPS until deployment. All feed the go-live decision (M4).
