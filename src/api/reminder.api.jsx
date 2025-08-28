import axiosInstance from "./axiosInstance";

export const sendClientReminder = async (data) => {
  try {
    const response = await axiosInstance.post("/staff/sendReminder", data);
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addReminderDefault = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/staff/defaultSettingReminder",
      data
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllRemaindersCount = async () => {
  try {
    const response = await axiosInstance.get(`/staff/getAllReminder`);
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllRemainders = async ({ page, limit }) => {
  try {
    const response = await axiosInstance.get(`/admin/getAllScheduledReminder`, {
      params: { page, limit },
    });
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getActiveClients = async (search = "") => {
  try {
    const response = await axiosInstance.get("/admin/getAllClientsAdmin", {
      params: { search },
    });

    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllTitleDocument = async () => {
  try {
    const response = await axiosInstance.get("/admin/document/title");
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllRemainderTemplates = async () => {
  try {
    const response = await axiosInstance.get("/admin/getAllReminderTemplates");
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/staff/getReminderTemplate/${id}`
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addRemainderTemplates = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/staff/addReminderTemplate",
      data
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateReminderTemplate = async (data) => {
  try {
    const response = await axiosInstance.put(
      `/staff/updateReminderTemplate/${data?.id}`,
      data
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// send reminder now using params
// route /api/admin/send-reminder-mail

export const sendReminderNow = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/admin/send-reminder-mail/${id}`
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
