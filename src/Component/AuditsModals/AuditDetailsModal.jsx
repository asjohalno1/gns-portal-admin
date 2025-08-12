import React from "react";
import { formatDate } from "../../adminutils/commonutils";

const AuditDetailsModal = ({ log, onClose, data }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0  bg-[#0000005D] flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hidden "
        style={{
          scrollbarWidth: "none",
          scrollbarColor: "none",
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-800">
            Audit Log Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Perform Action</p>
                <p className="font-medium">{log.activityType || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Performed By</p>
                <p className="font-medium">{log.name || "System"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">
                  {log.role?.toLowerCase() || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">
                  {log.lastActivity ? formatDate(log.lastActivity) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Details Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              Activity Details
            </h4>

            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(
                  log.description || "No additional details available",
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          {/* System Information Section */}
          {/* <div className="space-y-4">
            <h4 className="font-medium text-gray-700 border-b pb-2">
              System Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="font-medium">{log.ipAddress || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">User Agent</p>
                <p className="font-medium truncate">{log.userAgent || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{log.location || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Device Type</p>
                <p className="font-medium capitalize">
                  {log.deviceType || "N/A"}
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-gray-200 p-5 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primaryBlue text-white rounded-[10px] hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsModal;
