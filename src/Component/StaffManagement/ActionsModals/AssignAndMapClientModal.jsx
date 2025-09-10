import React, { useState, useEffect } from "react";

const AssignAndMapClientModal = ({
  isOpen,
  onClose,
  clientData,
  onAssignAndMap,
  staffList,
}) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Reset state when modal opens/closes
    if (isOpen) {
      setSelectedStaff("");
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [isOpen]);

  const handleAssignAndMapClick = async () => {
    if (!selectedStaff) {
      setStatusMessage("Please select a staff member");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Assigning staff and creating folders...");

    try {
      await onAssignAndMap(clientData._id, selectedStaff);
      setSelectedStaff("");
      onClose();
    } catch (error) {
      setStatusMessage("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          disabled={isProcessing}
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">
          Assign Client & Create Folders
        </h2>

        {/* Client Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
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
            disabled={isProcessing}
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

        {/* Status message */}
        {statusMessage && (
          <div
            className={`mb-4 p-2 rounded-md text-center ${
              statusMessage.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {statusMessage}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleAssignAndMapClick}
            disabled={isProcessing || !selectedStaff}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Assign & Create Folders"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAndMapClientModal;
