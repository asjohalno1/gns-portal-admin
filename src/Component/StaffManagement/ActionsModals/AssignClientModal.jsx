import React, { useState } from "react";

const AssignClientModal = ({
  isOpen,
  onClose,
  clientData,
  onAssign,
  staffList,
}) => {
  const [selectedStaff, setSelectedStaff] = useState("");

  if (!isOpen) return null;

  const handleAssignClick = () => {
    onAssign(clientData._id, selectedStaff);
    setSelectedStaff("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Client Details</h2>

        {/* Client Info */}
        <div className="mb-6">
          <p className="mb-2">
            <strong>Full Name:</strong> {clientData?.fullName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {clientData?.email}
          </p>
          <p className="mb-2">
            <strong>Phone:</strong> {clientData?.phoneNumber}
          </p>
        </div>

        {/* Assign Staff Dropdown */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Assign Staff:</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select staff</option>
            {staffList.map((staff) => (
              <option
                className="text-gray-700"
                key={staff._id}
                value={staff._id}
              >
                {staff.first_name} {staff.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignClientModal;
