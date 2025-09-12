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
import Loader from "../../Loader/Loader";
import { useToast } from "../../../CommonPages/customtoast/CustomToaster";

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
  const { addToast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const fetchAllStaffList = async (page = 1, limit = 10) => {
    try {
      setListLoading(true);
      let res = await getAllStaffListingApi(page, limit);
      if (res.success) {
        setStaffData({
          data: res.data,
          pagination: res.pagination,
        });
        setListLoading(false);
      }
    } catch (error) {
      setListLoading(false);
      console.error("Error fetching all staff list:", error);
      toast.error("Failed to fetch staff list");
    } finally {
      setListLoading(false);
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
        addToast("Staff deleted successfully", "success");
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
      if (response.success) {
        addToast("Staff updated successfully", "success");
        fetchAllStaffList(
          staffData.pagination.page,
          staffData.pagination.limit
        );
        setEditModalOpen(false);
      } else {
        // toast.error(response.data.message || "Failed to update staff");
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
      <div className="w-full">
        {listLoading ? (
          <Loader />
        ) : (
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
        )}
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
