import React, { useState } from "react";

const MapClientModal = ({ isOpen, onClose, clientData, onMap }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleMapClick = async () => {
    try {
      setLoading(true);
      await onMap(clientData._id, clientData?.email);
      onClose();
    } catch (err) {
      console.error("Error mapping client:", err);
    } finally {
      setLoading(false);
    }
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
        <div className="mb-6 space-y-2 text-gray-800">
          <p>
            <strong>Full Name:</strong> {clientData?.fullName}
          </p>
          <p>
            <strong>Email:</strong> {clientData?.email}
          </p>
          <p>
            <strong>Phone:</strong> {clientData?.phoneNumber}
          </p>
        </div>

        {/* Client Address */}
        <div className="mb-6 text-gray-800">
          <p>
            <strong>Mapping Path:</strong> /Client_Portal_Testing_SD/Clients/
            <span className="text-blue-600 font-medium">
              {clientData?.name}
            </span>
          </p>
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
            onClick={handleMapClick}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Mapping..." : "Map Client"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapClientModal;
