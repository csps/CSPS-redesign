import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumber: number;
  first: boolean;
  last: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageNumber,
  first,
  last,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-12">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={first}
          className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
        >
          «
        </button>

        {/* Page Numbers with Smart Ellipsis */}
        {Array.from({ length: totalPages }, (_, i) => {
          const currentPageNum = pageNumber;
          const showPage =
            i === 0 ||
            i === totalPages - 1 ||
            (i >= currentPageNum - 1 && i <= currentPageNum + 1);

          if (!showPage && i !== 1 && i !== totalPages - 2) {
            return null;
          }

          if (!showPage && (i === 1 || i === totalPages - 2)) {
            return (
              <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === i
                  ? "bg-violet-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(last ? currentPage : currentPage + 1)}
          disabled={last}
          className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>

      {/* Page Info */}
      <p className="text-gray-400 text-sm">
        Page {pageNumber + 1} of {totalPages}
      </p>
    </div>
  );
};

export default Pagination;
