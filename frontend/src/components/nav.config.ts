import HOME from "../assets/navs/home.svg";
import MERCHANDISE from "../assets/navs/merchandise.svg";
import BULLETIN from "../assets/navs/bulletin.svg";
import EVENTS from "../assets/navs/events.svg";
import STUDENT from "../assets/navs/student.svg";

import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";

import {
  type AdminPosition,
  isExecutivePosition,
  isFinancePosition,
} from "../enums/AdminPosition";

export const LOGOS: string[] = [UCLOGO, CCSLOGO, CSPSLOGO];

interface NavItem {
  name: string;
  icon: string;
  to: string;
}

/**
 * Get authenticated navbar items based on role and position.
 *
 * For students: Shows Home, Merchandise, Bulletin, Events
 * For executives (President, VPs, Secretary): Shows ALL admin nav items with /admin/dashboard as Home
 * For finance (Treasurer, Asst Treasurer): Shows finance-related items with /admin/finance as Home
 * For general admins: Shows Finance, Sales (read-only) with /admin/finance as Home
 */
export const getAuthenticatedNavbar = (
  isAdmin: boolean,
  position?: AdminPosition | string,
): NavItem[] => {
  // Check position categories
  const isExecutive = isExecutivePosition(position);
  const isFinance = isFinancePosition(position);

  // Determine Home route based on role and position
  const getHomeRoute = (): string => {
    if (!isAdmin) return "/dashboard";
    if (isExecutive) return "/admin/dashboard"; // Executives go to main dashboard
    // Finance and general admins go to finance dashboard
    return "/admin/finance";
  };

  // Base items for all authenticated users
  const baseItems: NavItem[] = [
    { name: "Home", icon: HOME, to: getHomeRoute() },
    {
      name: "Merchandise",
      icon: MERCHANDISE,
      to: isAdmin ? "/admin/merch/products" : "/merch",
    },
  ];

  // Student-only items
  if (!isAdmin) {
    return [
      ...baseItems,
      { name: "Bulletin", icon: BULLETIN, to: "/bulletin" },
      { name: "Events", icon: EVENTS, to: "/events" },
    ];
  }

  // Events - shown to all admins
  const eventsItem: NavItem = {
    name: "Events",
    icon: EVENTS,
    to: "/admin/event",
  };

  // Students - only for executives
  const studentsItem: NavItem = {
    name: "Students",
    icon: STUDENT,
    to: "/admin/students",
  };

  // Sales - for all admins (general admins see read-only)
  const salesItem: NavItem = {
    name: "Sales",
    icon: MERCHANDISE,
    to: "/admin/sales",
  };

  // Build admin nav based on position
  if (isExecutive) {
    // Executives get full access to everything (including Finance as a separate nav item)
    const financeItem: NavItem = {
      name: "Finance",
      icon: HOME,
      to: "/admin/finance",
    };
    const staffItem: NavItem = {
      name: "Staff",
      icon: STUDENT,
      to: "/admin/staff",
    };
    const auditItem: NavItem = {
      name: "Audit Logs",
      icon: BULLETIN,
      to: "/admin/audit",
    };

    return [
      ...baseItems,
      eventsItem,
      studentsItem,
      staffItem,
      financeItem,
      salesItem,
      auditItem,
    ];
  }

  if (isFinance) {
    // Finance positions - Home is already /admin/finance, so no separate Finance nav item needed
    // Add Membership as direct nav item (not under Students dropdown since they don't have access to student list)
    const membershipItem: NavItem = {
      name: "Membership",
      icon: STUDENT,
      to: "/admin/membership",
    };
    return [...baseItems, eventsItem, membershipItem, salesItem];
  }

  // General admins - Home is /admin/finance (read-only), show Sales (read-only)
  // Add Membership as direct nav item
  const membershipItem: NavItem = {
    name: "Membership",
    icon: STUDENT,
    to: "/admin/membership",
  };
  return [...baseItems, eventsItem, membershipItem, salesItem];
};
