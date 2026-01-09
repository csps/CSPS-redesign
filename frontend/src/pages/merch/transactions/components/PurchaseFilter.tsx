import React from "react";
import { PurchaseItemStatus } from "../../../../enums/PurchaseItemStatus";

const statusLabels = {
  [PurchaseItemStatus.CLAIMED]: "Claimed",
  [PurchaseItemStatus.NOT_PAID]: "Not paid",
  [PurchaseItemStatus.TO_BE_CLAIMED]: "To be claimed",
};

interface PurchaseFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const PurchaseFilter: React.FC<PurchaseFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const allStatuses = ["All", ...Object.values(PurchaseItemStatus)];

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
              : statusLabels[status as PurchaseItemStatus] || status}
          </option>
        ))}
      </select>
    </div>
  );
};
