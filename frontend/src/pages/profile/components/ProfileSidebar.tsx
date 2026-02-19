import React from "react";
import { motion } from "framer-motion";
import { IconUser, IconLock, IconChevronLeft } from "./Icons";

/**
 * Tab identifier types for the profile page.
 */
export type ActiveTab = "credentials" | "password";

interface ProfileSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onBack: () => void;
}

/**
 * Sidebar navigation for the profile page.
 */
const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  onBack,
}) => {
  const navItems = [
    { id: "credentials" as ActiveTab, icon: IconUser, label: "Credentials" },
    { id: "password" as ActiveTab, icon: IconLock, label: "Password" },
  ] as const;

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      {/* back button */}
      <div className="px-6 pt-10 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <IconChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Back
          </span>
        </button>
      </div>

      {/* navigation */}
      <nav className="px-4 pb-4 flex flex-row md:flex-col gap-2">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-sm font-bold transition-all overflow-hidden ${
                active
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full"
                />
              )}
              <item.icon
                className={`w-5 h-5 ${active ? "text-purple-400" : "text-white/20"}`}
              />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
