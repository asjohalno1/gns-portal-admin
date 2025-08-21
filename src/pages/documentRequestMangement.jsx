import React, { useEffect, useState } from "react";
import Table from "../Component/Table/table";
import {
  addSubCategoryApi,
  addTemplate,
  createDocumentRequest,
  getAllAssociatedSubCategories,
  getAllCategories,
  getAllClientsAdmin,
  getAllDocuments,
  getAllDocumentsListing,
  getAllTemplates,
} from "../api/documentManagemnet.api";
import { toast } from "react-toastify";
import {
  CompleteCheckIcon,
  DocumentIcon,
  OverdueIcon,
  PendingIcon,
} from "../Icons/SvgIcons";
import getPlainText from "../adminutils/commonutils";
import { useNavigate } from "react-router-dom";
import AddCustomSubcat from "../Component/settings/AddCustomSubcat";
import SuccessrequestModal from "../CommonPages/SuccessModal/SuccessrequestModal";

const DocReqManagement = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [documentList, setDocumentList] = useState([]);
  const [headerSummery, setHeaderSummery] = useState({});
  const [secureLink, setSecureLink] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [clientListing, setClientListing] = useState([]);
  const [catogaryListing, setCategoryListing] = useState([]);
  const [subDocumentListing, setSubDocumentListing] = useState([]);

  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [wasSchedulerActivated, setWasSchedulerActivated] = useState(false);
  const [customDateTime, setCustomDateTime] = useState("09:00");
  const [frequency, setFrequency] = useState("Weekly");
  const [selectedDays, setSelectedDays] = useState([]);
  const [notifyMethods, setNotifyMethods] = useState([]);
  const [linkMethods, setLinkMethod] = useState([]); // schedular logic
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] =
    useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const nevigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    clientId: [],
    categoryId: [],
    documentId: [],
    subcategoryPriorities: [],
    otherDocuments: "",
    dueDate: "",
    instructions: "",
    notifyMethods: [],
    linkMethods: [],
    // subcategoryPriorities: [],
  });
  const [templateList, setTemplateList] = useState([]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [query, setQuery] = useState({
    search: "",
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (activeTab === "tab1") {
      fetchDocumentListing(query);
    }
  }, [activeTab]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (activeTab === "tab1") {
        fetchDocumentListing(query);
      }
    }, 500);

    if (activeTab === "tab3") {
      fetchAllDocuments(query);
    }

    return () => clearTimeout(delayDebounce);
  }, [query.search]);

  useEffect(() => {
    if (activeTab === "tab1") {
      fetchDocumentListing(query);
    }
    if (activeTab === "tab3") {
      fetchAllDocuments(query);
    }
  }, [query.page, query.limit]);

  const fetchDocumentListing = async (queryParams = query) => {
    try {
      const res = await getAllDocumentsListing(queryParams);
      if (res.success) {
        const {
          documents,
          currentPage,
          totalDocuments,
          totalPages,
          headerTotal,
        } = res.data;

        setDocumentList(documents);

        setHeaderSummery(headerTotal);

        setQuery((prev) => ({
          ...prev,
          page: currentPage,
          total: totalDocuments,
          totalPages: totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document list."
      );
    }
  };

  // tab 2 logic  and  fuctionality  !
  const fetchAllClient = async (
    queryParams = {
      status: "all",
    }
  ) => {
    try {
      const res = await getAllClientsAdmin();
      if (res.success) {
        setClientListing(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch client list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch client list."
      );
    }
  };

  const fetchAllDocumentListing = async () => {
    try {
      const res = await getAllCategories();
      if (res.success) {
        setCategoryListing(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document list."
      );
    }
  };

  const handleCategoryChange = async (categoryId) => {
    try {
      const res = await getAllAssociatedSubCategories(categoryId);
      if (res.success) {
        const taggedSubcategories = res.data.map((sub) => ({
          ...sub,
          parentCategoryId: categoryId,
        }));
        setSubDocumentListing((prev) => {
          const existingIds = prev.map((item) => item._id);
          const newItems = taggedSubcategories.filter(
            (item) => !existingIds.includes(item._id)
          );
          return [...prev, ...newItems];
        });
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "tab2") {
      fetchAllClient(query);
      fetchAllDocumentListing();
    }
  }, [activeTab]);
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate required fields
      if (
        !formData.clientId?.length ||
        !formData.categoryId?.length ||
        !formData.documentId?.length ||
        !formData.dueDate ||
        !formData.notifyMethods?.length
      ) {
        toast.error(
          "Please fill all required fields including notification methods"
        );
        return;
      }

      const selectedClient = clientListing.find(
        (client) => client.clientId === formData.clientId[0]
      );

      // Convert subcategory priorities array to object
      const prioritiesObj = formData.subcategoryPriorities.reduce(
        (acc, curr) => {
          acc[curr.subCategoryId] = curr.priority;
          return acc;
        },
        {}
      );

      const requestData = {
        doctitle: formData.title,
        clientId: formData.clientId,
        categoryId: formData.categoryId,
        subCategoryId: formData.documentId,
        dueDate: formData.dueDate,
        instructions:
          formData.instructions ||
          "<p>Please Upload Your Document Using This Secure Link.</p>",
        notifyMethods: formData.notifyMethods, // Array of notification methods
        remainderSchedule: formData.scheduleReminder
          ? "ThreeDays"
          : "ThreeDays",
        expiration: formData.dueDate,
        subcategoryPriorities: prioritiesObj,
        userInfo: {
          id: selectedClient?.staff?.staffId,
        },
      };

      // Add scheduler data if enabled
      if (isScheduleEnabled) {
        requestData.scheduler = {
          scheduleTime: customDateTime,
          frequency,
          linkMethods: linkMethods,
          days: selectedDays,
        };
      }

      const res = await createDocumentRequest(requestData);

      if (res.success) {
        toast.success(res?.message || "Document request created successfully");

        // Reset form
        setFormData({
          title: "",
          clientId: [],
          categoryId: [],
          documentId: [],
          subcategoryPriorities: [],
          otherDocuments: "",
          dueDate: "",
          instructions: "",
          notifyMethods: [],
          scheduleReminder: false,
        });

        // Reset scheduler
        setIsScheduleEnabled(false);
        setCustomDateTime("09:00");
        setFrequency("Weekly");
        setSelectedDays([]);
        setNotifyMethods([]);
        setLoading(false);
        fetchDocumentListing();
        setIsSuccessModalOpen(true);
      } else {
        toast.error(res?.message || "Failed to create document request");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to create document request:", error);
      toast.error(
        error.response?.data?.message || "Failed to create document request."
      );
      setLoading(false);
    }
  };

  const handleSaveAsTemplate = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);

      // Validate required fields for template
      if (
        !formData.title ||
        !formData.categoryId?.length ||
        !formData.documentId?.length
      ) {
        toast.error(
          "Please fill title, select at least one document type and documents to save as template"
        );
        return;
      }

      // Convert subcategoryPriorities array to object if needed
      const prioritiesObj = Array.isArray(formData.subcategoryPriorities)
        ? formData.subcategoryPriorities.reduce((acc, curr) => {
            acc[curr.subCategoryId] = curr.priority;
            return acc;
          }, {})
        : formData.subcategoryPriorities;

      const templateData = {
        name: formData.title,
        clientIds: formData.clientId || [], // Array of client IDs
        categoryIds: formData.categoryId, // Array of category IDs
        subCategoryId: formData.documentId, // Array of document IDs
        notifyMethod: formData.notifyMethods[0] || "email",
        remainderSchedule: formData.scheduleReminder
          ? "ThreeDays"
          : "ThreeDays",
        message:
          formData.instructions ||
          "<p>Please Upload Your Document Using This Secure Link.</p>",
        subcategoryPriorities: prioritiesObj,
        expiration: formData.dueDate,
        linkMethod: formData.linkMethod, // Default or from form
        active: true,
      };

      // if (isScheduleEnabled) {
      //   templateData.scheduler = {
      //     scheduleTime: customDateTime,
      //     frequency,
      //     notifyMethod: notifyMethods,
      //     days: selectedDays,
      //   };
      // }

      const res = await addTemplate(templateData);

      if (res.success) {
        toast.success(res?.message || "Template saved successfully");
        setSaveLoading(false);
        setActiveTab("tab4"); // Navigate to templates tab
      } else {
        toast.error(res?.message || "Failed to save template");
        setSaveLoading(false);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error(error.response?.data?.message || "Failed to save template.");
      setSaveLoading(false);
    }
  };

  const fetchAllDocuments = async (query) => {
    try {
      const res = await getAllDocuments(query);

      const {
        documents,
        currentPage,
        totalDocuments,
        totalPages,
        headerTotal,
      } = res.data;

      if (res.success) {
        setSecureLink(documents);
        setQuery((prev) => ({
          ...prev,
          page: currentPage,
          total: totalDocuments,
          totalPages: totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document list."
      );
    }
  };

  const fetchAllTemplates = async () => {
    try {
      const res = await getAllTemplates();
      if (res.success) {
        setTemplateList(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
    }
  };
  const handleUseTemplate = async (templateData) => {
    try {
      setLoading(true);

      if (clientListing.length === 0) await fetchAllClient();
      if (catogaryListing.length === 0) await fetchAllDocumentListing();

      // Small delay to allow data population (optional safeguard)
      await new Promise((res) => setTimeout(res, 100));

      const clientIds = templateData.clientNames
        ? clientListing
            .filter((client) =>
              templateData.clientNames.includes(client.clientName)
            )
            .map((client) => client.clientId)
        : templateData.clientIds || [];

      const categoryIds = templateData.categoryNames
        ? catogaryListing
            .filter((category) =>
              templateData.categoryNames.includes(category.name)
            )
            .map((category) => category._id)
        : templateData.categoryIds || [];

      for (const categoryId of categoryIds) {
        await handleCategoryChange(categoryId);
      }

      const subcategoryPriorities = Object.entries(
        templateData.subcategoryPriorities || {}
      ).map(([subCategoryId, priority]) => ({
        subCategoryId,
        priority,
      }));

      const documentIds = Object.keys(templateData.subcategoryPriorities || {});

      // ✅ SET FORM DATA FIRST
      setFormData({
        title: templateData.name || "",
        clientId: clientIds,
        categoryId: categoryIds,
        documentId: documentIds,
        subcategoryPriorities,
        instructions: templateData.message || "",
        notifyMethods: [templateData.notifyMethod].filter(Boolean),
        scheduleReminder: templateData.remainderSchedule === "ThreeDays",
        reminderFrequency: "Weekly",
        selectedDays: [],
        dueDate: templateData?.expiration || "",
        otherDocuments: "",
        reminderTime: "",
      });

      // ✅ ONLY AFTER FORM DATA IS SET, SWITCH TO TAB
      setTimeout(() => {
        setActiveTab("tab2");
      }, 100); // slight delay to let form re-render properly
    } catch (error) {
      console.error("Error using template:", error);
      toast.error("Failed to load template data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tab3") {
      fetchAllDocuments(query);
    }
    if (activeTab === "tab4") {
      fetchAllTemplates();
    }
  }, [activeTab]);

  //schedular logic
  const handleSchedulerToggle = (e) => {
    const isChecked = e.target.checked;
    setIsScheduleEnabled(isChecked);

    if (!isChecked && wasSchedulerActivated) {
      // Reset scheduler data when turning it off
      setCustomDateTime("09:00");
      setFrequency("Weekly");
      setSelectedDays([]);
      // setNotifyMethods([]);
      setLinkMethod([]);
    }

    if (isChecked) {
      setWasSchedulerActivated(true);
    }
  };

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);

    if (newFrequency === "Daily") {
      setSelectedDays(daysOfWeek);
    } else {
      setSelectedDays([]);
    }
  };

  const handleDayToggle = (day) => {
    if (frequency === "Weekly") {
      setSelectedDays([day]);
    } else {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }
  };

  const handleNotifyChange = (value) => {
    setNotifyMethods((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };
  // Pagination handlers
  const onNextPage = () => {
    if (query.page < query.totalPages) {
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const onPrevPage = () => {
    if (query.page > 1) {
      setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const onLimitChange = (newLimit) => {
    setQuery((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };
  const handleClear = () => {
    setQuery((prev) => ({ ...prev, search: "", page: 1, limit: 10 }));
  };

  const handleAction = (action, data) => {
    switch (action) {
      case "request":
        setActiveTab("tab2");
        break;
      case "reminder":
        nevigate("/admin/send-reminder");
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleAddNewSubcategory = async (newName) => {
    try {
      let res = await addSubCategoryApi({
        name: newName,
        categoryId: currentCategory._id,
      });
      if (res.success) {
        toast.success(res.message);
        // await handleCategoryChange(currentCategoryForSubcategory);
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px]">
        <button
          className={`px-5 py-10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab1"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : " text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab1")}
        >
          Overview & Tracking
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab2"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab2")}
        >
          Create Request
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab3"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab3")}
        >
          Manage Links
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab4"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab4")}
        >
          Manage Templates
        </button>
      </div>
      <div className=" border-t-0 border-gray-300 rounded-b-md">
        {activeTab === "tab1" && (
          <div className="">
            <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Total Requests
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalReq}
                    </h4>
                  </div>
                  <div className="bg-bgPurple flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <DocumentIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Completed Today
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalComplete}
                    </h4>
                  </div>
                  <div className="bg-bgGreen flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <CompleteCheckIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Pending Requests
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalPending}
                    </h4>
                  </div>
                  <div className="bg-bgOrange flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <PendingIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Overdue
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.overdue}
                    </h4>
                  </div>
                  <div className="bg-bgRed flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <OverdueIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Document Requests
              </h4>
              <button
                onClick={() => setActiveTab("tab2")}
                type="button"
                className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
              >
                New Request
              </button>
            </div>

            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query.search}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        search: e.target.value,
                        page: 1,
                      }))
                    }
                    className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
                  />
                </div>
                <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
                  <div className="relative">
                    <select
                      name="cars"
                      id="cars"
                      className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                    >
                      <option value="volvo">Newest First</option>
                      <option value="saab">Saab</option>
                      <option value="opel">Opel</option>
                      <option value="audi">Audi</option>
                    </select>
                    <svg
                      className="absolute right-[14px] top-[14px]"
                      width="12"
                      height="11"
                      viewBox="0 0 12 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.2"
                        d="M7.64399 9.62711C6.84862 10.7751 5.15138 10.7751 4.35601 9.62711L0.380525 3.88899C-0.538433 2.56259 0.410876 0.750001 2.02452 0.750001L9.97548 0.750001C11.5891 0.750002 12.5384 2.56259 11.6195 3.88899L7.64399 9.62711Z"
                        fill="#2C3E50"
                      />
                    </svg>
                  </div>
                  <a
                    onClick={handleClear}
                    className="ml-5 color-black font-medium text-sm underline cursor-pointer"
                  >
                    Clear
                  </a>
                </div>
              </div>

              <Table
                data={documentList}
                mode="documentRequestListing"
                pagination={query}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
                onLimitChange={onLimitChange}
                onAction={handleAction}
              />
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Create New Document Request
              </h4>
              {/* <button
                onClick={() => setActiveTab("tab4")}
                className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
              >
                Prefill Data
              </button> */}
            </div>
            <div className="border border-customGray rounded-[20px] p-5 ">
              <form action="" onSubmit={handleCreateRequest}>
                <div className="w-full mb-5">
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Request Document Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter document request title"
                    className="w-full border border-[#eaeaea] rounded-[10px] px-3 py-2 text-sm"
                    required
                  />
                </div>
                {/* Replace the existing client selection section */}
                <div className="w-full mb-5">
                  <label className="mb-2 block font-medium text-sm">
                    Client*
                  </label>

                  {/* Dropdown for adding clients */}
                  <div className="relative mb-3">
                    <select
                      value=""
                      onChange={(e) => {
                        const clientId = e.target.value;
                        if (clientId && !formData.clientId.includes(clientId)) {
                          setFormData((prev) => ({
                            ...prev,
                            clientId: [...prev.clientId, clientId],
                          }));
                        }
                      }}
                      className="border border-[#eaeaea] rounded-[10px] py-2 px-4 w-full"
                    >
                      <option value="">Select a client to add...</option>
                      {(clientListing || [])
                        .filter(
                          (client) =>
                            !formData.clientId.includes(client?.clientId)
                        )
                        .map((client) => (
                          <option key={client.clientId} value={client.clientId}>
                            {client?.clientName} (Associated to:{" "}
                            {client?.staff?.staffName})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Selected clients display */}
                  {formData.clientId.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Selected Clients:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.clientId.map((clientId) => {
                          const client = clientListing.find(
                            (c) => c.clientId === clientId
                          );
                          return (
                            <div
                              key={clientId}
                              className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                            >
                              <span className="text-sm font-medium text-blue-800">
                                {client?.clientName}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    clientId: prev.clientId.filter(
                                      (id) => id !== clientId
                                    ),
                                  }));
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-5 mb-5">
                  {/* Replace the existing grid with category and document selection */}
                  <div className="mb-5">
                    {/* Document Types Selection Header */}
                    <div className="w-full mb-4">
                      <label className="mb-3 block font-medium text-sm text-gray-700">
                        Select Document Types*
                      </label>

                      {/* Document Type Selection Dropdown */}
                      <div className="relative mb-4">
                        <div
                          className="border border-[#eaeaea] rounded-[10px] py-3 px-4 w-full bg-white cursor-pointer flex items-center justify-between"
                          onClick={() =>
                            setShowCategoryDropdown(!showCategoryDropdown)
                          }
                        >
                          <span className="text-gray-500">
                            + Add Document Type...
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              showCategoryDropdown ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {/* Scrollable dropdown */}
                        {showCategoryDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {catogaryListing
                              .filter(
                                (category) =>
                                  !formData.categoryId.includes(category._id)
                              )
                              .map((category) => (
                                <div
                                  key={category._id}
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      categoryId: [
                                        ...prev.categoryId,
                                        category._id,
                                      ],
                                    }));
                                    handleCategoryChange(category._id);
                                    setShowCategoryDropdown(false);
                                  }}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  {category.name}
                                </div>
                              ))}
                            {catogaryListing.filter(
                              (category) =>
                                !formData.categoryId.includes(category._id)
                            ).length === 0 && (
                              <div className="px-4 py-3 text-gray-500 text-sm">
                                All categories selected
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Selected Document Types with Their Subcategories */}
                    {formData.categoryId.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700 mb-4">
                          Selected Document Types & Documents:
                        </p>

                        {formData.categoryId.map((categoryId) => {
                          const category = catogaryListing.find(
                            (c) => c._id === categoryId
                          );

                          const categorySubcategories =
                            formData?.documentId?.filter((docId) => {
                              const subCategory = subDocumentListing.find(
                                (sub) => sub._id === docId
                              );
                              return (
                                subCategory &&
                                subCategory.parentCategoryId === categoryId
                              );
                            });

                          return (
                            <div
                              key={categoryId}
                              className="border-2 border-blue-100 rounded-xl p-5 bg-[#fafafa] from-blue-50 to-indigo-50 shadow-sm"
                            >
                              {/* Category Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <h4 className="font-semibold text-gray-800 text-lg">
                                    {category?.name}
                                  </h4>
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                    {categorySubcategories.length} documents
                                    selected
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {/* <button
                                    type="button"
                                    onClick={() => {
                                      setCurrentCategory(category);
                                      setIsAddSubcategoryModalOpen(true);
                                    }}
                                    aria-label="Add document"
                                    title="Add document"
                                    className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <path d="M14 2v6h6" />
                                      <path d="M12 12v6" />
                                      <path d="M9 15h6" />
                                    </svg>
                                  </button> */}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Remove category and its subcategories
                                      const subcatsToRemove = subDocumentListing
                                        .filter((sub) =>
                                          categorySubcategories.includes(
                                            sub._id
                                          )
                                        )
                                        .map((sub) => sub._id);

                                      setFormData((prev) => ({
                                        ...prev,
                                        categoryId: prev.categoryId.filter(
                                          (id) => id !== categoryId
                                        ),
                                        documentId: prev.documentId.filter(
                                          (id) => !subcatsToRemove.includes(id)
                                        ),
                                        subcategoryPriorities:
                                          prev.subcategoryPriorities.filter(
                                            (item) =>
                                              !subcatsToRemove.includes(
                                                item.subCategoryId
                                              )
                                          ),
                                      }));
                                    }}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200"
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                    Remove Type
                                  </button>
                                </div>
                              </div>

                              {/* Subcategory Selection Dropdown - FIXED */}
                              <div className="mb-4">
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const subCategoryId = e.target.value;
                                    if (
                                      subCategoryId &&
                                      !formData.documentId.includes(
                                        subCategoryId
                                      )
                                    ) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        documentId: [
                                          ...prev.documentId,
                                          subCategoryId,
                                        ],
                                        subcategoryPriorities: [
                                          ...prev.subcategoryPriorities,
                                          { subCategoryId, priority: "medium" },
                                        ],
                                      }));
                                    }
                                  }}
                                  className="border border-gray-300 rounded-lg py-2 px-4 w-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">+ Add Document...</option>
                                  {subDocumentListing
                                    .filter(
                                      (sub) =>
                                        !formData.documentId.includes(
                                          sub._id
                                        ) && sub.parentCategoryId === categoryId // Only show subcategories for this category
                                    )
                                    .map((subCategory) => (
                                      <option
                                        key={subCategory._id}
                                        value={subCategory._id}
                                      >
                                        {subCategory.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="space-y-3">
                                {categorySubcategories.length > 0 ? (
                                  <>
                                    <h5 className="text-sm font-medium text-gray-600 mb-2">
                                      Selected Documents:
                                    </h5>
                                    {categorySubcategories.map((docId) => {
                                      const subCategory =
                                        subDocumentListing.find(
                                          (sc) => sc._id === docId
                                        );
                                      const priorityIndex =
                                        formData.subcategoryPriorities.findIndex(
                                          (p) => p.subCategoryId === docId
                                        );
                                      const currentPriority =
                                        priorityIndex >= 0
                                          ? formData.subcategoryPriorities[
                                              priorityIndex
                                            ].priority
                                          : "medium";

                                      const priorityColors = {
                                        low: "bg-green-50 border-green-200 text-green-700",
                                        medium:
                                          "bg-yellow-50 border-yellow-200 text-yellow-700",
                                        high: "bg-red-50 border-red-200 text-red-700",
                                      };

                                      const priorityLabels = {
                                        low: "Low Priority",
                                        medium: "Medium Priority",
                                        high: "High Priority",
                                      };

                                      return (
                                        <div
                                          key={docId}
                                          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                          <div className="flex items-center space-x-4 flex-1">
                                            {/* Document Icon */}
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                              <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-blue-600"
                                              >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14,2 14,8 20,8" />
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                />
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                />
                                                <polyline points="10,9 9,9 8,9" />
                                              </svg>
                                            </div>

                                            {/* Document Name */}
                                            <div className="flex-1">
                                              <span className="text-sm font-medium text-gray-800">
                                                {subCategory?.name}
                                              </span>
                                            </div>

                                            {/* Priority Selection */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs text-gray-500">
                                                Priority:
                                              </span>
                                              <select
                                                value={currentPriority}
                                                onChange={(e) => {
                                                  const newPriorities = [
                                                    ...formData.subcategoryPriorities,
                                                  ];
                                                  if (priorityIndex >= 0) {
                                                    newPriorities[
                                                      priorityIndex
                                                    ].priority = e.target.value;
                                                  } else {
                                                    newPriorities.push({
                                                      subCategoryId: docId,
                                                      priority: e.target.value,
                                                    });
                                                  }
                                                  setFormData((prev) => ({
                                                    ...prev,
                                                    subcategoryPriorities:
                                                      newPriorities,
                                                  }));
                                                }}
                                                className={`border rounded-lg px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${priorityColors[currentPriority]}`}
                                              >
                                                <option value="low">Low</option>
                                                <option value="medium">
                                                  Medium
                                                </option>
                                                <option value="high">
                                                  High
                                                </option>
                                              </select>
                                            </div>
                                          </div>

                                          {/* Remove Button */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setFormData((prev) => ({
                                                ...prev,
                                                documentId:
                                                  prev.documentId.filter(
                                                    (id) => id !== docId
                                                  ),
                                                subcategoryPriorities:
                                                  prev.subcategoryPriorities.filter(
                                                    (item) =>
                                                      item.subCategoryId !==
                                                      docId
                                                  ),
                                              }));
                                            }}
                                            className="ml-3 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                            >
                                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <svg
                                      width="48"
                                      height="48"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                      className="mx-auto mb-2 text-gray-300"
                                    >
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                      <polyline points="14,2 14,8 20,8" />
                                      <line x1="16" y1="13" x2="8" y2="13" />
                                      <line x1="16" y1="17" x2="8" y2="17" />
                                      <polyline points="10,9 9,9 8,9" />
                                    </svg>
                                    <p className="text-sm">
                                      No documents selected for this type
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Use the dropdown above to add documents
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Add other Documents (eg. Insurance, Petant document, ...)
                  </label>
                  <textarea
                    className="w-full border border-[#eaeaea] bg-[#FAFAFA] text-[#484848] p-3 rounded-[10px] font-normal text-[12px] leading-[100%] tracking-[0] capitalize focus:outline-none h-[60px] resize-none"
                    rows="2"
                    placeholder="Add Other Documents  seperated by ‘Comma’"
                  />
                </div> */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="mb-5">
                    <label className="block text-[#484848] text-sm font-medium mb-2">
                      Instructions & Requirements
                    </label>
                    <textarea
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instructions: e.target.value,
                        }))
                      }
                      className="w-full border border-[#eaeaea]  text-[#484848] p-3 rounded-[10px] font-normal text-[12px] leading-[100%] tracking-[0] capitalize focus:outline-dark h-[45px] resize-none"
                      rows="2"
                      placeholder="Add instructions..."
                    />
                  </div>
                  <div className="w-full">
                    <label
                      for="fname"
                      className="block mb-2 font-medium text-sm"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full py-2 px-4 border border-[#eaeaea] rounded-[10px] text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Notify Method*
                  </label>
                  <div className="flex gap-5 text-sm text-[#484848]">
                    {["email", "sms", "portal"].map((method) => (
                      <label key={method} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.notifyMethods.includes(method)}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...formData.notifyMethods, method]
                              : formData.notifyMethods.filter(
                                  (m) => m !== method
                                );
                            setFormData((prev) => ({
                              ...prev,
                              notifyMethods: newMethods,
                            }));
                          }}
                          className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
            checked:bg-[#20BF55] checked:border-[#20BF55]
            checked:after:content-['✓'] checked:after:text-white 
            checked:after:text-[12px] checked:after:font-bold 
            checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                        />
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Schedule Reminder
                  </label>
                  <div className="flex items-center gap-2   text-sm text-[#484848]">
                    <input
                      type="checkbox"
                      checked={isScheduleEnabled}
                      onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                      className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative
                checked:bg-[#20BF55] checked:border-[#20BF55]
                checked:after:content-['✓'] checked:after:text-white
                checked:after:text-[12px] checked:after:font-bold
                checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]
              "
                    />
                    Enable Schedule Reminder
                  </div>
                </div>

                {isScheduleEnabled && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="schedulerCheckbox"
                        checked={isScheduleEnabled}
                        onChange={handleSchedulerToggle}
                        className="w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px]"
                      />
                      <label
                        htmlFor="schedulerCheckbox"
                        className="block text-[#484848] text-sm font-medium mb-0"
                      >
                        Configure Reminder Schedule
                      </label>
                    </div>

                    {isScheduleEnabled && (
                      <div className="p-4 bg-white rounded-lg shadow-md">
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Set Time
                          </label>
                          <input
                            type="time"
                            value={customDateTime}
                            onChange={(e) => setCustomDateTime(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Frequency
                          </label>
                          <select
                            value={frequency}
                            onChange={handleFrequencyChange}
                            className="w-full border px-3 py-2 rounded"
                          >
                            <option value="Weekly">Weekly</option>
                            <option value="Daily">Daily</option>
                          </select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {days.map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`px-3 py-1 rounded border ${
                                  selectedDays.includes(day)
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300"
                                } ${
                                  frequency === "Weekly" &&
                                  selectedDays.length > 0 &&
                                  !selectedDays.includes(day)
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={
                                  frequency === "Weekly" &&
                                  selectedDays.length > 0 &&
                                  !selectedDays.includes(day)
                                }
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Scheduler Notify Methods*
                          </label>
                          <div className="flex flex-wrap gap-4">
                            {["email", "sms", "portal"].map((method) => (
                              <label
                                key={method}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={linkMethods.includes(method)}
                                  onChange={() => {
                                    const newMethods = linkMethods.includes(
                                      method
                                    )
                                      ? linkMethods.filter((m) => m !== method)
                                      : [...linkMethods, method];
                                    setLinkMethod(newMethods);
                                  }}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                {method.charAt(0).toUpperCase() +
                                  method.slice(1)}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2.5">
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    disabled={saveLoading}
                    className="rounded-[10px] py-2 px-6 text-primaryBlue border-1 border-primaryBlue cursor-pointer disabled:opacity-50"
                  >
                    {saveLoading ? "Saving..." : "Save as Template"}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Request..."
                      : "Generate Secure Link & Send Request"}
                  </button>
                </div>
              </form>
            </div>
            {/* locopoco */}
            <AddCustomSubcat
              isOpen={isAddSubcategoryModalOpen}
              onClose={() => setIsAddSubcategoryModalOpen(false)}
              onSubmit={handleAddNewSubcategory}
              categoryName={currentCategory ? currentCategory.name : "Category"}
            />
            {isSuccessModalOpen && (
              <SuccessrequestModal
                onClose={() => {
                  setIsSuccessModalOpen(false);
                }}
                title={"Document request created successfully"}
              />
            )}
          </div>
        )}

        {activeTab === "tab3" && (
          <div>
            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query.search}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        search: e.target.value,
                        page: 1,
                      }))
                    }
                    className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
                  />
                </div>
                <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
                  <div className="relative">
                    <select
                      name="cars"
                      id="cars"
                      className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                    >
                      <option value="volvo">Newest First</option>
                      <option value="saab">Saab</option>
                      <option value="opel">Opel</option>
                      <option value="audi">Audi</option>
                    </select>
                    <svg
                      className="absolute right-[14px] top-[14px]"
                      width="12"
                      height="11"
                      viewBox="0 0 12 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.2"
                        d="M7.64399 9.62711C6.84862 10.7751 5.15138 10.7751 4.35601 9.62711L0.380525 3.88899C-0.538433 2.56259 0.410876 0.750001 2.02452 0.750001L9.97548 0.750001C11.5891 0.750002 12.5384 2.56259 11.6195 3.88899L7.64399 9.62711Z"
                        fill="#2C3E50"
                      />
                    </svg>
                  </div>
                  <a
                    onClick={handleClear}
                    className="ml-5 color-black font-medium text-sm underline cursor-pointer"
                  >
                    Clear
                  </a>
                </div>
              </div>

              <Table
                data={secureLink || []}
                mode="secureDocumentListing"
                pagination={query}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
                onLimitChange={onLimitChange}
                onAction={handleAction}
              />
            </div>
          </div>
        )}

        {activeTab === "tab4" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-[30px] mb-[30px] gap-2 sm:gap[7px]">
              <h4 className="color-black text-lg font-semibold">
                Manage Document Templates
              </h4>
            </div>

            <div className="border border-customGray rounded-[20px] p-5">
              {templateList.length > 0 ? (
                templateList.map((template) => (
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
                            setSelectedTemplate(template);
                            handleUseTemplate(template);
                          }}
                        >
                          Use Template !
                        </button>
                        {/* <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-1"
                          title="Edit Template"
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
                        </button> */}
                      </div>
                    </div>

                    <div>
                      <p
                        dangerouslySetInnerHTML={{ __html: template.message }}
                        className="mb-2 font-normal text-[16px] leading-[100%] tracking-[0%] text-[#2C3E50]"
                      />
                      <p className="sr-only">
                        {getPlainText(template.message)}
                      </p>
                    </div>

                    <p className="text-[#2C3E50] font-normal text-[14px] leading-[100%] tracking-[0%] opacity-[0.6]">
                      Created:{" "}
                      {new Date(template.createdAt).toLocaleDateString()} |
                      Used: {template.usedCount || 0} times
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-4">No templates found</p>
                </div>
              )}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center mt-5">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DocReqManagement;
