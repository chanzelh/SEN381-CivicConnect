
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

const API_URL = "http://localhost:5000/api/requests";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
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

function RequesterRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDetails() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // 1. Load the actual request details.
      const requestResponse = await fetch(
        `${API_URL}/mine/${id}`,
        { headers }
      );

      const requestData = await requestResponse.json().catch(() => ({}));

      if (!requestResponse.ok) {
        throw new Error(
          requestData.message || "Could not load this request."
        );
      }

      const requestObject =
        requestData.request ??
        requestData.data?.request ??
        requestData.data ??
        requestData;

      console.log("FULL REQUEST API RESPONSE:", requestData);
      console.log("REQUEST OBJECT:", requestObject);

      setRequest(requestObject);

      // 2. Load the conversation separately.
      const commentsResponse = await fetch(
        `${API_URL}/mine/${id}/comments`,
        { headers }
      );

      const commentsData = await commentsResponse.json().catch(() => ({}));

      if (!commentsResponse.ok) {
        throw new Error(
          commentsData.message || "Could not load the conversation."
        );
      }

      console.log("COMMENTS API RESPONSE:", commentsData);

      const commentsList = Array.isArray(commentsData)
        ? commentsData
        : commentsData.comments ??
          commentsData.data?.comments ??
          commentsData.data ??
          [];

      setComments(Array.isArray(commentsList) ? commentsList : []);
    } catch (err) {
      console.error("Could not load requester request details:", err);
      setError(err.message || "Could not load request details.");
    } finally {
      setLoading(false);
    }
  }

     /* eslint-disable react-hooks/set-state-in-effect -- loads data on mount; refactor deferred (TD-003) */
  useEffect(() => {
    loadDetails();
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleReply(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setError("Please type a reply before sending.");
      return;
    }

    if (trimmedComment.length > 2000) {
      setError("Your reply must be 2000 characters or fewer.");
      return;
    }

    setSending(true);

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/mine/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentText: trimmedComment,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not send your reply.");
      }

      setCommentText("");
      setMessage("Your reply has been sent.");

      await loadDetails();
    } catch (err) {
      console.error("Could not send requester reply:", err);
      setError(err.message || "Could not send your reply.");
    } finally {
      setSending(false);
    }
  }

  const reference = getField(
    request,
    "reference_number",
    "request_reference",
    "request_number",
    "request_id",
    "requestId",
    "id"
  );

  const title = getField(
    request,
    "title",
    "request_title",
    "requestTitle",
    "subject"
  );

  const status = getField(
    request,
    "status",
    "request_status",
    "requestStatus"
  );

  const category = getField(
    request,
    "category",
    "category_name",
    "categoryName",
    "categoryNameText"
  );

  const submittedDate = getField(
    request,
    "submitted",
    "submitted_at",
    "submittedAt",
    "created_at",
    "createdAt",
    "date_submitted",
    "dateSubmitted"
  );

  const updatedDate = getField(
    request,
    "updated",
    "updated_at",
    "updatedAt",
    "last_updated",
    "lastUpdated"
  );

  const description = getField(
    request,
    "description",
    "request_description",
    "requestDescription",
    "details"
  );

  const requesterId = getField(
    request,
    "requesterId",
    "requester_id",
    "user_id",
    "userId"
  );

  return (
    <div className="page requester-page">
      <BrandHeader title="REQUEST DETAILS" />

      <div className="requester-navbar-full">
        <Navbar role="requester" />
      </div>

      <main className="dashboard-content requester-content">
        <Link to="/requester" className="back-link">
          ← Back to My Requests
        </Link>

        {loading && (
          <p className="helper-text">
            Loading request and conversation...
          </p>
        )}

        {!loading && error && !request && (
          <div className="request-message request-error">
            <p>{error}</p>
            <button
              type="button"
              className="primary-button"
              onClick={loadDetails}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && request && (
          <>
            <section className="request-detail-card">
              <div className="request-detail-heading">
                <div>
                  <p className="helper-text">
                    Request reference #{reference ?? id ?? "—"}
                  </p>

                  <h2>{title || `Request #${reference ?? id}`}</h2>
                </div>

                <StatusBadge status={status || "Pending"} />
              </div>

              <div className="request-detail-grid">
                <div>
                  <span>Category</span>
                  <strong>{category ?? "—"}</strong>
                </div>

                <div>
                  <span>Date submitted</span>
                  <strong>{formatDate(submittedDate)}</strong>
                </div>

                <div>
                  <span>Last updated</span>
                  <strong>{formatDate(updatedDate)}</strong>
                </div>

              </div>

              <div className="request-description">
                <h3>Description</h3>
                <p>{description || "No description provided."}</p>
              </div>
            </section>

            <section className="conversation-card">
              <div className="conversation-heading">
                <div>
                  <h2>Request Conversation</h2>
                  <p>
                    Read staff updates and reply if you have questions.
                  </p>
                </div>

                <span className="comment-count">
                  {comments.length}{" "}
                  {comments.length === 1 ? "message" : "messages"}
                </span>
              </div>

              {error && (
                <div className="request-message request-error">
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div className="request-message request-success">
                  <p>{message}</p>
                </div>
              )}

              <div className="conversation-list">
                {comments.map((comment, index) => {
                  const commentId =
                    comment.id ??
                    comment.comment_id ??
                    `${comment.createdAt ?? comment.created_at}-${index}`;

                  const authorId = Number(
                    comment.userId ??
                    comment.user_id ??
                    comment.authorId ??
                    comment.author_id
                  );

                  const isRequester =
                    requesterId != null &&
                    authorId === Number(requesterId);

                  const author =
                    comment.fullName ??
                    comment.full_name ??
                    comment.staffName ??
                    comment.staff_name ??
                    comment.authorName ??
                    comment.author_name ??
                    (isRequester ? "You" : "Staff");
                
                 const userRole = String(comment.userRole ?? comment.user_role ?? comment.role ?? "").toLowerCase();

                  const text = getField(
                    comment,
                    "commentText",
                    "comment_text",
                    "message",
                    "content"
                  );

                  return (
                    <article
                      key={commentId}
                      className={`conversation-message ${
                        isRequester
                          ? "message-requester"
                          : "message-staff"
                      }`}
                    >
                      <div className="conversation-message-header">
                        <strong>{author}{!isRequester && userRole === "staff" && " (Staff)"}</strong>
                        <time>{formatDate(comment.createdAt ?? comment.created_at)}</time>
                      </div>

                      <p>{text ?? ""}</p>
                    </article>
                  );
                })}

                {comments.length === 0 && (
                  <div className="conversation-empty">
                    <p>No messages yet.</p>
                    <span>
                      You can send a message below if you need to add
                      information.
                    </span>
                  </div>
                )}
              </div>

              <form className="reply-form" onSubmit={handleReply}>
                <label htmlFor="commentText">Your reply</label>

                <textarea
                  id="commentText"
                  name="commentText"
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  placeholder="Type your message to the staff member..."
                  rows={4}
                  maxLength={2000}
                  required
                  disabled={sending}
                />

                <div className="reply-form-footer">
                  <span>{commentText.length}/2000 characters</span>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={sending || !commentText.trim()}
                  >
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default RequesterRequestDetails;
