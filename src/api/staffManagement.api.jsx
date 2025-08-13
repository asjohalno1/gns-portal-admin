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

export const getAllStaffListingApi = async () => {
  try {
    const response = await axiosInstance.get("/staff/getAllStaff");
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
