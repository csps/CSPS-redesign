import React from "react";
import { DatePicker } from "../../../../components/DatePicker";
import { AuditAction } from "../../../../enums/AuditAction";

interface AuditLogFiltersProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  action: AuditAction | "";
  setAction: (action: AuditAction | "") => void;
  adminId: string;
  setAdminId: (id: string) => void;
  onSearch: () => void;
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  action,
  setAction,
  adminId,
  setAdminId,
  onSearch,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-white/5 p-4 rounded-2xl border border-white/10">
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
        placeholder="Select start"
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={setEndDate}
        placeholder="Select end"
      />

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
          Action
        </label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as AuditAction | "")}
          className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors"
        >
          <option value="">All Actions</option>
          <option value={AuditAction.CREATE}>CREATE</option>
          <option value={AuditAction.UPDATE}>UPDATE</option>
          <option value={AuditAction.DELETE}>DELETE</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
          Admin ID
        </label>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Optional"
          className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20"
        />
      </div>

      <button
        onClick={onSearch}
        className="h-[46px] bg-[#FDE006] hover:brightness-110 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/10"
      >
        Filter Logs
      </button>
    </div>
  );
};

export default AuditLogFilters;
