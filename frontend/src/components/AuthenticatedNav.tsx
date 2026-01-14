import React, { useState } from "react";
import { PiGearSixLight } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGOS, NAVBARSAUTHENTICATED } from "./nav.config";
import { useAuthStore } from "../store/auth_store";
import type { StudentResponse } from "../interfaces/student/StudentResponse";

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
  navTo: string
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
}) => (
  <div className="hidden lg:flex items-center ml-4 mt-2">
    <div className="hidden xl:flex flex-col items-center">
      <div className="h-14 w-14 bg-purple-700/40 rounded-md" />
      <p className="text-xs mt-1 text-gray-300">{student?.studentId}</p>
    </div>
  </div>
);

const SettingsIcon: React.FC = () => (
  <PiGearSixLight className="text-3xl text-white/90 hover:text-white transition cursor-pointer" />
);

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
          {NAVBARSAUTHENTICATED.map((navItem, index) => {
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
    null
  );

  const isAdmin = useAuthStore.getState().user?.role === "ADMIN";
  const { pathname } = useLocation();
  const student = useAuthStore((state) => state.user as StudentResponse);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  return (
    <div className="flex justify-end lg:hidden">
      <button
        onClick={toggleMenu}
        className="text-2xl p-2 text-white"
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...ANIMATION_CONFIG.mobileMenu}
            className="bg-white/4 backdrop-blur-lg border-2 border-white/20 min-h-screen fixed top-0 right-0 w-64 shadow-lg p-5 z-20"
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2">
                {LOGOS.map((logo, index) => (
                  <img
                    key={`mobile-logo-${index}`}
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="w-8 h-8 object-contain"
                  />
                ))}
              </div>
              <button onClick={toggleMenu} aria-label="Close menu">
                <FaTimes size={24} className="text-white" />
              </button>
            </div>

            <nav className="mt-10">
              <ul className="space-y-5">
                {NAVBARSAUTHENTICATED.map((navItem, index) => {
                  const isMerchandise = navItem.name === "Merchandise";

                  if (isMerchandise) {
                    return (
                      <li key={`mobile-nav-${index}`}>
                        <button
                          onClick={() => toggleMobileDropdown("Merchandise")}
                          className="text-white text-xl hover:text-gray-300 transition-colors w-full text-left flex items-center justify-between"
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
                        className="text-white text-xl hover:text-gray-300 transition-colors block"
                      >
                        {navItem.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {student && (
                <div className="mt-8 flex gap-3 items-center">
                  <div className="h-16 w-16 bg-purple-700/40 rounded-md flex-shrink-0" />
                  <p className="text-white text-sm">{student.studentId}</p>
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
