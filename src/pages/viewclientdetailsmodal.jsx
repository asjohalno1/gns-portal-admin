import React from 'react';

const ViewClientdetailsModal = ({ isOpen, onClose, title, children }) => {
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
                <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">Document Request Details</h2>

                {/* Content area */}

                <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#484848] align-middle mb-[15px]'>Document Req Title: <span className='font-semibold'>Tax filling doc for 2025</span></p>
                <p className='font-medium text-[14px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[8px]'>Client Information</p>
                <div className='bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] flex justify-between mb-[15px]'>
                    <div>
                        <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Name: <span className='ml-[11px] font-medium'>John Doe</span></p>
                        <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Email: <span className='ml-[11px] font-medium'>johndoe@yopmail.com</span></p>
                        <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Under Staff Name: <span className='ml-[11px] font-medium'>Kelly Gill</span></p>
                        <p className='mb-[0px] font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50]'>Request ID: <span className='ml-[11px] font-medium'>REQ-001</span></p>
                    </div>
                    <div>
                        <button className='font-normal text-[14px] leading-[100%] text-[#D97706] bg-[#FEF3C7] rounded-[50px] px-[25px] py-[6px]'>Pending</button>
                    </div>
                </div>
                <p className='font-medium text-[14px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[10px]'>Required Documents</p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD] ">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">W2- Forms</p>
                        <p className="text-[#059669] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Submitted</p>
                    </div>
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD]">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">1099 Forms</p>
                        <p className="text-[#F94853] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Missing</p>
                    </div>
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD]">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">Bank Statements</p>
                        <p className="text-[#F94853] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Missing</p>
                    </div>
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD]">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">1098 Forms</p>
                        <p className="text-[#D97706] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Under Review</p>
                    </div>
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD]">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">Insurance</p>
                        <p className="text-[#059669] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Submitted</p>
                    </div>
                    <div className="border rounded-xl px-[19px] py-[15px] bg-white border-[#DDDDDDDD]">
                        <p className="font-normal not-italic text-[14px] leading-[100%] tracking-[0px] text-[#2C3E50] mb-[6px]">Bank Statements</p>
                        <p className="text-[#059669] font-medium not-italic text-[14px] leading-[100%] tracking-[0px]">Submitted</p>
                    </div>
                </div>

                {/* Footer buttons if needed */}
                <div className="mt-6 flex justify-between flex-wrap">
                    <button
                        className="font-normal not-italic text-[14px] leading-[100%] tracking-normal text-[#2E7ED4] border border-[#2E7ED4] px-[20px] py-[6px] rounded-[6px]">
                        Export Details
                    </button>
                    <div className='flex gap-[10px]'>
                        <button className='font-normal text-[14px] leading-[100%] tracking-normal text-[#F1F1F1] py-[6px] px-[20px] border border-[#1BA3A3] bg-[#1BA3A3] rounded-[6px]'>
                            Mark Completed
                        </button>
                        <button className='font-normal text-[14px] leading-[100%] tracking-normal text-[#F1F1F1] py-[6px] px-[20px] border border-[#2E7ED4] bg-[#2E7ED4] rounded-[6px]'>
                            Send Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewClientdetailsModal;
