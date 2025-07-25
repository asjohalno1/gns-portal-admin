import React, { useEffect, useState } from "react";
import Table from "../Component/Table/table";
import { getAllDocumentsListing } from "../api/documentManagemnet.api";
import { toast } from "react-toastify";
import {
  CompleteCheckIcon,
  DocumentIcon,
  OverdueIcon,
  PendingIcon,
} from "../Icons/SvgIcons";
import { SearchIcon } from "lucide-react";

const DocReqManagement = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [documentList, setDocumentList] = useState([]);
  const [headerSummery, setHeaderSummery] = useState({});
  const [query, setQuery] = useState({
    search: "",
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (activeTab === "tab1") {
      fetchDocumentListing(query); // for first load
    }
  }, [activeTab]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (activeTab === "tab1") {
        fetchDocumentListing(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query.search]);

  useEffect(() => {
    if (activeTab === "tab1") {
      fetchDocumentListing(query);
    }
  }, [query.page, query.limit]);

  const fetchDocumentListing = async (queryParams = query) => {
    try {
      const res = await getAllDocumentsListing(queryParams);
      if (res.success) {
        const {
          documents,
          currentPage,
          totalDocuments,
          totalPages,
          headerTotal,
        } = res.data;

        setDocumentList(documents);

        setHeaderSummery(headerTotal);

        setQuery((prev) => ({
          ...prev,
          page: currentPage,
          total: totalDocuments,
          totalPages: totalPages,
        }));

        toast.success(res?.message || "Documents fetched successfully");
      }
    } catch (error) {
      console.error("Failed to fetch document list:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch document list."
      );
    }
  };

  const onNextPage = () => {
    if (query.page < query.totalPages) {
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const onPrevPage = () => {
    if (query.page > 1) {
      setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const onLimitChange = (newLimit) => {
    setQuery((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };
  const handleClear = () => {
    setQuery((prev) => ({ ...prev, search: "", page: 1, limit: 10 }));
  };
  return (
    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px]">
        <button
          className={`px-5 py-10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab1"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : " text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab1")}
        >
          Overview & Tracking
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab2"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab2")}
        >
          Create Request
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab3"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab3")}
        >
          Manage Links
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${
            activeTab === "tab4"
              ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
              : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
          }`}
          onClick={() => setActiveTab("tab4")}
        >
          Manage Templates
        </button>
      </div>
      <div className=" border-t-0 border-gray-300 rounded-b-md">
        {activeTab === "tab1" && (
          <div className="">
            <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Total Requests
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalReq}
                    </h4>
                  </div>
                  <div className="bg-bgPurple flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <DocumentIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Completed Today
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalComplete}
                    </h4>
                  </div>
                  <div className="bg-bgGreen flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <CompleteCheckIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Pending Requests
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.totalPending}
                    </h4>
                  </div>
                  <div className="bg-bgOrange flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <PendingIcon />
                  </div>
                </div>
              </div>
              <div className="border border-customGray p-5 rounded-[20px] flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                  <div className="">
                    <span className="text-body font-medium text-[14px]">
                      Overdue
                    </span>
                    <h4 className="text-body font-semibold text-[28px]">
                      {headerSummery?.overdue}
                    </h4>
                  </div>
                  <div className="bg-bgRed flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                    <OverdueIcon />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Document Requests
              </h4>
              <button
                type="button"
                className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
              >
                New Request
              </button>
            </div>

            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query.search}
                    onChange={(e) =>
                      setQuery((prev) => ({
                        ...prev,
                        search: e.target.value,
                        page: 1,
                      }))
                    }
                    className="border border-[#B6C8D6] rounded-[7px] w-[60px] px-2 py-1 ml-5"
                  />
                </div>
                <div className="text-right md:text-start mt-3 md:mt-0 flex items-center">
                  <div className="relative">
                    <select
                      name="cars"
                      id="cars"
                      className="border border-[#eaeaea] rounded-[10px] w-[167px] py-1.5 px-2 appearance-none"
                    >
                      <option value="volvo">Newest First</option>
                      <option value="saab">Saab</option>
                      <option value="opel">Opel</option>
                      <option value="audi">Audi</option>
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
                  <a
                    onClick={handleClear}
                    className="ml-5 color-black font-medium text-sm underline cursor-pointer"
                  >
                    Clear
                  </a>
                </div>
              </div>

              <Table
                data={documentList}
                mode="documentRequestListing"
                pagination={query}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
                onLimitChange={onLimitChange}
              />
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Create New Document Request
              </h4>
              <button
                type="button"
                className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
              >
                Use Template
              </button>
            </div>
            <div className="border border-customGray rounded-[20px] p-5 ">
              <form action="">
                <div className="w-full mb-5">
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Request Document Title*
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter document request title"
                    className="w-auto border border-[#eaeaea] rounded-[10px] px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="w-full mb-5">
                  <label for="cars" className="mb-2 block font-medium text-sm ">
                    Client*
                  </label>
                  <div className="relative">
                    <select className="border border-[#eaeaea] rounded-[10px] py-2 px-4 w-full appearance-none">
                      <option value="volvo">Volvo</option>
                      <option value="saab">Saab</option>
                      <option value="opel">Opel</option>
                      <option value="audi">Audi</option>
                    </select>
                    <i class="fa-solid fa-chevron-down absolute top-[12px] right-[14px]"></i>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="w-full ">
                    <label
                      for="cars"
                      className="mb-2 block font-medium text-sm "
                    >
                      Document Types*
                    </label>
                    <div className="relative">
                      <select className="border border-[#eaeaea] text-gray-700 rounded-[10px] py-2 px-4 w-full appearance-none">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                      </select>
                      <i class="fa-solid fa-chevron-down absolute top-[12px] right-[14px]"></i>
                    </div>
                  </div>
                  <div className="w-full ">
                    <label
                      for="cars"
                      className="mb-2 block font-medium text-sm "
                    >
                      Documents*
                    </label>
                    <div className="relative">
                      <select className="border border-[#eaeaea] text-gray-700 rounded-[10px] py-2 px-4 w-full appearance-none">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                      </select>
                      <i class="fa-solid fa-chevron-down absolute top-[12px] right-[14px]"></i>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Add other Documents (eg. Insurance, Petant document, ...)
                  </label>
                  <textarea
                    className="w-full border border-[#eaeaea] bg-[#FAFAFA] text-[#484848] p-3 rounded-[10px] font-normal text-[12px] leading-[100%] tracking-[0] capitalize focus:outline-none h-[60px] resize-none"
                    rows="2"
                    placeholder="Add Other Documents  seperated by ‘Comma’"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="w-full">
                    <label
                      for="fname"
                      className="block mb-2 font-medium text-sm"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="fname"
                      name="fname"
                      className="w-full py-2 px-4 border border-[#eaeaea] rounded-[10px] text-gray-700"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      for="cars"
                      className="mb-2 block font-medium text-sm "
                    >
                      Priority Level
                    </label>
                    <div className="relative">
                      <select className="border border-[#eaeaea] rounded-[10px] py-2 px-4 w-full appearance-none">
                        <option value="volvo">All Status</option>
                        <option value="saab">Saab</option>
                        <option value="opel">Opel</option>
                        <option value="audi">Audi</option>
                      </select>
                      <i class="fa-solid fa-chevron-down absolute top-[12px] right-[14px]"></i>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Instructions & Requirements
                  </label>
                  <textarea
                    className="w-full border border-[#eaeaea] bg-[#FAFAFA] text-[#484848] p-3 rounded-[10px] font-normal text-[12px] leading-[100%] tracking-[0] capitalize focus:outline-none h-[60px] resize-none"
                    rows="2"
                    placeholder="Add Other Documents  seperated by ‘Comma’"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-[#484848] text-sm font-medium mb-2">
                    Notify Method
                  </label>
                  <div className="flex gap-5 text-sm text-[#484848]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                                                    checked:bg-[#20BF55] checked:border-[#20BF55]
                                                    checked:after:content-['✓'] checked:after:text-white 
                                                    checked:after:text-[12px] checked:after:font-bold 
                                                    checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                                                    checked:bg-[#20BF55] checked:border-[#20BF55]
                                                    checked:after:content-['✓'] checked:after:text-white 
                                                    checked:after:text-[12px] checked:after:font-bold 
                                                    checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                      />
                      SMS
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                                                    checked:bg-[#20BF55] checked:border-[#20BF55]
                                                    checked:after:content-['✓'] checked:after:text-white 
                                                    checked:after:text-[12px] checked:after:font-bold 
                                                    checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                      />
                      Portal Notification
                    </label>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#484848] text-sm font-medium mb-2">
                      Schedule Reminder
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                                                        checked:bg-[#20BF55] checked:border-[#20BF55]
                                                        checked:after:content-['✓'] checked:after:text-white 
                                                        checked:after:text-[12px] checked:after:font-bold 
                                                        checked:after:absolute checked:after:top-[-2px] checked:after:left-[3px]"
                      />
                      Send as Default Reminder
                    </label>
                  </div>
                  <div className="border border-customGray p-5 rounded-[20px] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="mb-5 w-full">
                        <label className="block text-[14px] font-medium text-body mb-2">
                          Set Time
                        </label>
                        <input
                          type="time"
                          className="w-full p-3 bg-[#F8F8F8] border border-[#f2f2f2] text-[12px] font-[400] rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                        />
                      </div>

                      <div className="mb-5 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[14px] font-medium text-body">
                            Frequency
                          </label>
                          <div className="relative h-[20px]">
                            <select className="pr-8 pl-3 bg-white text-[14px] text-body appearance-none focus:outline-none focus:border-transparent font-[400]">
                              <option value="Weekly">Weekly</option>
                              <option value="Daily">Daily</option>
                            </select>
                            <i className="fa-solid fa-chevron-down absolute text-[14px] top-[5px] right-[14px]"></i>
                          </div>
                        </div>

                        {/* Day Picker */}
                        {/* <div className="flex flex-wrap gap-4 p-2 bg-[#F8F8F8] rounded-[10px]">
                                                    {days.map((day) => (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => handleDayToggle(day)}
                                                            className={`px-4 py-1 h-[30px] rounded-md text-[14px] font-[400] transition-colors ${selectedDays.includes(day)
                                                                ? 'border border-primaryBlue text-primaryBlue bg-white'
                                                                : 'text-body bg-white hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    ))}
                                                </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <button
                    type="button"
                    className="rounded-[10px] py-2 px-6 text-primaryBlue border-1 border-primaryBlue cursor-pointer"
                  >
                    Save as Template
                  </button>
                  <button
                    type="button"
                    className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  >
                    Generate Secure Link & Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DocReqManagement;
