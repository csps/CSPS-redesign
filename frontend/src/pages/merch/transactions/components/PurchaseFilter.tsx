import React from "react";
import { OrderStatus } from "../../../../enums/OrderStatus";

const statusLabels = {
  [OrderStatus.CLAIMED]: "Claimed",
  [OrderStatus.TO_BE_CLAIMED]: "To be claimed",
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.REJECTED]: "Rejected",
};

interface PurchaseFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const PurchaseFilter: React.FC<PurchaseFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const allStatuses = ["All", ...Object.values(OrderStatus)];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Filter by Status:
      </label>
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
      >
        {allStatuses.map((status) => (
          <option key={status} value={status} className="bg-black text-white">
            {status === "All"
              ? "All"
              : statusLabels[status as OrderStatus] || status}
          </option>
        ))}
      </select>
    </div>
  );
};
