import React, { useState, useEffect, useCallback } from "react";
import { X, FileText, Image, Download } from "lucide-react";
import { getDocumentType } from "../../adminutils/commonutils";

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentPath,
  documentComment,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const documentType = getDocumentType(documentPath);

  useEffect(() => {
    if (documentPath) {
      setIsLoading(true);
      setError(null);
      setDownloadProgress(0);
    }
  }, [documentPath]);

  const handleLoadSuccess = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleLoadError = useCallback((errorMessage) => {
    setIsLoading(false);
    setError(errorMessage || "Failed to load document");
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      if (!documentPath) return;

      const url = `${import.meta.env.VITE_API_BASE_URL_IMAGE}${documentPath}`;
      const filename = documentPath.split("/").pop() || "document";

      if (window.fetch) {
        setDownloadProgress(0);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get("content-length");
        const totalBytes = contentLength ? parseInt(contentLength) : null;
        let receivedBytes = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          receivedBytes += value.length;

          if (totalBytes) {
            const progress = Math.round((receivedBytes / totalBytes) * 100);
            setDownloadProgress(progress);
          }
        }

        const blob = new Blob(chunks);
        downloadBlob(blob, filename);
      } else {
        // Fallback for older browsers
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download failed:", err);
      handleLoadError("Download failed. Please try again.");
    } finally {
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  }, [documentPath, handleLoadError]);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const renderPreview = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <FileText className="w-16 h-16 mb-4" />
          <p className="text-lg">{error}</p>
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Download Instead
          </button>
        </div>
      );
    }

    switch (documentType) {
      case "image":
        return (
          <div className="flex justify-center items-center max-h-[80vh] overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL_IMAGE}${documentPath}`}
              alt="Document preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onLoad={handleLoadSuccess}
              onError={() => handleLoadError("Failed to load image")}
            />
          </div>
        );
      case "pdf":
        return (
          <div className="w-full h-[80vh]">
            <iframe //linkup
              src={`${
                import.meta.env.VITE_API_BASE_URL_IMAGE
              }${documentPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full rounded-lg"
              title="PDF Preview"
              onLoad={handleLoadSuccess}
              onError={() => handleLoadError("Failed to load PDF")}
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <FileText className="w-16 h-16 mb-4" />
            <p className="text-lg">Unsupported document type</p>
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Download File
            </button>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {documentType === "image" ? (
              <Image className="w-6 h-6 text-blue-500" />
            ) : (
              <FileText className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              Document Preview
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Download"
              disabled={downloadProgress > 0 && downloadProgress < 100}
            >
              {downloadProgress > 0 && downloadProgress < 100 ? (
                <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {downloadProgress}%
                </div>
              ) : null}
              <Download className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto flex-1">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 10.5h9m-9 3h6m-6-6h9M21 12c0 4.418-4.03 8-9 8a9.777 9.777 0 01-4.5-1.026L3 21l1.211-3.516A7.971 7.971 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="font-medium">Comments by staff:</span>
            </div>
            <p className="mt-1 text-gray-800 ml-7">{documentComment}</p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
