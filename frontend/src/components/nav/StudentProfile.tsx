import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";
import ProfileDropdown from "./ProfileDropdown";

interface StudentProfileProps {
  student: StudentResponse;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="hidden lg:flex items-center ml-4 mt-2 relative"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="hidden lg:flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="h-14 w-14 bg-purple-700/40 rounded-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <p className="text-xs mt-1 text-gray-300">{student?.studentId}</p>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <ProfileDropdown
            student={student}
            onClose={() => setIsDropdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentProfile;
