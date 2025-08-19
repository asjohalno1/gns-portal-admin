import React, { useEffect, useRef, useState, useCallback, use } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ImageFallbackIcon } from "../Icons/SvgIcons";
import {
  getDriveMappingApi,
  getProfileApi,
  updateProfileApi,
  getAssociatedClientsApi,
  createDriveMappingApi,
} from "../api/admin.setting.api";
import axiosInstance from "../api/axiosInstance";

const AdminSettings = () => {
  // State management
  const [activeTab, setActiveTab] = useState("general");
  const [userDetail, setUserDetail] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    address: "",
  });
  const [driveSettings, setDriveSettings] = useState({
    selectedClientId: "",
    clientFolderName: "",
    uncategorized: true,
    standardFolder: true,
    additionalSubfolders: [],
    newSubfolder: "",
    selectedFolderId: null,
    selectedFolderPath: "",
  });
  const [loading, setLoading] = useState({
    profile: false,
    drive: false,
    update: false,
    image: false,
  });
  const fileInputRef = useRef(null);
  const [clientsListing, setClientsListing] = useState([]);
  const [folderTreeData, setFolderTreeData] = useState(null);
  const [image, setImage] = useState("");

  const fetchProfileDetails = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await getProfileApi();
      const {
        first_name,
        last_name,
        email,
        phoneNumber,
        dob,
        address,
        profile,
      } = response.data;

      setUserDetail(response.data);
      setImage(profile);
      setFormData({
        firstName: first_name || "",
        lastName: last_name || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        dob: dob || "",
        address: address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile details");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, []);

  const fetchAssociatedClients = useCallback(async (id) => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await getAssociatedClientsApi(id);
      setClientsListing(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile details");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "general" && !userDetail) {
      fetchProfileDetails();
    }
  }, [activeTab, userDetail, fetchProfileDetails]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, image: true }));
      const imageUrl = URL.createObjectURL(file);
      console.log("Image URL:", imageUrl);
      setImage(imageUrl);
      const formData = new FormData();
      formData.append("profile", file);
      formData.append("profile", "true");
      const response = await axiosInstance.patch(
        "/admin/updateprofile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUserDetail((prev) => ({
          ...prev,
          profile: response.data.data.profile,
        }));
        fetchProfileDetails();
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      setImage("");
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
      e.target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);
  const handleRemoveImage = async () => {
    try {
      setLoading((prev) => ({ ...prev, image: true }));
      await updateProfileApi({ profile: "" });
      setUserDetail((prev) => ({
        ...prev,
        profile: "",
      }));

      toast.success("Profile image removed successfully");
      fetchProfileDetails();
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error("Failed to remove profile image");
    } finally {
      setLoading((prev) => ({ ...prev, image: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDriveSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDriveSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, update: true }));

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob,
        address: formData.address,
      };

      await updateProfileApi(payload);
      toast.success("Profile updated successfully");
      fetchProfileDetails();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleClientSelect = (e) => {
    setDriveSettings((prev) => ({
      ...prev,
      selectedClientId: e.target.value,
    }));
  };

  const handleFolderSelect = (id, path) => {
    setDriveSettings((prev) => ({
      ...prev,
      selectedFolderId: id,
      selectedFolderPath: path,
    }));
  };

  const handleAddSubfolder = () => {
    const { newSubfolder, additionalSubfolders } = driveSettings;

    if (!newSubfolder.trim()) {
      toast.error("Subfolder name cannot be empty");
      return;
    }

    setDriveSettings((prev) => ({
      ...prev,
      additionalSubfolders: [...prev.additionalSubfolders, newSubfolder.trim()],
      newSubfolder: "",
    }));
  };

  const handleRemoveSubfolder = (index) => {
    setDriveSettings((prev) => ({
      ...prev,
      additionalSubfolders: prev.additionalSubfolders.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleAddGoogleMapping = async () => {
    const {
      selectedStaffId,
      selectedClientId,
      uncategorized,
      standardFolder,
      additionalSubfolders,
    } = driveSettings;

    // Validate required fields
    if (!selectedStaffId || !selectedClientId) {
      toast.error("Please select staff, client, and provide a folder name");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, drive: true }));

      const mappingData = {
        staffId: selectedStaffId,
        clientId: selectedClientId,
        uncategorized,
        standardFolder,
        additionalSubfolders,
      };

      const response = await createDriveMappingApi(mappingData);

      if (response.success) {
        toast.success("Drive mapping created successfully");
        // Refresh the folder tree to show the new mapping
        fetchDriveMapping();
        // Reset form
        setDriveSettings((prev) => ({
          ...prev,
          selectedClientId: "",
          additionalSubfolders: [],
          newSubfolder: "",
        }));
      } else {
        toast.error(response.message || "Failed to create mapping");
      }
    } catch (error) {
      console.error("Error creating drive mapping:", error);
      toast.error(
        error.response?.data?.message || "Failed to create drive mapping"
      );
    } finally {
      setLoading((prev) => ({ ...prev, drive: false }));
    }
  };
  const fetchDriveMapping = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, drive: true }));
      const response = await getDriveMappingApi();

      if (response.data) {
        setFolderTreeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching drive mapping:", error);
      toast.error("Failed to fetch drive mapping");
    } finally {
      setLoading((prev) => ({ ...prev, drive: false }));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "drive") {
      fetchDriveMapping();
    }
  }, [activeTab]);

  const FolderItem = ({
    item,
    level = 0,
    selectedFolderId,
    onFolderSelect,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = () => setIsOpen(!isOpen);

    return (
      <div className="ml-4">
        <div
          className={`flex items-center p-2 rounded cursor-pointer ${
            selectedFolderId === item.id ? "bg-blue-100" : "hover:bg-gray-50"
          }`}
          onClick={() => onFolderSelect(item.id, item.name)}
        >
          {item.folders?.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder();
              }}
              className="mr-2"
            >
              {isOpen ? "▼" : "►"}
            </button>
          )}
          <span>{item.name}</span>
        </div>

        {isOpen && item.folders?.length > 0 && (
          <div className="ml-4">
            {item.folders.map((subFolder) => (
              <FolderItem
                key={subFolder.id}
                item={subFolder}
                level={level + 1}
                selectedFolderId={selectedFolderId}
                onFolderSelect={onFolderSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render functions
  const renderGeneralTab = () => (
    <>
      <h3 className="text-[18px] font-semibold leading-[100%] tracking-[0] text-[#2C3E50] mb-6">
        Personal Information
      </h3>
      <div className="bg-white border border-[#2C3E501A] rounded-xl p-8">
        {/* Profile Image Upload */}
        <div className="flex items-end gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-[120px] h-[120px] rounded-[16px] bg-gray-100 flex items-center justify-center">
              {image ? ( // Temporary preview during upload
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL_IMAGE}${image}`}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-[16px]"
                />
              ) : userDetail?.profile ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                    userDetail.profile
                  }`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[16px]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              ) : (
                // Fallback icon
                <ImageFallbackIcon />
              )}
              <button
                type="button"
                onClick={handleImageClick}
                disabled={loading.image}
                className={`absolute bottom-[-10px] right-[-10px] w-8 h-8 rounded-full bg-[#4A90E2] border-4 border-white flex items-center justify-center shadow-md hover:bg-blue-600 ${
                  loading.image ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading.image ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 20h4l11-11-4-4L4 16v4zm14.7-13.3l-1.4-1.4a1 1 0 00-1.4 0l-1 1 2.8 2.8 1-1a1 1 0 000-1.4z" />
                  </svg>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading.image}
              />
            </div>
          </div>
          {(image || userDetail?.profile) && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={loading.image}
              className={`text-sm text-[#4A90E2] border border-[#4A90E2] px-4 py-1.5 rounded-[10px] cursor-pointer ${
                loading.image ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading.image ? "Removing..." : "Remove"}
            </button>
          )}
        </div>

        {/* Form Fields */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              Email
            </label>
            <input
              disabled
              type="email"
              value={formData.email}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              Phone
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium leading-[100%] tracking-[0] text-[#484848] mb-[8px]">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm border border-[#ECEDF0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading.update}
            className={`bg-primaryBlue text-white text-sm px-6 py-2 rounded hover:bg-blue-700 transition ${
              loading.update ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading.update ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );

  const renderDriveTab = () => {
    // Recursive component to render the folder hierarchy
    const renderFolderTree = (data, level = 0, path = "Admin") => {
      return (
        <div className="ml-4">
          {data.map((staff) => (
            <div key={staff.staffId} className="mb-2">
              {/* Staff level */}
              <div
                className={`p-2 rounded cursor-pointer ${
                  level === 0 ? "font-semibold" : ""
                }`}
              >
                {staff.staffName}
              </div>

              {/* Client level */}
              {staff.driveData?.folders?.map((clientFolder) => (
                <div key={clientFolder.id} className="ml-4">
                  <div className="p-2 rounded cursor-pointer">
                    {clientFolder.name}
                  </div>

                  {/* Subfolder level */}
                  {clientFolder.folders?.map((subfolder) => (
                    <div key={subfolder.id} className="ml-8">
                      <div className="p-2 rounded cursor-pointer">
                        {subfolder.name}
                      </div>

                      {/* Additional nested levels if needed */}
                      {subfolder.folders?.length > 0 &&
                        renderFolderTree(
                          subfolder.folders,
                          level + 3,
                          `${path}/${subfolder.name}`
                        )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    };

    return (
      <>
        <div className="flex items-center justify-between mb-[30px]">
          <h3 className="text-[18px] font-semibold leading-[100%] tracking-[0] text-[#2C3E50]">
            Drive Mapping Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Mapping Configuration Section */}
          <div className="bg-white border border-[#2C3E501A] rounded-lg p-4">
            <h3 className="font-medium text-[16px] leading-[100%] tracking-[0%] text-[#2C3E50] mb-4">
              Add New Mapping
            </h3>

            <div className="space-y-4">
              {/* Staff Selection */}
              <div>
                <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] text-[#484848] mb-2">
                  Select Staff
                </label>
                <select
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none"
                  disabled={loading.drive}
                  value={driveSettings.selectedStaffId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setDriveSettings((prev) => ({
                      ...prev,
                      selectedStaffId: selectedId,
                    }));
                    if (selectedId) {
                      fetchAssociatedClients(selectedId);
                    }
                  }}
                >
                  <option value="">Select Staff Member</option>
                  {folderTreeData?.map((staff) => (
                    <option key={staff.staffId} value={staff.staffId}>
                      {staff.staffName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Selection */}
              <div>
                <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] text-[#484848] mb-2">
                  Select Client
                </label>
                <select
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none"
                  disabled={loading.drive || !driveSettings.selectedStaffId}
                  value={driveSettings.selectedClientId}
                  onChange={handleClientSelect}
                >
                  <option value="">Select Client</option>
                  {clientsListing?.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent Folder Selection */}
              <div>
                <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] text-[#484848] mb-2">
                  Select Parent Folder
                </label>
                <div className="border border-gray-200 rounded-md p-2 max-h-[200px] overflow-y-auto">
                  {loading.drive ? (
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                          driveSettings.selectedFolderId === "root"
                            ? "bg-blue-100 border-2 border-blue-500"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          handleFolderSelect("root", "Root Folder")
                        }
                      >
                        <div className="font-medium text-[14px] text-[#2C3E50]">
                          Root Folder
                        </div>
                      </div>
                      {folderTreeData?.map((staff) => (
                        <FolderItem
                          key={staff.staffId}
                          item={{
                            id: staff.staffId,
                            name: staff.staffName,
                            folders: staff.driveData?.folders || [],
                          }}
                          selectedFolderId={driveSettings.selectedFolderId}
                          onFolderSelect={handleFolderSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {driveSettings.selectedFolderPath && (
                  <div className="mt-2 text-sm text-blue-600">
                    Selected: {driveSettings.selectedFolderPath}
                  </div>
                )}
              </div>

              {/* Client Folder Name */}
              {/* <div>
                <label className="block font-medium text-[14px] leading-[100%] tracking-[0%] text-[#484848] mb-2">
                  Client Folder Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none"
                  disabled={loading.drive}
                  value={driveSettings.clientFolderName}
                  onChange={(e) =>
                    setDriveSettings((prev) => ({
                      ...prev,
                      clientFolderName: e.target.value,
                    }))
                  }
                />
              </div> */}

              {/* Folder Options */}
              <div className="space-y-2">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={driveSettings.standardFolder}
                    onChange={(e) =>
                      setDriveSettings((prev) => ({
                        ...prev,
                        standardFolder: e.target.checked,
                      }))
                    }
                    disabled={loading.drive}
                  />
                  <span className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50]">
                    Create standard document category subfolders
                    <span className="block font-normal text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50] opacity-[0.6] mt-[6px]">
                      Creates Tax Returns and Bookkeeping standard subfolders.
                    </span>
                  </span>
                </label>

                {/* <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={driveSettings.uncategorized}
                    onChange={(e) =>
                      setDriveSettings((prev) => ({
                        ...prev,
                        uncategorized: e.target.checked,
                      }))
                    }
                    disabled={loading.drive}
                  />
                  <span className="font-medium text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50]">
                    Create Uncategorized subfolder
                    <span className="block font-normal text-[14px] leading-[100%] tracking-[0%] text-[#2C3E50] opacity-[0.6] mt-[6px]">
                      Client uploads will be automatically stored in this
                      subfolder.
                    </span>
                  </span>
                </label> */}
              </div>

              {/* Additional Subfolders */}
              <div>
                <label className="block text-[14px] text-[#2C3E50] font-medium mb-2">
                  Additional Subfolders
                </label>
                <div className="flex max-[375px]:flex-col flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Subfolder name"
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
                    value={driveSettings.newSubfolder}
                    onChange={(e) =>
                      setDriveSettings((prev) => ({
                        ...prev,
                        newSubfolder: e.target.value,
                      }))
                    }
                    disabled={loading.drive}
                  />
                  <button
                    className="bg-[#ffffff] text-[#2E7ED4] border border-[#2E7ED4] rounded-[10px] px-4 py-2 text-sm"
                    onClick={handleAddSubfolder}
                    disabled={loading.drive}
                  >
                    Add Subfolder
                  </button>
                </div>
                {driveSettings.additionalSubfolders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Added Subfolders:
                    </h4>
                    <ul className="space-y-2">
                      {driveSettings.additionalSubfolders.map(
                        (folder, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between shadow ring-1 ring-gray-200 p-2 rounded-md"
                          >
                            <span>{folder}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubfolder(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={loading.drive}
                            >
                              Remove
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Create Mapping Button */}
              <div className="mt-4 flex justify-end">
                <button
                  className={`text-white text-sm px-6 py-2 rounded transition ${
                    loading.drive
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-primaryBlue hover:bg-blue-700"
                  }`}
                  onClick={handleAddGoogleMapping}
                  disabled={loading.drive}
                >
                  {loading.drive ? "Creating..." : "Create Mapping"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
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
          {activeTab === "general" && renderGeneralTab()}
          {activeTab === "drive" && renderDriveTab()}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
