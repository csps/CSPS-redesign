import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { OrderStatus } from "../../../../../enums/OrderStatus";
import CustomDropdown from "../../../../../components/CustomDropdown";
import { DatePicker } from "../../../../../components/DatePicker";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusHeaderProps {
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const StatusHeader = ({
  selectedStatus = "All",
  onStatusChange,
  searchQuery = "",
  onSearchChange,
  startDate = "",
  endDate = "",
  onStartDateChange,
  onEndDateChange,
}: StatusHeaderProps) => {
  const options = [
    { label: "All Orders", value: "All" },
    { label: "Ready for Pickup", value: OrderStatus.TO_BE_CLAIMED },
    { label: "Processing", value: OrderStatus.PENDING },
    { label: "Claimed", value: OrderStatus.CLAIMED },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <label
            className="block text-[10px] font-bold uppercase tracking-widest mb-2 px-1"
            style={{ color: "rgba(156,163,175,0.8)" }}
          >
            Search
          </label>
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-xl px-4 py-3 pl-12 text-sm transition-all duration-200 focus:outline-none"
              style={{
                background: "rgba(30,30,63,1)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.9)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(139,92,246,0.5)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(124,58,237,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-64">
          <CustomDropdown
            label="Order Status"
            options={options}
            value={selectedStatus}
            onChange={(val) => onStatusChange?.(val)}
          />
        </div>
      </div>

      {/* Date range pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="Start Date"
          value={startDate}
          maxDate={endDate || undefined}
          placeholder="Pick a start date"
          onChange={(d) => onStartDateChange?.(d)}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          minDate={startDate || undefined}
          placeholder="Pick an end date"
          onChange={(d) => onEndDateChange?.(d)}
        />
      </div>
    </div>
  );
};

export default StatusHeader;
