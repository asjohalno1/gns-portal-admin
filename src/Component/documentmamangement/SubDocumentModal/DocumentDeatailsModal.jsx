import React, { useState } from "react";
import { X, Download, Eye } from "lucide-react";
import {
  getTime,
  downloadFile,
  formatDate,
} from "../../../adminutils/commonutils";
import { approveDocumentStatusApi } from "../../../api/documentmanagement.api";
import DocumentPreviewModal from "../../../CommonPages/Peviewdocuments/DocumentPreviewModal";

const SubDocumentDetails = ({
  isOpen,
  onClose,
  documentData,
  onUpdateDocument,
}) => {
  const [document, setDocument] = useState(documentData);
  const [feedback, setFeedback] = useState(documentData?.doc?.comments || "");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  // Unified helper to call API and propagate new doc upward
  const handleDocumentAction = async (status) => {
    const data = {
      status,
      feedback,
    };

    try {
      const result = await approveDocumentStatusApi(
        document?.data.findByrequest,
        document?.doc.subCategory._id,
        data
      );
      // Prefer API return, otherwise patch locally
      const updatedDoc = result?.updatedDocument || {
        ...document,
        doc: { ...document.doc, status: status, comments: feedback },
      };
      if (onUpdateDocument) onUpdateDocument(updatedDoc); // notify parent
      onClose();
    } catch (error) {
      console.error(`Error ${status} document:`, error);
    }
  };

  const handleApprove = () => handleDocumentAction("approved");
  const handleReject = () => handleDocumentAction("rejected");

  const handleSaveFeedback = async () => {
    const data = {
      feedback: feedback,
    };
    try {
      const result = await approveDocumentStatusApi(
        document?.data.findByrequest,
        document?.doc.subCategory._id,
        data
      );
      const updatedDoc = result?.updatedDocument || {
        ...document,
        doc: { ...document.doc, comments: feedback },
      };
      if (onUpdateDocument) onUpdateDocument(updatedDoc); // notify parent
      onClose();
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const handlePreview = () => setIsPreviewOpen(true);

  const handleDownload = async (document) => {
    const path = document?.doc?.files[0];
    await downloadFile(path);
  };

  const handleClosePreview = () => setIsPreviewOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D] bg-opacity-50">
      <div className="bg-white  rounded-lg shadow-xl w-full max-w-[600px] mx-4 h-[450px] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-lg font-medium text-gray-900">
            Document Request Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-2 space-y-3 flex-1 overflow-hidden">
          {/* Document Info */}
          <div className="space-y-2 shadow-md p-4 rounded-md bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-700">
                  Document:
                </span>
                <span className="text-sm text-gray-900">
                  {document?.doc.subCategory.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(document)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={handlePreview}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                Submitted:
              </span>
              <span className="text-sm text-gray-900">
                {formatDate(document?.data.created)}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">Time:</span>
              <span className="text-sm text-gray-900">
                {getTime(document.updatedAt)}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                Request ID:
              </span>
              <span className="text-sm text-gray-900">
                {document?.data.requestId}
              </span>
            </div>
          </div>

          {/* Review Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Review Actions
            </h3>
            <div className="flex justify-center  space-x-3">
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-1.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm font-medium"
              >
                Approve
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Feedbacks/Comments
            </h3>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:lue-500 resize-none text-sm bg-gray-50"
              rows="2"
              placeholder="Provide Feedback To Client..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 ">
          <button
            onClick={handleSaveFeedback}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Feedback
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          documentPath={document?.doc.files[0]}
          documentComment={document?.doc.comments}
        />
      )}
    </div>
  );
};

export default SubDocumentDetails;
