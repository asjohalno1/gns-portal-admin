import React, { useEffect } from "react";

import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import Table from "../Component/Table/table";
import ImportBulkModal from "./importbulkmodal";
import AddClientmodal from "./addClientmodal";
import ViewClientdetailsModal from "./viewclientdetailsmodal";
import ReviewDocumentModal from "./reviewDocumentModal";
import ClientDetailsModal from "./clientDetailsModal";
import DocumentHistoryModal from "./documentHistoryModal";

// import '/index.css'

const ClientManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isImportBulkOpen, setIsImportBulkOpen] = useState(false);
  const [isViewClientdetailsOpen, setIsViewClientdetailsOpen] = useState(false);
  const [isreviewDocumentModalOpen, setIsreviewDocumentModalOpen] = useState(false);
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [isDocumentHistoryModalOpen, setIsDocumentHistoryModalOpen] = useState(false);

  function toggleButton() {
    setOpen((open) => !open);
  }

  //filter
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    documentType: "",
    dateFrom: "",
    dateTo: "",
    sortByDate: "desc",
    client: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    limit: 10,
  });

  //list of documents
  const [documentsList, setDocumentsList] = useState({
    documents: [],
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
  });

  useEffect(() => {
    const fetchDocuments = async () => {

    };

    fetchDocuments();
  }, [filters, pagination.currentPage, pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      currentPage: 1, // Reset to first page when changing limit
    }));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (

    <div className="p-7.5 pt-[86px] w-full">
      <div className="flex border-b border-gray-300 space-x-4 mb-[30px]">
        <button
          className={`px-5 py-10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${activeTab === "tab1"
            ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
            : " text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
            }`}
          onClick={() => setActiveTab("tab1")}
        >
          Manage Clients
        </button>
        <button
          className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${activeTab === "tab2"
            ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
            : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
            }`}
          onClick={() => setActiveTab("tab2")}
        >
          Client Mapping
        </button>
      </div>
      <div className=" border-t-0 border-gray-300 rounded-b-md">
        {activeTab === "tab1" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Client Records
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddClientOpen(true)}
                  type="button"
                  className="rounded-[10px] py-2 px-6 text-primaryBlue border-1 border-primaryBlue cursor-pointer"
                >
                  Add Client
                </button>
                <AddClientmodal
                  isOpen={isAddClientOpen}
                  onClose={() => setIsAddClientOpen(false)}
                  title="Add Client"
                ></AddClientmodal>
                <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsImportBulkOpen(true)}
                >
                  Bulk Import
                </button>
                <ImportBulkModal
                  isOpen={isImportBulkOpen}
                  onClose={() => setIsImportBulkOpen(false)}
                  title="Bulk Import"
                ></ImportBulkModal>
                {/* <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsViewClientdetailsOpen(true)}
                >
                  view client detail
                </button>
                <ViewClientdetailsModal
                  isOpen={isViewClientdetailsOpen}
                  onClose={() => setIsViewClientdetailsOpen(false)}
                  title="View Client Details"
                >
                  
                </ViewClientdetailsModal>
                <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsreviewDocumentModalOpen(true)}
                >
                  Review Document
                </button>
                <ReviewDocumentModal
                  isOpen={isreviewDocumentModalOpen}
                  onClose={() => setIsreviewDocumentModalOpen(false)}
                  title="Document Review"
                />
                <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsClientDetailsModalOpen(true)}
                >
                  Client Details
                </button>
                <ClientDetailsModal
                  isOpen={isClientDetailsModalOpen}
                  onClose={() => setIsClientDetailsModalOpen(false)}
                  title="Client Details"
                />
                <button
                  type="button"
                  className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  onClick={() => setIsDocumentHistoryModalOpen(true)}
                >
                  Document History
                </button>
                <DocumentHistoryModal
                  isOpen={isDocumentHistoryModalOpen}
                  onClose={() => setIsDocumentHistoryModalOpen(false)}
                  title="Document History"
                /> */}
              </div>
            </div>
            {showModal && (
              <DocumentModal
                data={documentsList.documents}
                onClose={() => setShowModal(false)}
              />
            )}

            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    placeholder="Search by name, email or status"
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
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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
                    href="#"
                    className="ml-5 color-black font-medium text-sm underline"
                  >
                    Clear
                  </a>
                </div>
              </div>
              <Table
                data={documentsList}
                pagination={{
                  page: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  total: pagination.totalDocuments,
                  limit: pagination.limit,
                }}
                onPageChange={(newPage) =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: newPage,
                  }))
                }
                onLimitChange={handleLimitChange}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                mode="documents"
              />
            </div>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="color-black text-lg font-semibold">
                Secure Link Management
              </h4>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
              >
                Create Secure Link
              </button>
              {showModal && (
                <DocumentModal onClose={() => setShowModal(false)} />
              )}
            </div>
            <div className="border border-customGray rounded-[20px] p-5 ">
              <form action="">
                <div className="grid grid-cols-3 gap-5">
                  <div className="w-full ">
                    <label
                      for="cars"
                      className="mb-2 block font-medium text-sm "
                    >
                      Client
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
                  <div className="w-full">
                    <label
                      for="fname"
                      className="block mb-2 font-medium text-sm"
                    >
                      Created Date
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
                      Status
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
                <div className="text-right mt-2.5">
                  <button
                    type="button"
                    className="bg-[#2E7ED4] rounded-[10px] py-2 px-6 text-white cursor-pointer"
                  >
                    Search
                  </button>
                  <a
                    href="#"
                    class="ml-5 color-black font-medium text-sm underline"
                  >
                    Clear
                  </a>
                </div>
              </form>
            </div>
            <h4 className="font-semibold text-lg text-body mb-2.5 mt-16">
              Secure Links
            </h4>
            <div className="border border-customGray rounded-[20px] p-5">
              <div className="mb-5 flex flex-col md:flex-row justify-between md:items-center">
                <div className="relative w-full md:w-[60%]">
                  <input
                    type="text"
                    placeholder="Search by name, email or status"
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
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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
                    href="#"
                    className="ml-5 color-black font-medium text-sm underline"
                  >
                    Clear
                  </a>
                </div>
              </div>
              <ClientTable
                data={documentsList}
                pagination={{
                  page: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  total: pagination.totalDocuments,
                  limit: pagination.limit,
                }}
                onPageChange={(newPage) =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: newPage,
                  }))
                }
                onLimitChange={handleLimitChange}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                mode="documents"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ClientManagement;
