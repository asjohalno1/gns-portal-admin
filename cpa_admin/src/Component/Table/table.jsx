import React from "react";
import Dropdown from "../Dropdown/dropdown";

const Table = () => {
  return (
    <div className="relative overflow-x-auto border border-customGray sm:rounded-lg">
      <table className="w-full  text-left rtl:text-right ">
        <thead className=" text-body  bg-[#E4F0F3] border border-[#eaeaea]">
          <tr>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Client name
            </th>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Document
            </th>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Expires
            </th>
            <th scope="col" className="px-6 py-3 text-base font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white    border-b border-[#eaeaea] ">
            <td className="px-6 py-4 text-base font-normal color-black ">
              John Doe
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            W-2 Form (2024)
            </td>
            <td className="px-6 py-4">
            Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#FEF3C7] text-[#D97706] px-8 py-1.5 rounded-full cursor-pointer"
              >
                Expires Soon
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4 ">
              <Dropdown />
            </td>
          </tr>
          <tr className="bg-white border-b border-[#eaeaea]  ">
            <td className="px-6 py-4 text-base font-normal color-black">
              Sarah Smith
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            1099-INT Form (Wells Fargo)
            </td>
            <td className="px-6 py-4">
              {" "}
              Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#FEF3C7] text-[#D97706] px-8 py-1.5 rounded-full cursor-pointer"
              >
                Expires Soon
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr className="bg-white border-b border-[#eaeaea]  ">
            <td className="px-6 py-4 text-base font-normal color-black">
              Mike Johnson
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            1095-A Form (Health Net))
            </td>
            <td className="px-6 py-4">
              {" "}
              Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#DBEAFE] text-[#2E7ED4] px-8 py-1.5 rounded-full cursor-pointer btn-table"
              >
                Used
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr className="bg-white border-b border-[#eaeaea]  ">
            <td className="px-6 py-4 text-base font-normal color-black">
              ABC Corporation
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
              All Uplaoded
            </td>
            <td className="px-6 py-4">
              {" "}
              Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
              >
                Active
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr className="bg-white border-b border-[#eaeaea]  ">
            <td className="px-6 py-4 text-base font-normal color-black">
              Kelly Jonson
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Bank Statements (Q1 2025)
            </td>
            <td className="px-6 py-4">
              {" "}
              Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#FEF3C7] text-[#D97706] px-8 py-1.5 rounded-full cursor-pointer"
              >
                Expires Soon
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr className="bg-white    border-b border-[#eaeaea] ">
            <td className="px-6 py-4 text-base font-normal color-black">
              Will Smith
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Quarterly Profit & Loss
            </td>
            <td className="px-6 py-4">
            Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#FEE2E2] text-[#DC2626] px-8 py-1.5 rounded-full cursor-pointer btn-table"
              >
                Expired
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black ">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4 ">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr className="bg-white border-b border-[#eaeaea]  ">
            <td className="px-6 py-4 text-base font-normal color-black">
              Harry Potter
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
              All Uplaoded
            </td>
            <td className="px-6 py-4">
              {" "}
              Mar 1, 2023
            </td>
            <td className="px-6 py-4">
              {" "}
              <button
                type="button"
                className="bg-[#D1FAE5] text-[#059669] px-8 py-1.5 rounded-full cursor-pointer btn-table"
              >
                Active
              </button>
            </td>
            <td className="px-6 py-4 text-base font-normal color-black">
            Apr 1, 2025
            </td>
            <td className="px-6 py-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.9" clip-path="url(#clip0_71_725)">
                  <g clip-path="url(#clip1_71_725)">
                    <path
                      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M17.25 13.5C18.0784 13.5 18.75 12.8284 18.75 12C18.75 11.1716 18.0784 10.5 17.25 10.5C16.4216 10.5 15.75 11.1716 15.75 12C15.75 12.8284 16.4216 13.5 17.25 13.5Z"
                      fill="#2C3E50"
                    />
                    <path
                      d="M6.75 13.5C7.57843 13.5 8.25 12.8284 8.25 12C8.25 11.1716 7.57843 10.5 6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12C5.25 12.8284 5.92157 13.5 6.75 13.5Z"
                      fill="#2C3E50"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_71_725">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 text-base font-normal color-black">
              Show entries:
              <input
                className="border border-[#B6C8D6] rounded-[7px] w-[12%] px-2 py-1 ml-5"
                placeholder="10"
                type="number"
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="px-6 py-4 text-base font-normal color-black flex items-center justify-end">
              {" "}
              <span>1 - 10 of 100</span>
              <ul className="flex ml-[30px] ">
                <li className="border border-[#2C3E50] h-7 w-7 rounded-[8px] flex items-center justify-center cursor-pointer">
                  <i class="fa-solid fa-chevron-left"></i>
                </li>
                <li className="border border-[#2C3E50] h-7 w-7 rounded-[8px] flex items-center justify-center ml-2.5 cursor-pointer">
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Table;