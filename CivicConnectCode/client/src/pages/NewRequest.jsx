
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";

function NewRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !category || !description.trim()) {
      setError("Please complete all fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            category,
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not submit your request."
        );
      }

      navigate("/requester", {
        state: {
          successMessage:
            "Your service request was submitted successfully.",
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page requester-page">
      <BrandHeader title="NEW SERVICE REQUEST" />

      <Navbar role="requester" />

      <main className="dashboard-content requester-content">
        <SectionHeading title="Submit a Service Request" />

        <form
          className="request-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="request-title">
              Request Title
            </label>

            <input
              id="request-title"
              type="text"
              maxLength={150}
              placeholder="Briefly describe your issue"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="request-category">
              Category
            </label>

            <select
              id="request-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
            >
              <option value="">Select a category</option>
              <option value="Maintenance">Maintenance</option>
              <option value="IT Support">IT Support</option>
              <option value="Security">Security</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="request-description">
              Description
            </label>

            <textarea
              id="request-description"
              rows={6}
              maxLength={5000}
              placeholder="Explain the problem and include any useful details..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/requester")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Request"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default NewRequest;
