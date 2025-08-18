import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Table from "../Component/Table/table";
import { getAllDocumentsListingApi } from "../api/documentmanagement.api";
import DocumentDeatailsModal from "../Component/documentmamangement/DocumentRequestDetails";

const DocumentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentList, setDocumentList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [
    isDocumentRequestDetailsModalOpen,
    setIsDocumentRequestDetailsModalOpen,
  ] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const fetchDocumentListing = async () => {
    try {
      setLoading(true);
      const res = await getAllDocumentsListingApi({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort: "desc",
      });

      if (res.success) {
        setDocumentList(res.data);
        setFilteredData(res.data); // Initially set filtered data to all data
        setPagination({
          ...pagination,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document list."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentListing();
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    // Apply search filter locally if backend doesn't handle it
    const filtered = documentList.filter((item) => {
      const matchesSearch =
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredData(filtered);
  }, [searchTerm, documentList, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleLimitChange = (newLimit) => {
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };
  const handleAction = (action, data) => {
    switch (action) {
      case "manage":
        setIsDocumentRequestDetailsModalOpen(true);
        setSelectedDocument(data);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleDocumentUpdateChild = (updatedDoc) => {
    setDocumentList((docs) =>
      docs.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
    );
    if (selectedDocument?.id === updatedDoc.id) {
      setSelectedDocument(updatedDoc);
    }
  };
  const handleOnclose = () => {
    setIsDocumentRequestDetailsModalOpen(false);
    setSelectedDocument(null);
    fetchDocumentListing();
  };
  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body font-medium text-[16px]">
          Document Management
        </h2>
      </div>
      <div className="border border-customGray rounded-[20px] p-5">
        <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
          <div className="relative w-full md:w-[60%]">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by client, email or title"
              className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
            />
            <svg
              className="absolute top-4 left-4"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 13L9 9M1 5.66667C1 6.2795 1.12071 6.88634 1.35523 7.45252C1.58975 8.01871 1.93349 8.53316 2.36683 8.9665C2.80018 9.39984 3.31462 9.74358 3.88081 9.97811C4.447 10.2126 5.05383 10.3333 5.66667 10.3333C6.2795 10.3333 6.88634 10.2126 7.45252 9.97811C8.01871 9.74358 8.53316 9.39984 8.9665 8.9665C9.39984 8.53316 9.74358 8.01871 9.97811 7.45252C10.2126 6.88634 10.3333 6.2795 10.3333 5.66667C10.3333 5.05383 10.2126 4.447 9.97811 3.88081C9.74358 3.31462 9.39984 2.80018 8.9665 2.36683C8.53316 1.93349 8.01871 1.58975 7.45252 1.35523C6.88634 1.12071 6.2795 1 5.66667 1C5.05383 1 4.447 1.12071 3.88081 1.35523C3.31462 1.58975 2.80018 1.93349 2.36683 2.36683C1.93349 2.80018 1.58975 3.31462 1.35523 3.88081C1.12071 4.447 1 5.05383 1 5.66667Z"
                stroke="#8F95A2"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
            <div className="relative">
              <select
                name="status"
                value={statusFilter}
                onChange={handleStatusChange}
                className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Partially fulfilled">Partially fulfilled</option>
                <option value="Completed">Completed</option>
              </select>
              <svg
                className="absolute right-[14px] top-[14px]"
                width="12"
                height="11"
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.2"
                  d="M7.64399 9.62711C6.84862 10.7751 5.15138 10.7751 4.35601 9.62711L0.380525 3.88899C-0.538433 2.56259 0.410876 0.750001 2.02452 0.750001L9.97548 0.750001C11.5891 0.750002 12.5384 2.56259 11.6195 3.88899L7.64399 9.62711Z"
                  fill="#2C3E50"
                />
              </svg>
            </div>
            <button
              onClick={handleClearFilters}
              className="ml-5 color-black font-medium text-sm underline"
            >
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryBlue"></div>
          </div>
        ) : (
          <Table
            data={filteredData}
            pagination={{
              page: pagination.page,
              totalPages: pagination.totalPages,
              total: pagination.totalItems,
              limit: pagination.limit,
            }}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onNextPage={() => handlePageChange(pagination.page + 1)}
            onPrevPage={() => handlePageChange(pagination.page - 1)}
            onAction={handleAction}
            mode="documentManagementListing"
          />
        )}
      </div>

      {isDocumentRequestDetailsModalOpen && (
        <DocumentDeatailsModal
          isOpen={isDocumentRequestDetailsModalOpen}
          onClose={() => handleOnclose()}
          title="Document Tracking"
          data={selectedDocument}
          onUpdateDocument={handleDocumentUpdateChild}
        />
      )}
    </div>
  );
};

export default DocumentManagement;
