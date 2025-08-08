import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteClient } from "../../api/dashboard.api";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  clientData,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteClient(clientData?._id);

      if (response.success === true) {
        toast.success("Client deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        onDeleteSuccess();
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error("Error while deleting client", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete client");
      console.error("Error deleting client:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
          <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
            <div className="flex justify-between items-center mb-[30px]">
              <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">
                Delete Record
              </h2>
              <button
                onClick={onClose}
                className="text-primaryBlue hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-[#484848] font-medium text-[14px] mb-2">
                  Are you sure?
                </p>
                <p className="text-[#484848] text-[14px]">
                  Are you sure you really want to delete this record?
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 border border-red-600 text-white px-4 py-2 rounded-[8px] text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
