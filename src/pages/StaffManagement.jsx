import React, { useState, useEffect, use } from "react";
import { staffTabs } from "../adminutils/tabactions";
import AddStaffModal from "../Component/StaffManagement/AddStaffModal";
import {
  getAllStaffListingApi,
  getDocumentheadersummaryApi,
  getRecentactivitirsApi,
} from "../api/staffManagement.api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Table from "../Component/Table/table";
import StafListing from "../Component/StaffManagement/staffTabs/StafListing";

dayjs.extend(relativeTime);

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [recentActivities, setRectentActivities] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [headerSummary, setHeaderSummary] = useState({});

  const fetchheaderSummary = async () => {
    try {
      let res = await getDocumentheadersummaryApi();
      if (res.success) {
        setHeaderSummary(res.data);
        console.log("Header Summary:", res.data);
      }
    } catch (error) {
      console.error("Error fetching document header summary:", error);
    }
  };

  const fetchRecentActivities = async (
    page = 1,
    search = searchQuery,
    status = statusFilter
  ) => {
    setIsLoadingActivities(true);
    try {
      let res = await getRecentactivitirsApi(page, 10, search, status);
      if (res.success) {
        if (page === 1) {
          setRectentActivities(res.recentActivity);
        } else {
          setRectentActivities((prev) => [...prev, ...res.recentActivity]);
        }
        setHasMoreActivities(res.currentPage < res.totalPages);
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = activitiesPage + 1;
    setActivitiesPage(nextPage);
    fetchRecentActivities(nextPage);
  };

  const fetchAllStaffList = async () => {
    try {
      let res = await getAllStaffListingApi();
      if (res.success) {
        setStaffList(res.data);
      }
    } catch (error) {
      console.error("Error fetching all staff list:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "Overview") {
      setActivitiesPage(1);
      fetchRecentActivities(1);
      fetchheaderSummary();
    }
    if (activeTab === "Staff List") {
      fetchAllStaffList();
    }
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "Overview") {
        setActivitiesPage(1);
        fetchRecentActivities(1, searchQuery, statusFilter);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const StatCard = ({ title, value, icon, bgColor, textColor }) => (
    <div className="border border-gray-200 p-5 rounded-[20px] flex justify-between items-center bg-white">
      <div className="flex justify-between items-center w-full">
        <div>
          <span className="text-gray-600 font-medium text-[14px] block mb-1">
            {title}
          </span>
          <h4 className="text-gray-800 font-bold text-[32px] leading-none">
            {value}
          </h4>
        </div>
        <div
          className={`${bgColor} flex justify-center items-center w-[50px] h-[50px] rounded-[12px]`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const CompletionRateIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#10B981"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M8 12l2 2 4-4"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ActiveStaffIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const TotalStaffIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="4" stroke="#06B6D4" strokeWidth="2" />
      <path
        d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const PendingTasksIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const handleClear = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="p-7.5 pt-[86px] w-full min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px] bg-white rounded-t-lg">
        {staffTabs.map((tab) => (
          <button
            key={tab}
            className={`px-5 py-[12px] text-[15px] leading-[100%] tracking-[0] font-medium rounded-t-lg transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-50 text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-b-2 border-transparent"
            }`}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Avg Completion Rate"
              value={`${headerSummary?.completionRate || 0}`}
              icon={<CompletionRateIcon />}
              bgColor="bg-green-100"
            />
            <StatCard
              title="Active Staff"
              value={headerSummary?.activeStaff || 0}
              icon={<ActiveStaffIcon />}
              bgColor="bg-blue-100"
            />
            <StatCard
              title="Total Staff"
              value={headerSummary?.totalStaff || 0}
              icon={<TotalStaffIcon />}
              bgColor="bg-cyan-100"
            />
            <StatCard
              title="Pending Tasks"
              value={headerSummary?.pendingRequests || 0}
              icon={<PendingTasksIcon />}
              bgColor="bg-red-100"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-[20px] p-6 border border-gray-200">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setAddStaffModalOpen(true)}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-[12px] font-medium transition-colors duration-200"
              >
                Add New Staff
              </button>
              <button
                onClick={() => setActiveTab("Client Assignment")}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-[12px] font-medium transition-colors duration-200"
              >
                Assign Clients
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-[20px] p-6 border border-gray-200">
            <h3 className="text-gray-800 font-semibold text-lg mb-4">
              Recent Activities
            </h3>

            {/* Search and Filter */}
            <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-[10px] px-3 py-2 pr-8 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="old">Old</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setActivitiesPage(1);
                    fetchRecentActivities(1);
                  }}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm underline"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                <>
                  {recentActivities.map((activity, index) => {
                    const [staff, ...actionArr] = activity.message.split(" ");
                    const action = actionArr.join(" ");

                    return (
                      <div
                        key={`${activity._id || index}`}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-[12px] hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">
                            {staff
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-gray-800 font-medium">
                                <span className="text-blue-600">{staff}</span>{" "}
                                {action}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                {activity.title || "—"}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-gray-500 text-sm whitespace-nowrap ml-4">
                                {dayjs(activity.createdAt).fromNow()}
                              </span>
                              {/* {activity.status && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                    activity.status === "new"
                                      ? "bg-green-100 text-green-800"
                                      : activity.status === "old"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {activity.status}
                                </span>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {hasMoreActivities && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingActivities}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                          isLoadingActivities
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isLoadingActivities ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading...
                          </span>
                        ) : (
                          "Load More Activities"
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No activities
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery || statusFilter !== "all"
                      ? "No activities match your search criteria"
                      : "There are no recent activities to display"}
                  </p>
                  {(searchQuery || statusFilter !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setActivitiesPage(1);
                        fetchRecentActivities(1);
                      }}
                      className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Staff List Tab Content */}
      {activeTab === "Staff List" && (
        <div className="bg-white rounded-[20px] p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Staff List
          </h3>
          <StafListing staffListdata={staffList} />
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={addStaffModalOpen}
        onClose={() => setAddStaffModalOpen(false)}
      />
    </div>
  );
};

export default StaffManagement;
