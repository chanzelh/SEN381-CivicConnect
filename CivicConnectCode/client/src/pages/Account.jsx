
import { useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";

function Account() {
  const navigate = useNavigate();

  let user;

  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const fullName = user?.full_name || user?.fullName || "User";
  const email = user?.email || "Not available";
  const role = user?.role || "requester";

  const formattedRole =
    role === "management"
      ? "Management"
      : role === "staff"
        ? "Staff"
        : "Requester";

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  return (
    <div className="page">
      <BrandHeader title="MY ACCOUNT" />

      <Navbar role={role} />

      <main className="dashboard-content account-content">
        <SectionHeading title="Account Details" />

        <section className="account-card">
          <div className="account-avatar">
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div className="account-heading">
            <h2>{fullName}</h2>
            <p>Your CivicConnect profile</p>
          </div>

          <div className="account-details">
            <div className="account-detail">
              <span>Full name</span>
              <strong>{fullName}</strong>
            </div>

            <div className="account-detail">
              <span>Email address</span>
              <strong>{email}</strong>
            </div>

            <div className="account-detail">
              <span>Account role</span>
              <strong>{formattedRole}</strong>
            </div>
          </div>

          <div className="account-actions">
            <button
              type="button"
              className="account-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Account;
