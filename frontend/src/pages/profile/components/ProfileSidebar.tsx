import React from "react";
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
 * Sidebar component for the Profile page.
 *
 * Provides navigation between different profile sections and a back button.
 * Adheres to the modern UI layout without emojis.
 *
 * @param {ProfileSidebarProps} props - Component properties
 * @returns {JSX.Element} The rendered sidebar
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
    <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-[#242050]">
      {/* Back button */}
      <div className="p-8 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all group"
        >
          <IconChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-[10px] font-bold uppercase">Return</span>
        </button>
      </div>

      {/* Nav links */}
      <nav className="p-4 flex flex-row md:flex-col gap-2">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-[11px] font-bold uppercase transition-all duration-300 ${
                active
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.05)]"
                  : "text-white/30 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`w-4 h-4 transition-colors duration-300 ${
                  active ? "text-purple-400" : "text-white/20"
                }`}
              />
              <span>{item.label}</span>
              {/* Active pill indicator */}
              {active && (
                <div className="ml-auto w-1 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
