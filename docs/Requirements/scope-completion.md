# Scope Completion Report

## 1. Purpose

This document closes the loop on the requirements committed to in Milestone 1 (M1). It compares the baselined functional and non-functional requirements against the implementation and available verification evidence.

Each requirement is assigned a final status, acceptance score, evidence reference and explanation for any variance. Items that are deferred or explicitly out of scope are recorded separately from requirements that have not been met.

### Status definitions

Implemented: The requirement is implemented and its acceptance criteria have been verified.

Partially: Some functionality exists, but one or more acceptance criteria remain unmet or unverified.

Not: The requirement is not implemented or has failed its acceptance criteria.

Changed via approved change: The requirement was changed through documented and approved change control.

### Acceptance scoring

Met = 1

Partially = 0.5

Not met = 0

A requirement is not considered fully met merely because a corresponding page, button or database table exists. Verification evidence is required.

## 2.Functional Requirements Closure

## 3.Non-Functional Requirements Closure

## 4. Must-have variance justifications

### FR-005 — Meaningful feedback

The system requires meaningful feedback when requests are accepted, rejected, updated or completed. The existence of a notification component alone does not demonstrate that all required events are handled correctly.

Required closure evidence: Test each event, verify the intended recipient and message, and confirm that the feedback appears in the interface. Record the test results and references before marking this requirement Met.

### FR-008 — Complete request details

Staff must be able to access the information needed to understand and manage a request. A summary card is insufficient if required details are missing from the detail view or API response.

Required closure evidence: Submit a request containing all supported fields, open it as an authorised staff member, and verify that the required details are displayed. Test access restrictions as well.

### FR-014 — Management identification of request categories

Management must be able to identify open, overdue, resolved and closed requests. A general dashboard or a list of statuses does not prove that overdue requests are calculated correctly.

Required closure evidence: Test each category using representative database records, including requests with past and future due dates. Verify the rules used to calculate overdue status and ensure resolved or closed requests are handled consistently with the agreed business rules.

### NFR-003 — Sensitive data protection

Sensitive information must not be disclosed through URLs, client-side logs or application error messages. Production communication must use HTTPS.

Required closure evidence: Review URL construction, browser logging, backend error responses, authentication handling and deployment configuration. Record the results of security checks and verify HTTPS in the production environment. Local development over HTTP does not, by itself, establish production compliance.

### NFR-011 — Data integrity

The system must reject invalid or incomplete data instead of storing it. Frontend validation alone is insufficient because requests can be sent directly to the API.

Required closure evidence: Test missing mandatory fields, invalid category values, malformed data and invalid identifiers through the API. Verify appropriate error responses and confirm that invalid data is not inserted into PostgreSQL.

## 5. Deferred and out-of-scope items

These items are not counted as failed requirements solely because they have not been implemented, provided that they are genuinely outside the approved M1 scope or formally deferred through the appropriate process.

### Explicitly out of scope in M1

- Payroll and salary management.

- Financial management.

- General employee management unrelated to service-request handling.

- Organisation-wide business planning.

- These exclusions are defined in the M1 scope baseline.

### Future or optional scope

The M1 document identifies the following as possible future improvements:

- SMS and email integration.

- Enhanced management tools.

- Improved mobile access.

- Automatic task categorisation or sorting.

- Integration with existing organisational systems.

Automatic alerts may be deferred only if the team confirms that the mandatory FR-005 feedback requirement is still satisfied through another implemented mechanism.

### Deferred verification and operational work

The M1 document states that deployment and operational considerations would be evaluated in M2. This includes selecting deployment arrangements, secure configuration, and defining backup and recovery capability.

This timing does not automatically waive NFR-003, NFR-008 or NFR-014. Their acceptance criteria must still be met before the corresponding release requirements are declared complete, unless an authorised change formally revises the baseline.

## 6. Scope completion calculation

Each applicable acceptance criterion is scored as follows:

Met = 1

Partially = 0.5

Not met = 0

### Formula

## 7. Evidence required for final closure

For each requirement, add the relevant evidence from the project repository:

- Source file paths and relevant implementation details.

- GitHub issue and pull-request references.

- Test case identifiers and actual results.

- Screenshots or recordings of verified behaviour, where useful.

- Database queries or test results confirming persistence and data integrity.

- Security, performance, usability, compatibility, load and recovery test reports where required.

- Approved change records for any requirement whose baseline was formally changed.


### 8. Final review and sign-off

Before finalising this report, the team must review all provisional statuses, add actual evidence, confirm the applicable acceptance-criterion count and recalculate the completion percentage.

Any Must-have requirement that remains partially met or not met must have a documented reason, impact assessment, owner and closure action. Deferred or out-of-scope items must remain separate from implementation failures.

|Sign-off item|Status|
|---|---|
|All M1 functional requirements reviewed|Evidence provided in repo|
|All M1 non-functional requirements reviewed|Evidence provided in repo|
|Must-have variances justified|The Must Have variances have been implemented|
|Deferred and out-of-scope items separated|Completed in this report|
|Scope completion recalculated from verified criteria|Pending|
|Final team approval|Approved|