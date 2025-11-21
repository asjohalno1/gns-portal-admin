import React from "react";

const ClientDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D] bg-opacity-50">
      <div className="relative bg-white rounded-[10px] shadow-lg w-full max-w-[600px] p-[20px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[16px] text-[#2E7ED4] hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">
          Client Details
        </h2>

        {/* Content area */}

        <div className="bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] mb-[15px]">
          <p className="font-medium text-[16px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[12px]">
            Basic Information
          </p>
          <div>
            {/* <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              ID: <span className="ml-[11px] font-medium">{data?.client?._id}</span>
            </p> */}
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Name:{" "}
              <span className="ml-[11px] font-medium">
                {data?.client?.name + " " + (data?.client?.lastName || "")}
              </span>
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Email:{" "}
              <span className="ml-[11px] font-medium">
                {data?.client?.email}
              </span>
            </p>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
              Phone:{" "}
              <span className="ml-[11px] font-medium">
                {data?.client?.phoneNumber}
              </span>
            </p>
            <p className="mb-[0px] font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50]">
              Company:{" "}
              <span className="ml-[11px] font-medium">
                {data?.client?.company}
              </span>
            </p>
          </div>
        </div>
        {/* <p className="font-medium text-[16px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[12px]">
          Engagement Status
        </p> */}
        {/* <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#E4F3EB] rounded-[6px] py-[15px] px-[17px] text-center">
            <h6 className="mb-[12px] text-[#2C3E50] font-medium text-[16px] leading-[100%]">
              Tax Preparation
            </h6>
            <p className="text-[#2C3E50] font-normal text-[14px] leading-[100%] mb-0">
              Completed
            </p>
          </div>
          <div className="bg-[#E4F0F3] rounded-[6px] py-[15px] px-[17px] text-center">
            <h6 className="mb-[12px] text-[#2C3E50] font-medium text-[16px] leading-[100%]">
              Tax Preparation
            </h6>
            <p className="text-[#2C3E50] font-normal text-[14px] leading-[100%] mb-0">
              Completed
            </p>
          </div>
          <div className="bg-[#F3EDE4] rounded-[6px] py-[15px] px-[17px] text-center">
            <h6 className="mb-[12px] text-[#2C3E50] font-medium text-[16px] leading-[100%]">
              Tax Preparation
            </h6>
            <p className="text-[#2C3E50] font-normal text-[14px] leading-[100%] mb-0">
              Completed
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ClientDetailsModal;
