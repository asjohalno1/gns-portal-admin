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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
           <Route path="clientmanagement" element={<ClientManagement />} />
           <Route path="addclient" element={<AddClient />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
