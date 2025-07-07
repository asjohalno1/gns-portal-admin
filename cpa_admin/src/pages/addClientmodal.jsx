import React, { useState } from 'react';

const AddClientmodal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
        <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
          <div className='flex justify-between items-center mb-[30px]'>
            <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">Add New Client</h2>
            <button
              onClick={onClose}
              className=" text-primaryBlue hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Client Name*</label>
                <input type="text" placeholder="Enter Template Name" className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Email Address*</label>
                <input type="email" placeholder="Enter Template Name" className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Phone no.*</label>
                <input type="text" placeholder="Enter Template Name" className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Company*</label>
                <input type="text" placeholder="Enter Template Name" className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Status</label>
                <input type="text" value="Active" className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm bg-gray-100" readOnly />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Assign to Staff</label>
                <select className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm">
                  <option>Select Staff Member</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Address</label>
              <textarea rows="3" placeholder="Enter Complete Address" className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"></textarea>
            </div>

            <div>
              <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">Notes</label>
              <textarea rows="3" placeholder="Enter Additional Notes About Client" className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="invite" className="accent-[#2E7ED4]" />
              <label htmlFor="invite" className="text-sm text-body">Send invitation to client</label>
            </div>

            <div className="text-right">
              <button type="submit" className="bg-[#2E7ED4] border border-[#2E7ED4] text-white px-4 py-2 rounded-[8px] text-sm font-medium">
                Add Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClientmodal;