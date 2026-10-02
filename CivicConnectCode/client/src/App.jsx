import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequesterDashboard from "./pages/RequesterDashboard";

import StaffDashboard from "./pages/StaffDashboard";
import ManagementDashboard from "./pages/ManagementDashboard";

function App() {
  return (
    <Routes>

      /* Authentication */
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      /* Requester */
      <Route
        path="/requester"
        element={<RequesterDashboard />}
      />

      /* Staff */
      <Route
        path="/staff"
        element={<StaffDashboard />}
      />

      /* Management */
      <Route
        path="/management"
        element={<ManagementDashboard />}
      />

      /* Invalid URL */
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default App;