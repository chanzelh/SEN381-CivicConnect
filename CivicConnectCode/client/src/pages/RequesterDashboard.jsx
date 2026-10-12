import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString();
}

function RequesterDashboard() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All statuses");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/requests/mine",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session may have expired. Please log in again."
            );
          }

          throw new Error(
            data.message || "Failed to load your requests."
          );
        }

        if (active) {
          const requestList = Array.isArray(data)
            ? data
            : data.requests;

          setRequests(
            Array.isArray(requestList) ? requestList : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Could not connect to the server."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, [navigate]);

  const filteredRequests =
    filter === "All statuses"
      ? requests
      : requests.filter(
          (request) => request.status === filter
        );

  function openRequest(request) {
    const requestId = request.id ?? request.request_id;

    if (!requestId) {
      setError("This request does not have a valid request ID.");
      return;
    }

    navigate(`/requester/requests/${requestId}`);
  }

  return (
    <div className="page requester-page">
      <BrandHeader title="REQUESTER DASHBOARD" />

       <div className="requester-navbar-full">
        <Navbar role="requester" />
       </div>

      <main className="dashboard-content requester-content">
        <SectionHeading
          title="My Requests"
          action={
            <button
              type="button"
              className="primary-button heading-action"
              onClick={() => navigate("/requester/new")}
            >
              + New Request
            </button>
          }
        />

        <div className="filter-single">
          <label htmlFor="status-filter">Filter:</label>

          <select
            id="status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Resolved</option>
            <option>Overdue</option>
            <option>Closed</option>
          </select>
        </div>

        <SectionHeading title="Service Request Overview" />

        {loading && (
          <p className="helper-text">Loading your requests...</p>
        )}

        {!loading && error && (
          <div className="request-message request-error">
            <p>{error}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="table-scroll">
              <table className="requester-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Updated</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => {
                    const requestId =
                      request.id ?? request.request_id;

                    return (
                      <tr
                        key={requestId}
                        onClick={() => openRequest(request)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            openRequest(request);
                          }
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label={`View request ${request.title}`}
                        className="clickable-row"
                      >
                        <td>#{requestId}</td>
                        <td>{request.title}</td>
                        <td>{request.category}</td>
                        <td>
                          <StatusBadge status={request.status} />
                        </td>
                        <td>{formatDate(request.submitted)}</td>
                        <td>{formatDate(request.updated)}</td>
                      </tr>
                    );
                  })}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        {requests.length === 0
                          ? "You haven't submitted any requests yet."
                          : "No requests match this status."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="helper-text">
              Showing {filteredRequests.length} of{" "}
              {requests.length} requests. Click a row to view its details.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default RequesterDashboard;
