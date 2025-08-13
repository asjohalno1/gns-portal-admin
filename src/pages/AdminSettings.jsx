import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ImageFallbackIcon } from "../Icons/SvgIcons";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [userDetail, setUserDetail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  const [clientsListing, setClientsListing] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientFolderName, setClientFolderName] = useState("");
  const [uncategorized, setUncategorized] = useState(true);
  const [standardFolder, setStandardFolder] = useState(true);
  const [additionalSubfolders, setAdditionalSubfolders] = useState([]);
  const [newSubfolder, setNewSubfolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchCreateLoading, setFetchCreateLoading] = useState(false);
  const [folderTreeData, setFolderTreeData] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderPath, setSelectedFolderPath] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  const handleImageClick = () => {
    console.log("Image clicked");
  };
  const handleFileChange = (e) => {
    console.log("File changed", e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Update clicked");
    // Here you would typically send the updated user details to your backend
  };
  const handleClientSelect = (e) => {
    setSelectedClientId(e.target.value);
  };
  const handleFolderSelect = (id, path) => {
    setSelectedFolderId(id);
    setSelectedFolderPath(path);
  };
  const handleAddGoogleMapping = async () => {
    console.log("Adding Google Drive mapping");
    // Here you would typically send the mapping details to your backend
  };

  const handleAddSubfolder = () => {
    if (newSubfolder.trim() === "") {
      toast.error("Subfolder name cannot be empty");
      return;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <div className="p-7.5 pt-[86px] w-full">
        <div className="flex space-x-6 border-b border-gray-300 mb-8 w-full">
          {["general", "drive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-[10px] text-base leading-[100%] tracking-[0] rounded-t-md ${
                activeTab === tab
                  ? "bg-bgBlue font-semibold text-primaryBlue border-b-2 border-primaryBlue"
                  : "text-bodyColor hover:bg-tabsBg border-b-2 border-transparent font-regular bg-[#F8FAFC]"
              }`}
            >
              {tab === "general" ? "General Settings" : "Google Drive"}
            </button>
          ))}
        </div>
        <div className="">
          {activeTab === "general" && (
            <>
              <h3 className="text-[18px] font-semibold leading-[100%] tracking-[0] text-[#2C3E50] mb-6">
                Personal Information
              </h3>
              <div className="bg-white border border-[#2C3E501A] rounded-xl p-8">
                {/* Profile Image Upload */}
                <div className="flex items-end gap-6 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Image Box */}
                    <div className="relative w-[120px] h-[120px] rounded-[16px] bg-gray-100 flex items-center justify-center">
                      {image ? (
                        <img
                          src={
                            image.startsWith("http") ||
                            image.startsWith("blob:")
                              ? image
                              : `${
                                  import.meta.env.VITE_API_BASE_URL_IMAGE || ""
                                }${image}`
                          }
                          alt="Profile"
                          className="w-full h-full object-cover rounded-[16px]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "default-profile.png";
                          }}
                        />
                      ) : (
                        <ImageFallbackIcon />
                      )}
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-[-10px] right-[-10px] w-8 h-8 rounded-full bg-[#4A90E2] border-4 border-white flex items-center justify-center shadow-md hover:bg-blue-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 20h4l11-11-4-4L4 16v4zm14.7-13.3l-1.4-1.4a1 1 0 00-1.4 0l-1 1 2.8 2.8 1-1a1 1 0 000-1.4z" />
                        </svg>
                      </button>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-sm text-[#4A90E2] border border-[#4A90E2] px-4 py-1.5 rounded-[10px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 "
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none "
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      Email
                    </label>
                    <input
                      disabled
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    onClick={handleUpdate}
                    className="bg-primaryBlue text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "drive" && (
            <>
              <div className="flex items-center justify-between mb-[30px]">
                <h3 className="text-[18px] font-semibold leading-[100%] tracking-[0] text-[#2C3E50]">
                  Add Client Drive Mapping
                </h3>
                {/* <button className="text-[#2E7ED4] border border-[#2E7ED4] rounded-md px-[21px] py-[9px] font-medium text-[14px] leading-[100%] tracking-[0] flex items-center gap-[10px]">
                  <div>Back</div>
                </button> */}
              </div>
              <div className="mt-[20px]">
                <div className="bg-white border border-[#2C3E501A] rounded-lg p-4 space-y-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-[10px] items-center justify-between mb-[30px]">
                    <h3 className="font-medium text-[16px] leading-[100%] tracking-[0%] text-[#2C3E50]">
                      Map Client to Google Drive Folder
                    </h3>
                  </div>
                  <div className="mb-[20px]">
                    <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] align-middle text-[#484848] mb-[13px]">
                      Select Client
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none"
                      onChange={handleClientSelect}
                      value={selectedClientId}
                    >
                      <option value="" disabled hidden>
                        Select Client
                      </option>
                      {clientsListing?.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-[20px]">
                    <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] align-middle text-[#484848] mb-[13px]">
                      Select Parent Folder
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4 text-[14px] text-gray-800 max-h-[300px] overflow-y-auto leading-[1.5]">
                      {loading ? (
                        <BarSpinnerIcon />
                      ) : (
                        <>
                          {folderTreeData && (
                            <div className="space-y-1">
                              {/* Root folder option */}
                              <div
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                  selectedFolderId === "root"
                                    ? "bg-blue-100 border-2 border-blue-500"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  handleFolderSelect(
                                    "root",
                                    folderTreeData.name
                                  )
                                }
                              >
                                <RootFolderIcon />
                                <div className="font-medium text-[14px] text-[#2C3E50]">
                                  {folderTreeData.name}
                                </div>
                              </div>

                              {folderTreeData.folders?.map((folder) => (
                                <FolderItem
                                  key={folder.id}
                                  folder={folder}
                                  selectedFolderId={selectedFolderId}
                                  onFolderSelect={handleFolderSelect}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {/* Show selected folder path */}
                    {selectedFolderPath && (
                      <div className="mt-2 text-sm text-blue-600">
                        Selected: {selectedFolderPath}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] align-middle text-[#484848] mb-[13px]">
                      Client Folder Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none"
                      value={clientFolderName}
                      onChange={(e) => setClientFolderName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start space-x-2 mb-[30px]">
                      <input
                        type="checkbox"
                        className="accent-green-600"
                        checked={uncategorized}
                        onChange={(e) => setUncategorized(e.target.checked)}
                      />
                      <span className="-top-[3px] relative font-medium text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50]">
                        Create Uncategorized subfolder
                        <span className="block font-normal text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50] opacity-[0.6] mt-[6px]">
                          Client uploads will be automatically stored in this
                          subfolder.
                        </span>
                      </span>
                    </label>

                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        className="accent-green-600"
                        checked={standardFolder}
                        onChange={(e) => setStandardFolder(e.target.checked)}
                      />
                      <span className="-top-[3px] relative font-medium text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50]">
                        Create standard document category subfolders
                        <span className="block font-normal text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50] opacity-[0.6] mt-[6px]">
                          Creates Tax Returns and Bookkeeping standard
                          subfolders.
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="mb-6 mt-[20px]">
                    <label className="block text-[14px] text-[#2C3E50] font-medium mb-2">
                      Additional Subfolders
                    </label>
                    <div className="flex max-[375px]:flex-col flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Subfolder name"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
                        value={newSubfolder}
                        onChange={(e) => setNewSubfolder(e.target.value)}
                      />
                    </div>
                    <button
                      className="bg-[#ffffff] text-[#2E7ED4] border border-[#2E7ED4] rounded-[10px] px-4 py-2 text-sm mt-[10px]"
                      onClick={handleAddSubfolder}
                    >
                      Add Subfolder
                    </button>
                    {/* Display added subfolders */}
                    {additionalSubfolders.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Added Subfolders:
                        </h4>
                        <ul className="space-y-2">
                          {additionalSubfolders.map((folder, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between shadow ring-1 ring-gray-200 p-2 rounded-md"
                            >
                              <span>{folder}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubfolder(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-[20px] flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddGoogleMapping}
                      disabled={fetchCreateLoading}
                      className={`text-white text-sm px-6 py-2 rounded transition ${
                        fetchCreateLoading
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-primaryBlue hover:bg-blue-700"
                      }`}
                    >
                      {fetchCreateLoading ? "Creating..." : "Create Mapping"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
