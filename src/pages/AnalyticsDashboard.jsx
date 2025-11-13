import React, { useEffect, useState } from "react";
import {
  getAnalyticsDashboard,
  getAnalyticsEvents,
  exportAnalytics,
} from "../api/analytics.api";
import Loader from "../Component/Loader/Loader";
import { toast } from "react-toastify";
import moment from "moment";

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalEvents: 0,
      successRate: 0,
      errorRate: 0,
      eventsByType: {},
      eventsByStatus: {},
    },
    topUsers: [],
    topCategories: [],
    recentEvents: [],
    trends: [],
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    eventType: "",
    category: "",
    status: "",
    userType: "",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  });

  // Fetch dashboard overview
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await getAnalyticsDashboard(params);
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events list
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.userType) params.userType = filters.userType;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await getAnalyticsEvents(params);
      if (response.success && response.data) {
        setEvents(response.data.events || []);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.pagination.pages || 1,
            total: response.data.pagination.total || 0,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  };

  // Export analytics
  const handleExport = async () => {
    try {
      setExporting(true);
      await exportAnalytics(filters);
      toast.success("Analytics data exported successfully");
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast.error("Failed to export analytics data");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchEvents();
  }, [
    filters.eventType,
    filters.category,
    filters.status,
    filters.userType,
    filters.startDate,
    filters.endDate,
    pagination.currentPage,
    pagination.limit,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = () => {
    return !!(
      filters.eventType ||
      filters.category ||
      filters.status ||
      filters.userType ||
      filters.startDate ||
      filters.endDate
    );
  };

  const handleClearFilters = () => {
    setFilters({
      eventType: "",
      category: "",
      status: "",
      userType: "",
      startDate: "",
      endDate: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleLimitChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      currentPage: 1,
    }));
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("MMM DD, YYYY HH:mm");
  };

  const getUserName = (event) => {
    // Handle userId (staff) - can be populated object or null
    if (event?.userId) {
      const user = event.userId;
      // Check if it's a populated object with _id property
      if (typeof user === 'object' && user._id) {
        if (user.first_name || user.last_name) {
          return `${user.first_name || ""} ${user.last_name || ""}`.trim();
        }
        return user.email || "Unknown";
      }
      // If it's just an ObjectId string, we can't get the name
      return "Unknown";
    }
    
    // Handle clientId (clients) - can be populated object or null
    if (event?.clientId) {
      const client = event.clientId;
      // Check if it's a populated object with _id property
      if (typeof client === 'object' && client._id) {
        if (client.name || client.lastName) {
          return `${client.name || ""} ${client.lastName || ""}`.trim();
        }
        return client.email || "Unknown";
      }
      // If it's just an ObjectId string, we can't get the name
      return "Unknown";
    }
    
    return "Unknown";
  };

  const formatEventField = (value) => {
    if (!value) return "-";
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px]"></div>
      <div className="border-t-0 border-gray-300 rounded-b-md">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="color-black text-lg font-semibold">Analytics Dashboard</h4>
          {/* <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button> */}
        </div>

        {/* Overview Cards */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border border-customGray rounded-[20px] p-5 bg-white">
              <h5 className="text-sm text-gray-600 mb-2">Total Events</h5>
              <p className="text-2xl font-bold color-black">
                {dashboardData.overview.totalEvents.toLocaleString()}
              </p>
            </div>
            <div className="border border-customGray rounded-[20px] p-5 bg-white">
              <h5 className="text-sm text-gray-600 mb-2">Success Rate</h5>
              <p className="text-2xl font-bold text-green-600">
                {dashboardData.overview.successRate}%
              </p>
            </div>
            <div className="border border-customGray rounded-[20px] p-5 bg-white">
              <h5 className="text-sm text-gray-600 mb-2">Error Rate</h5>
              <p className="text-2xl font-bold text-red-600">
                {dashboardData.overview.errorRate}%
              </p>
            </div>
            <div className="border border-customGray rounded-[20px] p-5 bg-white">
              <h5 className="text-sm text-gray-600 mb-2">Top Category</h5>
              <p className="text-2xl font-bold color-black">
                {dashboardData.topCategories[0]?.category || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="border border-customGray rounded-[20px] p-5 mb-6">
          <h5 className="text-base font-semibold mb-4 color-black">Filters</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Event Type</label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              >
                <option value="">All Types</option>
                <option value="tool_usage">Tool Usage</option>
                <option value="feature_access">Feature Access</option>
                <option value="document_action">Document Action</option>
                <option value="chat_action">Chat Action</option>
                <option value="login">Login</option>
                <option value="download">Download</option>
                <option value="upload">Upload</option>
                <option value="api_call">API Call</option>
                <option value="error">Error</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g., ESRP, ALE"
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">User Type</label>
              <select
                name="userType"
                value={filters.userType}
                onChange={handleFilterChange}
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              >
                <option value="">All Users</option>
                <option value="staff">Staff</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full border border-[#eaeaea] rounded-[10px] py-2 px-3"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
              className={`px-4 py-2 rounded-[10px] transition-colors font-medium text-sm ${
                hasActiveFilters()
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 opacity-50 cursor-not-allowed hover:bg-gray-200"
              }`}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="border border-customGray rounded-[20px] p-5">
          <h5 className="text-base font-semibold mb-4 color-black">Analytics Events</h5>
          {eventsLoading ? (
            <Loader />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#E4F0F3] border border-[#eaeaea]">
                    <tr>
                      <th className="px-6 py-3 text-base font-medium">Date/Time</th>
                      <th className="px-6 py-3 text-base font-medium">User</th>
                      <th className="px-6 py-3 text-base font-medium">Event Type</th>
                      <th className="px-6 py-3 text-base font-medium">Category</th>
                      <th className="px-6 py-3 text-base font-medium">Action</th>
                      <th className="px-6 py-3 text-base font-medium">Status</th>
                      <th className="px-6 py-3 text-base font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((event, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b border-[#eaeaea]"
                        >
                          <td className="px-6 py-4 text-base">
                            {formatDate(event.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-base">
                            {getUserName(event)}
                          </td>
                          <td className="px-6 py-4 text-base">{formatEventField(event.eventType)}</td>
                          <td className="px-6 py-4 text-base">{event.category}</td>
                          <td className="px-6 py-4 text-base">{formatEventField(event.action)}</td>
                          <td className="px-6 py-4 text-base">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                event.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : event.status === "error"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-base">
                            {event.duration ? `${event.duration}ms` : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={pagination.limit}
                      onChange={handleLimitChange}
                      className="border border-[#eaeaea] rounded px-2 py-1"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      of {pagination.total} events
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

