
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
        const response = await fetch(
          "http://localhost:5000/api/requests/mine"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load requests."
          );
        }

        if (active) {
          setRequests(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not connect to the server."
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
  }, []);

  const filteredRequests =
    filter === "All statuses"
      ? requests
      : requests.filter(
          (request) => request.status === filter
        );

  return (
    <div className="page requester-page">
      <BrandHeader title="REQUESTER DASHBOARD" />

      <Navbar role="requester" />

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
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Overdue</option>
          </select>
        </div>

        <SectionHeading title="Service Request Overview" />

        {loading && (
          <p className="helper-text">
            Loading your requests...
          </p>
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
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() =>
                        navigate(
                          `/requester/requests/${request.id}`
                        )
                      }
                      className="clickable-row"
                    >
                      <td>#{request.id}</td>
                      <td>{request.title}</td>
                      <td>{request.category}</td>
                      <td>
                        <StatusBadge
                          status={request.status}
                        />
                      </td>
                      <td>
                        {formatDate(request.submitted)}
                      </td>
                      <td>
                        {formatDate(request.updated)}
                      </td>
                    </tr>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan="6">
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
              {requests.length} requests
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default RequesterDashboard;
