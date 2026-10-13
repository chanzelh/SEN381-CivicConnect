import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";

const API_URL = "http://localhost:5000/api/requests";

const STAFF_STATUSES = ["In Progress", "On Hold", "Resolved"];

function StaffDashboard() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingIds, setSavingIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  async function loadRequests(signal) {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to view your assigned requests.");
      }

      const response = await fetch(`${API_URL}/assigned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load assigned requests."
        );
      }

      const rows = Array.isArray(data)
        ? data
        : data.requests || data.rows || data.data || [];

      const normalizedRequests = rows.map((request) => ({
        ...request,
        id: request.id ?? request.request_id,
        title:
          request.title ??
          request.request_title ??
          "Untitled request",
        category: request.category ?? "Uncategorised",
        status: request.status ?? "Pending",
        submitted: request.submitted ?? request.submitted_at ?? null,
      }));

      setRequests(normalizedRequests);

      setSelectedStatuses((previous) => {
        const next = {};

        normalizedRequests.forEach((request) => {
          next[request.id] =
            previous[request.id] || request.status;
        });

        return next;
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadRequests(controller.signal);

    return () => controller.abort();
  }, []);

  async function handleStatusUpdate(request) {
    const newStatus = selectedStatuses[request.id];

    if (!STAFF_STATUSES.includes(newStatus)) {
      setError("Please select a valid staff status.");
      return;
    }

    if (newStatus === request.status) {
      setMessage("The request already has this status.");
      return;
    }

    setSavingIds((previous) => [...previous, request.id]);
    setError("");
    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/${request.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update the request status."
        );
      }

      const savedStatus = data.request?.status || newStatus;

      setRequests((previous) =>
        previous.map((item) =>
          item.id === request.id
            ? { ...item, status: savedStatus }
            : item
        )
      );

      setSelectedStatuses((previous) => ({
        ...previous,
        [request.id]: savedStatus,
      }));

      setMessage(`Request #${request.id} updated to ${savedStatus}.`);
    } catch (err) {
      setError(err.message || "Could not update the request status.");
    } finally {
      setSavingIds((previous) =>
        previous.filter((id) => id !== request.id)
      );
    }
  }

  const categories = useMemo(
    () => [...new Set(requests.map((request) => request.category))],
    [requests]
  );

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((request) =>
        `${request.title} ${request.id} ${request.description || ""}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (status !== "All") {
      result = result.filter((request) => request.status === status);
    }

    if (category !== "All") {
      result = result.filter((request) => request.category === category);
    }

    result.sort((a, b) => {
      const first = new Date(a.submitted || 0).getTime();
      const second = new Date(b.submitted || 0).getTime();

      return sort === "Newest" ? second - first : first - second;
    });

    return result;
  }, [requests, search, status, category, sort]);

  const openCount = requests.filter(
    (request) =>
      ["Pending", "Open", "Assigned"].includes(request.status)
  ).length;

  const inProgressCount = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const resolvedCount = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  return (
    <div className="page">
      <BrandHeader title="STAFF DASHBOARD" />

      <Navbar role="staff" />

      <main className="dashboard-content staff-content">
        <SectionHeading title="My Assigned Requests" />

        <section className="staff-stats">
          <article className="staff-stat-card">
            <span>Total assigned</span>
            <strong>{requests.length}</strong>
          </article>

          <article className="staff-stat-card">
            <span>Open</span>
            <strong>{openCount}</strong>
          </article>

          <article className="staff-stat-card">
            <span>In progress</span>
            <strong>{inProgressCount}</strong>
          </article>

          <article className="staff-stat-card">
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </article>
        </section>

        <section className="staff-requests-panel">
          <div className="staff-panel-heading">
            <div>
              <h2>Request list</h2>
              <p>
                View assigned requests and update their progress.
              </p>
            </div>

            <button
              type="button"
              className="staff-refresh-button"
              onClick={() => loadRequests()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="staff-filters">
            <input
              className="search-input"
              type="search"
              placeholder="Search requests..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort requests"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="Newest">Newest first</option>
              <option value="Oldest">Oldest first</option>
            </select>
          </div>

          {message && (
            <p className="staff-success" role="status">
              {message}
            </p>
          )}

          {error && (
            <div className="staff-error" role="alert">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  loadRequests();
                }}
              >
                Try again
              </button>
            </div>
          )}

          {loading && (
            <p className="staff-message">
              Loading assigned requests...
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="table-scroll">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Current status</th>
                      <th>Update status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((request) => {
                      const isSaving = savingIds.includes(request.id);
                      const isClosed = ["Closed", "Rejected"].includes(
                        request.status
                      );

                      return (
                        <tr key={request.id} className="staff-clickable-row" tabIndex={0} onClick={(event) => {
                          if (event.target.closest("button, select, input, a, textarea")) {
                          return;
                          }

                          navigate(`/staff/requests/${request.id}`);
                          }}
                          onKeyDown={(event) => {
                          if (
                            (event.key === "Enter" || event.key === " ") &&
                            event.target === event.currentTarget
                            ) {
                            event.preventDefault();
                            navigate(`/staff/requests/${request.id}`);
                            }
                          }}
                          >
                          <td>#{request.id}</td>
                          <td>{request.title}</td>
                          <td>{request.category}</td>

                          <td>
                            <StatusBadge status={request.status} />
                          </td>

                          <td>
                            {isClosed ? (
                              <span className="staff-readonly-status">
                                {request.status}
                              </span>
                            ) : (
                              <div className="staff-status-controls">
                                <select
                                  className="staff-status-select"
                                  aria-label={`New status for request ${request.id}`}
                                  value={
                                    selectedStatuses[request.id] ??
                                    request.status
                                  }
                                  onChange={(event) => {
                                    setSelectedStatuses((previous) => ({
                                      ...previous,
                                      [request.id]: event.target.value,
                                    }));
                                    setMessage("");
                                    setError("");
                                  }}
                                  disabled={isSaving}
                                >
                                  <option value={request.status}>
                                    {request.status} (current)
                                  </option>

                                  {STAFF_STATUSES.filter(
                                    (item) => item !== request.status
                                  ).map((item) => (
                                    <option key={item} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  className="staff-save-status-button"
                                  onClick={() => handleStatusUpdate(request)}
                                  disabled={
                                    isSaving ||
                                    !STAFF_STATUSES.includes(
                                      selectedStatuses[request.id]
                                    ) ||
                                    selectedStatuses[request.id] ===
                                      request.status
                                  }
                                >
                                  {isSaving ? "Saving..." : "Save"}
                                </button>
                              </div>
                            )}
                          </td>

                          <td>
                            {request.submitted
                              ? new Date(
                                  request.submitted
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan="6" className="staff-empty">
                          No assigned requests match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <p className="staff-results-count">
                Showing {filteredRequests.length} of {requests.length} requests
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default StaffDashboard;
