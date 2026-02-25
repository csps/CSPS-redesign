import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { getAuthenticatedNavbar } from "../nav.config";
import { useAuthStore } from "../../store/auth_store";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";
import type { UserResponse } from "../../interfaces/user/UserResponse";
import { isRouteActive } from "./constants";
import LogoSection from "./LogoSection";
import NavItemContent from "./NavItemContent";
import MerchandiseDropdown from "./MerchandiseDropdown";
import StudentsDropdown from "./StudentsDropdown";
import StudentProfile from "./StudentProfile";

interface DesktopAuthenticatedNavProps {
  location: string;
}

const DesktopAuthenticatedNav: React.FC<DesktopAuthenticatedNavProps> = ({
  location,
}) => {
  const user = useAuthStore((state) => state.user);
  const student = user as StudentResponse;
  const isAdmin = user?.role === "ADMIN";
  const adminPosition = isAdmin ? (user as UserResponse).position : undefined;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!student) {
    return null;
  }

  const handleMerchandiseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === "Merchandise" ? null : "Merchandise");
  };

  const handleStudentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === "Students" ? null : "Students");
  };

  return (
    <div className="hidden lg:flex w-full justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-40">
      <nav className="w-full max-w-7xl bg-white/5 backdrop-blur-lg border border-white/20 rounded-[25px] shadow-lg py-3 sm:py-4 px-4 sm:px-6 md:px-8 flex items-center justify-between text-white relative z-40">
        <LogoSection />

        <ul className="flex gap-4 sm:gap-6 md:gap-10 justify-center flex-1">
          {getAuthenticatedNavbar(isAdmin, adminPosition).map(
            (navItem, index) => {
              const isMerchandise = navItem.name === "Merchandise";
              const isStudents = navItem.name === "Students";
              let isActive = isRouteActive(navItem.name, location, navItem.to);

              if (
                isMerchandise &&
                (location.startsWith("/merch") ||
                  (isAdmin && location.startsWith("/admin/merch")))
              ) {
                isActive = true;
              }

              // Students dropdown includes both /admin/students and /admin/membership
              if (
                isStudents &&
                (location.startsWith("/admin/students") ||
                  location.startsWith("/admin/membership"))
              ) {
                isActive = true;
              }

              if (isMerchandise) {
                return (
                  <li
                    key={`nav-${index}`}
                    className="relative z-50"
                    onMouseEnter={() => setOpenDropdown("Merchandise")}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div
                      onClick={handleMerchandiseClick}
                      className={`cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <NavItemContent
                        isActive={isActive}
                        icon={navItem.icon}
                        name={navItem.name}
                      />
                    </div>
                    <AnimatePresence>
                      {openDropdown === "Merchandise" && (
                        <MerchandiseDropdown
                          location={location}
                          isAdmin={isAdmin}
                        />
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              // Students dropdown (only for executives)
              if (isStudents) {
                return (
                  <li
                    key={`nav-${index}`}
                    className="relative z-50"
                    onMouseEnter={() => setOpenDropdown("Students")}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div
                      onClick={handleStudentsClick}
                      className={`cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <NavItemContent
                        isActive={isActive}
                        icon={navItem.icon}
                        name={navItem.name}
                      />
                    </div>
                    <AnimatePresence>
                      {openDropdown === "Students" && (
                        <StudentsDropdown location={location} />
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={`nav-${index}`}>
                  <Link
                    to={navItem.to}
                    className={`relative cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <NavItemContent
                      isActive={isActive}
                      icon={navItem.icon}
                      name={navItem.name}
                    />
                  </Link>
                </li>
              );
            },
          )}
        </ul>
      </nav>
      <StudentProfile student={student} />
    </div>
  );
};

export default DesktopAuthenticatedNav;
