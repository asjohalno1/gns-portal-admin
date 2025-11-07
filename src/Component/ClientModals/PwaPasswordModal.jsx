import React, { useEffect, useState } from "react";
import { getClientDetails, updateClient, updateAllClientsPassword, getClientConfig } from "../../api/dashboard.api";
import { useToast } from "../../CommonPages/customtoast/CustomToaster";

const PwaPasswordModal = ({ isOpen, onClose, clientData, isStandardPassword = false }) => {
    const [clientDetails, setClientDetails] = useState(null);
    const [standardPassword, setStandardPassword] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (isStandardPassword) {
                // Fetch standard password from config
                getClientConfig()
                    .then((res) => {
                        setStandardPassword(res?.data?.standardPassword || res?.standardPassword || "");
                    })
                    .catch((err) => {
                        console.error("Error fetching client config:", err);
                        setStandardPassword("");
                    });
            } else if (clientData) {
                // Fetch single client details
                getClientDetails(clientData?._id).then((res) => {
                    setClientDetails(res?.data);
                });
            }
        }
    }, [clientData, isStandardPassword, isOpen]);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { addToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.newPassword || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            if (isStandardPassword) {
                // Update password for all clients
                const response = await updateAllClientsPassword(formData.newPassword);

                if (response.success === true) {
                    addToast("Standard password set successfully for all clients!", "success");
                    setFormData({ newPassword: "", confirmPassword: "" });
                    setShowPassword(false);
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                } else {
                    setError(response.message || "Failed to set standard password");
                }
            } else {
                // Update password for single client
                const clientId = clientData?._id || clientData?.client?._id;
                if (!clientId) {
                    setError("Client ID is missing");
                    setLoading(false);
                    return;
                }

                if (!clientDetails) {
                    setError("Client details not found");
                    setLoading(false);
                    return;
                }
                const updatedClientData = {
                    ...clientDetails,
                    password: formData.newPassword,
                };

                const response = await updateClient(updatedClientData, clientId);

                if (response.success === true) {
                    addToast("PWA Password set successfully!", "success");
                    setFormData({ newPassword: "", confirmPassword: "" });
                    setShowPassword(false);
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                } else {
                    setError(response.message || "Failed to set password");
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to set password");
            console.error("Error setting password:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ newPassword: "", confirmPassword: "" });
        setError("");
        setShowPassword(false);
        setStandardPassword("");
        setClientDetails(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005D] bg-opacity-50">
            <div className="relative bg-white rounded-[10px] shadow-lg w-full max-w-[600px] p-[20px]">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-[10px] right-[16px] text-[#2E7ED4] hover:text-gray-600 text-2xl"
                >
                    &times;
                </button>
                {/* Title */}
                <h2 className="text-base font-medium leading-[100%] align-middle text-[#484848] tracking-normal mb-[20px]">
                    {isStandardPassword ? "Set Standard PWA Password for All Clients" : "Set PWA Password"}
                </h2>
                {/* Content area */}
                {!isStandardPassword && (
                    <div className="bg-[#2E7ED40D] rounded-[6px] px-[20px] py-[10px] mb-[15px]">
                        <p className="font-medium text-[16px] leading-[100%] tracking-normal capitalize text-[#484848] mb-[12px]">
                            Client Details
                        </p>
                        <div>
                            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
                                Name:{" "}
                                <span className="ml-[11px] font-medium">
                                    {clientDetails?.name}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
                                Email:{" "}
                                <span className="ml-[11px] font-medium">
                                    {clientDetails?.email}
                                </span>
                            </p>
                        </div>
                        {clientDetails?.password && (
                            <div>
                                <p className="font-normal text-[14px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
                                    Existing Password:{" "}
                                    <span className="ml-[11px] font-medium">
                                        {clientDetails?.password}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {isStandardPassword && standardPassword && (
                        <div>
                            <p className="font-semibold text-[18px] leading-[100%] tracking-normal text-[#2C3E50] mb-[8px]">
                                Existing Password:{" "}
                                <span className="ml-[11px] font-medium">
                                    {standardPassword}
                                </span>
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                            New Password *
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#484848] font-medium text-[14px] leading-[100%] tracking-[0] align-middle mb-[8px]">
                            Confirm Password *
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full border border-[#E0E0E0] rounded-[6px] px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div className="mb-[15px]">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="w-4 h-4 text-[#2E7ED4] border-[#E0E0E0] rounded focus:ring-[#2E7ED4] focus:ring-2 cursor-pointer"
                            />
                            <span className="ml-2 text-[#484848] text-[14px] font-normal">
                                Show Password
                            </span>
                        </label>
                    </div>

                    <div className="text-right mt-[20px]">
                        <button
                            type="button"
                            onClick={handleClose}
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
                            {loading ? "Processing..." : "Set Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PwaPasswordModal;
