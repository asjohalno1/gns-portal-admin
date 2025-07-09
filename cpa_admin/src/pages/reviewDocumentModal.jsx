import React from 'react';

const ReviewDocumentModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
                <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
                    <div className='flex justify-between items-center mb-[30px]'>
                        <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-primaryBlue hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    {/* Keep rest of form as is */}
                    <div className='bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] flex justify-between mb-[25px]'>
                        <div>
                            <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Document: <span className='ml-[11px] font-medium'>W-2 Forms</span></p>
                            <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Submitted: <span className='ml-[11px] font-medium'>2025-06-10</span></p>
                            <p className='font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]'>Time: <span className='ml-[11px] font-medium'>14:30</span></p>
                            <p className='mb-[0px] font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50]'>Request ID: <span className='ml-[11px] font-medium'>REQ-001</span></p>
                        </div>
                        <div className='flex gap-[10px]'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_298_2473)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.4517 15.8408C4.70631 15.8408 4.95049 15.942 5.13052 16.122C5.31056 16.302 5.4117 16.5462 5.4117 16.8008V18.7208C5.4117 18.9754 5.51284 19.2196 5.69288 19.3996C5.87291 19.5797 6.11709 19.6808 6.3717 19.6808H17.8917C18.1463 19.6808 18.3905 19.5797 18.5705 19.3996C18.7506 19.2196 18.8517 18.9754 18.8517 18.7208V16.8008C18.8517 16.5462 18.9528 16.302 19.1329 16.122C19.3129 15.942 19.5571 15.8408 19.8117 15.8408C20.0663 15.8408 20.3105 15.942 20.4905 16.122C20.6706 16.302 20.7717 16.5462 20.7717 16.8008V18.7208C20.7717 19.4846 20.4683 20.2172 19.9282 20.7573C19.3881 21.2974 18.6555 21.6008 17.8917 21.6008H6.3717C5.60788 21.6008 4.87534 21.2974 4.33523 20.7573C3.79513 20.2172 3.4917 19.4846 3.4917 18.7208V16.8008C3.4917 16.5462 3.59284 16.302 3.77288 16.122C3.95291 15.942 4.19709 15.8408 4.4517 15.8408Z" fill="#2E7ED4" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.65314 10.3614C6.83317 10.1815 7.07731 10.0804 7.33187 10.0804C7.58642 10.0804 7.83056 10.1815 8.01058 10.3614L12.1319 14.4827L16.2531 10.3614C16.3417 10.2697 16.4476 10.1966 16.5648 10.1463C16.6819 10.096 16.8079 10.0695 16.9353 10.0684C17.0628 10.0673 17.1892 10.0916 17.3072 10.1398C17.4252 10.1881 17.5323 10.2594 17.6225 10.3495C17.7126 10.4397 17.7839 10.5469 17.8322 10.6648C17.8804 10.7828 17.9047 10.9092 17.9036 11.0367C17.9025 11.1642 17.876 11.2901 17.8257 11.4073C17.7754 11.5244 17.7023 11.6303 17.6106 11.7189L12.8106 16.5189C12.6306 16.6988 12.3864 16.8 12.1319 16.8C11.8773 16.8 11.6332 16.6988 11.4531 16.5189L6.65314 11.7189C6.47317 11.5388 6.37207 11.2947 6.37207 11.0402C6.37207 10.7856 6.47317 10.5415 6.65314 10.3614Z" fill="#2E7ED4" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1319 3.36035C12.3865 3.36035 12.6307 3.46149 12.8107 3.64153C12.9907 3.82156 13.0919 4.06574 13.0919 4.32035V15.8404C13.0919 16.095 12.9907 16.3391 12.8107 16.5192C12.6307 16.6992 12.3865 16.8004 12.1319 16.8004C11.8773 16.8004 11.6331 16.6992 11.4531 16.5192C11.273 16.3391 11.1719 16.095 11.1719 15.8404V4.32035C11.1719 4.06574 11.273 3.82156 11.4531 3.64153C11.6331 3.46149 11.8773 3.36035 12.1319 3.36035Z" fill="#2E7ED4" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_298_2473">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_298_2480)">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5842 12.4126C19.6476 15.8904 15.9748 18.0508 12.0012 18.0508C8.02497 18.0508 4.35227 15.8904 2.41558 12.4126C2.26643 12.1426 2.26643 11.8571 2.41558 11.5873C4.35227 8.10954 8.02497 5.94935 12.0012 5.94935C15.9748 5.94935 19.6475 8.10954 21.5842 11.5873C21.736 11.8571 21.736 12.1426 21.5842 12.4126ZM22.8213 10.8978C20.6352 6.97118 16.4892 4.53223 12.0012 4.53223C7.51057 4.53223 3.36461 6.97118 1.17846 10.8978C0.78752 11.5984 0.78752 12.4016 1.17846 13.1016C3.36461 17.0282 7.51057 19.4677 12.0012 19.4677C16.4892 19.4677 20.6352 17.0282 22.8213 13.1016C23.2123 12.4016 23.2123 11.5984 22.8213 10.8978ZM12.0012 14.9069C13.6035 14.9069 14.9075 13.6029 14.9075 11.9998C14.9075 10.3968 13.6035 9.09279 12.0012 9.09279C10.3963 9.09279 9.09232 10.3968 9.09232 11.9998C9.09232 13.6029 10.3963 14.9069 12.0012 14.9069ZM12.0012 7.67566C9.61441 7.67566 7.67519 9.61568 7.67519 11.9999C7.67519 14.3846 9.61446 16.3238 12.0012 16.3238C14.3854 16.3238 16.3246 14.3846 16.3246 11.9999C16.3246 9.61568 14.3854 7.67566 12.0012 7.67566Z" fill="#2E7ED4" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_298_2480">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-[15px]'>
                        <p className='text-[#484848] font-medium text-[14px] leading-[100%] align-middle'>Review Actions</p>
                        <div className='flex gap-[10px]'>
                            <button className='text-[#EA4335] font-medium text-[14px] leading-[100%] rounded-[6px] bg-[#FEE2E2] py-[10px] px-[28px]'>Reject</button>
                            <button className='text-[#F1F1F1] font-medium text-[14px] leading-[100%] py-[10px] px-[28px] rounded-[6px] bg-[#1BA3A3]'>Approve</button>
                        </div>
                    </div>
                    <div className=' mb-[8px]'>
                        <label className='text-[#484848] font-medium text-[14px] leading-[100%] capitalize'>Feedbacks/Comments</label>
                    </div>
                    <div>
                         <textarea rows="3" placeholder="Provide feedback  to client..." className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDocumentModal;
