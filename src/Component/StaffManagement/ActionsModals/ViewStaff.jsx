import React from "react";

function ViewStaff({ isOpen, onClose, staff }) {
  if (!isOpen || !staff) return null;

  const role = staff.role_id === 1 ? "Admin" : "Staff";

  return (
    <div className="fixed inset-0 bg-[#0000005D]  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 slide-in-from-bottom-4">
        {/* Header */}
        <div className="relative bg-blue-700 text-white px-8 py-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold tracking-tight">Staff Details</h2>
          <div className="absolute -bottom-3 left-8"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 group"
          >
            <span className="text-black text-lg ">✕</span>
          </button>
        </div>

        <div className="px-8 py-8 pt-6">
          <div className="space-y-5">
            <div className="border-l-4 border-blue-500 pl-4 mt-2">
              <p className="text-sm text-gray-500 uppercase  font-medium">
                Full Name
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {staff.first_name} {staff.last_name}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Email
                </p>
                <p className="text-gray-800 font-medium break-all">
                  {staff.email}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Phone
                </p>
                <p className="text-gray-800 font-medium">{staff.phoneNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Role
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {role}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Status
                </p>
                <span
                  className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                    staff.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {staff.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Date of Birth
                </p>
                <p className="text-gray-800 font-medium">{staff.dob}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Address
                </p>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {staff.address}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                Member Since
              </p>
              <p className="text-gray-600 text-sm">
                {new Date(staff.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-700  hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewStaff;
