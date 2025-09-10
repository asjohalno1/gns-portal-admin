import React, { use, useEffect, useState } from "react";
import Table from "../../Table/table";
import { toast } from "react-toastify";
import {
  assignAndMapClientApi,
  assignStaffToClientApi,
  getAllUnassignedClientsApi,
  mapClientApi,
} from "../../../api/staffManagement.api";
import { getAllStaff } from "../../../api/dashboard.api";
import Loader from "../../Loader/Loader";
import { useToast } from "../../../CommonPages/customtoast/CustomToaster";
import AssignAndMapClientModal from "../ActionsModals/AssignAndMapClientModal";

const AssignToClients = () => {
  const [unassignedClients, setUnassignedClients] = useState({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  });
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [assignaMapModalOpen, setAssignaMapModalOpen] = useState(false);

  const fetchAllClients = async (
    page = 1,
    limit = 10,
    searchTerm = "",
    statusFilter = "all"
  ) => {
    try {
      setLoading(true);
      const query = {
        page,
        limit,
        search: searchTerm,
        status: statusFilter,
      };
      const res = await getAllUnassignedClientsApi(query);

      if (res.success) {
        setUnassignedClients({
          data: res.data.clients || [],
          pagination: {
            total: res.data.totalClients || 0,
            page: res.data.currentPage || 1,
            limit: res.data.limit || 10,
            totalPages: res.data.totalPages || 1,
          },
        });
      } else {
        toast.error(res.message || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error(error.response?.data?.message || "Failed to fetch clients");
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
    fetchAllStaff();
  }, []);

  useEffect(() => {
    fetchAllClients(
      unassignedClients.pagination.page,
      unassignedClients.pagination.limit,
      search,
      status
    );
  }, [search, status]);

  const handlePageChange = (newPage) => {
    fetchAllClients(
      newPage,
      unassignedClients.pagination.limit,
      search,
      status
    );
  };

  const handleLimitChange = (newLimit) => {
    fetchAllClients(1, newLimit, search, status);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Reset to first page when searching
    fetchAllClients(
      1,
      unassignedClients.pagination.limit,
      e.target.value,
      status
    );
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    // Reset to first page when changing status
    fetchAllClients(
      1,
      unassignedClients.pagination.limit,
      search,
      e.target.value
    );
  };

  const handleNextPage = () => {
    if (
      unassignedClients.pagination.page <
      unassignedClients.pagination.totalPages
    ) {
      handlePageChange(unassignedClients.pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (unassignedClients.pagination.page > 1) {
      handlePageChange(unassignedClients.pagination.page - 1);
    }
  };

  const handleActionClick = (action, client) => {
    switch (action) {
      case "assignAndMap":
        setSelectedClient(client);
        setAssignaMapModalOpen(true);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleAssignAndMapClient = async (clientId, staffId) => {
    try {
      let response = await assignAndMapClientApi(clientId, staffId);
      if (response.success) {
        addToast("Client assigned and mapped successfully", "success");
        setAssignaMapModalOpen(false);
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to assign and map client",
        "error"
      );
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search client or email"
          className="px-3 py-1 border border-gray-300 rounded-md"
          value={search}
          onChange={handleSearchChange}
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-3 py-1 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Table
          data={unassignedClients.data}
          pagination={unassignedClients.pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          mode="unassignedClients"
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onAction={handleActionClick}
          loading={loading}
        />
      )}

      <AssignAndMapClientModal
        isOpen={assignaMapModalOpen}
        onClose={() => setAssignaMapModalOpen(false)}
        clientData={selectedClient}
        onAssignAndMap={handleAssignAndMapClient}
        staffList={staffMembers}
      />
    </div>
  );
};

export default AssignToClients;
