import axiosInstance from "./axiosInstance";

export const getProfileApi = async () => {
  try {
    const response = await axiosInstance.get("/admin/profile");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching profile details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateProfileApi = async (data) => {
  try {
    const response = await axiosInstance.patch("/admin/updateprofile", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDriveMappingApi = async () => {
  try {
    const response = await axiosInstance.get("admin/getAllGoogleDocs");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching drive mapping details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAssociatedClientsApi = async (staffId) => {
  try {
    let response = await axiosInstance.get(
      `/admin/getAssociatedClient/${staffId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching drive mapping details:",
      error.response?.data || error.message
    );
  }
};

export const createDriveMappingApi = async (data) => {
  try {
    const response = await axiosInstance.post("/admin/addGoogleMapping", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating drive mapping:",
      error.response?.data || error.message
    );
    throw error;
  }
};
