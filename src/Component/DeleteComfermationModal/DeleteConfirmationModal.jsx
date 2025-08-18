import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-[#0000005D] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-[562px]">
          <div className="flex justify-between items-center mb-[30px]">
            <h2 className="text-[#484848] font-medium text-[16px]">
              Delete Record
            </h2>
            <button
              onClick={onClose}
              className="text-primaryBlue hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="text-center mb-4">
            <p className="text-[#484848] font-medium text-[14px] mb-2">
              Are you sure?
            </p>
            <p className="text-[#484848] text-[14px]">
              Are you sure you want to delete this record?
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
              onClick={onConfirm}
              className="bg-red-600 border border-red-600 text-white px-4 py-2 rounded-[8px] text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
