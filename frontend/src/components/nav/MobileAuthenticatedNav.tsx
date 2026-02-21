import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { LOGOS, getAuthenticatedNavbar } from "../nav.config";
import { useAuthStore } from "../../store/auth_store";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";
import type { UserResponse } from "../../interfaces/user/UserResponse";
import { ANIMATION_CONFIG } from "./constants";
import MobileProfileDropdown from "./MobileProfileDropdown";

const MobileAuthenticatedNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const user = useAuthStore((state) => state.user);
  const student = user as StudentResponse;
  const isAdmin = user?.role === "ADMIN";
  const adminPosition = isAdmin ? (user as UserResponse).position : undefined;

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
  };

  return (
    <div className="flex justify-end lg:hidden">
      <button
        onClick={toggleMenu}
        className="text-lg xs:text-xl sm:text-2xl p-2 xs:p-2.5 sm:p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...ANIMATION_CONFIG.mobileMenu}
            className="bg-white/4 backdrop-blur-lg border-2 border-white/20 min-h-screen fixed top-0 right-0 w-56 xs:w-60 sm:w-64 md:w-72 shadow-lg p-4 xs:p-5 sm:p-6 z-20 overflow-y-auto"
          >
            <div className="flex justify-between w-full items-center mb-6 xs:mb-7 sm:mb-8">
              <div className="flex gap-1 sm:gap-2">
                {LOGOS.map((logo, index) => (
                  <img
                    key={`mobile-logo-${index}`}
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="w-6 xs:w-6 sm:w-7 md:w-8 h-6 xs:h-6 sm:h-7 md:h-8 object-contain"
                  />
                ))}
              </div>
              <button
                onClick={toggleMenu}
                aria-label="Close menu"
                className="p-1 xs:p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes
                  size={20}
                  className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white"
                />
              </button>
            </div>

            <nav className="mt-4 xs:mt-5 sm:mt-6">
              <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-5">
                {getAuthenticatedNavbar(isAdmin, adminPosition).map(
                  (navItem, index) => {
                    const isMerchandise = navItem.name === "Merchandise";

                    if (isMerchandise) {
                      return (
                        <li key={`mobile-nav-${index}`}>
                          <button
                            onClick={() => toggleMobileDropdown("Merchandise")}
                            className="text-white text-sm xs:text-base sm:text-lg md:text-xl hover:bg-white/10 hover:text-gray-300 transition-colors w-full text-left flex items-center justify-between px-2 xs:px-2.5 sm:px-3 py-1.5 xs:py-2 sm:py-2.5 rounded-lg"
                          >
                            <span className="truncate">{navItem.name}</span>
                            <span
                              className={`ml-2 shrink-0 transform transition-transform ${
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
                                className="mt-1.5 xs:mt-2 sm:mt-3 ml-3 xs:ml-3 sm:ml-4 space-y-1 xs:space-y-1.5 border-l border-purple-200/40 pl-3"
                              >
                                {(isAdmin
                                  ? [
                                      {
                                        to: "/admin/merch/products",
                                        label: "Products",
                                      },
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
                                    className="text-gray-300 text-xs xs:text-sm sm:text-base hover:text-white transition-colors block py-1.5 xs:py-2 sm:py-2"
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
                          className="text-white text-sm xs:text-base sm:text-lg md:text-xl hover:bg-white/10 hover:text-gray-300 transition-colors block px-2 xs:px-2.5 sm:px-3 py-1.5 xs:py-2 sm:py-2.5 rounded-lg truncate"
                        >
                          {navItem.name}
                        </Link>
                      </li>
                    );
                  },
                )}
              </ul>

              {student && (
                <div className="mt-6 xs:mt-7 sm:mt-8 pt-4 xs:pt-5 sm:pt-6 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="w-full flex gap-2 xs:gap-3 items-center hover:bg-white/10 px-2 xs:px-2.5 sm:px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="h-9 xs:h-10 w-9 xs:w-10 bg-purple-700/40 rounded-md shrink-0 flex items-center justify-center text-white font-bold text-xs">
                      {student.user.firstName?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <p className="text-white text-xs xs:text-sm truncate flex-1">
                      {student.user.firstName} {student.user.lastName}
                    </p>
                  </button>
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <MobileProfileDropdown
                          student={student}
                          onClose={() => {
                            setShowProfileDropdown(false);
                            setIsOpen(false);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileAuthenticatedNav;
