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

export const getAllClientsAdmin = async () => {
  try {
    const response = await axiosInstance.get("/admin/getAllClientsAdmin");
    return response.data;
  } catch (error) {
    console.error(
      "Client listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const DocumentRequest = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/documentRequest", data);
    return response.data;
  } catch (error) {
    console.error(
      "Document request error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/category/getAllcategory");
    return response.data;
  } catch (error) {
    console.error(
      "Category listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllAssociatedSubCategories = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/getAssociatedSubCategory/?id=${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Sub-category listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createDocumentRequest = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/documentRequest", data);
    return response.data;
  } catch (error) {
    console.error(
      "Create document request error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
