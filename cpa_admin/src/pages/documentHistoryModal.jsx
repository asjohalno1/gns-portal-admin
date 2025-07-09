import React from 'react'

const DocumentHistoryModal = ({ isOpen, onClose, title, children }) => {
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
                <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">Document History</h2>

                {/* Content area */}
                <div className=" bg-white rounded-lg">
                    {/* Client name */}
                    <p className="text-[#2C3E50] font-normal text-[16px] leading-[100%] mb-[20px]">
                        Client Name: <span className="ml-[15px] font-medium">John Doe</span>
                    </p>

                    {/* Document 1 */}
                    <div className="bg-[#EFF6FF66] border-l-3 border-[#2E7ED4] p-[10px] rounded-[8px] mb-[10px]">
                        <div className="flex gap-[10px] items-center mb-[3px]">
                            <a
                                href="#"
                                className="text-[#2E7ED4] text-[16px] font-medium hover:underline"
                            >
                                Tax Return 2023.pdf
                            </a>
                            <span className="text-[#B3B3B3] text-[14px]">2.5 MB</span>
                        </div>
                        <p className="text-[#2C3E50] text-[14px] mb-[3px]">Uploaded on March 15, 2024</p>
                        <p className="text-[#2C3E50] text-[14px] mb-0">Status: Processed</p>
                    </div>

                    {/* Document 2 */}
                    <div className="bg-[#EFF6FF66] border-l-3 border-[#2E7ED4] p-[10px] rounded-[8px] mb-[10px]">
                        <div className="flex gap-[10px] items-center mb-[3px]">
                            <a
                                href="#"
                                className="text-[#2E7ED4] text-[16px] font-medium hover:underline"
                            >
                                Financial Statements Q1.xlsx
                            </a>
                            <span className="text-[#B0B0B0] text-xs">1.8 MB</span>
                        </div>
                        <p className="text-[#2C3E50] text-[14px] mb-[3px]">Uploaded on April 20, 2024</p>
                        <p className="text-[#2C3E50] text-[14px] mb-0">Status: Under Review</p>
                    </div>

                    {/* Document 3 */}
                    <div className="bg-[#EFF6FF66] border-l-3 border-[#2E7ED4] p-[10px] rounded-[8px] mb-[20px]">
                        <div className="flex gap-[10px] items-center mb-[3px]">
                            <a
                                href="#"
                                className="text-[#2E7ED4] text-[16px] font-medium hover:underline"
                            >
                                Engagement Letter.docx
                            </a>
                            <span className="text-[#B0B0B0] text-xs">0.5 MB</span>
                        </div>
                        <p className="text-[#2C3E50] text-[14px] mb-[3px]">Uploaded on April 20, 2024</p>
                        <p className="text-[#2C3E50] text-[14px] mb-0">Status: Signed</p>
                    </div>

                    {/* Pending Documents Box */}
                    <div className="bg-[#FFFAE8] p-[10px] rounded-[6px]">
                        <p className="text-[#2C3E50] font-medium text-[16px] leading-[100%] mb-[8px]">Pending Documents</p>
                        <ul className="list-disc list-inside text-[#484848] text-[14px] ml-[10px]">
                            <li className='mb-[5px]'>Please ensure all pages are included</li>
                            <li>Missing page 2</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentHistoryModal;