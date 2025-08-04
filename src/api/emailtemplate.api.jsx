import axiosInstance from "./axiosInstance";

export const getAllEmailApi = async () => {
  try {
    const response = await axiosInstance.get("/client/getAllEmailTemplate");
    return response.data;
  } catch (error) {
    console.error(
      "Email template listing fetch error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addEmailTemplateApi = async (data) => {
  try {
    const response = await axiosInstance.post("/client/addEmailTemplate", data);
    return response.data;
  } catch (error) {
    console.error(
      "Add email template error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
