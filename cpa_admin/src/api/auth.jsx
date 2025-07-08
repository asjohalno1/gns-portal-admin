
import axiosInstance from "./axiosInstance";
export const userLogin = async (data) => {
    try {
        const response = await axiosInstance.post(
            "/admin/signin",
            data,
        );
        return response.data;
    } catch (error) {
        console.error(
            "Upload error details:",
            error.response?.data || error.message
        );
        throw error;
    }
};