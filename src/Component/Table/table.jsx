import React from "react";
import { headerConfigs, renderCellContent } from "../../adminutils/tableHeader";

const Table = ({
  data,
  pagination,
  onPageChange,
  onLimitChange,
  onNextPage,
  onPrevPage,
  mode = "",
  onAction,
}) => {
  // Get the current header configuration
  const currentConfig = headerConfigs[mode] || headerConfigs.clients;

  return (
    <div className="relative overflow-x-auto border border-customGray sm:rounded-lg">
      <table className="w-full text-left rtl:text-right">
        <thead className="text-body bg-[#E4F0F3] border border-[#eaeaea]">
          <tr>
            {currentConfig.columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-base font-medium"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="bg-white border-b border-[#eaeaea]">
              {currentConfig.columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className="px-6 py-4 text-base font-normal color-black"
                >
                  {renderCellContent(item, column.key, onAction)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td
              className="px-6 py-4 text-base font-normal color-black"
              colSpan={currentConfig.columns.length}
            >
              <div className="flex justify-between items-center">
                <div>
                  Show entries:
                  <input
                    className="border border-[#B6C8D6] rounded-[7px] w-[60px] px-2 py-1 ml-5"
                    placeholder={pagination.limit}
                    type="number"
                    onChange={(e) => onLimitChange(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center">
                  {pagination.total > 0 ? (
                    <span>
                      {(pagination.page - 1) * pagination.limit + 1} -{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total}
                    </span>
                  ) : (
                    <span>No entries found</span>
                  )}

                  <ul className="flex ml-[30px]">
                    <li
                      className={`border border-[#2C3E50] h-7 w-7 rounded-[8px] flex items-center justify-center cursor-pointer ${
                        pagination.page === 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => pagination.page > 1 && onPrevPage()}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </li>
                    <li
                      className={`border border-[#2C3E50] h-7 w-7 rounded-[8px] flex items-center justify-center ml-2.5 cursor-pointer ${
                        pagination.page === pagination.totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        pagination.page < pagination.totalPages && onNextPage()
                      }
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
