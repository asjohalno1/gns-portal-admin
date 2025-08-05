import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addEmailTemplateApi, getAllEmailApi } from "../api/emailtemplate.api";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const fetchAllTemplates = async () => {
    setLoading(true);
    try {
      const response = await getAllEmailApi();
      setTemplates(response?.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      description: template.description
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        ...(editingTemplate ? { _id: editingTemplate._id } : {}),
      };

      await addEmailTemplateApi(payload);

      if (editingTemplate) {
        setTemplates((prev) =>
          prev.map((t) =>
            t._id === editingTemplate._id
              ? { ...t, ...formData, updatedAt: new Date().toISOString() }
              : t
          )
        );
        toast.success("Template updated successfully!");
      } else {
        const newTemplate = {
          _id: Date.now().toString(),
          ...formData,
          linkNote: "", // Keeping for backward compatibility
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTemplates((prev) => [newTemplate, ...prev]);
        toast.success("Template created successfully!");
      }

      setShowModal(false);
      setEditingTemplate(null);
      setFormData({ title: "", description: "" });
    } catch (error) {
      toast.error("Something went wrong while saving template.");
    }
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({ title: "", description: "" });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#2E7ED4] to-[#1B4F8A] rounded-[20px] p-5 mb-[30px]">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-medium text-white mb-[10px]">
              Email Templates Management
            </h4>
            <p className="text-white text-base font-medium">
              Create, edit, and manage your email templates for various
              communications
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-white text-[#2E7ED4] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Add New Template
          </button>
        </div>
      </div>

      {/* Templates List */}
      <div className="templates-section">
        <h5 className="font-medium text-[20px] leading-[100%] tracking-[0%] mb-[10px]">
          Email Templates
        </h5>
        <div className="templates-container">
          {templates.map((template) => (
            <div
              key={template._id}
              className="template-card bg-white border border-[#2C3E501A] rounded-[20px] p-[30px] mb-[20px] hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h6 className="font-semibold text-[18px] text-[#2C3E50] mb-2">
                    {template.title}
                  </h6>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 4V8L10.5 10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Created: {formatDate(template.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M11.5 2H12.5C13.0523 2 13.5 2.44772 13.5 3V13C13.5 13.5523 13.0523 14 12.5 14H3.5C2.94772 14 2.5 13.5523 2.5 13V3C2.5 2.44772 2.94772 2 3.5 2H4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10.5 1H5.5C4.94772 1 4.5 1.44772 4.5 2V3C4.5 3.55228 4.94772 4 5.5 4H10.5C11.0523 4 11.5 3.55228 11.5 3V2C11.5 1.44772 11.0523 1 10.5 1Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Updated: {formatDate(template.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Template"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M8.25 3H3C2.44772 3 2 3.44772 2 4V15C2 15.5523 2.44772 16 3 16H14C14.5523 16 15 15.5523 15 15V9.75"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M13.5 2.25L15.75 4.5L8.625 11.625L6 12L6.375 9.375L13.5 2.25Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="template-content">
                <div className="mb-4">
                  <h7 className="font-medium text-[14px] text-[#2C3E50] mb-2 block">
                    Description:
                  </h7>
                  <div className="bg-[#F0F6FC] rounded-[10px] p-4">
                    <p className="text-[#484848] text-[14px] leading-[1.5] whitespace-pre-line">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit Template */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#2C3E50]">
                {editingTemplate ? "Edit Template" : "Add New Template"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-[14px] text-[#2C3E50] mb-2">
                  Template Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter template title"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[14px] text-[#2C3E50] mb-2">
                  Email Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="8"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Enter email description..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E7ED4] text-white rounded-lg hover:bg-[#1B4F8A] transition-colors"
                >
                  {editingTemplate ? "Update Template" : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;