import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addEmailTemplateApi, getAllEmailApi } from "../api/emailtemplate.api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useToast } from "../CommonPages/customtoast/CustomToaster";

const EmailTemplates = () => {
  const { addToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    templateName: "",
    title: "",
    description: "",
    listType: "",
  });

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

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

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      templateName: template.templateName || "",
      title: template.title,
      description: template.description,
      listType: template.listType || "",
    });
    setShowModal(true);
  };

  const handleViewDetails = (template) => {
    setSelectedTemplate(template);
    setShowDetails(true);
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
        addToast("Template updated successfully!", "success");
      } else {
        const newTemplate = {
          _id: Date.now().toString(),
          ...formData,
          linkNote: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTemplates((prev) => [newTemplate, ...prev]);
        addToast("Template created successfully!", "success");
      }

      setShowModal(false);
      setEditingTemplate(null);
      setFormData({
        templateName: "",
        title: "",
        description: "",
        listType: "",
      });
    } catch (error) {
      toast.error("Something went wrong while saving template.");
    }
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({ templateName: "", title: "", description: "", listType: "" });
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
              Create, edit, and manage your email templates
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

      {/* Templates List or Details View */}
      {!showDetails ? (
        <div className="templates-section">
          <h5 className="font-medium text-[20px] leading-[100%] tracking-[0%] mb-[10px]">
            Email Templates ({templates.length})
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <div
                  key={template._id}
                  className="bg-white border border-[#2C3E501A] rounded-[20px] p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h6 className="font-semibold text-lg text-[#2C3E50]">
                      {template.templateName || "Untitled Template"}
                    </h6>
                    <span className="text-xs text-gray-500">
                      {formatDate(template.updatedAt)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Subject: {template.title}
                    </p>
                    <div
                      className="text-sm text-gray-600 line-clamp-2 quill-content"
                      dangerouslySetInnerHTML={{ __html: template.description }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {template.listType || "General"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(template)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-10 text-gray-400 text-sm">
                No templates available
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-[#2C3E50]">
              {selectedTemplate.templateName || "Template Details"}
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M15 8H1M1 8L8 15M1 8L8 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Templates
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Template Name
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedTemplate.templateName || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Email Subject
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedTemplate.title}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Template Type
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedTemplate.listType || "General"}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Created
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(selectedTemplate.createdAt)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Last Updated
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(selectedTemplate.updatedAt)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Description
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div
                      className="quill-content"
                      dangerouslySetInnerHTML={{
                        __html: selectedTemplate.description,
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowDetails(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                setShowDetails(false);
                handleEdit(selectedTemplate);
              }}
              className="px-6 py-2 bg-[#2E7ED4] text-white rounded-lg hover:bg-[#1B4F8A] transition-colors"
            >
              Edit Template
            </button>
          </div>
        </div>
      )}

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
                  Template Name *
                </label>
                <input
                  type="text"
                  name="templateName"
                  value={formData.templateName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter template name"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[14px] text-[#2C3E50] mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email subject"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-[14px] text-[#2C3E50] mb-2">
                  Template Type *
                </label>
                <select
                  name="listType"
                  value={formData.listType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Document Request">Document Request</option>
                  <option value="Reminder">Reminder</option>
                  <option value="Notification">Notification</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[14px] text-[#2C3E50] mb-2">
                  Description *
                </label>
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  className="h-64 mb-12"
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
