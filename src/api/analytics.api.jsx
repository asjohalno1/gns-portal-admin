import axiosInstance from "./axiosInstance";

/**
 * Log an analytics event
 * @param {Object} eventData - Event data { eventType, category, action, metadata, clientId, sessionId, duration, status, errorMessage }
 */
export const logEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post("/analytics/event", eventData);
    return response.data;
  } catch (error) {
    console.error("Error logging analytics event:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get analytics events with filters
 * @param {Object} filters - Filter options { eventType, category, userId, clientId, startDate, endDate, status, page, limit }
 */
export const getAnalyticsEvents = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/admin/analytics/events", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics events:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get analytics dashboard data
 * @param {Object} filters - Filter options { startDate, endDate }
 */
export const getAnalyticsDashboard = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/admin/analytics/dashboard", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get analytics statistics
 * @param {Object} filters - Filter options { eventType, category, startDate, endDate, groupBy }
 */
export const getAnalyticsStats = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/admin/analytics/stats", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics stats:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get user-specific analytics
 * @param {String} userId - User ID
 * @param {Object} filters - Filter options { startDate, endDate }
 */
export const getUserAnalytics = async (userId, filters = {}) => {
  try {
    const response = await axiosInstance.get(`/admin/analytics/user/${userId}`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user analytics:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get tool-specific analytics
 * @param {Object} filters - Filter options { toolName, startDate, endDate, groupBy }
 */
export const getToolAnalytics = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/admin/analytics/tools", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tool analytics:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Export analytics data to CSV
 * @param {Object} filters - Filter options { eventType, category, userId, clientId, startDate, endDate, status }
 */
export const exportAnalytics = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/admin/analytics/export", {
      params: filters,
      responseType: "blob", // Important for file download
    });
    
    // Create blob and download
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    link.download = `analytics-export-${timestamp}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error("Error exporting analytics:", error.response?.data || error.message);
    throw error;
  }
};

