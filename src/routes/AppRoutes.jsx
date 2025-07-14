// src/AppRoutes.js

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "../Layout/layout";
import Dashboard from "../pages/dashboard";
import ClientManagement from "../pages/clientmanagement";
import AddClient from "../pages/addClientmodal";
import Login from "../Component/Login/login";
import PrivateRoute from "./ProtectedRoute";
import { useAuth } from "../Context/AuthContext"; // ✅ Import useAuth

const AppRoutes = () => {
  const { authToken } = useAuth(); // ✅ Get token from context

  return (
    <Router>
      <Routes>
        {/* Login route now redirects to /admin if logged in */}
        <Route
          path="/"
          element={
            authToken ? <Navigate to="/admin" replace /> : <Login />
          }
        />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientmanagement" element={<ClientManagement />} />
            <Route path="addclient" element={<AddClient />} />
          </Route>
        </Route>

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
