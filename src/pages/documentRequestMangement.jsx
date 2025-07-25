import React, { useEffect } from "react";
 
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import Table from "../Component/Table/table";
import ImportBulkModal from "./importbulkmodal";
import AddClientmodal from "./addClientmodal";
 
// import '/index.css'
 
const DocReqManagement = () => {
    const [activeTab, setActiveTab] = useState("tab1");
 
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
                    Overview & Tracking
                </button>
                <button
                    className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${activeTab === "tab2"
                        ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
                        : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
                        }`}
                    onClick={() => setActiveTab("tab2")}
                >
                    Create Request
                </button>
                <button
                    className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${activeTab === "tab3"
                        ? "bg-bgBlue text-primaryBlue font-semibold border-b-2 border-primaryBlue"
                        : "text-bodyColor hover:bg-tabsBg border-b-2 font-regular border-transparent"
                        }`}
                    onClick={() => setActiveTab("tab3")}
                >
                    Manage Links
                </button>
                <button
                    className={`px-5 py-[10px] text-[16px] leading-[100%] tracking-[0] rounded-t-md ${activeTab === "tab4"
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
                                            41
                                        </h4>
                                    </div>
                                    <div className="bg-bgPurple flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
 
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.9346 5.83087L15.3097 0.206016C15.1778 0.0741977 14.999 0.000105395 14.8125 0L4.96875 0C3.80564 0 2.85938 0.946266 2.85938 2.10938V21.8906C2.85938 23.0537 3.80564 24 4.96875 24H19.0312C20.1944 24 21.1406 23.0537 21.1406 21.8906V6.32812C21.1406 6.13641 21.0601 5.95636 20.9346 5.83087ZM15.5156 2.40061L18.74 5.625H16.2188C15.831 5.625 15.5156 5.30958 15.5156 4.92188V2.40061ZM19.0312 22.5938H4.96875C4.58105 22.5938 4.26562 22.2783 4.26562 21.8906V2.10938C4.26562 1.72167 4.58105 1.40625 4.96875 1.40625H14.1094V4.92188C14.1094 6.08498 15.0556 7.03125 16.2188 7.03125H19.7344V21.8906C19.7344 22.2783 19.419 22.5938 19.0312 22.5938Z" fill="#497FFF" />
                                            <path d="M16.2188 9.9375H7.78125C7.39294 9.9375 7.07812 10.2523 7.07812 10.6406C7.07812 11.0289 7.39294 11.3438 7.78125 11.3438H16.2188C16.6071 11.3438 16.9219 11.0289 16.9219 10.6406C16.9219 10.2523 16.6071 9.9375 16.2188 9.9375ZM16.2188 12.75H7.78125C7.39294 12.75 7.07812 13.0648 7.07812 13.4531C7.07812 13.8414 7.39294 14.1562 7.78125 14.1562H16.2188C16.6071 14.1562 16.9219 13.8414 16.9219 13.4531C16.9219 13.0648 16.6071 12.75 16.2188 12.75ZM16.2188 15.5625H7.78125C7.39294 15.5625 7.07812 15.8773 7.07812 16.2656C7.07812 16.6539 7.39294 16.9688 7.78125 16.9688H16.2188C16.6071 16.9688 16.9219 16.6539 16.9219 16.2656C16.9219 15.8773 16.6071 15.5625 16.2188 15.5625ZM13.4062 18.375H7.78125C7.39294 18.375 7.07812 18.6898 7.07812 19.0781C7.07812 19.4664 7.39294 19.7812 7.78125 19.7812H13.4062C13.7946 19.7812 14.1094 19.4664 14.1094 19.0781C14.1094 18.6898 13.7946 18.375 13.4062 18.375Z" fill="#497FFF" />
                                        </svg>
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
                                            35
                                        </h4>
                                    </div>
                                    <div className="bg-bgGreen flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 40 40"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_65_897)">
                                                <path
                                                    d="M20.0002 37.9164C15.2484 37.9164 10.6912 36.0288 7.33117 32.6688C3.97114 29.3087 2.0835 24.7516 2.0835 19.9998C2.0835 15.248 3.97114 10.6908 7.33117 7.33077C10.6912 3.97075 15.2484 2.0831 20.0002 2.0831C22.7923 2.07386 25.5463 2.73094 28.0335 3.99977C28.1801 4.07419 28.3107 4.17676 28.4177 4.30163C28.5247 4.42649 28.6061 4.57122 28.6571 4.72753C28.7082 4.88384 28.728 5.04868 28.7153 5.21264C28.7027 5.3766 28.6579 5.53646 28.5835 5.6831C28.5091 5.82975 28.4065 5.9603 28.2816 6.0673C28.1568 6.1743 28.0121 6.25566 27.8557 6.30673C27.6994 6.35781 27.5346 6.37759 27.3706 6.36496C27.2067 6.35232 27.0468 6.30752 26.9002 6.2331C24.7666 5.1335 22.4004 4.56194 20.0002 4.56644C16.9517 4.56644 13.9718 5.47019 11.4369 7.16346C8.90196 8.85673 6.92596 11.2635 5.75862 14.0796C4.59128 16.8956 4.28501 19.9945 4.87852 22.9846C5.47202 25.9747 6.93866 28.7217 9.09306 30.8784C11.2474 33.0352 13.9929 34.5048 16.9823 35.1015C19.9718 35.6982 23.071 35.3953 25.8883 34.231C28.7056 33.0667 31.1145 31.0933 32.8106 28.5603C34.5066 26.0272 35.4135 23.0482 35.4168 19.9998C35.4255 19.861 35.4255 19.7219 35.4168 19.5831C35.3859 19.2516 35.4879 18.9214 35.7005 18.6651C35.913 18.4088 36.2186 18.2474 36.5502 18.2164C36.8817 18.1855 37.2119 18.2875 37.4682 18.5001C37.7245 18.7126 37.8859 19.0183 37.9168 19.3498V19.9998C37.9124 24.7502 36.0234 29.3048 32.6643 32.6639C29.3052 36.023 24.7506 37.912 20.0002 37.9164Z"
                                                    fill="#20BF55"
                                                />
                                                <path
                                                    d="M19.7002 25.6833C19.5382 25.6857 19.3775 25.6544 19.2283 25.5912C19.079 25.5281 18.9446 25.4346 18.8335 25.3166L10.7835 17.4166C10.5495 17.1823 10.418 16.8646 10.418 16.5333C10.418 16.2021 10.5495 15.8844 10.7835 15.65C11.0228 15.4188 11.3425 15.2896 11.6752 15.2896C12.0079 15.2896 12.3276 15.4188 12.5669 15.65L19.7169 22.7L35.8002 6.88331C36.0395 6.65215 36.3592 6.52295 36.6919 6.52295C37.0246 6.52295 37.3443 6.65215 37.5835 6.88331C37.8176 7.11769 37.9491 7.43539 37.9491 7.76664C37.9491 8.0979 37.8176 8.4156 37.5835 8.64998L20.6169 25.3166C20.4976 25.4376 20.3546 25.5326 20.1968 25.5957C20.0391 25.6588 19.87 25.6886 19.7002 25.6833Z"
                                                    fill="#20BF55"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_65_897">
                                                    <rect width="40" height="40" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
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
                                            18
                                        </h4>
                                    </div>
                                    <div className="bg-bgOrange flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 40 40"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_65_909)">
                                                <path
                                                    d="M20 40.5C16.0444 40.5 12.1776 39.327 8.8886 37.1294C5.59962 34.9318 3.03617 31.8082 1.52242 28.1537C0.00866562 24.4992 -0.387401 20.4778 0.384303 16.5982C1.15601 12.7186 3.06082 9.15492 5.85787 6.35787C8.65492 3.56082 12.2186 1.65601 16.0982 0.884303C19.9778 0.112599 23.9992 0.508666 27.6537 2.02242C31.3082 3.53617 34.4318 6.09962 36.6294 9.3886C38.827 12.6776 40 16.5444 40 20.5C39.9917 21.979 39.8325 23.4533 39.525 24.9C39.4889 25.0642 39.4208 25.2196 39.3246 25.3574C39.2284 25.4953 39.106 25.6128 38.9644 25.7033C38.8228 25.7939 38.6648 25.8556 38.4993 25.8851C38.3338 25.9146 38.1642 25.9111 38 25.875C37.8359 25.8389 37.6804 25.7708 37.5426 25.6746C37.4048 25.5784 37.2872 25.456 37.1967 25.3144C37.1061 25.1728 37.0444 25.0148 37.0149 24.8493C36.9855 24.6838 36.9889 24.5142 37.025 24.35C37.3216 23.0875 37.4808 21.7967 37.5 20.5C37.4973 16.6799 36.2447 12.9657 33.9334 9.92415C31.6221 6.88264 28.379 4.68096 24.6992 3.65516C21.0195 2.62937 17.1051 2.83582 13.5536 4.243C10.0022 5.65018 7.00872 8.18079 5.03017 11.4486C3.05161 14.7163 2.19666 18.5418 2.5958 22.3409C2.99494 26.1401 4.62625 29.7043 7.24074 32.4895C9.85522 35.2748 13.3092 37.128 17.0756 37.7664C20.842 38.4047 24.7138 37.7932 28.1 36.025C28.2458 35.9252 28.411 35.8575 28.5849 35.8262C28.7587 35.795 28.9372 35.8009 29.1086 35.8437C29.28 35.8864 29.4404 35.965 29.5792 36.0742C29.718 36.1835 29.832 36.3209 29.9139 36.4774C29.9957 36.634 30.0434 36.8061 30.0539 36.9824C30.0644 37.1587 30.0373 37.3353 29.9746 37.5004C29.9119 37.6655 29.8149 37.8155 29.69 37.9404C29.5651 38.0653 29.4151 38.1623 29.25 38.225C26.3981 39.7257 23.2227 40.5067 20 40.5Z"
                                                    fill="#EB8909"
                                                />
                                                <path
                                                    d="M33.75 35.5C33.4185 35.5 33.1005 35.3683 32.8661 35.1339C32.6317 34.8995 32.5 34.5815 32.5 34.25V24.25C32.5 23.9185 32.6317 23.6005 32.8661 23.3661C33.1005 23.1317 33.4185 23 33.75 23C34.0815 23 34.3995 23.1317 34.6339 23.3661C34.8683 23.6005 35 23.9185 35 24.25V34.25C35 34.5815 34.8683 34.8995 34.6339 35.1339C34.3995 35.3683 34.0815 35.5 33.75 35.5Z"
                                                    fill="#EB8909"
                                                />
                                                <path
                                                    d="M33.75 40.5C34.4404 40.5 35 39.9404 35 39.25C35 38.5596 34.4404 38 33.75 38C33.0596 38 32.5 38.5596 32.5 39.25C32.5 39.9404 33.0596 40.5 33.75 40.5Z"
                                                    fill="#EB8909"
                                                />
                                                <path
                                                    d="M12.7002 27.45C12.5179 27.1705 12.4525 26.8307 12.5179 26.5036C12.5834 26.1764 12.7744 25.8879 13.0502 25.7L20.0002 21.075V9.25C20.0002 8.91848 20.1318 8.60054 20.3663 8.36612C20.6007 8.1317 20.9186 8 21.2502 8C21.5817 8 21.8996 8.1317 22.134 8.36612C22.3685 8.60054 22.5002 8.91848 22.5002 9.25V21.75C22.5003 21.9565 22.4504 22.1599 22.3546 22.3428C22.2588 22.5257 22.12 22.6826 21.9502 22.8L14.4502 27.8C14.1645 27.9593 13.8314 28.0116 13.5107 27.9475C13.1899 27.8833 12.9025 27.707 12.7002 27.45Z"
                                                    fill="#EB8909"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_65_909">
                                                    <rect
                                                        width="40"
                                                        height="40"
                                                        fill="white"
                                                        transform="translate(0 0.5)"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
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
                                            08
                                        </h4>
                                    </div>
                                    <div className="bg-bgRed flex justify-center items-center w-[45px] h-[45px] p-[8px] rounded-[10px]">
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 40 40"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clip-path="url(#clip0_65_921)">
                                                <g clip-path="url(#clip1_65_921)">
                                                    <path
                                                        d="M19.9995 27.4131C18.8812 27.4131 17.9438 28.3505 17.9438 29.4687C17.9438 30.587 18.8812 31.5244 19.9995 31.5244C21.0767 31.5244 22.0552 30.587 22.0058 29.5181C22.0552 28.3422 21.126 27.4131 19.9995 27.4131Z"
                                                        fill="#EA4335"
                                                    />
                                                    <path
                                                        d="M39.0266 34.6982C40.3176 32.4699 40.3258 29.814 39.0431 27.5939L26.1665 5.29412C24.892 3.04935 22.5896 1.71729 20.0077 1.71729C17.4258 1.71729 15.1235 3.05757 13.849 5.2859L0.955919 27.6103C-0.32681 29.8551 -0.318587 32.5274 0.980586 34.7558C2.26331 36.9594 4.55743 38.2833 7.12288 38.2833H32.8432C35.4169 38.2833 37.7275 36.943 39.0266 34.6982ZM36.2309 33.0866C35.5156 34.32 34.2493 35.0518 32.835 35.0518H7.11466C5.71681 35.0518 4.45875 34.3364 3.75983 33.1277C3.05269 31.9025 3.04446 30.4389 3.75161 29.2055L16.6447 6.88931C17.3436 5.66414 18.5934 4.94055 20.0077 4.94055C21.4138 4.94055 22.6719 5.67237 23.3708 6.89754L36.2556 29.2137C36.9463 30.4142 36.9381 31.8614 36.2309 33.0866Z"
                                                        fill="#EA4335"
                                                    />
                                                    <path
                                                        d="M19.4898 12.9824C18.5113 13.2619 17.9028 14.15 17.9028 15.2271C17.9522 15.8767 17.9933 16.5345 18.0426 17.1841C18.1824 19.6591 18.3222 22.0848 18.462 24.5598C18.5113 25.3985 19.1609 26.007 19.9996 26.007C20.8383 26.007 21.4961 25.3574 21.5372 24.5105C21.5372 24.0007 21.5372 23.532 21.5866 23.0139C21.677 21.427 21.7757 19.84 21.8661 18.253C21.9155 17.2252 22.0059 16.1974 22.0553 15.1696C22.0553 14.7995 22.0059 14.4706 21.8661 14.1417C21.4468 13.2208 20.4683 12.7521 19.4898 12.9824Z"
                                                        fill="#EA4335"
                                                    />
                                                </g>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_65_921">
                                                    <rect width="40" height="40" fill="white" />
                                                </clipPath>
                                                <clipPath id="clip1_65_921">
                                                    <rect width="40" height="40" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
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
export default DocReqManagement;