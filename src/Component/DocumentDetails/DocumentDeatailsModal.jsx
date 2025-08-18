import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocByReqId } from "../../api/documentManagemnet.api";
import DocumentRequestDetails from "./SubDocumentDetailsModal/SubDocumentDetails";
import { formatDate } from "../../adminutils/commonutils";

const DocumentDeatailsModal = ({
  isOpen,
  onClose,
  title,
  data,
  children,
  handleDocumentUpdateChild,
}) => {
  if (!isOpen) return null;
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [process, setProcess] = useState();
  const nevigate = useNavigate();

  console.log("Data===========================", data);
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return { bg: "#DBEAFE", text: "#1D4ED8", label: "Submitted" };

      case "pending":
        return { bg: "#FEF3C7", text: "#D97706", label: "Pending" };

      case "missing":
        return { bg: "#FEE2E2", text: "#DC2626", label: "Missing" };

      case "under review":
        return { bg: "#E0E7FF", text: "#6366F1", label: "Under Review" };

      case "approved":
        return { bg: "#D1FAE5", text: "#059669", label: "Approved" };

      case "rejected":
        return { bg: "#FEE2E2", text: "#DC2626", label: "Rejected" };
      case "processed":
        return { bg: "#D1FAE5", text: "#059669", label: "Processed" };
      case "accepted":
        return { bg: "#DBEAFE", text: "#059669", label: "Accepted" };

      default:
        return { bg: "#F3F4F6", text: "#6B7280", label: status || "Unknown" };
    }
  };

  console.log("process.....", data);

  const fetchAllSubDocuments = async () => {
    try {
      const response = await getDocByReqId(data?.requestById[0]?._id);
      setRequiredDocuments(response.data.documents || []);
      setProcess(response.data.progressBar || {});
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchAllSubDocuments();
  }, []);

  // Handle subcategory click
  const handleSubCategoryClick = (doc, data) => {
    if (!doc.isUploaded) {
      return;
    }
    setSubCategoryData({ doc, data });
    setIsSubCategoryOpen(true);
  };

  const getDocumentStatus = (doc) => {
    if (!doc.isUploaded) {
      return "missing";
    }
    if (doc.status?.toLowerCase() === "pending" && !doc.isUploaded) {
      return "missing";
    }
    if (doc.isUploaded && doc.status?.toLowerCase() === "pending") {
      return "submitted";
    }
    return doc.status;
  };

  const handleCloseSubCategoryModal = () => {
    setIsSubCategoryOpen(false);
    fetchAllSubDocuments();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D] bg-opacity-50">
      <div className="relative bg-white rounded-[10px] shadow-lg w-full max-w-[600px] p-[20px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[16px] text-[#2E7ED4] hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">
          Document Request Details
        </h2>

        {/* Content area */}
        <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#484848] align-middle mb-[15px]">
          Document Req Title:{" "}
          <span className="font-semibold">{data?.title || "N/A"}</span>
        </p>

        <div className="bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] mb-[15px] flex flex-col items-center justify-center text-center w-[100%] ">
          <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-2 w-full">
            {process?.uploaded}/{process?.total}
          </p>
          <span className="w-full h-2 bg-gray-300 rounded-md overflow-hidden">
            <span
              className="block h-full bg-[#2E7ED4] transition-all duration-300"
              style={{
                width: `${(process?.uploaded / process?.total) * 100 || 0}%`,
                height: "100%",
              }}
            ></span>
          </span>
        </div>

        <p className="font-medium text-[14px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[8px]">
          Client Information
        </p>
        <div className="bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] flex justify-between mb-[15px]">
          <div>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Name:{" "}
              <span className="ml-[11px] font-medium">
                {data?.clientName || data?.name || "N/A"}
              </span>
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Email:{" "}
              <span className="ml-[11px] font-medium">
                {data?.clientEmail || data?.email || "N/A"}
              </span>
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Created:{" "}
              <span className="ml-[11px] font-medium">
                {formatDate(data?.created) ||
                  formatDate(data?.createdAt) ||
                  " - -"}
              </span>
            </p>
            {/* <p className="mb-[0px] font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50]">
              Request ID:{" "}
              <span className="ml-[11px] font-medium">
                {data?.requestId || "N/A"}
              </span>
            </p> */}
          </div>
          <div>
            <button
              className="font-normal text-[14px] leading-[100%] rounded-[50px] px-[25px] py-[6px]"
              style={{
                backgroundColor: getStatusStyle(data?.status).bg,
                color: getStatusStyle(data?.status).text,
              }}
            >
              {getStatusStyle(data?.status).label}
            </button>
          </div>
        </div>
        <p className="font-medium text-[14px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[10px]">
          Required Documents
        </p>
        <div className="grid grid-cols-3 gap-4">
          {requiredDocuments.map((doc, index) => {
            const documentStatus = getDocumentStatus(doc);
            const isClickable = doc.isUploaded;

            return (
              <button
                key={index}
                onClick={() => handleSubCategoryClick(doc, data)}
                className={`border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD] text-left transition-all duration-200 ${
                  isClickable
                    ? "hover:border-[#2E7ED4] hover:shadow-md cursor-pointer"
                    : "opacity-90 cursor-not-allowed"
                }`}
                disabled={!isClickable}
              >
                <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">
                  {doc.subCategory.name}
                </p>
                <p
                  className="font-medium not-italic text-[14px] leading-[100%] tracking-[0px]"
                  style={{
                    color: getStatusStyle(documentStatus).text,
                  }}
                >
                  {getStatusStyle(documentStatus).label}
                </p>
              </button>
            );
          })}

          {Array.from({
            length: Math.max(0, 1 - requiredDocuments.length),
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD] opacity-50"
            >
              <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">
                Additional Document
              </p>
              <p className="text-[#D1D5DB] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">
                Not Requested
              </p>
            </div>
          ))}
        </div>

        {/* Footer buttons if needed */}
        <div className="mt-6 flex justify-between flex-wrap">
          {/* <button className="font-normal not-italic text-[14px] leading-[100%] tracking-normal text-[#2E7ED4] border border-[#2E7ED4] px-[25px] py-[8px] rounded-[6px] hover:bg-[#2E7ED4] hover:text-white transition-colors duration-200">
              Export Details
          </button> */}
          <div className="flex gap-[10px]">
            <button
              onClick={() => nevigate("/admin/send-reminder")}
              className="font-normal text-[14px] leading-[100%] tracking-normal text-[#F1F1F1] py-[8px] px-[25px] border border-[#2E7ED4] bg-[#2E7ED4] rounded-[6px] hover:bg-[#256AB4] transition-colors duration-200"
            >
              Send Reminder
            </button>
          </div>
        </div>
      </div>
      {isSubCategoryOpen && (
        <DocumentRequestDetails
          isOpen={isSubCategoryOpen}
          onClose={() => handleCloseSubCategoryModal()}
          documentData={subCategoryData}
          onUpdateDocument={handleDocumentUpdateChild}
        />
      )}
    </div>
  );
};

export default DocumentDeatailsModal;
