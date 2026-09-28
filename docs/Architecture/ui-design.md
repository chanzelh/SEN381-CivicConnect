# UI & Interaction Design
## 1. Design Goals
| Goal Number | Goal | Driven By |
|---|---|---|
| G1 | A requester must be able to successfully submit a request and check its status without any assistance | NFR-006 (80% of the test users complete the key tasks unassisted)|
| G2 | Each role must only see the screen and actions that are necessary/appropriate for them | NFR-002 (role-based access) |
| G3 |  Incomplete/invalid input must be rejected at the interface with valuable feedback to the user | NFR-011 (data integrity) |
| G4 |  Core screens my work on necessary browsers with no browser-specific features | NFR-012 (browser compatibility) |
 
## 2. Information Architecture 
The login is shared and after the user logs in, they will land on their role's specific homescreen. Every screen will also show the same top bar (except the login page). Access of each type of role will be enforced on the server side (NFR-002), so this ensures security that a user can't type a staff URL and get access automatically.

The UI is following the presentation layer that is defined in the architecture under Modular Layered Monolith Architecture.png.

**Shared:**   Login → (role-based landing screen)

**Requester:**   Requester Dashboard → Submit New Request
 → Request Detail (status + history)

**Staff:**       Staff Dashboard → Request Detail (assign / update status / comment / resolve / close)

**Management:**  Management Dashboard → Request Detail (read-only)

## 3. User Flows 
Requester flow: Requester Flowchart.png
Staff flow: Staff Flowchart.png
Management flow: Management Flowchart.png

Rule for the Staff flow: after successfully updating a status and adding comments or actions, staff wil either resolve the request or continue working. Only a resolved request proceeds to close (FR-010, FR-012).

## 4. Wireframes 
| Screen | Role | Requirements covered | Wireframe |
|---|---|---|---|
| Login | All | NFR-001, NFR-003 | login.png |
| Submit a new request | Requester | FR-001, FR-002 | requester-submit-request.png |
| Submit a new request with validation errors | Requester | NFR-011 | requester-submit-request-error.png |
| Requester Dashboard | Requester | FR-003, FR-004 | requester-dashboard.png |
| Request Detail | Requester | FR-003, FR-005 | requester-request-detail.png |
| Staff Dashboard | Staff | FR-006, FR-007 | staff-dashboard.png |
| Request Detail and actions | Staff | FR-008, FR-009, FR-010, FR-011, FR-012, NFR-009 | staff-request-detail.png |
| Management Dashboard | Management | FR-013, FR-014, FR-015 | management-dashboard.png |

## 5. Usability Rationale
| Design Choice | Why | Requirement | 
|---|---|---|
| Overdue is being shown as a flag instead of as a status on a request | A request can be in progress as well as overdue at the same time | FR-014 |
| The Management Dashboard shows the counts for the amount of requests that are open, overdue, resolved and closed. Filters can also be used that filters everything by category, status and date | This gives the management an wide overview | FR-013, FR-014, FR-015 |
| The status, comments, assignment and history are all on one screen | Staff are able to complete common tasks without navigating between screens | FR-008 up until FR-012 |
| Status dropdown will only offer the valid next statuses | This will prevent any invalid transitions at the interface and backend | FR-010 |
| Validtion messages will appear the field it is referring to | User-friendly way to ensure users aren't confused | NFR-011 |
| A timeline of status changes/messages on the request detail | Requesters are able to see updates, rejections as well as resolution notes in one place | FR-005 |
| Confirmation shows the request reference number | The requester gets immediate proof that the request was successfully received | FR-001 |
| Few fields on the submit form and the category gets chosen from a dropdown | This keeps the submission quick and enforces controlled category selection | NFR-006, FR-002 |
| Status shown as a badge in the requester's list | This ensuress the status is visible without having to open each request | FR-003 |

## 6. Accessibility Rationale
The design target agreed upon: WCAG 2.2 Level AA (a design reference and not a claim of compliance).

**Verification:** Has not yet been performed as a more in detail/technical keyboard walkthrough is planned for Milestone 3.

**Design choices:**
- Layout will use standard components so it works across all types of browsers as outlined for the NFR-012.
- Error messages are simple texts that get placed next to a field they refer to.
- Status shown as text plus colour and never just the colour by itself.
- Every input has a visible label.
- Forms and actions are operable by keyboard

## 7. Deliberate Simplifications
The few deliberate simplifications we decided on are as follows:
- Wireframes are low-fidelity with no visual styling
- No file attachments and no editing of a request after submission. As well as no in-app messaging between the requester and staff since these are all outside the necessary/baselined scope.
- The Management Dashboard is read-only, meaning they can view a request detail but not change the assignment or status.

## 8. Validation Status
The entire team has reviewed the wireframes against all the listed functional requirements. They have not yet been tested in an operational environment with real users. Usability testing and accessibility checks are planned for M3.

## Traceability Summary
| Requirement | Screen |
|---|---|
| FR-001, FR-002 | Submit a new request |
| FR-003, FR-004 | Requester Dashboard, Requester request detail |
| FR-005 | Requester request detail (timeline), Notification Service |
| FR-006, FR-007 | Staff Dashboard |
| FR-008 up until FR-012| Staff Request Detail  |
| FR-013 up until FR-015 | Management Dashboard |
| NFR-001, NFR-003 | Login |
| NFR-002 | Role-specific navigation (enforced on the server-side) |
| NFR-006 | All requester screens (target for usability) |
| NFR-009 | Staff Request Detail (historical timeline of who, what and when) |
| NFR-011 | Submit new request (validation errors) |
| NFR-012 | All Screens |