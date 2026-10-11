import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function RequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequest() {
      setLoading(true);
      setError("");
      setRequest(null);

      try {
        const response = await fetch(
          `http://localhost:5000/api/requests/mine/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load request details."
          );
        }

        if (active) {
          setRequest(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Unable to connect to the server."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page requester-page">
      <BrandHeader title="REQUEST DETAILS" />

      <Navbar role="requester" />

      <main className="dashboard-content requester-content">
        <button
          type="button"
          className="secondary-button back-button"
          onClick={() => navigate("/requester")}
        >
          ← Back to My Requests
        </button>

        <SectionHeading title="Service Request Details" />

        {loading && (
          <p className="helper-text">
            Loading request details...
          </p>
        )}

        {!loading && error && (
          <div className="request-message request-error">
            <p>{error}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/requester")}
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {!loading && !error && request && (
          <section className="request-details-card">
            <div className="request-details-header">
              <div>
                <p className="request-reference">
                  Reference #{request.id}
                </p>

                <h2>{request.title}</h2>
              </div>

              <StatusBadge status={request.status} />
            </div>

            <div className="request-details-grid">
              <div className="request-detail-item">
                <span>Category</span>
                <strong>{request.category}</strong>
              </div>

              <div className="request-detail-item">
                <span>Current Status</span>
                <strong>{request.status}</strong>
              </div>

              <div className="request-detail-item">
                <span>Date Submitted</span>
                <strong>{formatDate(request.submitted)}</strong>
              </div>

              <div className="request-detail-item">
                <span>Last Updated</span>
                <strong>{formatDate(request.updated)}</strong>
              </div>
            </div>

            <div className="request-description">
              <h3>Description</h3>

              <p>
                {request.description || "No description provided."}
              </p>
            </div>

            <div className="request-details-footer">
              <p>
                You can refer to request #{request.id} when
                contacting the CivicConnect support team.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/requester")}
              >
                Back to My Requests
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default RequestDetails;
