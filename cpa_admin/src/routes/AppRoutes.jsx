// src/routes/AppRoutes.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {Layout} from "../Layout/layout"; // Make sure the path is correct
import Home from "../pages/Home";
import Dashboard from "../pages/dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Dashboard route with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
