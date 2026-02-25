import React from "react";

/**
 * Stats strip displaying 3 stat cards for merch customer overview.
 * Shows Total Customers, Pending count, and Claimed count.
 *
 * @param totalCustomers - total number of customers for the selected merch
 * @param pendingCount - number of customers with PENDING status
 * @param claimedCount - number of customers with CLAIMED status
 * @param loading - whether data is currently being fetched
 */

interface StatsStripProps {
  totalCustomers: number;
  pendingCount: number;
  claimedCount: number;
  loading: boolean;
}

// single stat card sub-component
const StatCard: React.FC<{
  label: string;
  value: number;
  accent?: string;
  loading: boolean;
}> = ({ label, value, accent = "text-white", loading }) => (
  <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-sm hover:border-zinc-700 transition-colors">
    <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
      {label}
    </p>
    {loading ? (
      <div className="h-9 w-20 bg-zinc-800 rounded-lg animate-pulse" />
    ) : (
      <p className={`text-3xl font-bold tracking-tight ${accent}`}>
        {value.toLocaleString()}
      </p>
    )}
  </div>
);

const StatsStrip: React.FC<StatsStripProps> = ({
  totalCustomers,
  pendingCount,
  claimedCount,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Total Customers"
        value={totalCustomers}
        loading={loading}
      />
      <StatCard
        label="Pending"
        value={pendingCount}
        accent="text-yellow-400"
        loading={loading}
      />
      <StatCard
        label="Claimed"
        value={claimedCount}
        accent="text-green-400"
        loading={loading}
      />
    </div>
  );
};

export default StatsStrip;
