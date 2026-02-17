import React from "react";

/**
 * A modern, bordered card container with a subtle glass effect.
 * Complements the deep purple background with subtle transparency.
 */
export const ProfileCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm ${className}`}
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
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6 px-8 py-5 transition-all duration-300 hover:bg-white/5 ${
      !isLast ? "border-b border-white/5" : ""
    }`}
  >
    <span className="text-[10px] font-bold text-purple-300/60 tracking-[0.2em] uppercase">
      {label}
    </span>
    <div className="flex-1 sm:text-right">
      {isEditing && editInput ? (
        <div className="relative group">
          {editInput}
          <div className="absolute inset-x-0 -bottom-1 h-[2px] bg-purple-500/0 group-focus-within:bg-purple-500/50 transition-all duration-300" />
        </div>
      ) : (
        <span className="text-sm text-white font-semibold tracking-tight">{value}</span>
      )}
    </div>
  </div>
);

/**
 * Minimalist section header for grouping profile information.
 */
export const SectionLabel: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4 px-2">
    <h3 className="text-[10px] font-bold text-white/40 tracking-[0.25em] uppercase">
      {title}
    </h3>
    {action}
  </div>
);

/**
 * Shared input styles for the profile forms.
 */
export const inputStyles = {
  base: "w-full bg-transparent text-sm text-white text-right placeholder-white/20 focus:outline-none focus:ring-0 border-none caret-purple-400 font-semibold",
  select: "w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white text-right px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-all cursor-pointer appearance-none font-semibold",
  password: "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all font-semibold",
};
