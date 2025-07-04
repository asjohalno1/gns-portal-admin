import React, { useEffect, useState } from "react";

const AddClientModal = ({ onClose }) => {
  const [clientList, setClientList] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendLinkModal, setSendLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formErrors, setFormErrors] = useState({
    clientId: "",
    doctitle: "",
    duedate: "",
    subcategories: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    clientId: [],
    doctitle: "",
    duedate: "",
    message:
      "Please Upload Your Document Using This Secure Link. The Link Will Expire In 24 Hours.",
    notifyMethod: ["email"],
    expiration: "24",
    linkMethod: "email",
  });

  // Validate form
  const validateForm = () => {
    const errors = {
      clientId:
        formData.clientId.length === 0
          ? "Please select at least one client"
          : "",
      doctitle: !formData.doctitle.trim() ? "Document title is required" : "",
      duedate: !formData.duedate ? "Due date is required" : "",
      subcategories:
        selectedItems.length === 0
          ? "Please select at least one document type"
          : "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const clientsResponse = await getDashboardData();
        setClientList(clientsResponse.data?.data?.clients || []);

        const categoriesResponse = await getAllCatogaries();
        const fetchedCategories = categoriesResponse.data || [];
        setCategories(fetchedCategories);

        const subcategoriesResponse = await getAllSubCatogaries();
        setSubcategories(subcategoriesResponse.data || []);

        if (fetchedCategories.length > 0) {
          setSelectedTab(fetchedCategories[0]._id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle client selection changes
  const handleClientChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const selectedClientIds = options.map((option) => option.value);
    setFormData((prev) => ({ ...prev, clientId: selectedClientIds }));
  };

  // Handle checkbox changes for subcategories
  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (selectedItems.length > 0) {
      setFormErrors((prev) => ({ ...prev, subcategories: "" }));
    }
  };

  // Handle notify method changes
  const handleNotifyMethodChange = (method) => {
    setFormData((prev) => {
      const methods = [...prev.notifyMethod];
      if (methods.includes(method)) {
        return { ...prev, notifyMethod: methods.filter((m) => m !== method) };
      } else {
        return { ...prev, notifyMethod: [...methods, method] };
      }
    });
  };

  // Handle expiration changes (radio button behavior)
  const handleExpirationChange = (hours) => {
    setFormData((prev) => ({ ...prev, expiration: hours }));
  };

  // Handle link method changes
  const handleLinkMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, linkMethod: method }));
  };

  // Generate the secure link
  const handleGenerateLink = async () => {
    if (!validateForm()) return;

    try {
      setIsGenerating(true);
      const requestData = {
        clientId: formData.clientId, // This should already be an array from your multi-select
        categoryId: selectedTab,
        subCategoryId: selectedItems, // Send as array of subcategory IDs
        dueDate: formData.duedate,
        instructions: formData.message,
        notifyMethod: formData.notifyMethod.join(","),
        expiration: formData.expiration.toString(),
        remainderSchedule: "ThreeDays",
        linkMethod: formData.linkMethod,
        doctitle: formData.doctitle,
      };

      const response = await generateLink(requestData);

      if (response.success) {
        setGeneratedLink(response.data.requestLink);
        setSendLinkModal(true);
      }
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render the tab content
  const renderTabContent = () => {
    if (loading) return <div className="text-sm text-gray-600">Loading...</div>;
    if (error) return <div className="text-sm text-red-500">{error}</div>;

    return (
      <>
        <div className="grid grid-cols-2 gap-3 text-[#484848] font-normal text-[14px] leading-[100%] tracking-[0] text-[#2C3E50] mb-6">
          {subcategories.length > 0 ? (
            subcategories.map((subcat) => (
              <label key={subcat._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(subcat._id)}
                  onChange={() => handleCheckboxChange(subcat._id)}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-[4px] relative 
                    checked:bg-[#20BF55] checked:border-[#20BF55]
                    checked:after:content-['✓'] checked:after:text-white 
                    checked:after:text-[12px] checked:after:font-bold 
                    checked:after:absolute checked:after:top-[0px] checked:after:left-[3px]"
                />
                {subcat.name}
              </label>
            ))
          ) : (
            <div className="col-span-2 text-sm text-gray-500">
              No subcategories found for this category
            </div>
          )}
        </div>
        {formErrors.subcategories && (
          <p className="text-red-500 text-xs mb-2">
            {formErrors.subcategories}
          </p>
        )}

        <div className="w-full mb-[15px]">
          <label htmlFor="doctitle" className="block mb-2 font-medium text-sm">
            Document Request Title
          </label>
          <input
            type="text"
            id="doctitle"
            name="doctitle"
            value={formData.doctitle}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border border-[#eaeaea] rounded-[10px] outline-none"
          />
          {formErrors.doctitle && (
            <p className="text-red-500 text-xs mt-1">{formErrors.doctitle}</p>
          )}
        </div>

        <div className="w-full mb-[15px]">
          <label htmlFor="duedate" className="block mb-2 font-medium text-sm">
            Due Date
          </label>
          <input
            type="date"
            id="duedate"
            name="duedate"
            value={formData.duedate}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border border-[#eaeaea] rounded-[10px] outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
          {formErrors.duedate && (
            <p className="text-red-500 text-xs mt-1">{formErrors.duedate}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[#484848] text-sm font-medium mb-2">
            Message To Client
          </label>
          <textarea
            className="w-full border border-gray-200 bg-[#FAFAFA] text-[#484848] p-3 rounded-md font-normal text-[12px] leading-[100%] tracking-[0] capitalize focus:outline-none h-[103px] resize-none"
            rows="3"
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Please Upload Your Document Using This Secure Link. The Link Will Expire In 24 Hours."
          />
        </div>

        <div className="grid grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-[#484848] text-sm font-medium mb-2">
              Send Link Method
            </label>
            <div className="flex flex-col gap-2 text-sm text-[#484848]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="linkMethod"
                  checked={formData.linkMethod === "email"}
                  onChange={() => handleLinkMethodChange("email")}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-full relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-[''] checked:after:absolute 
                  checked:after:w-[8px] checked:after:h-[8px] checked:after:bg-white 
                  checked:after:rounded-full checked:after:top-[3px] checked:after:left-[3px]"
                />{" "}
                Email
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="linkMethod"
                  checked={formData.linkMethod === "sms"}
                  onChange={() => handleLinkMethodChange("sms")}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-full relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-[''] checked:after:absolute 
                  checked:after:w-[8px] checked:after:h-[8px] checked:after:bg-white 
                  checked:after:rounded-full checked:after:top-[3px] checked:after:left-[3px]"
                />{" "}
                SMS
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#484848] text-sm font-medium mb-2">
              Expiration
            </label>
            <div className="flex flex-col gap-2 text-sm text-[#484848]">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expiration"
                  checked={formData.expiration === "24"}
                  onChange={() => handleExpirationChange("24")}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-full relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-[''] checked:after:absolute 
                  checked:after:w-[8px] checked:after:h-[8px] checked:after:bg-white 
                  checked:after:rounded-full checked:after:top-[3px] checked:after:left-[3px]"
                />{" "}
                24 Hours
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expiration"
                  checked={formData.expiration === "48"}
                  onChange={() => handleExpirationChange("48")}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-full relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-[''] checked:after:absolute 
                  checked:after:w-[8px] checked:after:h-[8px] checked:after:bg-white 
                  checked:after:rounded-full checked:after:top-[3px] checked:after:left-[3px]"
                />{" "}
                02 days
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="expiration"
                  checked={formData.expiration === "168"}
                  onChange={() => handleExpirationChange("168")}
                  className="appearance-none w-[16px] h-[16px] border border-[#B3B3B3] rounded-full relative 
                  checked:bg-[#20BF55] checked:border-[#20BF55]
                  checked:after:content-[''] checked:after:absolute 
                  checked:after:w-[8px] checked:after:h-[8px] checked:after:bg-white 
                  checked:after:rounded-full checked:after:top-[3px] checked:after:left-[3px]"
                />{" "}
                07 Days
              </label>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#0000005D] bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full relative max-w-[562px]">
          <div className="w-full max-w-[562px] bg-white rounded-[10px] mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Request Documents</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="popup-content max-h-[500px] overflow-y-auto">
              <div className="w-full">
                <label
                  htmlFor="client-select"
                  className="mb-2 block font-medium text-sm"
                >
                  Client
                </label>
                <div className="relative">
                  <select
                    id="client-select"
                    multiple
                    className="border border-[#eaeaea] rounded-[10px] py-2 px-4 w-full appearance-none h-auto min-h-[42px]"
                    value={formData.clientId}
                    onChange={handleClientChange}
                    size={Math.min(5, clientList.length + 1)}
                  >
                    <option value="" disabled>
                      Select Client(s)
                    </option>
                    {clientList.map((client) => (
                      <option key={client.clientId} value={client.clientId}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute top-[12px] right-[14px]"></i>
                </div>
                {formErrors.clientId && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.clientId}
                  </p>
                )}
              </div>

              <label className="mb-3 block font-medium text-sm mt-[20px]">
                Document Type
              </label>
              <div className="flex rounded-none w-full mb-6 border-b border-gray-300 gap-[20px] overflow-x-auto">
                {loading ? (
                  <div className="px-5 py-[7px]">Loading categories...</div>
                ) : error ? (
                  <div className="px-5 py-[7px] text-red-500">{error}</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedTab(category._id)}
                      className={`px-5 py-[7px] font-normal text-[16px] leading-[100%] tracking-[0] rounded-t-md border-b-2 transition-all duration-200 bg-[#F8FAFC] whitespace-nowrap ${selectedTab === category._id
                          ? "bg-bgBlue text-primaryBlue border-primaryBlue font-semibold"
                          : "bg-tabsBg text-bodyColor hover:text-blue-500 border-transparent"
                        }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>

              {renderTabContent()}
            </div>
            <div className="float-right mt-5 popup-footer">
              <button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="bg-[#2E7ED4] text-white px-4 py-2 rounded-md hover:bg-[#1a6cbb] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Link"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {sendLinkModal && (
        <DocuploadsuccessfullyModal onClose={() => onClose()} />
      )}
    </>
  );
};

export default AddClientModal;