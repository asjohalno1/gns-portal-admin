import React, { useState } from "react";
import successful from "../../assets/img/upload.png";

const SuccessrequestModal = ({ onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
        <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
          <div className="items-center justify-center flex flex-col">
            <img src={successful} alt="" />
            <h2 className="font-medium text-[22px] leading-[100%] tracking-[0] text-[#484848] mb-[5px] mt-[20px]">
              Successful
            </h2>
            <p className="font-normal text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]">
              {" "}
              {title}
            </p>
          </div>

          <div className="text-center mt-[40px]">
            <button
              onClick={onClose}
              className="bg-[#2E7ED4] hover:bg-[#256BC0] text-white px-4 py-2 rounded-md w-full"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessrequestModal;
