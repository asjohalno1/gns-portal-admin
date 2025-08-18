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
