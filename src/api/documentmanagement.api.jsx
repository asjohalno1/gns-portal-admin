import axiosInstance from "./axiosInstance";

export const getAllDocumentsListingApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/admin/documents", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || "",
        status: params.status,
        sort: params.sort || "desc",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching document list:", error);
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

export const approvedRequestDocument = async (id) => {
  try {
    const response = await axiosInstance.patch(`/staff/approvedrequest/${id}`);
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveDocumentStatusApi = async (requestId, subCatId, data) => {
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
