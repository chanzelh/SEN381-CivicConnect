import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";
import requests from "../data/requests";

function RequesterDashboard() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All statuses");

  const myRequests = requests.slice(0, 4);

  const filteredRequests =
    filter === "All statuses"
      ? myRequests
      : myRequests.filter((request) => request.status === filter);

  return (
    <div className="page requester-page">
      <BrandHeader title="REQUESTER DASHBOARD" />

      <Navbar role="requester" />

      <main className="dashboard-content requester-content">

        <SectionHeading
          title="My Requests"
          action={
            <button
              className="primary-button heading-action"
              onClick={() => navigate("/requester/new")}
            >
              + New Request
            </button>
          }
        />

        <div className="filter-single">
          <label htmlFor="status-filter">
            Filter:
          </label>

          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <SectionHeading title="Service Request Overview" />

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
                    navigate(`/requester/requests/${request.id}`)
                  }
                  className="clickable-row"
                >
                  <td>#{request.id}</td>
                  <td>{request.title}</td>
                  <td>{request.category}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>{request.submitted}</td>
                  <td>{request.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default RequesterDashboard;