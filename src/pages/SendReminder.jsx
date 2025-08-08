import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addReminderDefault,
  getAllRemaindersCount,
  sendClientReminder,
  getAllRemainders,
  getActiveClients,
  getAllTitleDocument,
  getAllRemainderTemplates,
  getTemplateById,
} from "../api/reminder.api";
import Table from "../Component/Table/table";
import RemainderModal from "../Component/Reminder/RemainderModal";
import EditReminderModal from "../Component/Reminder/EditReminderModal";
import QuillEditor from "../CommonPages/QuerillEditor/QuillEditor";
import getPlainText from "../adminutils/commonutils";

const SendReminder = () => {
  const [activeTab, setActiveTab] = useState("reminder");
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [frequency, setFrequency] = useState("Weekly");
  const [selectedDays, setSelectedDays] = useState(["Tue", "Wed"]);
  const [customDateTime, setCustomDateTime] = useState("10:00");
  const [customMessage, setCustomMessage] = useState(
    "Important: Your Tax Filing Deadline Is Approaching On [DATE]. Please Ensure All Required Documents Are Submitted. We're Here To Help - Contact Us At [PHONE] Or [EMAIL]."
  );
  const [templateData, setTemplateData] = useState("");
  const [clients, setClients] = useState([]);
  const [remainder, setDocumentRemainder] = useState([]);
  const [remainderCount, setDocumentRemainderCount] = useState([]);
  const [title, setTitle] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRemainderModal, setShowRemainderModal] = useState(false);
  const [showRemainderEditModal, setShowEditRemainderModal] = useState(false);
  const [notifyMethods, setNotifyMethods] = useState([]);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [isDefaultselect, setIsDefaultselect] = useState(false);
  const [sendAsDefaultReminder, setSendAsDefaultReminder] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const handleDayToggle = (day) => {
    if (frequency === "Daily") {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    } else {
      setSelectedDays((prev) => (prev.includes(day) ? [] : [day]));
    }
  };
  const handleNotifyMethodChange = (method) => {
    setNotifyMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleReminderScheduleChange = (schedule) => {
    setReminderSchedule((prev) => ({
      ...prev,
      [schedule]: !prev[schedule],
    }));
  };
  const handleSelectAll = () => {
    setSelectedClientIds(clients.map((client) => client.clientId));
  };

  const handleClearSelection = () => {
    setSelectedClientIds([]);
  };
  // In fetchClientData function
  const fetchClientData = async () => {
    try {
      const res = await getActiveClients({ search: searchQuery });
      if (res.success === true) {
        const validClients =
          res?.data?.filter((client) => client.clientId) || [];
        setClients(validClients);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDocumentTitle = async () => {
    try {
      const res = await getAllTitleDocument();
      if (res.success === true) {
        setTitle(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getTemplates = async () => {
    try {
      const res = await getAllRemainderTemplates();
      if (res.success === true) {
        setTemplates(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getRemainderTemplateById = async (id) => {
    try {
      const res = await getTemplateById(id);
      if (res.success === true) {
        setCustomMessage(res?.data?.message);
        setTemplateData(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAllRemainder = async () => {
    try {
      const res = await getAllRemainders({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (res.success === true) {
        const { pagination: pagData = {} } = res;
        setDocumentRemainder(res?.data);
        setPagination((prev) => ({
          ...prev,
          total: res.pagination.totalCount,
          totalPages: res.pagination.totalPages,
          page: res.pagination.currentPage,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getCountRemainder = async () => {
    try {
      const res = await getAllRemaindersCount();
      if (res.success === true) {
        setDocumentRemainderCount(res?.data);
        if (res?.data?.defaultRemainder) {
          setDefaultSettings(res.data.defaultRemainder);
          // Pre-fill the form fields with default values
          setCustomDateTime(res.data.defaultRemainder.scheduleTime);
          setFrequency(res.data.defaultRemainder.frequency);
          setSelectedDays(res.data.defaultRemainder.days);
          setNotifyMethods(res.data.defaultRemainder.notifyMethod);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addDefaultRemainder = async () => {
    if (notifyMethods.length === 0) {
      toast.error("Please select at least one notify method.");
      return;
    }

    try {
      const payloadDefault = {
        scheduleTime: customDateTime,
        frequency: frequency,
        days: selectedDays,
        notifyMethod: notifyMethods,
      };

      const res = await addReminderDefault(payloadDefault);
      if (res?.success === true) {
        toast.success("Default Reminder Settings Updated Successfully!");
        setDocumentRemainderCount(res?.data);
        setDefaultSettings(res.data);
      } else {
        toast.error(res?.message || "Failed to update default settings.");
      }
    } catch (error) {
      console.error("Default settings error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const SendReminder = async () => {
    if (!selectedDoc) {
      toast.error("Please select a Document Title.");
      return;
    }
    const validClientIds = selectedClientIds.filter((clientId) => clientId);

    if (validClientIds.length === 0) {
      toast.error("Please select at least one valid Client.");
      return;
    }

    try {
      const payload = {
        clientId: validClientIds,
        templateId: selectedTemplate,
        customMessage: customMessage,
        documentId: selectedDoc,
      };

      if (sendAsDefaultReminder && defaultSettings) {
        payload.scheduleTime = defaultSettings.scheduleTime;
        payload.frequency = defaultSettings.frequency;
        payload.days = defaultSettings.days;
        payload.notifyMethod = defaultSettings.notifyMethod;
        payload.isDefault = true;
      } else {
        // When using custom settings
        payload.scheduleTime = customDateTime;
        payload.frequency = frequency;
        payload.days = selectedDays;
        payload.notifyMethod = Object.keys(notifyMethods).filter(
          (method) => notifyMethods[method]
        );
      }

      const res = await sendClientReminder(payload);
      if (res?.success === true) {
        toast.success("Reminder Scheduled Successfully!");
        getAllRemainder();
        setActiveTab("history");
        setSelectedClientIds([]);
        setSelectedDoc("");
        setSelectedTemplate(null);
      } else {
        toast.error(res?.message || "Failed to create reminder.");
      }
    } catch (error) {
      console.error("Reminder error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const handleClientSelect = (id) => {
    if (!id) return;

    setSelectedClientIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((clientId) => clientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  useEffect(() => {
    getDocumentTitle(), getTemplates(), getAllRemainder();
    getCountRemainder();
  }, [showRemainderModal]);
  useEffect(() => {
    if (activeTab === "history") {
      getAllRemainder();
    }
  }, [pagination.page, pagination.limit, activeTab]);
  useEffect(() => {
    fetchClientData();
  }, [searchQuery]);

  useEffect(() => {
    getRemainderTemplateById(selectedTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    if (frequency === "Daily" && selectedDays.length === 0) {
      setSelectedDays([...days]);
    }
    if (frequency === "Weekly" && selectedDays.length > 1) {
      setSelectedDays([]);
    }
  }, [frequency]);

  useEffect(() => {
    if (activeTab === "schedule") {
      getCountRemainder();
    }
  }, [activeTab]);

  return (
    <>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      /> */}
      <div className="p-7.5 pt-[86px] w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <span className="text-[#2C3E50] font-medium text-[14px] ">
                  Clients Notified Today
                </span>
                <h4 className="text-[#2C3E50] font-semibold text-[28px]">
                  {remainderCount?.clientNotifiedToday}
                </h4>
              </div>
              <div className="bg-bgGreen ml-3 flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4763 13.5171C21.1614 13.5171 24.1567 10.5218 24.1567 6.83668C24.1567 3.15158 21.1614 0.15625 17.4763 0.15625C14.5991 0.15625 12.1518 1.98463 11.2116 4.53585C11.188 4.53113 11.1644 4.5264 11.1408 4.51696C11.3061 4.21931 11.4006 3.87442 11.4006 3.51064C11.4006 2.36259 10.4652 1.42714 9.31711 1.42714C8.16906 1.42714 7.23361 2.36259 7.23361 3.51064C7.23361 3.87442 7.3281 4.21931 7.49346 4.51696C4.62569 5.32012 2.51385 7.94694 2.51385 11.0651V15.166C2.51385 17.2022 1.73903 19.1393 0.340579 20.618C0.156324 20.8117 0.104355 21.0952 0.213018 21.3409C0.316957 21.5865 0.557906 21.7425 0.827202 21.7425H6.31706C6.62415 23.122 7.85252 24.1567 9.31711 24.1567C10.7864 24.1567 12.0148 23.122 12.3219 21.7425H17.8117C18.0763 21.7425 18.3173 21.5818 18.4259 21.3409C18.5299 21.0952 18.4826 20.8117 18.2984 20.618C16.8952 19.1393 16.1251 17.2069 16.1251 15.166V13.3754C16.555 13.4699 17.0086 13.5171 17.4763 13.5171ZM9.31711 2.76417C9.73287 2.76417 10.0683 3.09961 10.0683 3.51536C10.0683 3.93112 9.72814 4.26656 9.31711 4.26656C8.90136 4.26656 8.56592 3.93112 8.56592 3.51536C8.56592 3.09961 8.90136 2.76417 9.31711 2.76417ZM9.31239 22.8244C8.58482 22.8244 7.96591 22.3803 7.70134 21.7472H10.9282C10.6636 22.3755 10.04 22.8244 9.31239 22.8244ZM16.4086 20.4101H2.22093C3.27921 18.8794 3.85088 17.0605 3.85088 15.166V11.0651C3.85088 8.05087 6.30289 5.59886 9.31711 5.59886C9.85098 5.59886 10.3754 5.67446 10.8809 5.83036C10.8289 6.16108 10.7959 6.49652 10.7959 6.84141C10.7959 9.56744 12.44 11.9108 14.7833 12.9502V15.1707C14.7833 17.0605 15.355 18.8794 16.4086 20.4101ZM12.1282 6.83668C12.1282 3.8886 14.5282 1.48856 17.4763 1.48856C20.4244 1.48856 22.8244 3.8886 22.8244 6.83668C22.8244 9.78476 20.4244 12.1848 17.4763 12.1848C14.5282 12.1848 12.1282 9.78476 12.1282 6.83668Z"
                    fill="#20BF55"
                  />
                  <path
                    d="M19.6589 7.50276C20.0274 7.50276 20.3251 7.20512 20.3251 6.83661C20.3251 6.4681 20.0274 6.17045 19.6589 6.17045H18.1424V3.32631C18.1424 2.9578 17.8447 2.66016 17.4762 2.66016C17.1077 2.66016 16.8101 2.9578 16.8101 3.32631V6.83661C16.8101 7.20512 17.1077 7.50276 17.4762 7.50276H19.6589Z"
                    fill="#20BF55"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <span className="text-[#2C3E50] font-medium text-[14px] ">
                  Active Reminders
                </span>
                <h4 className="text-[#2C3E50] font-semibold text-[28px]">
                  {remainderCount?.activeReminders}
                </h4>
              </div>
              <div className="bg-bgOrange ml-3 flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                <svg
                  width="23"
                  height="22"
                  viewBox="0 0 23 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.515 12.0115V11.8014C16.515 11.4767 16.3869 11.1653 16.1591 10.9357C15.9312 10.7061 15.6221 10.5771 15.2998 10.5771C14.9776 10.5771 14.6685 10.7061 14.4406 10.9357C14.2127 11.1653 14.0847 11.4767 14.0847 11.8014V12.0115C13.3018 12.2695 12.6197 12.7699 12.1356 13.4415C11.6516 14.113 11.3903 14.9213 11.389 15.7512V17.3098C11.3884 17.9405 11.1744 18.5522 10.7824 19.044C10.6758 19.1751 10.6083 19.3341 10.588 19.5024C10.5677 19.6706 10.5954 19.8413 10.6677 19.9943C10.7401 20.1473 10.8542 20.2764 10.9967 20.3666C11.1392 20.4567 11.3042 20.5041 11.4724 20.5032H13.6183C13.6692 20.9164 13.8682 21.2966 14.1779 21.5723C14.4876 21.848 14.8866 22.0002 15.2998 22.0002C15.7131 22.0002 16.1121 21.848 16.4218 21.5723C16.7314 21.2966 16.9304 20.9164 16.9813 20.5032H19.1234C19.2405 20.5034 19.3564 20.4803 19.4646 20.4352C19.5727 20.3902 19.671 20.324 19.7538 20.2407C19.8365 20.1573 19.9022 20.0582 19.9469 19.9493C19.9916 19.8403 20.0146 19.7235 20.0144 19.6056C20.0126 19.4015 19.9432 19.2039 19.8173 19.044C19.4226 18.5535 19.2071 17.9413 19.2068 17.3098V15.7512C19.2064 14.9217 18.9458 14.1134 18.4624 13.4419C17.979 12.7703 17.2975 12.2697 16.515 12.0115ZM14.843 11.8014C14.843 11.741 14.8548 11.6811 14.8777 11.6253C14.9007 11.5694 14.9344 11.5187 14.9768 11.476C15.0192 11.4332 15.0696 11.3993 15.125 11.3762C15.1804 11.353 15.2398 11.3411 15.2998 11.3411C15.3598 11.3411 15.4192 11.353 15.4747 11.3762C15.5301 11.3993 15.5805 11.4332 15.6229 11.476C15.6653 11.5187 15.699 11.5694 15.7219 11.6253C15.7449 11.6811 15.7567 11.741 15.7567 11.8014V11.8396C15.6045 11.821 15.4513 11.8121 15.2979 11.8129C15.1459 11.8121 14.9939 11.821 14.843 11.8396V11.8014ZM15.2979 21.2367C15.0862 21.2363 14.8809 21.1636 14.7156 21.0303C14.5503 20.8971 14.4348 20.7113 14.388 20.5032H16.2117C16.164 20.7115 16.0478 20.8974 15.8818 21.0306C15.7159 21.1638 15.5101 21.2364 15.2979 21.2367ZM10.55 14.2363C10.4751 14.1686 10.3767 14.1338 10.2763 14.1393C10.1759 14.1448 10.0818 14.1903 10.0146 14.2657C9.65826 14.6624 9.46003 15.1779 9.45807 15.713C9.45751 16.2503 9.65692 16.7683 10.0169 17.1646C10.0502 17.2028 10.0907 17.2339 10.136 17.2562C10.1814 17.2784 10.2307 17.2913 10.281 17.2941C10.3314 17.2969 10.3818 17.2895 10.4293 17.2724C10.4768 17.2553 10.5204 17.2289 10.5577 17.1946C10.5949 17.1603 10.6249 17.1189 10.6461 17.0728C10.6672 17.0267 10.679 16.9767 10.6808 16.926C10.6825 16.8752 10.6742 16.8246 10.6563 16.7771C10.6384 16.7295 10.6113 16.6861 10.5765 16.6493C10.3445 16.3935 10.2161 16.0595 10.2165 15.713C10.2169 15.3665 10.3462 15.0327 10.5788 14.7775C10.6123 14.7402 10.6382 14.6965 10.6549 14.649C10.6716 14.6015 10.6789 14.5512 10.6762 14.5009C10.6735 14.4505 10.661 14.4013 10.6393 14.3559C10.6177 14.3104 10.5873 14.2698 10.55 14.2363ZM9.17485 12.9868C9.13813 12.9529 9.09515 12.9266 9.04836 12.9094C9.00156 12.8923 8.95187 12.8846 8.90212 12.8868C8.85237 12.889 8.80354 12.9011 8.75842 12.9223C8.71329 12.9435 8.67276 12.9734 8.63913 13.0104C7.97061 13.7502 7.6001 14.7147 7.6001 15.7151C7.6001 16.7156 7.97061 17.6801 8.63913 18.4198C8.67213 18.4586 8.71251 18.4904 8.75789 18.5131C8.80327 18.5359 8.85273 18.5493 8.90333 18.5525C8.95393 18.5557 9.00465 18.5486 9.05249 18.5317C9.10033 18.5148 9.14432 18.4884 9.18186 18.454C9.21939 18.4197 9.24971 18.3781 9.27101 18.3317C9.29232 18.2854 9.30418 18.2352 9.30589 18.1842C9.30761 18.1331 9.29914 18.0822 9.281 18.0345C9.26285 17.9868 9.2354 17.9433 9.20025 17.9065C8.65916 17.3074 8.3593 16.5265 8.3593 15.7165C8.3593 14.9065 8.65916 14.1256 9.20025 13.5265C9.23377 13.4894 9.25971 13.446 9.27657 13.3988C9.29344 13.3516 9.3009 13.3015 9.29855 13.2513C9.29619 13.2012 9.28405 13.152 9.26283 13.1066C9.2416 13.0613 9.21171 13.0205 9.17485 12.9868ZM20.0455 17.1875C20.1197 17.2558 20.2178 17.2915 20.3182 17.2869C20.4186 17.2824 20.513 17.2378 20.5808 17.1631C20.9408 16.7667 21.1401 16.2488 21.1393 15.7115C21.1375 15.1764 20.9394 14.6609 20.5831 14.2641C20.5504 14.2251 20.5102 14.193 20.4649 14.1699C20.4197 14.1468 20.3703 14.133 20.3196 14.1295C20.269 14.1259 20.2182 14.1327 20.1702 14.1493C20.1222 14.1659 20.078 14.1921 20.0402 14.2262C20.0024 14.2604 19.9719 14.3018 19.9503 14.3481C19.9287 14.3944 19.9165 14.4445 19.9146 14.4956C19.9126 14.5467 19.9208 14.5977 19.9387 14.6455C19.9567 14.6934 19.9839 14.7371 20.019 14.7741C20.2512 15.0296 20.38 15.3635 20.38 15.71C20.38 16.0565 20.2512 16.3903 20.019 16.6459C19.9852 16.6831 19.9591 16.7267 19.9422 16.7741C19.9253 16.8216 19.9178 16.8719 19.9203 16.9223C19.9227 16.9726 19.9351 17.022 19.9566 17.0675C19.9781 17.113 20.0083 17.1538 20.0455 17.1875ZM21.9583 13.0104C21.9245 12.9734 21.8839 12.9435 21.8387 12.9223C21.7935 12.9012 21.7445 12.8892 21.6947 12.887C21.6449 12.8849 21.5952 12.8927 21.5483 12.9099C21.5015 12.9272 21.4585 12.9535 21.4218 12.9875C21.3851 13.0215 21.3553 13.0625 21.3343 13.108C21.3133 13.1536 21.3014 13.2028 21.2993 13.253C21.2972 13.3032 21.3049 13.3534 21.322 13.4005C21.3391 13.4477 21.3653 13.491 21.399 13.528C21.9404 14.127 22.2405 14.9079 22.2405 15.718C22.2405 16.5281 21.9404 17.3091 21.399 17.908C21.3651 17.945 21.3387 17.9885 21.3215 18.0359C21.3043 18.0833 21.2966 18.1336 21.2988 18.184C21.301 18.2344 21.3131 18.2838 21.3344 18.3295C21.3556 18.3752 21.3857 18.4161 21.4228 18.45C21.4598 18.4839 21.5032 18.5101 21.5504 18.527C21.5975 18.5439 21.6476 18.5513 21.6976 18.5486C21.7476 18.5459 21.7965 18.5333 21.8417 18.5115C21.8868 18.4897 21.9272 18.459 21.9605 18.4214C22.6293 17.6817 23 16.7172 23 15.7167C23 14.7161 22.6293 13.7516 21.9605 13.012L21.9583 13.0104Z"
                    fill="#EB8909"
                  />
                  <path
                    d="M7.44718 19.3559C7.54773 19.3559 7.64417 19.3156 7.71527 19.244C7.78637 19.1724 7.82632 19.0752 7.82632 18.9739C7.82632 18.8726 7.78637 18.7754 7.71527 18.7038C7.64417 18.6322 7.54773 18.5919 7.44718 18.5919H1.88029C1.64941 18.5919 1.42796 18.4997 1.26449 18.3354C1.10102 18.1711 1.00888 17.9482 1.00828 17.7156V6.59427H17.8265V10.9551C17.8265 11.0564 17.8664 11.1536 17.9375 11.2252C18.0086 11.2968 18.105 11.3371 18.2056 11.3371C18.3062 11.3371 18.4026 11.2968 18.4737 11.2252C18.5448 11.1536 18.5847 11.0564 18.5847 10.9551V3.60479C18.5842 3.16988 18.4126 2.75292 18.1074 2.44536C17.8022 2.1378 17.3884 1.96474 16.9567 1.96413H15.2078V1.12718C15.2076 0.831923 15.0911 0.548815 14.8838 0.340035C14.6766 0.131255 14.3956 0.0138742 14.1026 0.0136719H13.8277C13.5349 0.0142784 13.2542 0.131825 13.0473 0.340551C12.8403 0.549276 12.7239 0.832152 12.7236 1.12718V1.96413H6.11261V1.12718C6.11231 0.83202 5.99583 0.549028 5.78871 0.340281C5.5816 0.131534 5.30076 0.0140763 5.0078 0.0136719H4.73255C4.43953 0.0139752 4.15859 0.131389 3.9514 0.340147C3.7442 0.548905 3.62766 0.831954 3.62736 1.12718V1.96413H1.88029C1.44824 1.96413 1.03386 2.13692 0.728172 2.44455C0.422487 2.75218 0.250502 3.16948 0.25 3.60479V17.7156C0.250603 18.1509 0.422631 18.5681 0.728306 18.8756C1.03398 19.1832 1.44831 19.3559 1.88029 19.3559H7.44718ZM13.4819 1.12718C13.482 1.03451 13.5186 0.94567 13.5836 0.880143C13.6487 0.814617 13.7369 0.777759 13.8288 0.777658H14.1037C14.1957 0.777658 14.284 0.814483 14.349 0.880031C14.4141 0.94558 14.4506 1.03448 14.4506 1.12718V3.57881C14.4506 3.67151 14.4141 3.76042 14.349 3.82596C14.284 3.89151 14.1957 3.92834 14.1037 3.92834H13.8288C13.7369 3.92824 13.6487 3.89138 13.5836 3.82585C13.5186 3.76033 13.482 3.67148 13.4819 3.57881V1.12718ZM4.38678 1.12718C4.38678 1.03448 4.42333 0.94558 4.48838 0.880031C4.55344 0.814483 4.64168 0.777658 4.73369 0.777658H5.00894C5.10088 0.777759 5.18902 0.814629 5.254 0.880166C5.31898 0.945704 5.35547 1.03455 5.35547 1.12718V3.57881C5.35547 3.67145 5.31898 3.76029 5.254 3.82583C5.18902 3.89137 5.10088 3.92824 5.00894 3.92834H4.73369C4.64168 3.92834 4.55344 3.89151 4.48838 3.82596C4.42333 3.76042 4.38678 3.67151 4.38678 3.57881V1.12718ZM1.88029 2.72812H3.62926V3.57881C3.62956 3.87404 3.74609 4.15709 3.95329 4.36585C4.16049 4.57461 4.44142 4.69202 4.73445 4.69232H5.0097C5.30266 4.69192 5.58349 4.57446 5.79061 4.36571C5.99772 4.15697 6.11421 3.87398 6.11451 3.57881V2.72812H12.7236V3.57881C12.7239 3.87404 12.8405 4.15709 13.0477 4.36585C13.2549 4.57461 13.5358 4.69202 13.8288 4.69232H14.1037C14.3968 4.69212 14.6778 4.57474 14.885 4.36596C15.0922 4.15718 15.2087 3.87407 15.2089 3.57881V2.72812H16.9579C17.1887 2.72872 17.41 2.82155 17.573 2.98626C17.736 3.15096 17.8276 3.37408 17.8276 3.6067V5.83219H1.00828V3.60479C1.00878 3.37211 1.10087 3.14912 1.26435 2.98477C1.42783 2.82042 1.64935 2.72811 1.88029 2.72812Z"
                    fill="#EB8909"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <span className="text-[#2C3E50] font-medium text-[14px] ">
                  Pending Uploads
                </span>
                <h4 className="text-[#2C3E50] font-semibold text-[28px]">
                  {remainderCount?.pendingUploads}
                </h4>
              </div>
              <div className="bg-bgRed ml-3 flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_65_921)">
                    <g clip-path="url(#clip1_65_921)">
                      <path
                        d="M19.9995 27.4131C18.8812 27.4131 17.9438 28.3505 17.9438 29.4687C17.9438 30.587 18.8812 31.5244 19.9995 31.5244C21.0767 31.5244 22.0552 30.587 22.0058 29.5181C22.0552 28.3422 21.126 27.4131 19.9995 27.4131Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M39.0266 34.6982C40.3176 32.4699 40.3258 29.814 39.0431 27.5939L26.1665 5.29412C24.892 3.04935 22.5896 1.71729 20.0077 1.71729C17.4258 1.71729 15.1235 3.05757 13.849 5.2859L0.955919 27.6103C-0.32681 29.8551 -0.318587 32.5274 0.980586 34.7558C2.26331 36.9594 4.55743 38.2833 7.12288 38.2833H32.8432C35.4169 38.2833 37.7275 36.943 39.0266 34.6982ZM36.2309 33.0866C35.5156 34.32 34.2493 35.0518 32.835 35.0518H7.11466C5.71681 35.0518 4.45875 34.3364 3.75983 33.1277C3.05269 31.9025 3.04446 30.4389 3.75161 29.2055L16.6447 6.88931C17.3436 5.66414 18.5934 4.94055 20.0077 4.94055C21.4138 4.94055 22.6719 5.67237 23.3708 6.89754L36.2556 29.2137C36.9463 30.4142 36.9381 31.8614 36.2309 33.0866Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M19.4898 12.9824C18.5113 13.2619 17.9028 14.15 17.9028 15.2271C17.9522 15.8767 17.9933 16.5345 18.0426 17.1841C18.1824 19.6591 18.3222 22.0848 18.462 24.5598C18.5113 25.3985 19.1609 26.007 19.9996 26.007C20.8383 26.007 21.4961 25.3574 21.5372 24.5105C21.5372 24.0007 21.5372 23.532 21.5866 23.0139C21.677 21.427 21.7757 19.84 21.8661 18.253C21.9155 17.2252 22.0059 16.1974 22.0553 15.1696C22.0553 14.7995 22.0059 14.4706 21.8661 14.1417C21.4468 13.2208 20.4683 12.7521 19.4898 12.9824Z"
                        fill="#EA4335"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_65_921">
                      <rect width="40" height="40" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_65_921">
                      <rect width="40" height="40" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <span className="text-[#2C3E50] font-medium text-[14px] ">
                  Templates Created
                </span>
                <h4 className="text-[#2C3E50] font-semibold text-[28px]">
                  {remainderCount?.templatesCreatedTotal}
                </h4>
              </div>
              <div className="bg-bgPurple ml-3 flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.891 9.71812L25.5163 0.343359C25.2964 0.123663 24.9983 0.000175658 24.6875 0L8.28125 0C6.34273 0 4.76562 1.57711 4.76562 3.51562V36.4844C4.76562 38.4229 6.34273 40 8.28125 40H31.7188C33.6573 40 35.2344 38.4229 35.2344 36.4844V10.5469C35.2344 10.2273 35.1002 9.92727 34.891 9.71812ZM25.8594 4.00102L31.2334 9.375H27.0312C26.3851 9.375 25.8594 8.8493 25.8594 8.20312V4.00102ZM31.7188 37.6562H8.28125C7.63508 37.6562 7.10938 37.1305 7.10938 36.4844V3.51562C7.10938 2.86945 7.63508 2.34375 8.28125 2.34375H23.5156V8.20312C23.5156 10.1416 25.0927 11.7188 27.0312 11.7188H32.8906V36.4844C32.8906 37.1305 32.3649 37.6562 31.7188 37.6562Z"
                    fill="#497FFF"
                  />
                  <path
                    d="M27.0312 16.5625H12.9688C12.3216 16.5625 11.7969 17.0872 11.7969 17.7344C11.7969 18.3816 12.3216 18.9062 12.9688 18.9062H27.0312C27.6784 18.9062 28.2031 18.3816 28.2031 17.7344C28.2031 17.0872 27.6784 16.5625 27.0312 16.5625ZM27.0312 21.25H12.9688C12.3216 21.25 11.7969 21.7747 11.7969 22.4219C11.7969 23.0691 12.3216 23.5938 12.9688 23.5938H27.0312C27.6784 23.5938 28.2031 23.0691 28.2031 22.4219C28.2031 21.7747 27.6784 21.25 27.0312 21.25ZM27.0312 25.9375H12.9688C12.3216 25.9375 11.7969 26.4622 11.7969 27.1094C11.7969 27.7566 12.3216 28.2812 12.9688 28.2812H27.0312C27.6784 28.2812 28.2031 27.7566 28.2031 27.1094C28.2031 26.4622 27.6784 25.9375 27.0312 25.9375ZM22.3438 30.625H12.9688C12.3216 30.625 11.7969 31.1497 11.7969 31.7969C11.7969 32.4441 12.3216 32.9688 12.9688 32.9688H22.3438C22.9909 32.9688 23.5156 32.4441 23.5156 31.7969C23.5156 31.1497 22.9909 30.625 22.3438 30.625Z"
                    fill="#497FFF"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-[30px] mb-[30px] gap-2 sm:gap[7px]">
          <h4 className="color-black text-lg font-semibold">Reminder System</h4>
        </div>

        <div className="flex tabs-blk gap-[20px] border-b border-gray-300 overflow-auto mb-8 w-full">
          {["reminder", "template", "schedule", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-[10px] text-base leading-[100%] tracking-[0] rounded-t-md ${
                activeTab === tab
                  ? "bg-bgBlue font-semibold text-primaryBlue border-b-2 border-primaryBlue"
                  : "text-bodyColor hover:bg-tabsBg border-b-2 border-transparent font-regular"
              }`}
            >
              {tab === "reminder" && "Schedule Reminders"}
              {tab === "template" && "Manage Template"}
              {tab === "schedule" && "Default Reminder Settings"}
              {tab === "history" && "Reminder History"}
            </button>
          ))}
        </div>
        {showRemainderModal && (
          <RemainderModal onClose={() => setShowRemainderModal(false)} />
        )}

        {showRemainderEditModal && (
          <EditReminderModal
            onClose={() => setShowEditRemainderModal(false)}
            template={templateData}
          />
        )}
        {/* Tab Content Section */}
        <div className="w-full">
          {activeTab === "reminder" && (
            <div>
              {/* Reminder Settings Content Here */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-5 gap-x-5 mt-7 w-full">
                <div className="border border-customGray p-5 rounded-[20px] overflow-hidden">
                  <div className="flex justify-between ">
                    <h1 className="text-[18px] font-medium text-body mb-5">
                      Reminder Details
                    </h1>
                    <div className="">
                      <label className="mt-2 ">Send as Default Reminder</label>
                      <input
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSendAsDefaultReminder(isChecked);
                          setIsDefaultselect(isChecked);

                          // When checking "use default", load the saved defaults
                          if (isChecked && defaultSettings) {
                            setCustomDateTime(defaultSettings.scheduleTime);
                            setFrequency(defaultSettings.frequency);
                            setSelectedDays(defaultSettings.days);
                            setNotifyMethods(defaultSettings.notifyMethod);
                          }
                        }}
                        checked={sendAsDefaultReminder}
                        type="checkbox"
                        className="ml-2 mt-2 shadow cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-[14px] font-medium text-body mb-2">
                      Document Req Title
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDoc}
                        onChange={(e) => setSelectedDoc(e.target.value)}
                        className="border text-[16px] font-[400] text-body border-[#eaeaea] rounded-[10px] py-2 px-4 w-full min-h-[42px] text-gray-800 appearance-none"
                      >
                        <option value="">Select a Document title</option>
                        {title.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                            {doc.doctitle}
                          </option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down text-[14px] absolute top-[16px] right-[14px]"></i>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-[14px] font-medium text-body mb-2">
                      Select Template
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="border text-[16px] font-[400] text-body border-[#eaeaea] rounded-[10px] py-2 px-4 w-full min-h-[42px] text-gray-800 appearance-none"
                      >
                        <option value="">Select a template</option>
                        {templates.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                            {doc.name}
                          </option>
                        ))}
                      </select>

                      <i className="fa-solid fa-chevron-down absolute text-[14px] top-[16px] right-[14px]"></i>
                    </div>
                  </div>

                  <div className="mb-[44px]">
                    <label className="block text-[14px] font-medium text-body mb-2">
                      Custom Message
                    </label>
                    <QuillEditor
                      value={customMessage}
                      onChange={setCustomMessage}
                      placeholder="Enter your message here..."
                      height="150px"
                      className="min-h-[150px] w-full p-3 bg-[#F8F8F8] border border-[#f2f2f2] text-[12px] font-[400] rounded-md focus:outline-none focus:ring-2 resize-none"
                    />
                  </div>

                  {isDefaultselect ? (
                    <div className=" mb-[20px] flex justify-center items-center gap-2 text-[14px] font-[400] text-body">
                      {" "}
                      Default Reminder Selected
                    </div>
                  ) : (
                    <>
                      <div className=" mb-4">
                        <label className="block text-[14px] font-medium text-body mb-2">
                          Set Time
                        </label>
                        <input
                          type="time"
                          value={customDateTime}
                          onChange={(e) => setCustomDateTime(e.target.value)}
                          disabled={sendAsDefaultReminder}
                          className={`w-full p-3 bg-[#F8F8F8] border border-[#f2f2f2] text-[12px] font-[400] rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                            sendAsDefaultReminder
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        />
                      </div>
                      {/* Frequency Selector */}
                      <div className="mb-5 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[14px] font-medium text-body">
                            Frequency
                          </label>
                          <div className="relative h-[20px]">
                            <select
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value)}
                              className="pr-8 pl-3 bg-white text-[14px] text-body appearance-none focus:outline-none focus:border-transparent font-[400]"
                            >
                              <option value="Weekly">Weekly</option>
                              <option value="Daily">Daily</option>
                            </select>
                            <i className="fa-solid fa-chevron-down absolute text-[14px] top-[5px] right-[14px]"></i>
                          </div>
                        </div>

                        {/* Day Picker */}
                        <div className="flex flex-wrap gap-4 p-2 bg-[#F8F8F8] rounded-[10px]">
                          {days.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayToggle(day)}
                              className={`px-4 py-1 h-[30px] rounded-md text-[14px] font-[400] transition-colors ${
                                selectedDays.includes(day)
                                  ? "border border-primaryBlue text-primaryBlue bg-white"
                                  : "text-body bg-white hover:bg-gray-100"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-medium text-body mb-3">
                          Notify Method
                        </h3>
                        <div className="flex gap-5 flex-wrap">
                          {[
                            { label: "Email", value: "email" },
                            { label: "SMS", value: "sms" },
                            { label: "Portal Notification", value: "portal" },
                            { label: "AI Call", value: "AiCall" },
                          ].map((method) => (
                            <label
                              key={method.value}
                              className={`flex items-center gap-2 text-[14px] font-[400] text-body ${
                                sendAsDefaultReminder
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={method.value}
                                checked={notifyMethods.includes(method.value)}
                                onChange={(e) => {
                                  if (!sendAsDefaultReminder) {
                                    const value = e.target.value;
                                    setNotifyMethods((prev) =>
                                      prev.includes(value)
                                        ? prev.filter((m) => m !== value)
                                        : [...prev, value]
                                    );
                                  }
                                }}
                                disabled={sendAsDefaultReminder}
                                className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
          checked:bg-[#20BF55] checked:border-[#20BF55]
          checked:after:content-['✓'] checked:after:text-white 
          checked:after:text-[12px] checked:after:font-bold 
          checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                              />
                              {method.label}
                            </label>
                          ))}
                        </div>
                      </div>{" "}
                    </>
                  )}
                </div>
                <div className="border flex flex-col border-customGray p-5 rounded-[20px] h-[100%] overflow-hidden">
                  <div className="flex flex-col flex-grow">
                    <h1 className="text-[18px] font-medium text-body mb-5">
                      Select Recipients
                    </h1>

                    <div className="mb-6">
                      <label className="block text-[14px] font-medium text-body mb-2">
                        Filter Clients
                      </label>
                      <input
                        type="text"
                        placeholder="Search Clients..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="border text-[16px] font-[400] text-body border-[#eaeaea] rounded-[10px] py-2 px-4 w-full min-h-[42px] text-gray-800 appearance-none placeholder-gray-400 placeholder:text-[14px] placeholder:font-[400]"
                      />
                    </div>

                    {/* Client List */}
                    <div className="space-y-1 p-5 mb-5 border border-[#eaeaea] rounded-[10px] min-h-[250px] overflow-auto">
                      {clients.map((client) => (
                        <div
                          key={client.clientId}
                          className="flex items-center justify-between p-3 hover:bg-[#f6f6f6] rounded-md transition-colors"
                        >
                          {/* Client info */}
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-[18px] bg-gradient-to-r from-[#1BA3A3] to-[#2E7ED4]">
                              {client.initials}
                            </div>
                            <div>
                              <div className="font-medium text-[16px] text-body">
                                {client?.clientName}
                              </div>
                              <div className="text-[12px] font-[400] text-body">
                                {client.email}
                              </div>
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedClientIds.includes(
                                client.clientId
                              )}
                              onChange={() =>
                                handleClientSelect(client.clientId)
                              }
                              className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-['✓'] checked:after:text-white 
                  checked:after:text-[12px] checked:after:font-bold 
                  checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center px-4 py-2 border border-customGray rounded-[10px] text-[14px] font-[400] text-body bg-white hover:bg-gray-50 transition-colors"
                    >
                      Select All
                      <div className="w-4 h-4 ml-2 flex items-center justify-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0.385254 2.33301C0.385254 1.83573 0.572921 1.35881 0.90697 1.00718C1.24102 0.655552 1.69409 0.458008 2.1665 0.458008H12.4582C12.9306 0.458008 13.3837 0.655552 13.7177 1.00718C14.0518 1.35881 14.2394 1.83573 14.2394 2.33301V13.1663C14.2394 13.6636 14.0518 14.1405 13.7177 14.4922C13.3837 14.8438 12.9306 15.0413 12.4582 15.0413H2.1665C1.69409 15.0413 1.24102 14.8438 0.90697 14.4922C0.572921 14.1405 0.385254 13.6636 0.385254 13.1663V2.33301ZM2.1665 1.70801C2.00903 1.70801 1.85801 1.77386 1.74666 1.89107C1.63531 2.00828 1.57275 2.16725 1.57275 2.33301V13.1663C1.57275 13.5113 1.83875 13.7913 2.1665 13.7913H12.4582C12.6156 13.7913 12.7667 13.7255 12.878 13.6083C12.9894 13.4911 13.0519 13.3321 13.0519 13.1663V2.33301C13.0519 2.16725 12.9894 2.00828 12.878 1.89107C12.7667 1.77386 12.6156 1.70801 12.4582 1.70801H2.1665Z"
                            fill="#B3B3B3"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M16.4163 3.79199C16.5738 3.79199 16.7248 3.85784 16.8361 3.97505C16.9475 4.09226 17.01 4.25123 17.01 4.41699V16.4995C17.01 16.8863 16.8641 17.2572 16.6043 17.5307C16.3444 17.8042 15.9921 17.9578 15.6246 17.9578H4.14545C3.98798 17.9578 3.83696 17.892 3.72561 17.7748C3.61426 17.6576 3.5517 17.4986 3.5517 17.3328C3.5517 17.1671 3.61426 17.0081 3.72561 16.8909C3.83696 16.7737 3.98798 16.7078 4.14545 16.7078H15.6246C15.6771 16.7078 15.7275 16.6859 15.7646 16.6468C15.8017 16.6077 15.8225 16.5547 15.8225 16.4995V4.41699C15.8225 4.25123 15.8851 4.09226 15.9964 3.97505C16.1078 3.85784 16.2588 3.79199 16.4163 3.79199ZM10.8928 5.10116C11.0056 5.21668 11.0702 5.37461 11.0724 5.54024C11.0747 5.70587 11.0143 5.86566 10.9047 5.98449L6.94637 10.2728C6.83865 10.3898 6.69182 10.4578 6.53715 10.4625C6.38249 10.4671 6.23219 10.4081 6.11829 10.2978L3.74329 7.99533C3.68585 7.93973 3.63937 7.87278 3.60651 7.79828C3.57366 7.72378 3.55506 7.64319 3.55179 7.56113C3.54852 7.47907 3.56064 7.39713 3.58745 7.31999C3.61426 7.24286 3.65524 7.17204 3.70806 7.11158C3.76087 7.05111 3.82448 7.00219 3.89525 6.96761C3.96603 6.93302 4.04258 6.91345 4.12054 6.91C4.1985 6.90656 4.27634 6.91931 4.34962 6.94754C4.4229 6.97576 4.49018 7.0189 4.54762 7.07449L6.49749 8.96449L10.0529 5.11283C10.1626 4.99411 10.3126 4.92611 10.47 4.92377C10.6273 4.92142 10.7791 4.98493 10.892 5.10033L10.8928 5.10116Z"
                            fill="#B3B3B3"
                          />
                        </svg>
                      </div>
                    </button>
                    <button
                      onClick={handleClearSelection}
                      className="px-4 py-2 border border-customGray rounded-[10px] text-[14px] font-[400] text-body hover:text-gray-900 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-5 mt-5">
                <button
                  type="button"
                  onClick={() => SendReminder()}
                  className="bg-[#2E7ED4] hover:bg-[#256BC0] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                >
                  Send Reminder
                </button>
              </div>
              {/* Add form or content here */}
            </div>
          )}

          {activeTab === "template" && (
            <div>
              {/* Manage Template Content Here */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-[30px] mb-[30px] gap-2 sm:gap[7px]">
                <h4 className="color-black text-lg font-semibold">
                  Manage Template
                </h4>
                <button
                  onClick={() => setShowRemainderModal(true)}
                  type="button"
                  className="bg-[#2E7ED4] hover:bg-[#256BC0] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                >
                  Create New Template
                </button>
              </div>
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="bg-white border border-[#2C3E501A] rounded-[10px] py-[25px] px-[20px] mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-[10px]">
                    <h3 className="text-[#2C3E50] font-medium text-[16px] leading-[100%] tracking-[0%]">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-[10px]">
                      <button
                        className="bg-[#1BA3A3] text-[#ffffff] px-[20px] py-[10px] rounded-md font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                        onClick={() => {
                          setSelectedTemplate(template._id),
                            setActiveTab("reminder");
                        }}
                      >
                        Use
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-1"
                        title="Edit Template"
                        onClick={() => {
                          setSelectedTemplate(template._id); // Set the selected template or template._id
                          setShowEditRemainderModal(true); // Open the modal
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-colors duration-200"
                        >
                          <path
                            d="M4.76 18.8096H4.87L7.8 18.5396C8.21 18.4996 8.59 18.3196 8.88 18.0296L19.94 6.96961C20.46 6.44961 20.75 5.75961 20.75 5.02961C20.75 4.29961 20.46 3.60961 19.94 3.08961L19.23 2.37961C18.19 1.33961 16.38 1.33961 15.34 2.37961L13.93 3.78961L4.29 13.4296C4 13.7196 3.82 14.0996 3.79 14.5096L3.52 17.4396C3.49 17.8096 3.62 18.1696 3.88 18.4396C4.12 18.6796 4.43 18.8096 4.76 18.8096ZM17.29 3.06961C17.61 3.06961 17.93 3.18961 18.17 3.43961L18.88 4.14961C18.9968 4.26446 19.0896 4.40142 19.153 4.55251C19.2163 4.70359 19.2489 4.86578 19.2489 5.02961C19.2489 5.19344 19.2163 5.35562 19.153 5.50671C19.0896 5.6578 18.9968 5.79476 18.88 5.90961L18 6.78961L15.53 4.31961L16.41 3.43961C16.65 3.19961 16.97 3.06961 17.29 3.06961ZM5.28 14.6496C5.28 14.5896 5.31 14.5396 5.35 14.4996L14.46 5.37961L16.93 7.84961L7.82 16.9596C7.82 16.9596 7.72 17.0296 7.67 17.0296L5.04 17.2696L5.28 14.6396V14.6496ZM22.75 21.9996C22.75 22.4096 22.41 22.7496 22 22.7496H2C1.59 22.7496 1.25 22.4096 1.25 21.9996C1.25 21.5896 1.59 21.2496 2 21.2496H22C22.41 21.2496 22.75 21.5896 22.75 21.9996Z"
                            fill="#2C3E50"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p
                      dangerouslySetInnerHTML={{ __html: template.message }}
                      className="mb-2 font-normal text-[16px] leading-[100%] tracking-[0%] text-[#2C3E50]"
                    />
                    <p className="sr-only">
                      {" "}
                      {/* Screen reader only text */}
                      {getPlainText(template.message)}
                    </p>
                  </div>

                  <p className="text-[#2C3E50] font-normal text-[14px] leading-[100%] tracking-[0%] opacity-[0.6]">
                    Created: {new Date(template.createdAt).toLocaleDateString()}{" "}
                    | Used: {template.usedCount || 0} times
                  </p>
                </div>
              ))}

              {/* Add template management UI */}
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="w-full">
              {/* Title */}
              <h2 className="text-lg font-semibold mb-4">
                Automated Reminder Schedules
                {defaultSettings && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    (Current settings !)
                  </span>
                )}
              </h2>

              <div className="border border-customGray p-5 rounded-[20px] overflow-hidden">
                <h1 className="text-[18px] font-medium text-body mb-5">
                  Configure Automation
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* DateTime Picker */}
                  <div className="mb-5 w-full">
                    <label className="block text-[14px] font-medium text-body mb-2">
                      Set Time
                    </label>
                    <input
                      type="time"
                      value={customDateTime}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      className="w-full p-3 bg-[#F8F8F8] border border-[#f2f2f2] text-[12px] font-[400] rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                    />
                  </div>

                  {/* Frequency Selector */}
                  <div className="mb-5 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[14px] font-medium text-body">
                        Frequency
                      </label>
                      <div className="relative h-[20px]">
                        <select
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="pr-8 pl-3 bg-white text-[14px] text-body appearance-none focus:outline-none focus:border-transparent font-[400]"
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                        </select>
                        <i className="fa-solid fa-chevron-down absolute text-[14px] top-[5px] right-[14px]"></i>
                      </div>
                    </div>

                    {/* Day Picker */}
                    <div className="flex flex-wrap gap-4 p-2 bg-[#F8F8F8] rounded-[10px]">
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-4 py-1 h-[30px] rounded-md text-[14px] font-[400] transition-colors ${
                            selectedDays.includes(day)
                              ? "border border-primaryBlue text-primaryBlue bg-white"
                              : "text-body bg-white hover:bg-gray-100"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  {/* Notify Methods */}
                  <div className="w-full">
                    <h3 className="text-[14px] font-medium text-body mb-3">
                      Notify Method
                    </h3>
                    <div className="flex gap-5 flex-wrap">
                      {[
                        { label: "Email", value: "email" },
                        { label: "SMS", value: "sms" },
                        { label: "Portal Notification", value: "portal" },
                        { label: "AI Call", value: "AiCall" },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className="flex items-center gap-2 text-[14px] font-[400] text-body"
                        >
                          <input
                            type="checkbox"
                            value={method.value}
                            checked={notifyMethods.includes(method.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNotifyMethods((prev) =>
                                prev.includes(value)
                                  ? prev.filter((m) => m !== value)
                                  : [...prev, value]
                              );
                            }}
                            className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-['✓'] checked:after:text-white 
                  checked:after:text-[12px] checked:after:font-bold 
                  checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                          />
                          {method.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={addDefaultRemainder}
                  className="bg-[#2E7ED4] hover:bg-[#256BC0] text-white py-2 px-6 rounded-[10px] transition-colors duration-200"
                >
                  {defaultSettings ? "Update Schedule" : "Save Schedule"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              {/* Reminder History Content Here */}
              <h2 className="text-lg font-semibold mb-4">Reminder History</h2>
              {/* Add logs, history table etc. */}
              <div>
                <Table
                  data={remainder}
                  mode="remainderHistory"
                  pagination={pagination}
                  onPageChange={(newPage) =>
                    setPagination((prev) => ({ ...prev, page: newPage }))
                  }
                  onLimitChange={(newLimit) => {
                    setPagination((prev) => ({
                      ...prev,
                      limit: newLimit,
                      page: 1,
                    }));
                  }}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SendReminder;
