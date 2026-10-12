import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  const dashboardLinks = {
    requester: {
      path: "/requester",
      label: "My Requests",
    },
    staff: {
      path: "/staff",
      label: "Staff Dashboard",
    },
    management: {
      path: "/management",
      label: "Management Dashboard",
    },
  };

  const dashboard = dashboardLinks[role];

  function isActive(path) {
    if (path === "/requester") {
      return (
        location.pathname === "/requester" ||
        location.pathname === "/requester/"
      );
    }

    return location.pathname === path;
  }

  function getLinkClass(path) {
    return isActive(path)
      ? "nav-button active"
      : "nav-button";
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {dashboard && (
          <Link
            to={dashboard.path}
            className={getLinkClass(dashboard.path)}
          >
            {dashboard.label}
          </Link>
        )}

        {role === "requester" && (
          <Link
            to="/requester/new"
            className={getLinkClass("/requester/new")}
          >
            New Request
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <Link
          to="/account"
          className={getLinkClass("/account")}
        >
          My Account
        </Link>

        <button
          type="button"
          className="nav-button logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
