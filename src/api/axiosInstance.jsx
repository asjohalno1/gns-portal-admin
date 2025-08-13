import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[Axios] Authorization header set");
    }
    
    return config;
  },
  (error) => {
    console.error("[Axios] Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized
    if (error?.response?.status === 401) {
      console.warn("[Axios] 401 Unauthorized detected - Initiating logout");
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("[Axios] Network Error:", error.message);
      if (error.message === "Network Error") {
        console.error("[Axios] Possible CORS issue or server down");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;