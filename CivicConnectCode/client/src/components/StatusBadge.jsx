function StatusBadge({ status }) {
  const safeStatus = status || "Pending";

  const normalizedStatus = safeStatus
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {safeStatus}
    </span>
  );
}

export default StatusBadge;
