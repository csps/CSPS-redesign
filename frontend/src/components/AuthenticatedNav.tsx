import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGOS, getAuthenticatedNavbar } from "./nav.config";
import { useAuthStore } from "../store/auth_store";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import { logout } from "../api/auth";

interface DesktopNavProps {
  location: string;
}

// ============================================================================

const ANIMATION_CONFIG = {
  line: {
    initial: { width: 0 },
    animate: { width: "100%" },
    exit: { width: 0 },
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
  trapezoid: {
    initial: { opacity: 0, scaleX: 0 },
    animate: { opacity: 1, scaleX: 1 },
    exit: { opacity: 0, scaleX: 0 },
    transition: { duration: 0.2, delay: 0.25 },
  },
  mobileMenu: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { stiffness: 80 },
  },
};

const isRouteActive = (
  _navName: string,
  currentLocation: string,
  navTo: string,
): boolean => {
  if (!navTo) return false;
  if (currentLocation === navTo) return true;
  return currentLocation.startsWith(`${navTo}/`);
};

const getMerchandiseActiveStates = (location: string) => ({
  isProductsActive:
    location === "/merch" ||
    location.startsWith("/merch/variant") ||
    location === "/admin/merch/products",
  isTransactionsActive: location.startsWith("/merch/transactions"),
  isCartActive: location.startsWith("/merch/cart"),
  isOrderActive: location.startsWith("/admin/merch/orders"),
});

// ============================================================================
// Subcomponents
// ============================================================================

const ActiveIndicator: React.FC = () => (
  <AnimatePresence mode="wait">
    <motion.div
      key="line"
      {...ANIMATION_CONFIG.line}
      className="absolute top-[-8px] left-0 h-[2px] bg-gray-400"
    />
    <motion.div
      key="trapezoid"
      {...ANIMATION_CONFIG.trapezoid}
      className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-[3px] bg-white [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]"
    />
  </AnimatePresence>
);

const MerchandiseDropdown: React.FC<{ location: string; isAdmin: boolean }> = ({
  location,
  isAdmin,
}) => {
  const {
    isProductsActive,
    isTransactionsActive,
    isCartActive,
    isOrderActive,
  } = getMerchandiseActiveStates(location);

  // For admins we show admin merch entries (Products + Orders)
  const menuItems = isAdmin
    ? [
        {
          to: "/admin/merch/products",
          label: "Products",
          isActive: isProductsActive,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        },
        {
          to: "/admin/merch/orders",
          label: "Orders",
          isActive: isOrderActive,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-5h-8m0 0l3 3m-3-3l3-3"
              />
            </svg>
          ),
        },
      ]
    : [
        {
          to: "/merch",
          label: "Products",
          isActive: isProductsActive,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        },
        {
          to: "/merch/transactions",
          label: "Transaction",
          isActive: isTransactionsActive,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-5h-8m0 0l3 3m-3-3l3-3"
              />
            </svg>
          ),
        },
        {
          to: "/merch/cart",
          label: "Cart",
          isActive: isCartActive,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h18l-1 9H4L3 3zm0 9h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm5 7h8"
              />
            </svg>
          ),
        },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 p-3 space-y-2 text-white bg-[#2d0d70] rounded-xl shadow-xl border border-purple-200/40 z-[1000]"
    >
      {menuItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`relative flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-all ${
            item.isActive ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          {item.isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-r-sm" />
          )}
          {item.icon}
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      ))}
    </motion.div>
  );
};

interface ProfileDropdownProps {
  student: StudentResponse | null;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  student,
  onClose,
}) => {
  const navigate = useNavigate();

  console.log("STUDENT IN DROPDOWN:", student);

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

  // Helper to get initials
  const getInitials = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-72 bg-[#2d0d70] rounded-2xl shadow-2xl border border-white/10 z-[1000] overflow-hidden flex flex-col"
    >
      {/* --- SECTION 1: Header (Avatar & Name) --- */}
      <div className="p-4 flex items-center gap-3.5">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg border border-white/5 shadow-inner">
          {getInitials(student?.user.firstName)}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white font-semibold text-sm truncate">
            {student?.user.firstName || "Student"}{" "}
            {student?.user.lastName || ""}
          </span>
          <span className="text-xs text-purple-200/60 truncate">
            Student Account
          </span>
        </div>
      </div>

      {/* Dashed Divider */}
      <div className="border-b border-dashed border-white/10 mx-3" />

      {/* --- SECTION 2: ID Context (Matches the 'Email/Workspace' section) --- */}
      <div className="px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-purple-200/40 font-bold mb-2 ml-1">
          Active ID
        </p>
        <div className="flex items-center justify-between group cursor-default px-1">
          <span className="text-sm text-white/90 font-medium">
            ID: {isAdmin ? student.user.userId : student?.studentId}
          </span>
          {/* Checkmark to mimic the 'Selected' state in the image */}
          <svg
            className="w-4 h-4 text-purple-300 opacity-100"
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
      <div className="border-b border-dashed border-white/10 mx-3" />

      {/* --- SECTION 3: Menu Actions --- */}
      <div className="p-2 space-y-1">
        <button
          onClick={handleProfile}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white rounded-xl transition-all hover:bg-white/10 text-left group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-200/70 group-hover:text-white transition-colors"
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
          <span className="text-sm font-medium">Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white rounded-xl transition-all hover:bg-white/10 text-left group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-200/70 group-hover:text-white transition-colors"
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
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </motion.div>
  );
};

const NavItemContent: React.FC<{
  isActive: boolean;
  icon?: string;
  name: string;
}> = ({ isActive, icon, name }) => (
  <div className="relative flex items-center">
    {isActive && <ActiveIndicator />}
    {isActive && icon && <img src={icon} alt="" className="w-5 h-5 mr-2" />}
    <span>{name}</span>
  </div>
);

const LogoSection: React.FC = () => (
  <div className="hidden xl:flex items-center gap-6 px-4">
    {LOGOS.map((logo, index) => (
      <img
        key={`logo-${index}`}
        src={logo}
        alt={`Logo ${index + 1}`}
        className="w-10 h-auto object-contain"
      />
    ))}
  </div>
);

const StudentProfile: React.FC<{ student: StudentResponse }> = ({
  student,
}) => {
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
        className="hidden xl:flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
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

// ============================================================================
// Main Navigation Components
// ============================================================================

const DesktopAuthenticatedNav: React.FC<DesktopNavProps> = ({ location }) => {
  // reactive access to auth user
  const user = useAuthStore((state) => state.user);
  const student = user as StudentResponse;
  const isAdmin = user?.role === "ADMIN";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!student) {
    return null;
  }

  const handleMerchandiseClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setOpenDropdown(openDropdown === "Merchandise" ? null : "Merchandise");
  };

  return (
    <div className="hidden lg:flex w-full justify-center px-6 py-4 relative z-40">
      <nav className="w-full max-w-7xl bg-white/5 backdrop-blur-lg border border-white/20 rounded-[25px] shadow-lg py-4 px-8 flex items-center justify-between text-white relative z-40">
        <LogoSection />

        <ul className="flex gap-10 justify-center flex-1">
          {getAuthenticatedNavbar(isAdmin).map((navItem, index) => {
            const isMerchandise = navItem.name === "Merchandise";
            // base active detection (matches nav.to or nested paths)
            let isActive = isRouteActive(navItem.name, location, navItem.to);

            // explicit override: treat Merchandise active for admin merch routes
            if (
              isMerchandise &&
              (location.startsWith("/merch") ||
                (isAdmin && location.startsWith("/admin/merch")))
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
                    className={`cursor-pointer text-lg font-medium transition-all ${
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

            return (
              <li key={`nav-${index}`}>
                <Link
                  to={navItem.to}
                  className={`relative cursor-pointer text-lg font-medium transition-all ${
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
          })}
        </ul>
      </nav>
      <StudentProfile student={student} />
    </div>
  );
};

const MobileAuthenticatedNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );

  const user = useAuthStore((state) => state.user);
  const student = user as StudentResponse;
  const isAdmin = user?.role === "ADMIN";

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  return (
    <div className="flex justify-end lg:hidden">
      <button
        onClick={toggleMenu}
        className="text-2xl p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...ANIMATION_CONFIG.mobileMenu}
            className="bg-white/4 backdrop-blur-lg border-2 border-white/20 min-h-screen fixed top-0 right-0 w-64 sm:w-72 shadow-lg p-6 z-20 overflow-y-auto"
          >
            <div className="flex justify-between w-full items-center mb-8">
              <div className="flex gap-1 sm:gap-2">
                {LOGOS.map((logo, index) => (
                  <img
                    key={`mobile-logo-${index}`}
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="w-7 sm:w-8 h-7 sm:h-8 object-contain"
                  />
                ))}
              </div>
              <button
                onClick={toggleMenu}
                aria-label="Close menu"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes size={24} className="text-white" />
              </button>
            </div>

            <nav className="mt-6">
              <ul className="space-y-3 sm:space-y-5">
                {getAuthenticatedNavbar(isAdmin).map((navItem, index) => {
                  const isMerchandise = navItem.name === "Merchandise";

                  if (isMerchandise) {
                    return (
                      <li key={`mobile-nav-${index}`}>
                        <button
                          onClick={() => toggleMobileDropdown("Merchandise")}
                          className="text-white text-base sm:text-xl hover:bg-white/10 hover:text-gray-300 transition-colors w-full text-left flex items-center justify-between px-3 py-2 rounded-lg"
                        >
                          {navItem.name}
                          <span
                            className={`transform transition-transform ${
                              openMobileDropdown === "Merchandise"
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        <AnimatePresence>
                          {openMobileDropdown === "Merchandise" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 ml-4 space-y-2 border-l border-purple-200/40 pl-4"
                            >
                              {(isAdmin
                                ? [
                                    { to: "/admin/merch", label: "Products" },
                                    {
                                      to: "/admin/merch/orders",
                                      label: "Orders",
                                    },
                                  ]
                                : [
                                    { to: "/merch", label: "Products" },
                                    {
                                      to: "/merch/transactions",
                                      label: "Transaction",
                                    },
                                    { to: "/merch/cart", label: "Cart" },
                                  ]
                              ).map((item) => (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  onClick={() => {
                                    toggleMenu();
                                    setOpenMobileDropdown(null);
                                  }}
                                  className="text-gray-300 text-sm hover:text-white transition-colors block py-2"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  return (
                    <li key={`mobile-nav-${index}`}>
                      <Link
                        to={navItem.to}
                        onClick={toggleMenu}
                        className="text-white text-base sm:text-xl hover:bg-white/10 hover:text-gray-300 transition-colors block px-3 py-2 rounded-lg"
                      >
                        {navItem.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {student && (
                <div className="mt-8 pt-6 border-t border-white/10 flex gap-3 items-center">
                  <div className="h-14 w-14 bg-purple-700/40 rounded-md flex-shrink-0" />
                  <p className="text-white text-xs sm:text-sm truncate">
                    {student.studentId}
                  </p>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AuthenticatedNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <DesktopAuthenticatedNav location={pathname} />
      <MobileAuthenticatedNav />
    </>
  );
};

export default AuthenticatedNav;
