import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <section className="bg-[#0F033C]/80 border border-white/10 rounded-2xl p-6 animate-pulse">
        <header className="flex justify-between items-start mb-4">
          <span className="w-10 h-10 bg-white/5 rounded-xl" />
          <span className="w-16 h-4 bg-white/5 rounded" />
        </header>
        <p className="w-24 h-8 bg-white/5 rounded mb-2" />
        <p className="w-32 h-3 bg-white/5 rounded" />
      </section>
    );
  }

  return (
    <section className="bg-[#0F033C]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
      <header className="flex justify-between items-start mb-4">
        <span className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend.value}
          </span>
        )}
      </header>
      <article>
        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {description}
          </p>
        )}
      </article>
    </section>
  );
};

export default StatCard;
