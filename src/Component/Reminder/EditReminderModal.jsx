import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuillEditor from "../../CommonPages/QuerillEditor/QuillEditor";
import { updateReminderTemplate } from "../../api/reminder.api";

const EditReminderModal = ({ onClose, template }) => {
  const [templateName, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (template && template._id) {
      setTemplateName(template.name || "");
      setMessage(template.message || "");
    }
  }, [template?._id]);

  const handleUpdate = async () => {
    if (!templateName || !message) {
      toast.warn("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: template._id,
        name: templateName,
        message: message,
      };

      const res = await updateReminderTemplate(payload);
      if (res.success === true) {
        toast.success("Reminder template updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error("Failed to update template.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="fixed inset-0 bg-[#0000005D] flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full relative max-w-[700px] min-h-[450px] shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Reminder Template</h2>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

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
              height="200px"
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`bg-[#2E7ED4] hover:bg-[#256BC0] text-white px-6 py-2 mr-2 mt-[30px] rounded-md text-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Template"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditReminderModal;
