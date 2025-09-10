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

// services/category.js
export const addCategoryApi = async (data) => {
  try {
    const { data: res } = await axiosInstance.post("/category/add", data);
    return res; // { success, message, data: savedCategory }
  } catch (error) {
    console.error(
      "Add category error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addSubCategoryApi = async (data) => {
  try {
    const { data: res } = await axiosInstance.post("/subcategory/add", data);
    return res; // { success, message, data: savedSubCategory }
  } catch (error) {
    console.error(
      "Add subcategory error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// GET all categories with subcategories
export const getAllCategoriesApi = async () => {
  try {
    const { data } = await axiosInstance.get("/category/getAllcategory");
    return data;
  } catch (err) {
    console.error(
      "Failed to fetch categories:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// GET all subcategories by category ID

export const getSubCategoriesByCategoryIdApi = async (categoryId) => {
  try {
    const { data } = await axiosInstance.get(
      `/subcategory/getAllSubCategoryByCategory/${categoryId}`
    );
    return data;
  } catch (err) {
    console.error(
      "Failed to fetch subcategories:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const getAllDocuments = async (query) => {
  try {
    const response = await axiosInstance.get(
      "/admin/getAllRequestedDocuments",
      {
        params: query,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Document listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addTemplate = async (data) => {
  try {
    const response = await axiosInstance.post("/template/add", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllTemplates = async (query) => {
  try {
    const response = await axiosInstance.get("/template/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocByReqId = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/staff/getDocumentRequestById/${id}`
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveDocumentStatus = async (requestId, subCatId, data) => {
  try {
    const response = await axiosInstance.patch(
      `/staff/updateDocumentRequestStatus`,
      {
        requestId,
        subCatId,
        data,
      }
    );
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSubCategoryApi = async ({ id, name }) => {
  const res = await axiosInstance.patch(`/update-subcategories/${id}`, {
    name,
  });
  return res.data;
};

export const deleteSubCategoryApi = async (id) => {
  const res = await axiosInstance.delete(`/delete-subcategories/${id}`);
  return res.data;
};

export const getAlldocumnetLinkstatusApi = async (query) => {
  try {
    const response = await axiosInstance.get("/admin/getalldocuments", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching document link status:", error);
    throw error;
  }
};
