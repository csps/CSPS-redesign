import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getMerchandiseActiveStates } from "./constants";

interface MerchandiseDropdownProps {
  location: string;
  isAdmin: boolean;
}

const MerchandiseDropdown: React.FC<MerchandiseDropdownProps> = ({
  location,
  isAdmin,
}) => {
  const {
    isProductsActive,
    isTransactionsActive,
    isCartActive,
    isOrderActive,
    isCustomersActive,
  } = getMerchandiseActiveStates(location);

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
        {
          to: "/admin/merch/customers",
          label: "Customers",
          isActive: isCustomersActive,
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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

export default MerchandiseDropdown;
