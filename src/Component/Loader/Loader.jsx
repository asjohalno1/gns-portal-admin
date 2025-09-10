import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-8 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
