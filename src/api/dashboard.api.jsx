import axiosInstance from "./axiosInstance";

export const dashboarData = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/admin/dashboard", {
      params: params,
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

//get all client listing

export const getAllClients = async (query) => {
  try {
    const response = await axiosInstance.get("/client/getAllClient", {
      params: query,
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

// add client

export const addClient = async (data) => {
  try {
    const response = await axiosInstance.post("/client/add", data);
    return response.data;
  } catch (error) {
    console.error(
      "Dashboard data fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//get all staff

export const getAllStaff = async () => {
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
