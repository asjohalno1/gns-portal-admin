import React, { useEffect, useState } from "react";
import Table from "../../Table/table";
import {
  deleteStaffApi,
  getAllStaffListingApi,
  updateStaffApi,
} from "../../../api/staffManagement.api";
import ViewStaff from "../ActionsModals/ViewStaff";
import DeleteConfirmationModal from "../../DeleteComfermationModal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import EditStaffModal from "../ActionsModals/EditStaffModal";

const StafListing = () => {
  const [staffData, setStaffData] = useState({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  });
  const [viewStaffModal, setViewStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAllStaffList = async (page = 1, limit = 10) => {
    try {
      let res = await getAllStaffListingApi(page, limit);
      if (res.success) {
        setStaffData({
          data: res.data,
          pagination: res.pagination,
        });
      }
    } catch (error) {
      console.error("Error fetching all staff list:", error);
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchAllStaffList();
  }, []);

  const handlePageChange = (newPage) => {
    fetchAllStaffList(newPage, staffData.pagination.limit);
  };

  const handleLimitChange = (newLimit) => {
    fetchAllStaffList(1, newLimit);
  };

  const handleNextPage = () => {
    if (staffData.pagination.page < staffData.pagination.totalPages) {
      handlePageChange(staffData.pagination.page + 1);
    }
  };

  const handlePrevPage = () => {
    if (staffData.pagination.page > 1) {
      handlePageChange(staffData.pagination.page - 1);
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      setLoading(true);
      const res = await deleteStaffApi(selectedStaff._id);

      if (res.success) {
        toast.success(res.message || "Staff deleted successfully");
        // Refresh the current page after deletion
        fetchAllStaffList(
          staffData.pagination.page,
          staffData.pagination.limit
        );
        setDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete staff");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting staff");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStaffApi = async (formData) => {
    try {
      if (!selectedStaff) return;

      const id = selectedStaff._id;
      const response = await updateStaffApi(id, formData);

      if (response.data.success) {
        toast.success(response.message);
        // Refresh the current page after update
        fetchAllStaffList(
          staffData.pagination.page,
          staffData.pagination.limit
        );
        setEditModalOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    }
  };

  const handleActionClick = (action, staff) => {
    switch (action) {
      case "edit":
        setSelectedStaff(staff);
        setEditModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        setSelectedStaff(staff);
        break;
      case "view":
        setViewStaffModal(true);
        setSelectedStaff(staff);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  return (
    <>
      <div className="">
        <Table
          data={staffData.data}
          pagination={staffData.pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          mode="staffListing"
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onAction={handleActionClick}
        />
      </div>

      <ViewStaff
        isOpen={viewStaffModal}
        onClose={() => {
          setViewStaffModal(false);
        }}
        staff={selectedStaff || {}}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteStaff}
        loading={loading}
      />

      <EditStaffModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        staff={selectedStaff}
        onUpdate={handleUpdateStaffApi}
      />
    </>
  );
};

export default StafListing;
