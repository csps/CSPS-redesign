import { FiSearch, FiChevronDown } from "react-icons/fi";
import { OrderStatus } from "../../../../../enums/OrderStatus";

interface StatusHeaderProps {
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const StatusHeader = ({
  selectedStatus = "All",
  onStatusChange,
  searchQuery = "",
  onSearchChange,
}: StatusHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Status Filter */}
      <div className="relative w-full sm:w-auto">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="appearance-none bg-[#1E1E3F] border border-white/10 text-white rounded-xl px-4 py-3 pr-10 w-full sm:w-auto min-w-[180px] focus:outline-none focus:border-purple-500/50 transition-colors"
        >
          <option value="All">All Orders</option>
          <option value={OrderStatus.TO_BE_CLAIMED}>Ready for Pickup</option>
          <option value={OrderStatus.PENDING}>Processing</option>
          <option value={OrderStatus.CLAIMED}>Claimed</option>
        </select>
        <FiChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" 
          size={18} 
        />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-auto sm:min-w-[300px]">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-[#1E1E3F] border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      </div>
    </div>
  );
};

export default StatusHeader;
