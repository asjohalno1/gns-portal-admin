import React, { useEffect, useState } from "react";
import Table from "../../Table/table";
import { getAllStaffListingApi } from "../../../api/staffManagement.api";
import ViewStaff from "../ActionsModals/ViewStaff";

const StafListing = () => {
  const [staffList, setStaffList] = useState([]);
  const [viewStaffModal, setViewStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchAllStaffList = async () => {
    try {
      let res = await getAllStaffListingApi();
      if (res.success) {
        setStaffList(res.data);
      }
    } catch (error) {
      console.error("Error fetching all staff list:", error);
    }
  };

  useEffect(() => {
    fetchAllStaffList();
  }, []);

  const handleActionClick = (action, staff) => {
    switch (action) {
      case "edit":
        console.log("Edit staff:", staff);
        break;
      case "delete":
        console.log("Delete staff:", staff);
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
          data={staffList || []}
          mode="staffListing"
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
    </>
  );
};

export default StafListing;
