import React from "react";

/**
 * A clean card container with subtle border. Modern modal-like style.
 */
export const ProfileCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-[#111827] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl ${className}`}
  >
    {children}
  </div>
);

/**
 * Single labelled row inside a detail card with support for editing state.
 */
export const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
  isEditing?: boolean;
  editInput?: React.ReactNode;
}> = ({ label, value, isLast, isEditing, editInput }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 px-8 py-5 transition-all hover:bg-white/[0.03] group ${
      !isLast ? "border-b border-white/5" : ""
    }`}
  >
    <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
      {label}
    </span>
    <div className="flex-1 sm:text-right">
      {isEditing && editInput ? (
        editInput
      ) : (
        <span className="text-sm font-semibold text-white/90">{value}</span>
      )}
    </div>
  </div>
);

/**
 * Section header for grouping profile information.
 */
export const SectionLabel: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4 px-2">
    <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em]">
      {title}
    </h3>
    {action}
  </div>
);

/**
 * Shared input styles for the profile forms.
 * Matches the search and modal inputs in the event section.
 */
export const inputStyles = {
  base: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-white text-right placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-medium",
  select:
    "w-full bg-[#1e1e2e] border border-white/10 rounded-xl text-sm text-white text-right px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all cursor-pointer appearance-none font-medium",
  password:
    "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-medium",
};
