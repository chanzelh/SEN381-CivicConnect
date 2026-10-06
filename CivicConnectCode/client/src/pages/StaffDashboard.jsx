import { useMemo, useState } from "react";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";
import StatusBadge from "../components/StatusBadge";

import requests from "../data/requests";

function StaffDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Status");
  const [category, setCategory] = useState("Category");
  const [assigned, setAssigned] = useState("Assigned To");
  const [sort, setSort] = useState("Newest");

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (search !== "") {
      const query = search.toLowerCase();

      result = result.filter((request) => {
        const title = request.title.toLowerCase();
        const id = String(request.id);

        return title.includes(query) || id.includes(query);
      });
    }

    if (status !== "Status") {
      result = result.filter((request) => {
        return request.status === status;
      });
    }

    if (category !== "Category") {
      result = result.filter((request) => {
        return request.category === category;
      });
    }

    if (assigned !== "Assigned To") {
      result = result.filter((request) => {
        return request.assigned === assigned;
      });
    }

    if (sort === "Newest") {
      result.reverse();
    }

    return result;
  }, [search, status, category, assigned, sort]);

  return (
    <div className="page">
      <BrandHeader title="STAFF DASHBOARD" />

      <Navbar role="staff" />

      <main className="dashboard-content staff-content">
        <SectionHeading title="Service Requests" />

        <div className="staff-filters">
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
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Category">Category</option>
            <option value="Maintenance">Maintenance</option>
            <option value="IT Support">IT Support</option>
            <option value="Security">Security</option>
            <option value="Equipment">Equipment</option>
          </select>

          <select
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          >
            <option value="Assigned To">Assigned To</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Staff A">Staff A</option>
            <option value="Staff B">Staff B</option>
            <option value="Staff C">Staff C</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>

        <p className="helper-text">
          Default view: unassigned and my open requests.
        </p>

        <div className="table-scroll">
          <table className="staff-table">
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
              {filteredRequests.slice(0, 5).map((request) => (
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
                      request.overdue ? "overdue-text" : ""
                    }
                  >
                    {request.overdue ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing 1-
            {Math.min(filteredRequests.length, 5)} of{" "}
            {filteredRequests.length}
          </span>

          <div>
            <button type="button" disabled>
              {"<"}
            </button>

            <button type="button" className="current">
              1
            </button>

            <button type="button">2</button>

            <button type="button">3</button>

            <button type="button">
              {">"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;