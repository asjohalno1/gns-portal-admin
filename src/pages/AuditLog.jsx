import React, { useEffect, useState } from "react";
import Table from "../Component/Table/table";
import { getAllLogs } from "../api/dashboard.api";
import AuditDetailsModal from "../Component/AuditsModals/AuditDetailsModal";

const AuditLogs = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
    limit: 10,
  });

  const [clientsList, setClientsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const query = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search.trim(),
        // Removed status from API query - now handled on frontend
      };

      const cleanQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v !== undefined)
      );

      const response = await getAllLogs(cleanQuery);
      setClientsList(response.data.logs);
      const { totalPages, totalLogs } = response.data.pagination;
      setPagination((prev) => ({
        ...prev,
        totalPages,
        totalLogs,
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // New function to filter data on frontend based on status
  const getFilteredData = () => {
    if (filters.status === "all") {
      return clientsList;
    }

    return clientsList.filter((log) => {
      // Convert role to lowercase for case-insensitive comparison
      const logRole = log.role.toLowerCase();
      const filterStatus = filters.status.toLowerCase();

      return logRole === filterStatus;
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Updated useEffect - removed filters.status dependency since we don't want to refetch on status change
  useEffect(() => {
    fetchClients();
  }, [filters.search, pagination.currentPage, pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusChange = (e) => {
    handleFilterChange(e);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      search: "",
      status: "all",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1, limit: 10 }));
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    let timeoutId;
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setPagination((prev) => ({
        ...prev,
        limit: newLimit,
        currentPage: 1,
      }));
    }, 1000);
  };

  const handleActionClick = (action, log) => {
    if (action === "view") {
      setSelectedLog(log);
    }
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px]"></div>
      <div className=" border-t-0 border-gray-300 rounded-b-md">
        <div className="">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="color-black text-lg font-semibold">Audit Logs</h4>
          </div>

          <div className="border border-customGray rounded-[20px] p-5">
            <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
              <div className="relative w-full md:w-[60%]">
                <input
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by activity type"
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
                    value={filters.status}
                    onChange={handleStatusChange}
                    className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="client">Client</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
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
                data={getFilteredData()} // Changed from clientsList to getFilteredData()
                pagination={{
                  page: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  total: pagination.totalLogs,
                  limit: pagination.limit,
                }}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                onAction={handleActionClick}
                mode="AuditList"
              />
            )}
          </div>
        </div>
      </div>
      {selectedLog && (
        <AuditDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default AuditLogs;
