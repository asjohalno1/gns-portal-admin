import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({ onAction, mode, itemId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Define actions based on mode
  const getActionsForMode = (mode) => {
    switch (mode) {
      case "clientsListing":
        return [
          { label: "View", value: "view" },
          { label: "Update", value: "update" },
          { label: "Delete", value: "delete" },
        ];
      case "documentRequestListing":
        return [
          { label: "Update", value: "update" },
          { label: "Delete", value: "delete" },
          { label: "Mark as Complete", value: "markComplete" },
        ];
      case "dashboardListing":
        return [
          { label: "View", value: "view" },
          { label: "Request Document", value: "Request" },
          { label: "Send Reminder", value: "sendReminder" },
        ];
      case "secureDocumentListing":
        return [
          { label: "View", value: "view" },
          { label: "Download", value: "download" },
          { label: "Delete", value: "delete" },
        ];
      default:
        return [
          { label: "View", value: "view" },
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ];
    }
  };

  const actions = getActionsForMode(mode);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Close all other dropdowns when this one opens
    const handleDropdownOpen = (event) => {
      if (event.detail && event.detail.dropdownId !== itemId) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("dropdownOpen", handleDropdownOpen);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("dropdownOpen", handleDropdownOpen);
    };
  }, [itemId]);

  const toggleDropdown = () => {
    if (!isOpen) {
      const event = new CustomEvent("dropdownOpen", {
        detail: { dropdownId: itemId },
      });
      document.dispatchEvent(event);
    }
    setIsOpen(!isOpen);
  };

  const handleActionClick = (actionValue) => {
    onAction(actionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center rounded-full border border-gray-300 w-full px-3 py-1.5 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white  rounded-md shadow-lg">
          <div className="py-1">
            {actions.map((action) => (
              <button
                key={action.value}
                className="block w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleActionClick(action.value)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
