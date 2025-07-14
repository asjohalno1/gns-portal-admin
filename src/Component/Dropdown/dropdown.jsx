import React, { useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option) => {
    console.log("Selected:", option);
    setIsOpen(false);
  };
  const options = [
    "View",
    "Request Document",
    "Mark Complete",
    "Send Reminder",
  ];
  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} className="cursor-pointer">
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
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-xl ring-opacity-5 z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-4 py-2 text-sm text-body hover:text-primaryBlue"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
