
import { useEffect, useMemo, useState } from "react";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";
import { getDateInputValue, isOverdue } from "../utils/overdue";

const API_URL = "http://localhost:5000/api/requests";

const MANAGEMENT_STATUSES = [
  "Pending",
  "Assigned",
  "In Progress",
  "On Hold",
  "Resolved",
  "Closed",
];

async function apiRequest(url, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const responseText = await response.text();
  let data;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { message: responseText };
  }

  if (!response.ok) {
    console.error("Management API error:", {
      url,
      status: response.status,
      response: data,
    });

    throw new Error(
      data.message || `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

function getField(object, ...keys) {
  for (const key of keys) {
    if (
      object &&
      object[key] !== undefined &&
      object[key] !== null &&
      object[key] !== ""
    ) {
      return object[key];
    }
  }

  return null;
}

function formatDate(value) {
  if (!value) return "Not provided";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleString();
}

function formatDateOnly(value) {
  const dateValue = getDateInputValue(value);

  if (!dateValue) return "Not set";

  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString();
}

function DetailField({ label, value, multiline = false }) {
  const displayValue =
    value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";

  return (
    <div className={`manager-detail-field${multiline ? " manager-detail-field-wide" : ""}`}>
      <span>{label}</span>
      <p>{displayValue}</p>
    </div>
  );
}

function HorizontalBarChart({ title, data }) {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <section className="overview-chart">
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p className="chart-empty">No data available.</p>
      ) : (
        <div className="chart-bars">
          {data.map((item) => (
            <div className="chart-row" key={item.label}>
              <span className="chart-label" title={item.label}>
                {item.label}
              </span>

              <div
                className="chart-track"
                role="progressbar"
                aria-label={item.label}
                aria-valuemin={0}
                aria-valuemax={maxValue}
                aria-valuenow={item.value}
              >
                <div
                  className="chart-fill"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    minWidth: item.value > 0 ? "4px" : "0",
                  }}
                />
              </div>

              <strong className="chart-value">{item.value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RequestDetailsModal({ request, onClose, staffMembers }) {
  useEffect(() => {
    if (!request) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [request, onClose]);

  if (!request) return null;

  const id = getField(request, "id", "request_id");
  const title = getField(request, "title", "request_title", "subject");
  const assignedStaffId = getField(
    request,
    "assignedStaffId",
    "assigned_staff_id"
  );

  const staffMember = staffMembers.find(
    (member) => String(member.id) === String(assignedStaffId)
  );

  const assignedName =
    staffMember?.fullName ||
    getField(
      request,
      "staffName",
      "staff_name",
      "assigned",
      "assigned_to",
      "assigned_name"
    ) ||
    "Unassigned";

  return (
    <div
      className="manager-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="manager-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-details-title"
      >
        <header className="manager-modal-header">
          <div>
            <p className="manager-modal-reference">
              REQUEST #{id ?? "—"}
            </p>

            <h2 id="manager-details-title">
              {title || `Request #${id}`}
            </h2>

            <div className="manager-modal-status">
              <StatusBadge status={request.status || "Pending"} />
            </div>
          </div>

          <button
            type="button"
            className="manager-modal-close"
            onClick={onClose}
            aria-label="Close request details"
          >
            &times;
          </button>
        </header>

        <div className="manager-modal-body">
          <section className="manager-detail-section">
            <h3>Request Information</h3>

            <div className="manager-detail-grid">
              <DetailField
                label="Reference number"
                value={id != null ? `#${id}` : null}
              />

              <DetailField
                label="Category"
                value={getField(request, "category")}
              />

              <DetailField
                label="Status"
                value={getField(request, "status")}
              />

              <DetailField
                label="Assigned staff"
                value={assignedName}
              />

              <DetailField
                label="Submitted"
                value={formatDate(
                  getField(
                    request,
                    "submittedAt",
                    "submitted",
                    "submitted_at",
                    "createdAt",
                    "created_at"
                  )
                )}
              />

              <DetailField
                label="Last updated"
                value={formatDate(
                  getField(
                    request,
                    "updatedAt",
                    "updated",
                    "updated_at"
                  )
                )}
              />

              <DetailField
                label="Due date"
                value={formatDateOnly(
                  getField(request, "dueDate", "due_date")
                )}
              />
            </div>
          </section>

          <section className="manager-detail-section">
            <h3>Requester Information</h3>

            <div className="manager-detail-grid">
              <DetailField
                label="Requester name"
                value={getField(
                  request,
                  "requesterName",
                  "requester_name",
                  "request_name"
                )}
              />

              <DetailField
                label="Requester email"
                value={getField(
                  request,
                  "requesterEmail",
                  "requester_email",
                  "request_email"
                )}
              />
            </div>
          </section>

          <section className="manager-detail-section">
            <h3>Request Description</h3>

            <DetailField
              label="Full description"
              value={getField(
                request,
                "description",
                "request_description",
                "requestDescription",
                "details"
              )}
              multiline
            />
          </section>

          <section className="manager-detail-section">
            <h3>Technical Details</h3>

            <div className="manager-detail-grid">
              <DetailField
                label="Issue type"
                value={getField(request, "issueType", "issue_type")}
              />

              <DetailField
                label="Device type"
                value={getField(request, "deviceType", "device_type")}
              />

              <DetailField
                label="Device name"
                value={getField(request, "deviceName", "device_name")}
              />

              <DetailField
                label="Manufacturer"
                value={getField(request, "manufacturer")}
              />

              <DetailField
                label="Model"
                value={getField(request, "model")}
              />

              <DetailField
                label="Software name"
                value={getField(request, "softwareName", "software_name")}
              />

              <DetailField
                label="Software version"
                value={getField(
                  request,
                  "softwareVersion",
                  "software_version"
                )}
              />

              <DetailField
                label="Operating system"
                value={getField(
                  request,
                  "operatingSystem",
                  "operating_system"
                )}
              />

              <DetailField
                label="Location"
                value={getField(request, "location")}
              />

              <DetailField
                label="Date issue started"
                value={formatDate(
                  getField(request, "dateStarted", "date_started")
                )}
              />

              <DetailField
                label="Impact"
                value={getField(request, "impact")}
              />

              <DetailField
                label="Urgency"
                value={getField(request, "urgency")}
              />

              <DetailField
                label="Error message"
                value={getField(request, "errorMessage", "error_message")}
                multiline
              />

              <DetailField
                label="Troubleshooting already attempted"
                value={getField(request, "troubleshooting")}
                multiline
              />
            </div>
          </section>
        </div>

        <footer className="manager-modal-footer">
          <button type="button" onClick={onClose}>
            Close Details
          </button>
        </footer>
      </section>
    </div>
  );
}

function ManagementDashboard() {
  const [requests, setRequests] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [selectedDueDates, setSelectedDueDates] = useState({});
  const [assigningId, setAssigningId] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);

  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [savingStatusIds, setSavingStatusIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Status");
  const [category, setCategory] = useState("Category");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staffError, setStaffError] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(API_URL);

      const records = Array.isArray(data)
        ? data
        : data.requests ?? data.rows ?? data.data;

      if (!Array.isArray(records)) {
        throw new Error("The requests API did not return a list.");
      }

      const normalized = records.map((request) => {
        const requestStatus = request.status ?? "Pending";

        const dueDate = getDateInputValue(
          request.dueDate ??
            request.due_date ??
            request.due ??
            ""
        );

        const staffId =
          request.assignedStaffId ??
          request.assigned_staff_id ??
          "";

        return {
          ...request,

          id: request.id ?? request.request_id,

          title:
            request.title ??
            request.request_title ??
            request.subject ??
            "Untitled request",

          requesterName:
            request.requesterName ??
            request.request_name ??
            request.requester_name ??
            "Unknown requester",

          requesterEmail:
            request.requesterEmail ??
            request.request_email ??
            request.requester_email ??
            "",

          category: request.category ?? "Uncategorised",
          status: requestStatus,

          assignedStaffId:
            staffId === null ? "" : String(staffId),

          assigned:
            request.staffName ??
            request.staff_name ??
            request.assigned ??
            request.assigned_to ??
            request.assigned_name ??
            "Unassigned",

          dueDate,
          due: formatDateOnly(dueDate),
          overdue: isOverdue(dueDate, requestStatus),
        };
      });

      setRequests(normalized);

      setSelectedStatuses((previous) => {
        const next = { ...previous };

        normalized.forEach((request) => {
          next[request.id] ??= request.status;
        });

        return next;
      });

      setSelectedStaff((previous) => {
        const next = { ...previous };

        normalized.forEach((request) => {
          next[request.id] ??= request.assignedStaffId;
        });

        return next;
      });

      setSelectedDueDates((previous) => {
        const next = { ...previous };

        normalized.forEach((request) => {
          next[request.id] ??= request.dueDate;
        });

        return next;
      });
    } catch (err) {
      console.error("Loading requests failed:", err);
      setError(err.message || "Could not load requests.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStaffMembers() {
    setStaffError("");

    try {
      const data = await apiRequest(`${API_URL}/staff`);

      const records = Array.isArray(data)
        ? data
        : data.staff ?? data.users ?? data.data;

      if (!Array.isArray(records)) {
        throw new Error("The staff API did not return a list.");
      }

      setStaffMembers(
        records.map((member) => ({
          id: String(member.id ?? member.user_id),
          fullName:
            member.fullName ??
            member.full_name ??
            member.name ??
            "Unnamed staff member",
          email: member.email ?? "",
        }))
      );
    } catch (err) {
      console.error("Loading staff failed:", err);
      setStaffError(err.message || "Could not load staff members.");
    }
  }

    /* eslint-disable react-hooks/set-state-in-effect -- loads data on mount; refactor deferred (TD-003) */
  useEffect(() => {
    loadRequests();
    loadStaffMembers();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleAssign(request) {
    const staffId = selectedStaff[request.id];
    const dueDate = selectedDueDates[request.id];

    setAssignmentError("");
    setAssignmentMessage("");

    if (!staffId) {
      setAssignmentError("Please select a staff member.");
      return;
    }

    if (!dueDate) {
      setAssignmentError("Please select a due date.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      setAssignmentError("Please select a valid due date.");
      return;
    }

    const parsedDate = new Date(`${dueDate}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== dueDate
    ) {
      setAssignmentError("The selected due date is invalid.");
      return;
    }

    setAssigningId(request.id);

    try {
      const result = await apiRequest(
        `${API_URL}/${request.id}/assign`,
        {
          method: "PUT",
          body: JSON.stringify({
            staffId: Number(staffId),
            dueDate,
          }),
        }
      );

      const chosenStaff = staffMembers.find(
        (member) => member.id === String(staffId)
      );

      const savedStatus = result.request?.status ?? "Assigned";

      setRequests((previous) =>
        previous.map((item) =>
          String(item.id) === String(request.id)
            ? {
                ...item,
                assignedStaffId: String(staffId),
                assigned: chosenStaff?.fullName ?? "Assigned",
                dueDate,
                due: formatDateOnly(dueDate),
                status: savedStatus,
                overdue: isOverdue(dueDate, savedStatus),
              }
            : item
        )
      );

      setSelectedStatuses((previous) => ({
        ...previous,
        [request.id]: savedStatus,
      }));

      setAssignmentMessage(
        result.message ||
          `Request #${request.id} assigned successfully.`
      );
    } catch (err) {
      console.error("Assignment failed:", err);
      setAssignmentError(
        err.message || "Could not assign this request."
      );
    } finally {
      setAssigningId(null);
    }
  }

  async function handleStatusUpdate(request) {
    const newStatus = selectedStatuses[request.id];

    if (!MANAGEMENT_STATUSES.includes(newStatus)) {
      setStatusError("Please select a valid status.");
      return;
    }

    if (newStatus === request.status) {
      setStatusMessage("The request already has this status.");
      return;
    }

    setSavingStatusIds((previous) =>
      previous.includes(request.id)
        ? previous
        : [...previous, request.id]
    );

    setStatusMessage("");
    setStatusError("");

    try {
      const data = await apiRequest(
        `${API_URL}/${request.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const savedStatus = data.request?.status ?? newStatus;

      setRequests((previous) =>
        previous.map((item) =>
          String(item.id) === String(request.id)
            ? {
                ...item,
                status: savedStatus,
                overdue: isOverdue(item.dueDate, savedStatus),
              }
            : item
        )
      );

      setSelectedStatuses((previous) => ({
        ...previous,
        [request.id]: savedStatus,
      }));

      setStatusMessage(
        data.message ||
          `Request #${request.id} updated to ${savedStatus}.`
      );
    } catch (err) {
      console.error("Status update failed:", err);
      setStatusError(
        err.message || "Could not update the request status."
      );
    } finally {
      setSavingStatusIds((previous) =>
        previous.filter(
          (id) => String(id) !== String(request.id)
        )
      );
    }
  }

  const categories = useMemo(
    () =>
      [...new Set(requests.map((request) => request.category))]
        .filter(Boolean)
        .sort(),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        String(request.id ?? "").toLowerCase().includes(query) ||
        request.title.toLowerCase().includes(query) ||
        request.requesterName.toLowerCase().includes(query) ||
        request.requesterEmail.toLowerCase().includes(query) ||
        request.assigned.toLowerCase().includes(query);

      const matchesStatus =
        status === "Status" ||
        (status === "Overdue"
          ? request.overdue
          : request.status === status);

      const matchesCategory =
        category === "Category" || request.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [requests, search, status, category]);

  const stats = useMemo(
    () => [
      { label: "Total Requests", value: requests.length },
      {
        label: "Open",
        value: requests.filter((request) =>
          ["Open", "Pending", "Assigned"].includes(request.status)
        ).length,
      },
      {
        label: "In Progress",
        value: requests.filter(
          (request) => request.status === "In Progress"
        ).length,
      },
      {
        label: "Resolved",
        value: requests.filter((request) =>
          ["Resolved", "Closed"].includes(request.status)
        ).length,
      },
    ],
    [requests]
  );

  const statusChart = useMemo(
    () =>
      [
        "Pending",
        "Assigned",
        "In Progress",
        "On Hold",
        "Resolved",
        "Closed",
        "Overdue",
      ].map((label) => ({
        label,
        value: filteredRequests.filter((request) =>
          label === "Overdue"
            ? request.overdue
            : request.status === label
        ).length,
      })),
    [filteredRequests]
  );

  const categoryChart = useMemo(
    () =>
      categories.map((label) => ({
        label,
        value: filteredRequests.filter(
          (request) => request.category === label
        ).length,
      })),
    [categories, filteredRequests]
  );

  return (
    <div className="page management-dashboard-page">
      <BrandHeader title="MANAGEMENT DASHBOARD" />

      <Navbar role="management" />

      <main className="dashboard-content management-content">
        <SectionHeading title="Overview" />

        <div className="management-stats">
          {stats.map((stat) => (
            <section className="management-stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </section>
          ))}
        </div>

        {error && (
          <div className="dashboard-message dashboard-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadRequests}>
              Retry
            </button>
          </div>
        )}

        <div className="overview-charts">
          <HorizontalBarChart
            title="Requests by Status"
            data={statusChart}
          />

          <HorizontalBarChart
            title="Requests by Category"
            data={categoryChart}
          />
        </div>

        <SectionHeading title="Service Requests" />

        {assignmentMessage && (
          <div className="dashboard-message assignment-success" role="status">
            {assignmentMessage}
          </div>
        )}

        {assignmentError && (
          <div className="dashboard-message dashboard-error" role="alert">
            {assignmentError}
          </div>
        )}

        {statusMessage && (
          <div className="dashboard-message assignment-success" role="status">
            {statusMessage}
          </div>
        )}

        {statusError && (
          <div className="dashboard-message dashboard-error" role="alert">
            {statusError}
          </div>
        )}

        {staffError && (
          <div className="dashboard-message dashboard-error" role="alert">
            <p>{staffError}</p>
            <button type="button" onClick={loadStaffMembers}>
              Retry staff list
            </button>
          </div>
        )}

        <div className="staff-filters management-filters">
          <input
            className="search-input"
            type="search"
            placeholder="Search requests, requesters or staff..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search requests, requesters or staff"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="Status">All statuses</option>

            {MANAGEMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="Category">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="secondary-button refresh-button"
            onClick={() => {
              loadRequests();
              loadStaffMembers();
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="dashboard-message">Loading requests...</p>
        ) : (
          <div className="table-scroll">
            <table className="staff-table management-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Title</th>
                  <th>Requester</th>
                  <th>Category</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Assigned Staff</th>
                  <th>Due Date</th>
                  <th>Overdue</th>
                  <th>Details</th>
                  <th>Assign / Reassign</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="empty-table">
                      No requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => {
                    const isSaving = savingStatusIds.some(
                      (id) => String(id) === String(request.id)
                    );

                    return (
                      <tr key={request.id ?? index}>
                        <td>#{request.id ?? "—"}</td>

                        <td>{request.title}</td>

                        <td>
                          <div className="requester-cell">
                            <strong>
                              {request.requesterName || "Unknown requester"}
                            </strong>

                            <small>
                              {request.requesterEmail || "No email available"}
                            </small>
                          </div>
                        </td>

                        <td>{request.category}</td>

                        <td>
                          <StatusBadge status={request.status} />
                        </td>

                        <td>
                          <div className="management-status-controls">
                            <select
                              value={
                                selectedStatuses[request.id] ??
                                request.status
                              }
                              onChange={(event) => {
                                setSelectedStatuses((previous) => ({
                                  ...previous,
                                  [request.id]: event.target.value,
                                }));

                                setStatusMessage("");
                                setStatusError("");
                              }}
                              aria-label={`Change status for request ${request.id}`}
                              disabled={isSaving}
                            >
                              {MANAGEMENT_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="management-save-status"
                              onClick={() => handleStatusUpdate(request)}
                              disabled={
                                isSaving ||
                                !selectedStatuses[request.id] ||
                                selectedStatuses[request.id] === request.status
                              }
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </td>

                        <td>{request.assigned}</td>

                        <td>{request.due}</td>

                        <td className={request.overdue ? "overdue-text" : ""}>
                          {request.overdue ? "Yes" : "No"}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="manager-view-details-button"
                            onClick={() => setViewingRequest(request)}
                          >
                            View Details
                          </button>
                        </td>

                        <td>
                          <div className="assignment-controls">
                            <select
                              value={selectedStaff[request.id] ?? ""}
                              onChange={(event) => {
                                setSelectedStaff((previous) => ({
                                  ...previous,
                                  [request.id]: event.target.value,
                                }));

                                setAssignmentError("");
                                setAssignmentMessage("");
                              }}
                              aria-label={`Select staff for request ${request.id}`}
                              disabled={staffMembers.length === 0}
                            >
                              <option value="">Select staff...</option>

                              {staffMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.fullName}
                                </option>
                              ))}
                            </select>

                            <input
                              type="date"
                              value={selectedDueDates[request.id] || ""}
                              onChange={(event) =>
                                setSelectedDueDates((previous) => ({
                                  ...previous,
                                  [request.id]: event.target.value,
                                }))
                              }
                              aria-label={`Select due date for request ${request.id}`}
                              className="due-date-input"
                            />

                            <button
                              type="button"
                              onClick={() => handleAssign(request)}
                              disabled={
                                !selectedStaff[request.id] ||
                                !selectedDueDates[request.id] ||
                                assigningId === request.id ||
                                staffMembers.length === 0
                              }
                            >
                              {assigningId === request.id
                                ? "Saving..."
                                : request.assignedStaffId
                                  ? "Reassign"
                                  : "Assign"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <RequestDetailsModal
        request={viewingRequest}
        staffMembers={staffMembers}
        onClose={() => setViewingRequest(null)}
      />
    </div>
  );
}

export default ManagementDashboard;
