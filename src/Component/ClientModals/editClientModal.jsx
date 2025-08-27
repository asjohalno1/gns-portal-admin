import React, { useState, useEffect } from "react";
import {
  updateClient,
  getAllStaff,
  deleteClient,
} from "../../api/dashboard.api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditClientmodal = ({ isOpen, onClose, clientData }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    status: "",
    staffId: "",
    address: "",
    notes: "",
  });

  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData?.client?.name || "",
        lastName: clientData?.client?.lastName || "",
        email: clientData?.client?.email || "",
        phoneNumber: clientData?.client?.phoneNumber || "",
        company: clientData?.client?.company || "",
        status: clientData?.client?.status === true ? true : false, // or use boolean
        staffId: clientData?.assignedStaff?._id || "",
        address: clientData?.client?.address || "",
        notes: clientData?.client?.notes || "",
      });
    }
  }, [clientData]);

  // Fetch staff members when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchStaffMembers = async () => {
        try {
          setLoading(true);
          const response = await getAllStaff();
          setStaffMembers(response.data || []);
        } catch (err) {
          setError("Failed to fetch staff members");
          console.error("Error fetching staff members:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStaffMembers();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payloadClient = {
        ...formData,
        sendInvitation: undefined,
      };
      const response = await updateClient(
        payloadClient,
        clientData?.client?._id
      );
      if (response.success === true) {
        toast.success("Client Updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Error While Client Updating", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add client");
      console.error("Error adding client:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      sendInvitation: checked,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
          <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
            <div className="flex justify-between items-center mb-[30px]">
              <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">
                {"Update Client"}
              </h2>
              <button
                onClick={onClose}
                className=" text-primaryBlue hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Client Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    placeholder="Enter Client Name"
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName || ""}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    placeholder="Enter Email Address"
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Phone no.*
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData?.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Company*
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData?.company}
                    onChange={handleChange}
                    placeholder="Enter Company Name"
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData?.status}
                    onChange={handleChange}
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                    Assign to Staff
                  </label>
                  <select
                    name="staffId"
                    value={formData?.staffId}
                    onChange={handleChange}
                    className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm "
                    disabled={loading}
                  >
                    <option className="text-black bg-blue-100" value="">
                      Select Staff Member
                    </option>
                    {staffMembers.map((staff) => (
                      <option
                        className="text-dark "
                        key={staff._id}
                        value={staff._id}
                      >
                        {staff?.first_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                  Address
                </label>
                <textarea
                  rows="3"
                  name="address"
                  value={formData?.address}
                  onChange={handleChange}
                  placeholder="Enter Complete Address"
                  className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                  Notes
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={formData?.notes}
                  onChange={handleChange}
                  placeholder="Enter Additional Notes About Client"
                  className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2E7ED4] border border-[#2E7ED4] text-white px-4 py-2 rounded-[8px] text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditClientmodal;
