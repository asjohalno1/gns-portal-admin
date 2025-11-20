import React, { useState, useEffect } from "react";
import { getAllEmailApi } from "../../api/emailtemplate.api";
import { bulkInviteClients, getInviteClients } from "../../api/dashboard.api";
import { useToast } from "../../CommonPages/customtoast/CustomToaster";

const BulkInviteModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchEmailTemplates();
    } else {
      // Reset state when modal closes
      setSelectedClients([]);
      setSelectAll(false);
      setSelectedTemplate("");
      setClients([]);
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getInviteClients({
        page: 1,
        limit: 1000, // Fetch all clients for selection
        search: "",
        loginStatus: "",
      });
      if (response.success) {
        const filteredClients = (response.data.clients || []).filter(
          (client) => client.loginStatus === "NOT_INVITED" || client.loginStatus === "INVITED"
        );
        setClients(filteredClients);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      addToast(
        error.response?.data?.message || "Failed to fetch clients",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const response = await getAllEmailApi();
      // Handle different response structures
      const templates = response?.data || response || [];
      
      // Filter templates by CLIENT_PORTAL_INVITE listType
      const filteredTemplates = Array.isArray(templates)
        ? templates.filter(
            (template) => template.listType === "CLIENT_PORTAL_INVITE"
          )
        : [];
      
      setEmailTemplates(filteredTemplates);
      
      // Set default template if available
      if (filteredTemplates.length > 0) {
        const defaultTemplate = filteredTemplates.find(
          (t) => t.templateName?.toLowerCase().includes("default")
        );
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate._id);
        } else {
          setSelectedTemplate(filteredTemplates[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedClients(clients.map((client) => client._id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleClientSelect = (clientId) => {
    setSelectedClients((prev) => {
      if (prev.includes(clientId)) {
        const updated = prev.filter((id) => id !== clientId);
        setSelectAll(updated.length === clients.length);
        return updated;
      } else {
        const updated = [...prev, clientId];
        setSelectAll(updated.length === clients.length);
        return updated;
      }
    });
  };

  const getClientStatus = (client) => {
    if (client.loginStatus === "LOGGED_IN") return "Logged In";
    if (client.loginStatus === "INVITED") return "Invited";
    if (client.loginStatus === "BOUNCED") return "Bounced";
    return "New";
  };

  const handleSendInvitations = async () => {
    if (selectedClients.length === 0) {
      addToast("Please select at least one client", "error");
      return;
    }

    try {
      setSending(true);
      const response = await bulkInviteClients({
        clientIds: selectedClients,
        templateId: selectedTemplate || null,
      });

      if (response.success) {
        addToast(
          `Invitations sent successfully to ${selectedClients.length} client(s)`,
          "success"
        );
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        addToast(
          response.message || "Failed to send invitations",
          "error"
        );
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      addToast(
        error.response?.data?.message || "Failed to send invitations",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D] bg-opacity-50">
      <div className="relative bg-white rounded-[10px] shadow-lg w-full max-w-[800px] p-[20px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[16px] text-[#2E7ED4] hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">
          Select clients to invite
        </h2>

        {/* Select All */}
        <div className="mb-[15px]">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-[#2E7ED4] border-[#E0E0E0] rounded focus:ring-[#2E7ED4] focus:ring-2 cursor-pointer"
            />
            <span className="ml-2 text-[#484848] text-[14px] font-normal">
              Select All
            </span>
          </label>
        </div>

        {/* Client List */}
        <div className="mb-[15px] max-h-[300px] overflow-y-auto border border-[#E0E0E0] rounded-[6px] p-[10px]">
          {loading ? (
            <div className="text-center py-8 text-[#484848] text-[14px]">
              Loading clients...
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-[#484848] text-[14px]">
              No clients available
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="flex items-center py-2 px-2 hover:bg-[#2E7ED40D] rounded-[4px] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client._id)}
                    onChange={() => handleClientSelect(client._id)}
                    className="w-4 h-4 text-[#2E7ED4] border-[#E0E0E0] rounded focus:ring-[#2E7ED4] focus:ring-2 cursor-pointer"
                  />
                  <div className="ml-3 flex-1 flex items-center text-[14px] text-[#484848]">
                    <span className="font-medium min-w-[150px]">
                      {client.clientName || client.name}
                    </span>
                    <span className="mx-4 text-[#E0E0E0]">|</span>
                    <span className="flex-1 min-w-[200px]">{client.email}</span>
                    <span className="mx-4 text-[#E0E0E0]">|</span>
                    <span className="text-[#2E7ED4] font-medium min-w-[100px]">
                        {getClientStatus(client)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Template */}
        <div className="mb-[15px]">
          <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
            Email Template:
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm text-[#484848] bg-white"
          >
            
            <option value="">Client Portal Invite – Default</option>
            {emailTemplates.map((template) => (
                <option key={template._id} value={template._id}>
                    {template.templateName || "Client Portal Invite – Default"}
                </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="text-right mt-[20px]">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendInvitations}
            className="bg-[#2E7ED4] border border-[#2E7ED4] text-white px-4 py-2 rounded-[8px] text-sm font-medium"
            disabled={sending || selectedClients.length === 0}
          >
            {sending ? "Processing..." : "Send Invitations"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkInviteModal;

