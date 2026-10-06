import { Link, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {role === "requester" && (
          <>
            <Link to="/requester" className="nav-button">
              My Requests
            </Link>

            <Link to="/requester/new" className="nav-button">
              New Request
            </Link>
          </>
        )}

        {role === "staff" && (
          <>
            <Link to="/staff" className="nav-button">
              Staff Dashboard
            </Link>
          </>
        )}

        {role === "management" && (
          <>
            <Link to="/management" className="nav-button">
              Management Dashboard
            </Link>
          </>
        )}
      </div>

      <div className="navbar-right">
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