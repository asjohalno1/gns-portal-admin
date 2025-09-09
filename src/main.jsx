import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext";
import { CustomToaster } from "./CommonPages/customtoast/CustomToaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <CustomToaster>
      <App />
    </CustomToaster>
  </AuthProvider>
  // </React.StrictMode>
);
