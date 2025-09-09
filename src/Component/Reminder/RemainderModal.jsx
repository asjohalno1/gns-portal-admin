import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuillEditor from "../../CommonPages/QuerillEditor/QuillEditor";
import { addRemainderTemplates } from "../../api/reminder.api";
import { useToast } from "../../CommonPages/customtoast/CustomToaster";

const RemainderModal = ({ onClose }) => {
  const [templateName, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSave = async () => {
    if (!templateName || !message) {
      toast.warn("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: templateName,
        message: message,
      };
      const res = await addRemainderTemplates(payload);
      if (res.success === true) {
        addToast("Reminder template added successfully!", "success");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error("Failed to add template.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full relative max-w-[700px] min-h-[450px]">
          <div className="w-full max-w-[700px] bg-white rounded-[10px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Create Reminder Template
              </h2>
              <button
                onClick={handleClose}
                type="button"
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="mb-5">
              <label className="block text-[#484848] text-sm font-medium mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Tax Reminder"
                className="w-full border border-gray-300 bg-[#FAFAFA] text-[#484848] p-3 rounded-md text-sm focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#484848] text-sm font-medium mb-2">
                Message
              </label>

              <QuillEditor
                value={message}
                onChange={setMessage}
                placeholder="Please upload your documents using the secure link below."
                className="min-h-[130px] border border-gray-300 bg-[#FAFAFA] p-2 rounded-md"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`bg-[#2E7ED4] hover:bg-[#256BC0] ml-4 mt-[25px] text-white px-6 py-2 rounded-md text-sm ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemainderModal;
