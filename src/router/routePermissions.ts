import {
  AdminPosition,
  isExecutivePosition,
  isFinancePosition,
} from "../enums/AdminPosition";

/**
 * Route permission configuration for admin routes.
 * Defines which admin positions can access which routes.
 * 
 * Note: General admins can access finance/sales pages but with read-only UI.
 * The UI components use usePermissions hook to hide CRUD buttons for non-finance users.
 */

// Admin routes that require EXECUTIVE position only
export const EXECUTIVE_ONLY_ROUTES = [
  "/admin/dashboard",
  "/admin/students",
];

// Admin routes accessible to FINANCE, EXECUTIVE, and general admins
// General admins see read-only UI (no CRUD buttons)
export const FINANCE_ROUTES = [
  "/admin/finance",
  "/admin/sales",
];

// Admin routes accessible to ALL admins
export const ALL_ADMIN_ROUTES = [
  "/admin/profile",
  "/admin/event",
  "/admin/merch/products",
  "/admin/merch/orders",
  "/admin/merch/customers",
  "/admin/membership",
  "/admin/merch", // For dynamic routes like /admin/merch/:merchId
];

/**
 * Check if a given admin position has permission to access a route.
 * 
 * @param pathname - The current route pathname
 * @param position - The admin's position
 * @returns boolean - Whether the admin can access this route
 */
export const canAccessRoute = (
  pathname: string,
  position?: AdminPosition | string
): boolean => {
  // Executives can access everything
  if (isExecutivePosition(position)) {
    return true;
  }

  // Check if route is executive-only
  const isExecutiveOnlyRoute = EXECUTIVE_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isExecutiveOnlyRoute) {
    return false; // Only executives can access these
  }

  // Finance positions can access finance routes and all admin routes
  if (isFinancePosition(position)) {
    const isFinanceRoute = FINANCE_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    const isAllAdminRoute = ALL_ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    return isFinanceRoute || isAllAdminRoute;
  }

  // General admins can access ALL_ADMIN_ROUTES and FINANCE_ROUTES (read-only mode)
  const isFinanceRoute = FINANCE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAllAdminRoute = ALL_ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  
  return isFinanceRoute || isAllAdminRoute;
};

/**
 * Get the appropriate home route for an admin based on their position.
 * Executives go to /admin/dashboard, everyone else goes to /admin/finance
 */
export const getAdminHomeRoute = (position?: AdminPosition | string): string => {
  if (isExecutivePosition(position)) {
    return "/admin/dashboard";
  }
  // Finance and general admins go to finance dashboard
  return "/admin/finance";
};

