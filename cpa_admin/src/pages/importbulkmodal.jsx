import React, { useState } from 'react';
import csvfolder from '../assets/img/csv-folder.png';
 
const ImportBulkModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
                <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">Bulk Import Clients</h2>
                        <button
                            onClick={onClose}
                            className=" text-primaryBlue hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="border border-dashed border-[#80A5FF] rounded-[10px] p-6 text-center mb-6 mt-[25px]">
                        <div className="flex flex-col items-center gap-2">
                            <img src={csvfolder} alt="" className='mb-[60px]' />
                            <p className="text-body font-medium text-[18px] leading-[100%] tracking-[-0.34%] mb-[8px]">
                                Drop files here or click to browse
                            </p>
                            <p className="text-body font-normal text-[14px] leading-[100%] tracking-[-0.34%] mb-[60px]">
                                Upload client data from QuickBooks, UltraTax, or Excel, CSV spreadsheets
                            </p>
                        </div>
                    </div>
 
                    <div className="flex flex-col [@media(min-width:500px)]:flex-row gap-[10px] [@media(min-width:500px)]:gap-0 justify-between items-center">
                        <button className="border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium">
                            Download Sample CSV
                        </button>
                        <button className="bg-[#2E7ED4] border border-[#2E7ED4] text-white px-4 py-2 rounded-[8px] text-sm font-medium">
                            Submit Documents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default ImportBulkModal;