
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

import RequesterDashboard from "./pages/RequesterDashboard";
import NewRequest from "./pages/NewRequest";
import RequestDetails from "./pages/RequestDetails";
import RequesterRequestDetails from "./pages/RequesterRequestDetails";
import StaffDashboard from "./pages/StaffDashboard";
import StaffRequestDetails from "./pages/StaffRequestDetails";
import ManagementDashboard from "./pages/ManagementDashboard";

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function RequireAuth({ allowedRoles, children }) {
  const token = sessionStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const destinations = {
      requester: "/requester",
      staff: "/staff",
      management: "/management",
    };

    return (
      <Navigate
        to={destinations[user.role] || "/login"}
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/account"
        element={
          <RequireAuth
            allowedRoles={["requester", "staff", "management"]}
          >
            <Account />
          </RequireAuth>
        }
      />

      <Route
        path="/requester"
        element={
          <RequireAuth allowedRoles={["requester"]}>
            <RequesterDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/requester/new"
        element={
          <RequireAuth allowedRoles={["requester"]}>
            <NewRequest />
          </RequireAuth>
        }
      />


      <Route
        path="/staff"
        element={
          <RequireAuth allowedRoles={["staff"]}>
            <StaffDashboard />
          </RequireAuth>
        }
      />
      <Route
  path="/staff/requests/:id"
  element={<StaffRequestDetails />}
  />

      <Route
        path="/management"
        element={
          <RequireAuth allowedRoles={["management"]}>
            <ManagementDashboard />
          </RequireAuth>
        }
      />
     
<Route
  path="/requester/requests/:id"
  element={
    <RequireAuth allowedRoles={["requester"]}>
      <RequesterRequestDetails />
    </RequireAuth>
  }
/>


      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
