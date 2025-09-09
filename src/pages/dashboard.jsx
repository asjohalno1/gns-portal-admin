import React, { useEffect, useState } from "react";
import Table from "../Component/Table/table";
import { dashboarData } from "../api/dashboard.api";
import { useNavigate } from "react-router-dom";
import DocumentDeatailsModal from "../Component/DocumentDetails/DocumentDeatailsModal";
import Loader from "../Component/Loader/Loader";

const Dashboard = () => {
  const [open, isOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    recentActivity: [],

    summary: {},
    urgentTasks: { overdue: [], today: [], tomorrow: [] },
    clients: [],
    pagination: {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    },
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDocument, setViewDocument] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboarData({
          page: dashboardData.pagination.page,
          limit: dashboardData.pagination.limit,
          search: searchQuery,
          status: statusFilter,
        });
        setDashboardData({
          recentActivity: response.data.recentActivity || [],
          summary: response.data.summary || {},
          urgentTasks: response.data.urgentTasks || {
            overdue: [],
            today: [],
            tomorrow: [],
          },
          clients: response.data.clients || [],
          pagination: {
            total: response.data.totalClients || 0,
            totalPages: response.data.totalPages || 0,
            page: response.data.currentPage || 1,
            limit: dashboardData.pagination.limit,
          },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [
    dashboardData.pagination.page,
    dashboardData.pagination.limit,
    searchQuery,
    statusFilter,
  ]);

  function toggleButton() {
    isOpen((open) => !open);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setDashboardData((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handleNextPage = () => {
    if (dashboardData.pagination.page < dashboardData.pagination.totalPages) {
      setDashboardData((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page: prev.pagination.page + 1 },
      }));
    }
  };

  const handlePrevPage = () => {
    if (dashboardData.pagination.page > 1) {
      setDashboardData((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page: prev.pagination.page - 1 },
      }));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDashboardData((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: 1, limit: 10 },
    }));
  };

  const handleActionChange = (action, item) => {
    console.log("Action:", action, "Item:", item);
    switch (action) {
      case "view":
        setViewDocument(true);
        setSelectedDocument(item);

        break;
      case "Request":
        navigate("/admin/documentrequestmanagement");
        break;
      case "sendReminder":
        navigate("/admin/send-reminder");
        break;

      default:
        break;
    }
  };

  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="bg-gradient-to-r from-[#1BA3A3] to-[#2E7ED4] rounded-[20px] p-5">
        <h4 className="text-2xl font-medium text-white mb-[15px]">
          Welcome, User!
        </h4>
        <p className="text-white text-base font-medium">
          Here's an overview of your Staff status and upcoming deadlines.
        </p>
      </div>
      <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Document Request */}
        <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <span className="text-body font-medium text-[14px]">
                Active Document Request
              </span>
              <h4 className="text-body font-semibold text-[28px]">
                {dashboardData.summary.completedDocumentsRequest || 0}
              </h4>
            </div>
            <div className="bg-bgGreen flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_65_897)">
                  <path
                    d="M20.0002 37.9164C15.2484 37.9164 10.6912 36.0288 7.33117 32.6688C3.97114 29.3087 2.0835 24.7516 2.0835 19.9998C2.0835 15.248 3.97114 10.6908 7.33117 7.33077C10.6912 3.97075 15.2484 2.0831 20.0002 2.0831C22.7923 2.07386 25.5463 2.73094 28.0335 3.99977C28.1801 4.07419 28.3107 4.17676 28.4177 4.30163C28.5247 4.42649 28.6061 4.57122 28.6571 4.72753C28.7082 4.88384 28.728 5.04868 28.7153 5.21264C28.7027 5.3766 28.6579 5.53646 28.5835 5.6831C28.5091 5.82975 28.4065 5.9603 28.2816 6.0673C28.1568 6.1743 28.0121 6.25566 27.8557 6.30673C27.6994 6.35781 27.5346 6.37759 27.3706 6.36496C27.2067 6.35232 27.0468 6.30752 26.9002 6.2331C24.7666 5.1335 22.4004 4.56194 20.0002 4.56644C16.9517 4.56644 13.9718 5.47019 11.4369 7.16346C8.90196 8.85673 6.92596 11.2635 5.75862 14.0796C4.59128 16.8956 4.28501 19.9945 4.87852 22.9846C5.47202 25.9747 6.93866 28.7217 9.09306 30.8784C11.2474 33.0352 13.9929 34.5048 16.9823 35.1015C19.9718 35.6982 23.071 35.3953 25.8883 34.231C28.7056 33.0667 31.1145 31.0933 32.8106 28.5603C34.5066 26.0272 35.4135 23.0482 35.4168 19.9998C35.4255 19.861 35.4255 19.7219 35.4168 19.5831C35.3859 19.2516 35.4879 18.9214 35.7005 18.6651C35.913 18.4088 36.2186 18.2474 36.5502 18.2164C36.8817 18.1855 37.2119 18.2875 37.4682 18.5001C37.7245 18.7126 37.8859 19.0183 37.9168 19.3498V19.9998C37.9124 24.7502 36.0234 29.3048 32.6643 32.6639C29.3052 36.023 24.7506 37.912 20.0002 37.9164Z"
                    fill="#20BF55"
                  />
                  <path
                    d="M19.7002 25.6833C19.5382 25.6857 19.3775 25.6544 19.2283 25.5912C19.079 25.5281 18.9446 25.4346 18.8335 25.3166L10.7835 17.4166C10.5495 17.1823 10.418 16.8646 10.418 16.5333C10.418 16.2021 10.5495 15.8844 10.7835 15.65C11.0228 15.4188 11.3425 15.2896 11.6752 15.2896C12.0079 15.2896 12.3276 15.4188 12.5669 15.65L19.7169 22.7L35.8002 6.88331C36.0395 6.65215 36.3592 6.52295 36.6919 6.52295C37.0246 6.52295 37.3443 6.65215 37.5835 6.88331C37.8176 7.11769 37.9491 7.43539 37.9491 7.76664C37.9491 8.0979 37.8176 8.4156 37.5835 8.64998L20.6169 25.3166C20.4976 25.4376 20.3546 25.5326 20.1968 25.5957C20.0391 25.6588 19.87 25.6886 19.7002 25.6833Z"
                    fill="#20BF55"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_65_897">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Active Secure Links */}
        <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <span className="text-body font-medium text-[14px]">
                Active Secure Links
              </span>
              <h4 className="text-body font-semibold text-[28px]">
                {dashboardData.summary.activeSecureLink || 0}
              </h4>
            </div>
            <div className="bg-bgPurple flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_561_3699)">
                  <g clip-path="url(#clip1_561_3699)">
                    <path
                      d="M17.242 20.399C16.8297 20.3988 16.4215 20.317 16.041 20.1583C15.6605 19.9995 15.3151 19.7669 15.025 19.474L11.918 16.348C11.327 15.763 11 14.975 11 14.134C11 13.293 11.327 12.505 11.922 11.915C13.067 10.745 15.16 10.73 16.344 11.918L16.878 12.453C17.006 12.5962 17.0743 12.783 17.0688 12.975C17.0633 13.1671 16.9845 13.3497 16.8484 13.4853C16.7124 13.621 16.5296 13.6993 16.3375 13.7043C16.1455 13.7093 15.9588 13.6404 15.816 13.512L15.282 12.977C14.669 12.362 13.581 12.365 12.986 12.972C12.67 13.286 12.5 13.697 12.5 14.134C12.5 14.571 12.67 14.982 12.979 15.288L16.088 18.417C16.3726 18.7046 16.7545 18.8754 17.1587 18.8957C17.5628 18.9161 17.9599 18.7845 18.272 18.527C18.4268 18.4106 18.6205 18.3586 18.8128 18.3816C19.005 18.4047 19.1809 18.5012 19.3038 18.6509C19.4266 18.8005 19.4869 18.9919 19.472 19.1849C19.4572 19.378 19.3683 19.5579 19.224 19.687C18.666 20.1472 17.9653 20.399 17.242 20.399Z"
                      fill="#497FFF"
                    />
                    <path
                      d="M20.868 24C20.4557 24.0015 20.0472 23.9203 19.6668 23.7612C19.2863 23.6022 18.9416 23.3685 18.653 23.074L18.141 22.56C18.0715 22.4902 18.0164 22.4074 17.9788 22.3163C17.9413 22.2252 17.9221 22.1276 17.9223 22.0291C17.9224 21.9306 17.942 21.833 17.9799 21.7421C18.0178 21.6511 18.0732 21.5685 18.143 21.499C18.2128 21.4295 18.2956 21.3744 18.3867 21.3368C18.4778 21.2993 18.5754 21.2801 18.6739 21.2803C18.7724 21.2805 18.87 21.3 18.9609 21.3379C19.0519 21.3758 19.1345 21.4312 19.204 21.501L19.719 22.018C20.334 22.641 21.407 22.638 22.017 22.021C22.331 21.708 22.501 21.298 22.501 20.861C22.501 20.424 22.331 20.013 22.022 19.707L18.913 16.578C18.7614 16.4263 18.5813 16.3062 18.3831 16.2245C18.1849 16.1428 17.9724 16.1012 17.758 16.102C17.3841 16.0983 17.0208 16.2264 16.732 16.464C16.5788 16.591 16.3815 16.652 16.1833 16.6336C15.9852 16.6151 15.8025 16.5187 15.6755 16.3655C15.5485 16.2123 15.4875 16.015 15.5059 15.8169C15.5244 15.6187 15.6208 15.436 15.774 15.309C16.959 14.327 18.872 14.414 19.976 15.518L23.083 18.645C23.673 19.232 24 20.021 24 20.861C24 21.701 23.673 22.49 23.078 23.08C22.495 23.672 21.708 24 20.868 24ZM11.25 20H2.25C1.65351 19.9992 1.08167 19.7619 0.659886 19.3401C0.238102 18.9183 0.000793738 18.3465 0 17.75L0 9.25001C0 8.01001 1.009 7.00001 2.25 7.00001H13.75C14.0671 6.99926 14.3806 7.06643 14.6695 7.19701C14.9585 7.32758 15.2161 7.51853 15.425 7.75701C15.5479 7.90802 15.6073 8.10086 15.5908 8.29486C15.5742 8.48886 15.483 8.66884 15.3363 8.79686C15.1896 8.92488 14.9989 8.99092 14.8045 8.98106C14.61 8.9712 14.427 8.88621 14.294 8.74401C14.2261 8.66674 14.1424 8.60497 14.0485 8.56287C13.9547 8.52077 13.8529 8.49934 13.75 8.50001H2.25C2.05109 8.50001 1.86032 8.57902 1.71967 8.71968C1.57902 8.86033 1.5 9.05109 1.5 9.25001V17.75C1.5 18.163 1.836 18.5 2.25 18.5H11.25C11.4489 18.5 11.6397 18.579 11.7803 18.7197C11.921 18.8603 12 19.0511 12 19.25C12 19.4489 11.921 19.6397 11.7803 19.7803C11.6397 19.921 11.4489 20 11.25 20Z"
                      fill="#497FFF"
                    />
                    <path
                      d="M12.25 8.5C12.0511 8.5 11.8603 8.42098 11.7197 8.28033C11.579 8.13968 11.5 7.94891 11.5 7.75V5C11.5 3.07 9.93 1.5 8 1.5C6.07 1.5 4.5 3.07 4.5 5V7.75C4.5 7.94891 4.42098 8.13968 4.28033 8.28033C4.13968 8.42098 3.94891 8.5 3.75 8.5C3.55109 8.5 3.36032 8.42098 3.21967 8.28033C3.07902 8.13968 3 7.94891 3 7.75V5C3 2.243 5.243 0 8 0C10.757 0 13 2.243 13 5V7.75C13 7.94891 12.921 8.13968 12.7803 8.28033C12.6397 8.42098 12.4489 8.5 12.25 8.5Z"
                      fill="#497FFF"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_561_3699">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_561_3699">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <span className="text-body font-medium text-[14px]">
                Total Clients
              </span>
              <h4 className="text-body font-semibold text-[28px]">
                {dashboardData.summary.totalClients || 0}
              </h4>
            </div>
            <div className="bg-bgTeal flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_561_3689)">
                  <path
                    d="M8.65743 10.4615C7.71989 10.4615 6.8034 10.1548 6.02387 9.58C5.24433 9.00523 4.63676 8.1883 4.27798 7.2325C3.9192 6.2767 3.82532 5.22497 4.00823 4.2103C4.19113 3.19563 4.6426 2.2636 5.30554 1.53206C5.96848 0.800523 6.81312 0.30234 7.73264 0.10051C8.65217 -0.10132 9.60528 0.00226641 10.4715 0.398171C11.3376 0.794075 12.078 1.46452 12.5988 2.32471C13.1197 3.18491 13.3977 4.19622 13.3977 5.23077C13.3962 6.61756 12.8963 7.94708 12.0077 8.92768C11.119 9.90829 9.91418 10.4599 8.65743 10.4615ZM8.65743 1.84616C8.05078 1.84616 7.45776 2.04466 6.95336 2.41657C6.44895 2.78847 6.05582 3.31708 5.82367 3.93553C5.59151 4.55399 5.53077 5.23453 5.64912 5.89108C5.76747 6.54763 6.0596 7.15071 6.48856 7.62406C6.91752 8.0974 7.46405 8.41976 8.05904 8.55035C8.65403 8.68095 9.27075 8.61392 9.83121 8.35775C10.3917 8.10157 10.8707 7.66776 11.2077 7.11116C11.5448 6.55456 11.7247 5.90019 11.7247 5.23077C11.7241 4.33332 11.4007 3.4728 10.8256 2.83821C10.2506 2.20361 9.47073 1.84681 8.65743 1.84616ZM13.1088 24H4.18595C1.48678 24 0 22.3692 0 19.408C0 16.1317 1.67973 12.3077 6.41332 12.3077H10.8748C15.6084 12.3077 17.2881 16.1317 17.2881 19.408C17.2914 22.3692 15.8047 24 13.1088 24ZM6.41667 14.1538C5.77978 14.0995 5.13979 14.1983 4.54088 14.4435C3.94198 14.6886 3.39842 15.0743 2.94773 15.5738C2.49705 16.0734 2.14998 16.6749 1.93048 17.3369C1.71099 17.9988 1.62429 18.7055 1.67639 19.408C1.67639 21.3329 2.42814 22.1538 4.18929 22.1538H13.1088C14.87 22.1538 15.6217 21.3329 15.6217 19.408C15.6739 18.7051 15.5871 17.9981 15.3674 17.3359C15.1477 16.6736 14.8004 16.0719 14.3493 15.5723C13.8983 15.0727 13.3543 14.6871 12.7549 14.4422C12.1556 14.1973 11.5153 14.0989 10.8781 14.1538H6.41667ZM17.0795 11.0031C16.0792 11.0069 15.1177 10.5763 14.4026 9.80431C14.2671 9.62955 14.1955 9.40523 14.202 9.17529C14.2085 8.94536 14.2926 8.72638 14.4377 8.56127C14.5829 8.39615 14.7787 8.2968 14.9868 8.28268C15.1949 8.26856 15.4002 8.34068 15.5626 8.48493C15.9669 8.91988 16.5104 9.16134 17.0751 9.15692C17.3645 9.16038 17.6516 9.10003 17.9196 8.97941C18.1876 8.85879 18.4311 8.68032 18.6357 8.45448C18.8404 8.22864 19.0021 7.95998 19.1114 7.66425C19.2208 7.36852 19.2754 7.05168 19.2723 6.73231C19.2714 6.08956 19.0396 5.47342 18.6278 5.01893C18.2159 4.56443 17.6575 4.30867 17.0751 4.30769C16.755 4.30207 16.4383 4.38098 16.1515 4.53785C15.9538 4.64899 15.7241 4.6689 15.5131 4.5932C15.302 4.51749 15.1269 4.35237 15.0261 4.13416C14.9254 3.91594 14.9074 3.66252 14.976 3.42963C15.0446 3.19673 15.1942 3.00346 15.392 2.89231C15.9151 2.60173 16.4939 2.454 17.0795 2.46154C18.106 2.46154 19.0904 2.9115 19.8162 3.71242C20.5421 4.51334 20.9498 5.59963 20.9498 6.73231C20.9498 7.86499 20.5421 8.95127 19.8162 9.7522C19.0904 10.5531 18.106 11.0031 17.0795 11.0031ZM20.5371 21.5385H19.7787C19.5568 21.5385 19.3441 21.4412 19.1872 21.2681C19.0303 21.095 18.9422 20.8602 18.9422 20.6154C18.9422 20.3706 19.0303 20.1358 19.1872 19.9627C19.3441 19.7896 19.5568 19.6923 19.7787 19.6923H20.5371C21.8142 19.6923 22.3106 19.1508 22.3106 17.76C22.3488 17.2412 22.2845 16.7195 22.1222 16.2308C21.9599 15.7421 21.7034 15.2981 21.3704 14.9295C21.0374 14.5609 20.6359 14.2764 20.1935 14.0958C19.7512 13.9151 19.2786 13.8425 18.8083 13.8831H17.1241C16.9023 13.8831 16.6895 13.7858 16.5326 13.6127C16.3757 13.4396 16.2876 13.2048 16.2876 12.96C16.2876 12.7152 16.3757 12.4804 16.5326 12.3073C16.6895 12.1342 16.9023 12.0369 17.1241 12.0369H18.8083C19.5007 11.9867 20.1948 12.1005 20.844 12.3705C21.4933 12.6406 22.0827 13.0606 22.5728 13.6026C23.0629 14.1446 23.4423 14.7959 23.6857 15.513C23.929 16.23 24.0306 16.9961 23.9836 17.76C24.0313 18.2713 23.9747 18.7879 23.818 19.2719C23.6614 19.756 23.4085 20.1952 23.0781 20.5575C22.7477 20.9197 22.348 21.1959 21.9083 21.3656C21.4687 21.5353 21.0002 21.5944 20.5371 21.5385Z"
                    fill="#1BA3A3"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_561_3689">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Total Staffs */}
        <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <div className="">
              <span className="text-body font-medium text-[14px]">
                Total Staffs
              </span>
              <h4 className="text-body font-semibold text-[28px]">
                {dashboardData.summary.totalStaff || 0}
              </h4>
            </div>
            <div className="bg-bgOrange flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 24C9.87205 24.0008 9.74563 23.9726 9.6308 23.9175L5.88468 22.0948C4.1099 21.2343 2.61789 19.9062 1.5778 18.261C0.537711 16.6158 -0.00884324 14.7193 0.000108216 12.7867V3.68099C7.05407e-05 3.47071 0.0846717 3.26882 0.235716 3.11873C0.38676 2.96865 0.59218 2.88236 0.807794 2.87843H3.477C4.5689 2.87281 5.63642 2.56314 6.5539 1.98587L9.5308 0.12573C9.66296 0.0436193 9.8164 0 9.97311 0C10.1298 0 10.2833 0.0436193 10.4154 0.12573L13.3923 1.98587C14.3098 2.56314 15.3773 2.87281 16.4692 2.87843H19.1384C19.2497 2.87336 19.3609 2.89036 19.4652 2.92841C19.5696 2.96647 19.6649 3.02478 19.7454 3.09981C19.826 3.17485 19.8901 3.26505 19.9338 3.36495C19.9776 3.46485 20.0001 3.57237 20 3.68099V12.7867C20.006 14.7196 19.4565 16.6156 18.4137 18.2595C17.3709 19.9034 15.8765 21.2295 14.1 22.0873L10.3539 23.91C10.2443 23.9655 10.1234 23.9962 10 24ZM1.63086 4.49855V12.7867C1.62618 14.4219 2.09138 16.0258 2.97374 17.4164C3.8561 18.8071 5.12033 19.9289 6.62313 20.6547L10 22.3049L13.3769 20.6547C14.8797 19.9289 16.144 18.8071 17.0263 17.4164C17.9087 16.0258 18.3739 14.4219 18.3692 12.7867V4.49855H16.5231C15.1068 4.49845 13.7206 4.09999 12.5308 3.35097L10 1.74585L7.46928 3.33597C6.28111 4.09028 4.89481 4.49398 3.477 4.49855H1.63086Z"
                  fill="#EB8909"
                />
                <path
                  d="M9.9997 12.599C9.26943 12.599 8.55557 12.3878 7.94838 11.9922C7.34119 11.5966 6.86794 11.0343 6.58848 10.3765C6.30902 9.7186 6.2359 8.99471 6.37837 8.29633C6.52083 7.59794 6.87249 6.95644 7.38886 6.45293C7.90524 5.94943 8.56314 5.60653 9.27937 5.46762C9.9956 5.3287 10.738 5.4 11.4127 5.67249C12.0873 5.94499 12.664 6.40644 13.0697 6.9985C13.4754 7.59056 13.692 8.28664 13.692 8.9987C13.6899 9.95294 13.3003 10.8675 12.6083 11.5423C11.9163 12.217 10.9783 12.597 9.9997 12.599ZM9.9997 6.99606C9.59349 6.99606 9.1964 7.11351 8.85865 7.33356C8.5209 7.55362 8.25766 7.86639 8.10221 8.23232C7.94676 8.59826 7.90608 9.00092 7.98533 9.3894C8.06458 9.77788 8.26019 10.1347 8.54742 10.4148C8.83465 10.6949 9.20061 10.8856 9.59902 10.9629C9.99742 11.0401 10.4104 11.0005 10.7857 10.8489C11.161 10.6973 11.4817 10.4406 11.7074 10.1113C11.9331 9.78198 12.0535 9.39479 12.0535 8.9987C12.0515 8.46887 11.8342 7.96141 11.4493 7.58746C11.0643 7.21352 10.5431 7.00355 9.9997 7.00356V6.99606ZM14.9227 17.0018H13.2843C13.2823 16.5787 13.109 16.1735 12.8022 15.8743C12.4953 15.5751 12.0798 15.4061 11.6458 15.4042H8.35356C7.91901 15.4042 7.50227 15.5725 7.195 15.8721C6.88773 16.1717 6.71511 16.5781 6.71511 17.0018H5.07666C5.07666 16.1544 5.4219 15.3416 6.03644 14.7424C6.65098 14.1432 7.48447 13.8066 8.35356 13.8066H11.6381C12.5079 13.8066 13.3422 14.143 13.958 14.742C14.5737 15.341 14.9207 16.1537 14.9227 17.0018Z"
                  fill="#EB8909"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-7">
        {/* Recent Activity */}
        <div className="border border-customGray p-5 rounded-[20px]">
          <h4 className="text-body font-semibold text-lg mb-5">
            Recent Activity
          </h4>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="divide-y divide-gray-100 h-[250px] overflow-y-scroll">
                {dashboardData?.recentActivity &&
                dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 mb-1 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer group rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                          📄
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-[15px] font-semibold text-gray-900">
                                {activity.title || "Untitled"}
                              </h3>
                              <p className="text-[13px] text-gray-500 mt-1">
                                {activity.message || "No details available"}
                              </p>
                            </div>
                            {/* Timestamp (placeholder for now) */}
                            <div className="ml-4 text-right">
                              <span className="text-[12px] text-gray-400">
                                Recently
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No recent activity available !
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Urgent Task and Deadlines */}
        <div className="border border-customGray p-5 rounded-[20px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h4 className="text-body font-semibold text-lg mb-5">
                Urgent Task and Deadlines
              </h4>
              {["overdue", "today", "tomorrow"].some(
                (category) =>
                  (dashboardData?.urgentTasks?.[category] || []).length > 0
              ) ? (
                <ul className="overflow-y-auto h-[225px] pr-2">
                  {["overdue", "today", "tomorrow"].map((category) => {
                    const tasks = dashboardData?.urgentTasks?.[category] || [];
                    const labelColor = {
                      overdue: "#F94853",
                      today: "#F94853",
                      tomorrow: "#FDA830",
                    }[category];

                    const bgColor = {
                      overdue: "#FDEAEA",
                      today: "#FDEAEA",
                      tomorrow: "#FFF4E0",
                    }[category];

                    return tasks.map((task, idx) => {
                      const formattedDate = new Date(
                        task.dueDate
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <li
                          key={`${category}-${idx}`}
                          className="rounded-[10px] border-l-4 p-3 mb-3 shadow-sm"
                          style={{
                            borderLeftColor: labelColor,
                            backgroundColor: bgColor,
                          }}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <h4 className="font-semibold text-base text-gray-900 flex-1 min-w-0 truncate">
                              Request for:{" "}
                              <span className="text-indigo-600 font-bold truncate">
                                {task?.subCategory}
                              </span>
                              <span className="text-sm text-gray-500 truncate">
                                {" "}
                                ({task.category})
                              </span>
                            </h4>

                            {category === "overdue" && task.daysOverdue && (
                              <span className="flex-shrink-0 text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium shadow-sm">
                                {task.daysOverdue}d overdue
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-900 mt-1">
                            <span className="font-medium">Request to:</span>{" "}
                            {task.clientName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Deadline: {formattedDate}
                          </p>

                          {/* Upload status */}
                          <p className="text-xs mt-2">
                            {task.isUploaded ? (
                              <span className="bg-green-100 text-green-700 outline outline-green-500 px-4 py-1 rounded-full">
                                Uploaded
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 outline outline-yellow-500 px-4 py-1 rounded-full">
                                Pending Upload
                              </span>
                            )}
                          </p>
                        </li>
                      );
                    });
                  })}
                </ul>
              ) : (
                <div className="h-[225px] flex items-center justify-center text-gray-400 text-sm">
                  No urgent tasks available!
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <h4 className="font-semibold text-lg text-body mb-2.5 mt-16">
        Clients & Documents Status
      </h4>
      <div className="border border-customGray rounded-[20px] p-5">
        <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
          <div className="relative w-full md:w-[60%]">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full md:w-[60%] py-2.5 px-10 border rounded-[12px] border-[#eaeaea]"
              value={searchQuery}
              onChange={handleSearch}
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
                d="M13 13L9 9M1 5.66667C1 6.2795 1.12071 6.88634 1.35523 7.45252C1.58975 8.01871 1.93349 8.53316 2.36683 8.9665C2.80018 9.39984 3.31462 9.74358 3.88081 9.97811C4.447 10.2126 5.05383 10.3333 5.66667 10.3333C6.2795 10.3333 6.88634 10.2126 7.45252 9.97811C8.01871 9.74358 8.53316 9.39984 8.9665 8.9665C9.39984 8.53316 9.74358 8.01871 9.97811 7.45252C10.2126 6.88634 10.3333 6.2795 10.3333 5.66667C10.3333 5.05383 10.2126 6.88634 9.97811 3.88081C9.74358 3.31462 9.39984 2.80018 8.9665 2.36683C8.53316 1.93349 8.01871 1.58975 7.45252 1.35523C6.88634 1.12071 6.2795 1 5.66667 1C5.05383 1 4.447 1.12071 3.88081 1.35523C3.31462 1.58975 2.80018 1.93349 2.36683 2.36683C1.93349 2.80018 1.58975 3.31462 1.35523 3.88081C1.12071 4.447 1 5.05383 1 5.66667Z"
                stroke="#8F95A2"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-right md:text-start mt-3 md:mt-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setDashboardData((prev) => ({
                  ...prev,
                  pagination: { ...prev.pagination, page: 1 },
                }));
              }}
              className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <a
              onClick={handleClearSearch}
              className="ml-5 color-black font-medium text-sm underline cursor-pointer"
            >
              Clear
            </a>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <Table
            data={dashboardData.clients}
            pagination={dashboardData.pagination}
            onPageChange={(newPage) =>
              setDashboardData((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, page: newPage },
              }))
            }
            onLimitChange={(newLimit) =>
              setDashboardData((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, limit: newLimit, page: 1 },
              }))
            }
            mode="dashboardListing"
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onAction={handleActionChange}
          />
        )}
      </div>
      <DocumentDeatailsModal
        isOpen={viewDocument}
        onClose={() => setViewDocument(false)}
        title="Document Tracking"
        data={selectedDocument}
      />
    </div>
  );
};

export default Dashboard;
