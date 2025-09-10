import React, { useState, useEffect } from "react";
import { addClient, getAllStaff } from "../api/dashboard.api";
import { toast } from "react-toastify";
import { useToast } from "../CommonPages/customtoast/CustomToaster";

const AddClientmodal = ({ isOpen, onClose, title, children }) => {
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
  const { addToast } = useToast();

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
    } else if (!isOpen) {
      setFormData({
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
      setError(null);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const clientData = {
        ...formData,
        sendInvitation: undefined,
      };

      const response = await addClient(clientData);
      setFormData({
        name: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        company: "",
        status: "",
        staffId: "",
        address: "",
        notes: "",
        sendInvitation: false,
      });
      if (response.success) {
        setError(null);
        addToast("Client added successfully!", "success");
        setFormData({
          name: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          company: "",
          status: "",
          staffId: "",
          address: "",
          notes: "",
          sendInvitation: false,
        });
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add client");
      addToast(err.response?.data?.message || "Failed to add client", "error");
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
    <div className="fixed inset-0 bg-[#0000005D]  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6  rounded-lg w-full relative max-w-[562px] max-h-[550px] overflow-y-auto  scrollbar-none">
        <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
          <div className="flex justify-between items-center mb-[30px]">
            <h2 className="text-[#484848] font-medium text-[16px] leading-[100%] tracking-[0]">
              {title || "Add New Client"}
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Client Name"
                  className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                  Last Name*
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  value={formData.phoneNumber}
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
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                  Status*
                </label>
                <select
                  name="status"
                  value={formData.status}
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
                  Assign to Staff*
                </label>
                <select
                  name="staffId"
                  value={formData.staffId}
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
                      {staff.first_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                Address*
              </label>
              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
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
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter Additional Notes About Client"
                className="w-full rounded-[6px] px-3 py-2 text-sm resize-none bg-[#F8F8F8] text-[12px]"
              ></textarea>
            </div>

            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="invite"
                name="sendInvitation"
                checked={formData.sendInvitation}
                onChange={handleCheckboxChange}
                className="accent-[#2E7ED4]"
              />
              <label htmlFor="invite" className="text-sm text-body">
                Send invitation to client
              </label>
            </div> */}

            <div className="text-right">
              <button
                type="button"
                onClick={onClose}
                className={`mr-2 border border-[#2E7ED4] text-[#2E7ED4] px-4 py-2 rounded-[8px] text-sm font-medium 
      ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#E4F0F3]"}`}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-4 py-2 rounded-[8px] text-sm font-medium border border-[#2E7ED4] 
      ${
        loading
          ? "bg-[#2E7ED4] text-white opacity-50 cursor-not-allowed"
          : "bg-[#2E7ED4] text-white hover:bg-[#1E5FB6]"
      }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Add Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClientmodal;
