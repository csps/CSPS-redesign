import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * A sleek, modern pagination component following "Stripe-style" minimalist principles.
 * Uses tight tracking, medium font weights, and clear visual hierarchy.
 * 
 * @param {PaginationProps} props - Component properties.
 * @returns {JSX.Element | null} The rendered pagination controls.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPaginationGroup = () => {
    const pageNumbers = [];
    pageNumbers.push(0); // First page
    
    if (currentPage > 2) pageNumbers.push("ellipsis-start");
    
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (i > 0 && i < totalPages - 1) {
        pageNumbers.push(i);
      }
    }
    
    if (currentPage < totalPages - 3) pageNumbers.push("ellipsis-end");
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1); // Last page
    }
    
    return [...new Set(pageNumbers)];
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 tracking-[-0.01em] text-zinc-400 hover:text-zinc-100 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed group"
      >
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPaginationGroup().map((item, index) => {
          if (typeof item === "string") {
            return (
              <div 
                key={`${item}-${index}`} 
                className="w-9 h-9 flex items-center justify-center text-zinc-600"
              >
                <MoreHorizontal size={16} strokeWidth={1.5} />
              </div>
            );
          }

          const isActive = currentPage === item;

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={isActive ? "page" : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 tracking-[-0.01em]
                ${isActive 
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                }`}
            >
              {item + 1}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 tracking-[-0.01em] text-zinc-400 hover:text-zinc-100 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed group"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </nav>
  );
};

export default Pagination;
