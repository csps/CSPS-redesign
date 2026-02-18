import React from "react";
import { OrderStatus } from "../../../../enums/OrderStatus";
import CustomDropdown from "../../../../components/CustomDropdown";

const statusLabels: Record<string, string> = {
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

  const options = allStatuses.map((status) => ({
    label: status === "All" ? "All" : statusLabels[status] || status,
    value: status,
  }));

  return (
    <div className="w-full lg:w-64">
      <CustomDropdown
        label="Filter by Status"
        options={options}
        value={selectedStatus}
        onChange={onStatusChange}
      />
    </div>
  );
};
