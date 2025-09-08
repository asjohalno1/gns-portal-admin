import React, { useEffect, useState, useCallback } from "react";
import Table from "../Component/Table/table";
import ImportBulkModal from "./importbulkmodal";
import AddClientmodal from "./addClientmodal";
import {
  deleteClient,
  getAllClients,
  getAllStaff,
  getStaffClient,
} from "../api/dashboard.api";
import ClientDetailsModal from "../Component/ClientModals/ClientDetailsModal";
import EditClientmodal from "../Component/ClientModals/editClientModal";
import DeleteConfirmationModal from "../Component/DeleteComfermationModal/DeleteConfirmationModal";
import {
  assignStaffToClientApi,
  getAllUnassignedClientsApi,
  mapClientApi,
} from "../api/staffManagement.api";
import AssignClientModal from "../Component/StaffManagement/ActionsModals/AssignClientModal";
import { toast } from "react-toastify";
import MapClientModal from "../Component/StaffManagement/ActionsModals/MapClientModal";

const ClientManagement = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isImportBulkOpen, setIsImportBulkOpen] = useState(false);
  const [clientDetailsModal, setClientDetailsModal] = useState(false);
  const [clientEditModal, setClientEditModal] = useState(false);
  const [clientInfo, setClientInfo] = useState();
  const [staffMembers, setStaffMembers] = useState([]);
  const [tab1LimitDebounce, setTab1LimitDebounce] = useState(null);
  const [tab2LimitDebounce, setTab2LimitDebounce] = useState(null);

  // Separate filters and pagination for each tab
  const [tab1Filters, setTab1Filters] = useState({
    search: "",
    status: "all",
  });
  const [tab1Pagination, setTab1Pagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    limit: 10,
  });

  const [tab2Filters, setTab2Filters] = useState({
    search: "",
    status: "all",
  });
  const [tab2Pagination, setTab2Pagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    limit: 10,
  });

  const [clientsList, setClientsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [unAssignedClientsList, setUnAssignedClientsList] = useState([]);
  const [isAssignToClientModalOpen, setIsAssignToClientModalOpen] =
    useState(false);
  const [isMapClientModalOpen, setIsMapClientModalOpen] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const query = {
        pageNumber: tab1Pagination.currentPage,
        limit: tab1Pagination.limit,
        search: tab1Filters.search, // Using search key instead of name/email
        status: tab1Filters.status,
      };

      const response = await getAllClients(query);
      setClientsList(response?.data.clients);
      const { clients, totalPages, totalClients } = response.data;
      setClientsList(clients);
      setTab1Pagination((prev) => ({
        ...prev,
        totalPages,
        totalClients,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedClients = async () => {
    const query = {
      page: tab2Pagination.currentPage, // Note: API uses 'page' instead of 'pageNumber'
      limit: tab2Pagination.limit,
      search: tab2Filters.search, // Using search key
      status: tab2Filters.status,
    };

    try {
      setLoading(true);
      const response = await getAllUnassignedClientsApi(query);
      setUnAssignedClientsList(response?.data.clients);
      const { clients, totalPages, totalClients } = response.data;
      setUnAssignedClientsList(clients);
      setTab2Pagination((prev) => ({
        ...prev,
        totalPages,
        totalClients,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStaff = async () => {
    try {
      let res = await getAllStaff();
      setStaffMembers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tab2") {
      fetchUnassignedClients();
      fetchAllStaff();
    }
  }, [activeTab]);

  // Separate useEffects for each tab
  useEffect(() => {
    if (activeTab === "tab1") {
      fetchClients();
    }
  }, [
    tab1Filters,
    tab1Pagination.currentPage,
    tab1Pagination.limit,
    activeTab,
    clientEditModal === false,
  ]);

  useEffect(() => {
    if (activeTab === "tab2") {
      fetchUnassignedClients();
    }
  }, [tab2Filters, tab2Pagination.currentPage, tab2Pagination.limit]);

  useEffect(() => {
    return () => {
      if (tab1LimitDebounce) clearTimeout(tab1LimitDebounce);
      if (tab2LimitDebounce) clearTimeout(tab2LimitDebounce);
    };
  }, [tab1LimitDebounce, tab2LimitDebounce]);

  // Tab 1 handlers
  const handleTab1FilterChange = (e) => {
    const { name, value } = e.target;
    setTab1Filters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTab1Pagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTab1Search = (e) => {
    handleTab1FilterChange(e);
  };

  const handleTab1StatusChange = (e) => {
    handleTab1FilterChange(e);
  };

  const handleTab1ClearFilters = () => {
    setTab1Filters({
      search: "",
      status: "all",
    });
    setTab1Pagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTab1NextPage = () => {
    if (tab1Pagination.currentPage < tab1Pagination.totalPages) {
      setTab1Pagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const handleTab1PrevPage = () => {
    if (tab1Pagination.currentPage > 1) {
      setTab1Pagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const handleTab1PageChange = (newPage) => {
    setTab1Pagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleTab1LimitChange = useCallback(
    (newLimit) => {
      // Clear existing timeout
      if (tab1LimitDebounce) {
        clearTimeout(tab1LimitDebounce);
      }

      // Set new timeout
      const timeoutId = setTimeout(() => {
        setTab1Pagination((prev) => ({
          ...prev,
          limit: newLimit,
          currentPage: 1,
        }));
      }, 500); // 500ms delay

      setTab1LimitDebounce(timeoutId);
    },
    [tab1LimitDebounce]
  );

  // Tab 2 handlers
  const handleTab2FilterChange = (e) => {
    const { name, value } = e.target;
    setTab2Filters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTab2Pagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTab2Search = (e) => {
    handleTab2FilterChange(e);
  };

  const handleTab2StatusChange = (e) => {
    handleTab2FilterChange(e);
  };

  const handleTab2ClearFilters = () => {
    setTab2Filters({
      search: "",
      status: "all",
    });
    setTab2Pagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTab2NextPage = () => {
    if (tab2Pagination.currentPage < tab2Pagination.totalPages) {
      setTab2Pagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const handleTab2PrevPage = () => {
    if (tab2Pagination.currentPage > 1) {
      setTab2Pagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const handleTab2PageChange = (newPage) => {
    setTab2Pagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleTab2LimitChange = useCallback(
    (newLimit) => {
      if (tab2LimitDebounce) {
        clearTimeout(tab2LimitDebounce);
      }
      const timeoutId = setTimeout(() => {
        setTab2Pagination((prev) => ({
          ...prev,
          limit: newLimit,
          currentPage: 1,
        }));
      }, 500);

      setTab2LimitDebounce(timeoutId);
    },
    [tab2LimitDebounce]
  );

  const handleModalAction = async (type, client) => {
    if (client?._id) {
      try {
        const response = await getStaffClient(client?._id);
        if (response.success == true) {
          setClientInfo(response?.data);
        }
      } catch (err) {
        console.error("Error fetching staff members:", err);
      }
    }
    switch (type) {
      case "view":
        setClientDetailsModal(true);
        break;
      case "update":
        setSelectedClient(client);
        setClientEditModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        setSelectedClient(client);
        break;
    }
  };

  const handleDeleteSuccess = () => {
    try {
      let res = deleteClient(selectedClient._id);
      if (res) {
        toast.success("Client deleted successfully");
        setShowDeleteModal(false);
        setSelectedClient(null);
        fetchClients();
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleActionUnassignedClient = (type, client) => {
    switch (type) {
      case "assign":
        setSelectedClient(client);
        setIsAssignToClientModalOpen(true);
        break;
      case "mapping":
        setSelectedClient(client);
        setIsMapClientModalOpen(true);
        break;
      default:
        console.warn("Unknown action:", type);
    }
  };

  const handleAssignedStaffToClient = async (clientId, staffId) => {
    try {
      const payload = { clientId, staffId };
      let response = await assignStaffToClientApi(payload);

      if (response.success) {
        toast.success("Staff assigned successfully");
        fetchUnassignedClients();
      } else {
        toast.error(response.message || "Failed to assign client");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign client");
    }
  };

  const handleMapingClient = async (clientId, email) => {
    try {
      // if (!email.toLowerCase().endsWith("@gmail.com")) {
      //   toast.error("Only Gmail addresses are allowed!");
      //   return;
      // }
      let res = await mapClientApi(clientId);
      if (res.success) {
        toast.success("Client mapped successfully");
        fetchUnassignedClients();
        fetchClients();
      } else {
        toast.error(res.message || "Failed to map client");
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
          Manage Clients
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab2"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab2")}
        >
          Client Mapping
        </button>
      </div>
      <div className=" border-t-0 border-gray-300 rounded-b-md">
        {activeTab === "tab1" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Client Records
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddClientOpen(true)}
                  type="button"
                  className="rounded-[10px] py-2 px-6 text-primaryBlue border-1 border-primaryBlue cursor-pointer"
                >
                  Add Client
                </button>
                <AddClientmodal
                  isOpen={isAddClientOpen}
                  onClose={() => {
                    setIsAddClientOpen(false);
                    fetchClients();
                  }}
                  title="Add Client"
                />
                <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsImportBulkOpen(true)}
                >
                  Bulk Import
                </button>
                <ImportBulkModal
                  isOpen={isImportBulkOpen}
                  onClose={() => setIsImportBulkOpen(false)}
                  title="Bulk Import"
                />
              </div>
            </div>

            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    name="search"
                    value={tab1Filters.search}
                    onChange={handleTab1Search}
                    placeholder="Search by name, email or status"
                    className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
                  />
                  <svg
                    className="absolute top-4 left-4"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 13L9 9M1 5.66667C1 6.2795 1.12071 6.88634 1.35523 7.45252C1.58975 8.01871 1.93349 8.53316 2.36683 8.9665C2.80018 9.39984 3.31462 9.74358 3.88081 9.97811C4.447 10.2126 5.05383 10.3333 5.66667 10.3333C6.2795 10.3333 6.88634 10.2126 7.45252 9.97811C8.01871 9.74358 8.53316 9.39984 8.9665 8.9665C9.39984 8.53316 9.74358 8.01871 9.97811 7.45252C10.2126 6.88634 10.3333 6.2795 10.3333 5.66667C10.3333 5.05383 10.2126 4.447 9.97811 3.88081C9.74358 3.31462 9.39984 2.80018 8.9665 2.36683C8.53316 1.93349 8.01871 1.58975 7.45252 1.35523C6.88634 1.12071 6.2795 1 5.66667 1C5.05383 1 4.447 1.12071 3.88081 1.35523C3.31462 1.58975 2.80018 1.93349 2.36683 2.36683C1.93349 2.80018 1.58975 3.31462 1.35523 3.88081C1.12071 4.447 1 5.05383 1 5.66667Z"
                      stroke="#8F95A2"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
                  <div className="relative">
                    <select
                      name="status"
                      value={tab1Filters.status}
                      onChange={handleTab1StatusChange}
                      className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                    >
                      <option value="all">All</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
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
                  <button
                    onClick={handleTab1ClearFilters}
                    className="ml-5 color-black font-medium text-sm underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
                </div>
              ) : (
                <Table
                  data={clientsList}
                  pagination={{
                    page: tab1Pagination.currentPage,
                    totalPages: tab1Pagination.totalPages,
                    total: tab1Pagination.totalClients,
                    limit: tab1Pagination.limit,
                  }}
                  onPageChange={handleTab1PageChange}
                  onLimitChange={handleTab1LimitChange}
                  onNextPage={handleTab1NextPage}
                  onPrevPage={handleTab1PrevPage}
                  onAction={handleModalAction}
                  mode="clientsListing"
                />
              )}
            </div>

            <ClientDetailsModal
              isOpen={clientDetailsModal}
              onClose={() => setClientDetailsModal(false)}
              data={clientInfo}
            />
            <EditClientmodal
              isOpen={clientEditModal}
              onClose={() => setClientEditModal(false)}
              clientData={clientInfo}
            />

            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              clientData={selectedClient}
              onConfirm={handleDeleteSuccess}
            />
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Manage Client Mapping
              </h4>
            </div>
            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    name="search"
                    value={tab2Filters.search}
                    onChange={handleTab2Search}
                    placeholder="Search by name, email or status"
                    className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
                  />
                  <svg
                    className="absolute top-4 left-4"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 13L9 9M1 5.66667C1 6.2795 1.12071 6.88634 1.35523 7.45252C1.58975 8.01871 1.93349 8.53316 2.36683 8.9665C2.80018 9.39984 3.31462 9.74358 3.88081 9.97811C4.447 10.2126 5.05383 10.3333 5.66667 10.3333C6.2795 10.3333 6.88634 10.2126 7.45252 9.97811C8.01871 9.74358 8.53316 9.39984 8.9665 8.9665C9.39984 8.53316 9.74358 8.01871 9.97811 7.45252C10.2126 6.88634 10.3333 6.2795 10.3333 5.66667C10.3333 5.05383 10.2126 4.447 9.97811 3.88081C9.74358 3.31462 9.39984 2.80018 8.9665 2.36683C8.53316 1.93349 8.01871 1.58975 7.45252 1.35523C6.88634 1.12071 6.2795 1 5.66667 1C5.05383 1 4.447 1.12071 3.88081 1.35523C3.31462 1.58975 2.80018 1.93349 2.36683 2.36683C1.93349 2.80018 1.58975 3.31462 1.35523 3.88081C1.12071 4.447 1 5.05383 1 5.66667Z"
                      stroke="#8F95A2"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
                  <div className="relative">
                    <select
                      name="status"
                      value={tab2Filters.status}
                      onChange={handleTab2StatusChange}
                      className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                    >
                      <option value="all">All</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
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
                  <button
                    onClick={handleTab2ClearFilters}
                    className="ml-5 color-black font-medium text-sm underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
                </div>
              ) : (
                <Table
                  data={unAssignedClientsList}
                  pagination={{
                    page: tab2Pagination.currentPage,
                    totalPages: tab2Pagination.totalPages,
                    total: tab2Pagination.totalClients,
                    limit: tab2Pagination.limit,
                  }}
                  onPageChange={handleTab2PageChange}
                  onLimitChange={handleTab2LimitChange}
                  onNextPage={handleTab2NextPage}
                  onPrevPage={handleTab2PrevPage}
                  onAction={handleActionUnassignedClient}
                  mode="unassignedClients"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <AssignClientModal
        isOpen={isAssignToClientModalOpen}
        onClose={() => setIsAssignToClientModalOpen(false)}
        clientData={selectedClient}
        onAssign={handleAssignedStaffToClient}
        staffList={staffMembers}
      />

      <MapClientModal
        isOpen={isMapClientModalOpen}
        onClose={() => setIsMapClientModalOpen(false)}
        clientData={selectedClient}
        onMap={handleMapingClient}
      />
    </div>
  );
};
export default ClientManagement;
