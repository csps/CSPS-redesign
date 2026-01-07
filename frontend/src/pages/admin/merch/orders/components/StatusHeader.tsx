import React from "react";
import GlassIcon from "../../../../../assets/icons/glass.svg";

const StatusHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 gap-4 sm:gap-0 mb-4">
      <select
        className="bg-[#2a2456] text-white rounded-lg px-4 py-2 w-full sm:w-auto"
        defaultValue="toBeClaimed"
      >
        <option value="toBeClaimed">To Be Claimed</option>
        <option value="pending">Pending</option>
        <option value="claimed">Claimed</option>
      </select>

      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="border border-white outline-none p-2 pl-8 rounded-lg w-full"
        />
        <img src={GlassIcon} alt="glass" className="absolute top-2.5 left-2.5 w-5 h-5" />
      </div>
    </div>
  );
};

export default StatusHeader;
