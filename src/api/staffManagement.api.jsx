import axiosInstance from "./axiosInstance";

export const AddStaff = async (formData) => {
  try {
    const response = await axiosInstance.post("/admin/addStaff", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw error;
  }
};

export const getRecentactivitirsApi = async (
  page = 1,
  limit = 10,
  search = "",
  status = "all"
) => {
  try {
    const response = await axiosInstance.get(`/admin/recentActivities`, {
      params: { page, limit, search, status },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};

export const getAllStaffListingApi = async (
  page = 1,
  limit = 10,
  search = "",
  status = "all"
) => {
  try {
    const response = await axiosInstance.get("/admin/getAllStaffList", {
      params: { page, limit, search, status },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Dashboard data fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDocumentheadersummaryApi = async () => {
  try {
    const response = await axiosInstance.get("/admin/getDocumentHeaderSummary");
    return response.data;
  } catch (error) {
    console.error("Error fetching document header summary:", error);
    throw error;
  }
};

export const deleteStaffApi = async (staffId) => {
  try {
    const response = await axiosInstance.patch(`/admin/deleteStaff/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

export const updateStaffApi = async (staffId, formData) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/updateStaff/${staffId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const getAllUnassignedClientsApi = async (query) => {
  try {
    const response = await axiosInstance.get("/admin/getunassignedClients", {
      params: {
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: query.status,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching unassigned clients:", error);
    throw error;
  }
};

// staffPerformance.api.js
export const getStaffPerformanceMetricsApi = async (query = {}) => {
  try {
    const response = await axiosInstance.get("/staff/performance-metrics", {
      params: {
        page: query.page || 1,
        limit: query.limit || 10,
        search: query.search || "",
        status: query.status || "all",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    throw error;
  }
};

export const mapClientApi = async (clientId) => {
  try {
    const response = await axiosInstance.post(`admin/client-mapping`, {
      clientId,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error("Unexpected API error:", error);
    return { success: false, message: "Unexpected error occurred" };
  }
};

