import React, { useRef, useState } from 'react';
import axios from 'axios';
import csvfolder from '../assets/img/csv-folder.png';

const ImportBulkModal = ({ isOpen, onClose }) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    if (!isOpen) return null;

    const handleClickDropArea = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            const isCSV = selected.name.toLowerCase().endsWith('.csv');
            if (!isCSV) {
                setError('Only .csv files are allowed');
                setFile(null);
                setFileName('');
                return;
            }
            setFile(selected);
            setFileName(selected.name);
            setError('');
            setSuccessMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a CSV file before uploading');
            return;
        }

        try {
            setUploading(true);
            setError('');
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/client/uploadCsv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setSuccessMessage('Upload successful!');
                setFile(null);
                setFileName('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
                <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
                    <div className='flex justify-between items-center'>
                        <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">Bulk Import Clients</h2>
                        <button
                            onClick={onClose}
                            className="text-primaryBlue hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Clickable Drop Area */}
                    <div
                        className="border border-dashed border-[#80A5FF] rounded-[10px] p-6 text-center mb-6 mt-[25px] cursor-pointer"
                        onClick={handleClickDropArea}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <img src={csvfolder} alt="" className='mb-[60px]' />
                            <p className="text-body font-medium text-[18px] leading-[100%] tracking-[-0.34%] mb-[8px]">
                                {fileName || 'Drop files here or click to browse'}
                            </p>
                            <p className={`text-[14px] leading-[100%] tracking-[-0.34%] mb-[60px] font-normal ${error ? 'text-red-500' : 'text-body'}`}>
                                {error || 'Upload client data from QuickBooks, UltraTax, or Excel, CSV spreadsheets'}
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col [@media(min-width:500px)]:flex-row gap-[10px] [@media(min-width:500px)]:gap-0 justify-between items-center">
                        <a href="/clients.csv" download="SampleClients.csv">
                            <button className="border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium">
                                Download Sample CSV
                            </button>
                        </a>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`bg-[#2E7ED4] border border-[#2E7ED4] text-white px-4 py-2 rounded-[8px] text-sm font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Clients CSV'}
                        </button>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <p className="text-green-600 text-sm mt-4 text-center">
                            {successMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportBulkModal;
