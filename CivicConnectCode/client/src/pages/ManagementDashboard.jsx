import { useMemo, useState } from "react";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";

import requests from "../data/requests";

function ManagementDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Status");
  const [category, setCategory] = useState("Category");

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (search !== "") {
      const query = search.toLowerCase();

      result = result.filter((request) => {
        return (
          request.title.toLowerCase().includes(query) ||
          String(request.id).includes(query)
        );
      });
    }

    if (status !== "Status") {
      result = result.filter(
        (request) => request.status === status
      );
    }

    if (category !== "Category") {
      result = result.filter(
        (request) => request.category === category
      );
    }

    return result;
  }, [search, status, category]);

  return (
    <div className="page">
      <BrandHeader title="MANAGEMENT DASHBOARD" />

      <Navbar role="management" />

      <main className="dashboard-content management-content">
        <SectionHeading title="Overview" />

        {/* Statistics */}
        <div className="management-stats">
          <div className="stat-card">
            <span className="stat-number">
              {requests.length}
            </span>
            <span className="stat-label">
              Total Requests
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {
                requests.filter(
                  (request) => request.status === "Open"
                ).length
              }
            </span>
            <span className="stat-label">
              Open
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {
                requests.filter(
                  (request) =>
                    request.status === "In Progress"
                ).length
              }
            </span>
            <span className="stat-label">
              In Progress
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {
                requests.filter(
                  (request) =>
                    request.status === "Resolved"
                ).length
              }
            </span>
            <span className="stat-label">
              Resolved
            </span>
          </div>
        </div>

        <SectionHeading title="Service Requests" />

        {/* Filters */}
        <div className="staff-filters management-filters">
          <input
            className="search-input"
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Status">Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Category">Category</option>
            <option value="Maintenance">
              Maintenance
            </option>
            <option value="IT Support">
              IT Support
            </option>
            <option value="Security">Security</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-scroll">
          <table className="staff-table management-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Due</th>
                <th>Overdue</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.slice(0, 10).map((request) => (
                <tr key={request.id}>
                  <td>#{request.id}</td>

                  <td>{request.title}</td>

                  <td>{request.category}</td>

                  <td>
                    <StatusBadge status={request.status} />
                  </td>

                  <td>{request.assigned}</td>

                  <td>{request.due}</td>

                  <td
                    className={
                      request.overdue
                        ? "overdue-text"
                        : ""
                    }
                  >
                    {request.overdue ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ManagementDashboard;