import React from "react";

/**
 * Filter bar for the merch customer table.
 * Provides a status dropdown and a search input for filtering by student ID or name.
 *
 * @param selectedStatus - currently selected order status filter ("All" or a specific OrderStatus)
 * @param onStatusChange - callback when the status filter changes
 * @param searchQuery - current search query string
 * @param onSearchChange - callback when the search input changes
 */

interface CustomerFilterBarProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "To Be Claimed", value: "TO_BE_CLAIMED" },
  { label: "Claimed", value: "CLAIMED" },
  { label: "Rejected", value: "REJECTED" },
];

const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* status dropdown */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full sm:w-48 bg-[#110e31]  border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* search input */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student ID or name..."
          className="w-full bg-[#110e31]  border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
        />
        {/* search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
};

export default CustomerFilterBar;
