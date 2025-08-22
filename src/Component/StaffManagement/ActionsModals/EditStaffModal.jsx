import React, { useState, useEffect } from "react";
import { PERMISSIONS } from "../../../adminutils/commonutils";

function EditStaffModal({ isOpen, onClose, staff, onUpdate }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    address: "",
    active: true,
    rolePermissions: [],
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name || "",
        last_name: staff.last_name || "",
        email: staff.email || "",
        phoneNumber: staff.phoneNumber || "",
        dob: staff.dob || "",
        address: staff.address || "",
        active: staff.active ?? true,
        rolePermissions: staff.rolePermissions || [],
      });
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePermissionChange = (key) => {
    setFormData((prev) => {
      const alreadySelected = prev.rolePermissions.includes(key);
      return {
        ...prev,
        rolePermissions: alreadySelected
          ? prev.rolePermissions.filter((p) => p !== key)
          : [...prev.rolePermissions, key],
      };
    });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto  relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">Edit Staff</h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              rows={3}
            />
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-600 font-medium">Active</label>
          </div>

          {/* Role Permissions */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-2">
              Role Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PERMISSIONS.map((perm) => (
                <label key={perm.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.rolePermissions.includes(perm.key)}
                    onChange={() => handlePermissionChange(perm.key)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStaffModal;
