import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";
import { logout } from "../../api/auth";

interface MobileProfileDropdownProps {
  student: StudentResponse | null;
  onClose: () => void;
}

const MobileProfileDropdown: React.FC<MobileProfileDropdownProps> = ({
  student,
  onClose,
}) => {
  const navigate = useNavigate();

  const isAdmin = student?.user.role === "ADMIN";
  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login");
  };

  const handleProfile = () => {
    onClose();
    const navPath = isAdmin ? "/admin/profile" : "/profile";
    navigate(navPath);
  };

  const getInitials = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full bg-[#2d0d70] rounded-xl shadow-xl border border-white/10 overflow-hidden flex flex-col"
    >
      {/* Header (Avatar & Name) */}
      <div className="p-3 flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm border border-white/5">
          {getInitials(student?.user.firstName)}
        </div>
        <div className="flex flex-col overflow-hidden flex-1">
          <span className="text-white font-semibold text-xs truncate">
            {student?.user.firstName || "Student"}{" "}
            {student?.user.lastName || ""}
          </span>
          <span className="text-[10px] text-purple-200/60 truncate">
            {isAdmin ? "Admin" : "Student"} Account
          </span>
        </div>
      </div>

      {/* Dashed Divider */}
      <div className="border-b border-dashed border-white/10 mx-2" />

      {/* ID Context */}
      <div className="px-3 py-2">
        <p className="text-[8px] uppercase tracking-wider text-purple-200/40 font-bold mb-1.5">
          Active ID
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/90 font-medium">
            {isAdmin ? "Admin" : "Student"} ID:{" "}
            {isAdmin ? student?.user.userId : student?.studentId}
          </span>
          <svg
            className="w-3 h-3 text-purple-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Dashed Divider */}
      <div className="border-b border-dashed border-white/10 mx-2" />

      {/* Menu Actions */}
      <div className="p-2 space-y-1">
        <button
          onClick={handleProfile}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-white rounded-lg transition-all hover:bg-white/10 text-left group text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-purple-200/70 group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-medium">Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-white rounded-lg transition-all hover:bg-white/10 text-left group text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-purple-200/70 group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileProfileDropdown;
