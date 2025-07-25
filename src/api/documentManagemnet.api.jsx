import axiosInstance from "./axiosInstance";

export const getAllDocumentsListing = async (query) => {
  try {
    const response = await axiosInstance.get("/admin/documentmanagement", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Document listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
