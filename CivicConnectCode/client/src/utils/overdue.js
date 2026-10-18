export function getDateInputValue(value) {
  if (!value) return "";

  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);

  return match ? match[0] : "";
}

export function isOverdue(dueDate, status) {
  const dateValue = getDateInputValue(dueDate);

  if (!dateValue || ["Resolved", "Closed"].includes(status)) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compare local calendar dates: a request due today is not overdue.
  // Parsing components avoids shifting a date-only value through UTC.
  const [year, month, day] = dateValue.split("-").map(Number);
  const deadline = new Date(year, month - 1, day);

  return deadline < today;
}