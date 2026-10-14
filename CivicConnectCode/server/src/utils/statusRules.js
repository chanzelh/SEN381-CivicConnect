// Controlled status transitions (FR-010, FR-012).
// Key = current status, value = statuses it may move to via PATCH /status.
// "Assigned" is only reached through the assignment endpoint, never directly.
const STATUS_TRANSITIONS = {
  Open: ["Pending"],
  Pending: [],
  Assigned: ["In Progress"],
  "In Progress": ["On Hold", "Resolved"],
  "On Hold": ["In Progress"],
  Resolved: ["Closed"],
  Closed: [],
};

// Statuses from which a request may be (re)assigned to staff.
const ASSIGNABLE_STATUSES = ["Open", "Pending", "Assigned"];

function isValidTransition(currentStatus, newStatus) {
  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}

function canAssign(currentStatus) {
  return ASSIGNABLE_STATUSES.includes(currentStatus);
}

module.exports = {
  STATUS_TRANSITIONS,
  ASSIGNABLE_STATUSES,
  isValidTransition,
  canAssign,
};