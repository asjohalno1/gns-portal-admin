import Dropdown from "../Component/Dropdown/dropdown";
import { formatDate } from "./commonutils";

export const headerConfigs = {
  dashboardListing: {
    columns: [
      { key: "title", label: "Document Request Title" },
      { key: "name", label: "Client Name" },
      { key: "documentRequest", label: "Document Request" },
      { key: "taskDeadline", label: "Task Deadline" },
      { key: "statusUpdate", label: "Status Update" },
      { key: "lastActivity", label: "Log Activity" },
      { key: "actions", label: "Action" },
    ],
  },

  clientsListing: {
    columns: [
      // { key: "_id", label: "ID" },
      { key: "name", label: "Client Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "assignedTo", label: "Assigned To" },
      { key: "status", label: "Status" },
      { key: "lastActivity", label: "Last Activity" },
      { key: "actions", label: "Action" },
    ],
  },

  documentRequestListing: {
    columns: [
      { key: "doctitle", label: "Document Request Title" },
      { key: "clientName", label: "Client Name" },
      { key: "assignedTo", label: "Under Staff Name" },
      { key: "dueDate", label: "Due Date" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Action" },
    ],
  },

  secureDocumentListing: {
    columns: [
      { key: "title", label: "Document Name" },
      { key: "clientName", label: "Client Name" },
      { key: "DocType", label: "Document Type" },
      { key: "RemaindersCount", label: "Remainders" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Created" },
      { key: "expire", label: "Expires" },
      { key: "actions", label: "Action" },
    ],
  },
};

// Function to determine status button styling
export const getStatusButton = (status) => {
  switch (status) {
    case "Overdue":
      return (
        <button
          type="button"
          className="bg-[#FEF9C3] text-[#CA8A04] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          {status}
        </button>
      );
    case "Active":
      return (
        <button
          type="button"
          className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Active
        </button>
      );
    case "Used":
      return (
        <button
          type="button"
          className="bg-[#DBEAFE] text-[#2E7ED4] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Used
        </button>
      );
    case true:
      return (
        <button
          type="button"
          className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Active
        </button>
      );
    case false:
      return (
        <button
          type="button"
          className="bg-[#FEE2E2] text-[#B91C1C] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Inactive
        </button>
      );
    default:
      return (
        <button
          type="button"
          className="bg-[#cfd1d0] text-[#696e6a] px-8 py-1.5 rounded-full cursor-pointer"
        >
          {status}
        </button>
      );
  }
};

// Function to render cell content based on column key
export const renderCellContent = (item, columnKey, onAction) => {
  switch (columnKey) {
    case "statusUpdate":
    case "taskDeadline":
      return getStatusButton(item[columnKey]);
    case "lastActivity":
      return item[columnKey]
        ? new Date(item[columnKey]).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    case "status":
      return getStatusButton(item[columnKey]);

    case "actions":
      return <Dropdown onAction={(actionType) => onAction(actionType, item)} />;
    case "dueDate":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "expire":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "createdAt":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    default:
      return item[columnKey] || "N/A";
  }
};
