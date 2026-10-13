
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

const API_URL = "http://localhost:5000/api/requests";

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
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString();
}

function DetailField({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong>{" "}
      {value !== null && value !== undefined && value !== ""
        ? value
        : "Not provided"}
    </p>
  );
}

function StaffRequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDetails() {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const requestResponse = await fetch(
        `${API_URL}/assigned/${id}`,
        { headers }
      );

      const requestData = await requestResponse
        .json()
        .catch(() => ({}));

      if (!requestResponse.ok) {
        throw new Error(
          requestData.message ||
            `Failed to load request. HTTP ${requestResponse.status}`
        );
      }

      const requestObject =
        requestData.request ??
        requestData.data?.request ??
        requestData.data ??
        requestData;

      const commentsResponse = await fetch(
        `${API_URL}/${id}/comments`,
        { headers }
      );

      const commentsData = await commentsResponse
        .json()
        .catch(() => ({}));

      if (!commentsResponse.ok) {
        throw new Error(
          commentsData.message ||
            `Failed to load comments. HTTP ${commentsResponse.status}`
        );
      }

      const commentsList = Array.isArray(commentsData)
        ? commentsData
        : commentsData.comments ??
          commentsData.data?.comments ??
          commentsData.data ??
          [];

      setRequest(requestObject);
      setComments(
        Array.isArray(commentsList) ? commentsList : []
      );
    } catch (err) {
      console.error("Error loading staff request:", err);
      setError(
        err.message || "Could not load request details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  async function handleAddComment(event) {
    event.preventDefault();

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setError("Please enter a comment.");
      return;
    }

    if (trimmedComment.length > 2000) {
      setError(
        "Your comment must be 2000 characters or fewer."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}/${id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentText: trimmedComment,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not add your comment."
        );
      }

      setCommentText("");
      setMessage("Your comment was added successfully.");

      await loadDetails();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(
        err.message || "Could not add your comment."
      );
    } finally {
      setSaving(false);
    }
  }

  const requestTitle = getField(
    request,
    "title",
    "request_title",
    "requestTitle",
    "subject"
  );

  const requestStatus = getField(
    request,
    "status",
    "request_status",
    "requestStatus"
  );

  const requesterName = getField(
    request,
    "requesterName",
    "requester_name",
    "fullName",
    "full_name"
  );

  const requesterEmail = getField(
    request,
    "requesterEmail",
    "requester_email"
  );

  const category = getField(
    request,
    "category",
    "category_name",
    "categoryName"
  );

  const submitted = getField(
    request,
    "submitted",
    "submitted_at",
    "submittedAt",
    "created_at",
    "createdAt"
  );

  const dueDate = getField(
    request,
    "dueDate",
    "due_date"
  );

  const description = getField(
    request,
    "description",
    "request_description",
    "requestDescription",
    "details"
  );

  const dateStarted = getField(
    request,
    "dateStarted",
    "date_started"
  );

  return (
    <div className="page">
      <BrandHeader title="STAFF DASHBOARD" />
      <Navbar role="staff" />

      <main className="dashboard-content staff-content">
        <Link to="/staff" className="staff-back-link">
          &larr; Back to My Assigned Requests
        </Link>

        {loading && (
          <p className="staff-message">
            Loading request details...
          </p>
        )}

        {error && (
          <div className="staff-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadDetails}>
              Try again
            </button>
          </div>
        )}

        {message && (
          <p className="staff-success" role="status">
            {message}
          </p>
        )}

        {!loading && request && (
          <section className="staff-detail-card">
            <div className="staff-detail-heading">
              <div>
                <p className="staff-detail-reference">
                  REQUEST #
                  {getField(request, "id", "request_id") ?? id}
                </p>

                <h1>{requestTitle || `Request #${id}`}</h1>
              </div>

              <StatusBadge
                status={requestStatus || "Pending"}
              />
            </div>

            <h2>Request Information</h2>

            <div className="staff-detail-information">
              <DetailField
                label="Category"
                value={category}
              />

              <DetailField
                label="Requester"
                value={requesterName}
              />

              <DetailField
                label="Requester email"
                value={requesterEmail}
              />

              <DetailField
                label="Submitted"
                value={formatDate(submitted) || null}
              />

              <DetailField
                label="Last updated"
                value={
                  formatDate(
                    getField(request, "updated", "updated_at")
                  ) || null
                }
              />

              <DetailField
                label="Due date"
                value={formatDate(dueDate) || null}
              />

              <DetailField
                label="Assigned staff ID"
                value={getField(
                  request,
                  "assignedStaffId",
                  "assigned_staff_id"
                )}
              />
            </div>

            <div className="staff-detail-description">
              <h2>Request Description</h2>
              <p>
                {description || "No description provided."}
              </p>
            </div>

            <section className="staff-detail-description">
              <h2>Technical Details</h2>

              <div className="staff-detail-information">
                <DetailField
                  label="Issue type"
                  value={getField(
                    request,
                    "issueType",
                    "issue_type"
                  )}
                />

                <DetailField
                  label="Device type"
                  value={getField(
                    request,
                    "deviceType",
                    "device_type"
                  )}
                />

                <DetailField
                  label="Device name"
                  value={getField(
                    request,
                    "deviceName",
                    "device_name"
                  )}
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
                  value={getField(
                    request,
                    "softwareName",
                    "software_name"
                  )}
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
                  value={formatDate(dateStarted) || null}
                />

                <DetailField
                  label="Impact"
                  value={getField(request, "impact")}
                />

                <DetailField
                  label="Urgency"
                  value={getField(request, "urgency")}
                />
              </div>

              <h3>Error Message</h3>
              <p>
                {getField(
                  request,
                  "errorMessage",
                  "error_message"
                ) || "No error message provided."}
              </p>

              <h3>Troubleshooting Already Attempted</h3>
              <p>
                {getField(request, "troubleshooting") ||
                  "No troubleshooting information provided."}
              </p>
            </section>

            <section className="staff-comments-section">
              <h2>Comments and Updates</h2>

              <p className="staff-comments-intro">
                View previous comments and record progress
                on this request.
              </p>

              {comments.length === 0 ? (
                <p className="staff-empty-comments">
                  No comments yet. Add the first update below.
                </p>
              ) : (
                <div className="staff-comment-list">
                  {comments.map((comment, index) => {
                    const author = getField(
                      comment,
                      "fullName",
                      "full_name",
                      "staffName",
                      "staff_name",
                      "authorName",
                      "author_name",
                      "senderName",
                      "sender_name"
                    );

                    const role = String(
                      getField(
                        comment,
                        "userRole",
                        "user_role",
                        "authorRole",
                        "author_role",
                        "role"
                      ) ?? ""
                    ).toLowerCase();

                    const commentId =
                      getField(comment, "id", "comment_id") ??
                      `${getField(
                        comment,
                        "createdAt",
                        "created_at"
                      )}-${index}`;

                    const commentBody = getField(
                      comment,
                      "commentText",
                      "comment_text",
                      "message",
                      "content"
                    );

                    const createdAt = getField(
                      comment,
                      "createdAt",
                      "created_at",
                      "timestamp"
                    );

                    return (
                      <article
                        className="staff-comment"
                        key={commentId}
                      >
                        <div className="staff-comment-heading">
                          <strong>
                            {author || "Unknown user"}
                            {role === "staff" ? " (Staff)" : ""}
                          </strong>

                          <time>
                            {formatDate(createdAt)}
                          </time>
                        </div>

                        <p>{commentBody ?? ""}</p>
                      </article>
                    );
                  })}
                </div>
              )}

              <form
                className="staff-comment-form"
                onSubmit={handleAddComment}
              >
                <label htmlFor="staff-comment-text">
                  Add a comment
                </label>

                <textarea
                  id="staff-comment-text"
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  placeholder="Write a progress update or comment..."
                  rows={4}
                  maxLength={2000}
                  required
                  disabled={saving}
                />

                <div className="staff-comment-form-footer">
                  <span>
                    {commentText.length}/2000 characters
                  </span>

                  <button
                    type="submit"
                    className="staff-comment-submit"
                    disabled={saving || !commentText.trim()}
                  >
                    {saving ? "Posting..." : "Add Comment"}
                  </button>
                </div>
              </form>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default StaffRequestDetails;
