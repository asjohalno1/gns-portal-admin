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
      { key: "fullName", label: "Client Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "assignedTo", label: "Assigned To" },
      { key: "status", label: "Status" },
      { key: "updatedAt", label: "Last Activity" },
      { key: "actions", label: "Action" },
    ],
  },
  assignToClients: {
    columns: [
      { key: "fullName", label: "Client Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "status", label: "Status" },
      { key: "assignedTo", label: "Assigned To" },
      { key: "updatedAt", label: "Last Activity" },

      { key: "actions", label: "Action" },
    ],
  },
  unassignedClients: {
    columns: [
      { key: "fullName", label: "Client Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "status", label: "Status" },
      { key: "assignedTo", label: "Assigned To" },
      { key: "updatedAt", label: "Last Activity" },
      { key: "actions", label: "Action" },
    ],
  },
  AuditList: {
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "activityType", label: "Activity Type" },
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
  remainderHistory: {
    columns: [
      {
        header: "Client Name",
        key: "clientName",
        isText: true,
      },
      {
        header: "Channel",
        key: "notifyMethod",
        isText: true,
      },
      {
        header: "Document Title",
        key: "docTitle",
        isText: true,
      },
      {
        header: "Date & Time",
        key: "scheduleTime",
        isDeadline: true,
      },
      {
        header: "Status",
        key: "status",
        isStatus: true,
      },
    ],
  },

  staffListing: {
    columns: [
      { key: "first_name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "active", label: "Status" },
      { key: "updatedAt", label: "Last Activity" },
      { key: "actions", label: "Action" },
    ],
  },
  performanceStats: {
    columns: [
      { key: "staffName", label: "Staff Name" },
      { key: "totalTasks", label: "Total Tasks" },
      { key: "completedTasks", label: "Completed Tasks" },
      { key: "pendingTasks", label: "Pending Tasks" },
      { key: "overdueTasks", label: "Overdue Tasks" },
      { key: "performanceStatus", label: "Performance Status" },
    ],
  },
  documentManagementListing: {
    columns: [
      { key: "title", label: "Document Name" },
      { key: "clientName", label: "Client Name" },
      { key: "status", label: "Status" },
      { key: "created", label: "Created Date" },
      { key: "progress", label: "Progress" },
      { key: "dueDate", label: "Due Date" },
      { key: "actions", label: "Actions" },
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

    case "Bad":
      return (
        <button
          type="button"
          className="bg-[#FEE2E2] text-[#B91C1C] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Bad
        </button>
      );
    case "Good":
      return (
        <button
          type="button"
          className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Good
        </button>
      );
    case "Excellent":
      return (
        <button
          type="button"
          className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Excellent
        </button>
      );
    case "Average":
      return (
        <button
          type="button"
          className="bg-[#FEF9C3] text-[#CA8A04] px-8 py-1.5 rounded-full cursor-pointer btn-table"
        >
          Average
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
export const renderCellContent = (item, columnKey, onAction, mode, index) => {
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

    case "performanceStatus":
      return getStatusButton(item[columnKey]);

    case "actions":
      return (
        <Dropdown
          onAction={(actionType) => onAction(actionType, item)}
          mode={mode}
          itemId={item._id || item.id || `${mode}-${index}`}
        />
      );
    case "dueDate":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "expire":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "createdAt":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "updatedAt":
      return item[columnKey] ? formatDate(item[columnKey]) : "N/A";
    case "active":
      return getStatusButton(item[columnKey]);
    default:
      return item[columnKey] || "N/A";
  }
};
