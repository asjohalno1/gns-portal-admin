import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "../Layout/layout";
import Dashboard from "../pages/dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Layout Route */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
