import React, { useEffect, useState } from "react";
import Table from "../../Table/table";
import { toast } from "react-toastify";
import { getStaffPerformanceMetricsApi } from "../../../api/staffManagement.api";

const PerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [stats, setStats] = useState({
    avgTurnaround: "0 days",
    totalTasks: 0,
    totalCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchPerformanceData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getStaffPerformanceMetricsApi({
        page,
        limit,
        search,
        status,
      });

      if (response.success) {
        setPerformanceData(response.data);
        setStats(response.stats);
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        });
      } else {
        toast.error(response.message || "Failed to fetch performance data");
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [search, status]);

  const handlePageChange = (newPage) => {
    fetchPerformanceData(newPage, pagination.limit);
  };

  const handleLimitChange = (newLimit) => {
    fetchPerformanceData(1, newLimit);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    fetchPerformanceData(1, pagination.limit);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchPerformanceData(pagination.page + 1, pagination.limit);
    }
  };
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchPerformanceData(pagination.page - 1, pagination.limit);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    fetchPerformanceData(1, pagination.limit);
  };

  return (
    <>
      <div className="flex gap-6 w-full mb-6">
        {/* Total Task */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {stats.totalTasks}
            </h2>
            <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {stats.totalTasks - stats.totalCompleted}
            </h2>
            <p className="text-gray-500 text-sm font-medium">Pending Tasks</p>
          </div>
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {stats.totalCompleted}
            </h2>
            <p className="text-gray-500 text-sm font-medium">Completed Tasks</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search staff..."
          className="px-4 py-2 border rounded-md w-64"
          value={search}
          onChange={handleSearchChange}
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="bad">Bad</option>
          <option value="average">Average </option>{" "}
          <option value="good">Good</option>
          <option value="excellent">Excellent</option>
        </select>
      </div>

      <Table
        data={performanceData}
        mode="performanceStats"
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        loading={loading}
      />
    </>
  );
};

export default PerformanceMetrics;
