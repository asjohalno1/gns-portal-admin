import React, { use, useEffect, useState } from "react";
import Table from "../../Table/table";
import { toast } from "react-toastify";
import AssignClientModal from "../ActionsModals/AssignClientModal";
import {
  assignStaffToClientApi,
  getAllUnassignedClientsApi,
  mapClientApi,
} from "../../../api/staffManagement.api";
import { getAllStaff } from "../../../api/dashboard.api";
import MapClientModal from "../ActionsModals/MapClientModal";

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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [viewAssignToClientModal, setViewAssignToClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isMapClientModalOpen, setIsMapClientModalOpen] = useState(false);

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

  const handleAssignToClient = async (clientId, staffId) => {
    try {
      const payload = { clientId, staffId };
      let response = await assignStaffToClientApi(payload);

      if (response.success) {
        toast.success("Client assigned successfully");
        fetchAllClients(
          unassignedClients.pagination.page,
          unassignedClients.pagination.limit,
          search,
          status
        );
      } else {
        toast.error(response.message || "Failed to assign client");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign client");
    }
  };

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
      case "assign":
        setViewAssignToClientModal(true);
        setSelectedClient(client);
        break;
      case "mapping":
        setSelectedClient(client);
        setIsMapClientModalOpen(true);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleMapingClient = async (clientId) => {
    try {
      let res = await mapClientApi(clientId);
      if (res.success) {
        toast.success("Client mapped successfully");
        fetchAllClients();
      } else {
        toast.error(res.message || "Failed to map client");
      }
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="px-4 py-2 border rounded-md"
          value={search}
          onChange={handleSearchChange}
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

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

      <AssignClientModal
        isOpen={viewAssignToClientModal}
        onClose={() => {
          setViewAssignToClientModal(false);
          setSelectedClient(null);
        }}
        staffList={staffMembers}
        clientData={selectedClient}
        onAssign={handleAssignToClient}
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

export default AssignToClients;
