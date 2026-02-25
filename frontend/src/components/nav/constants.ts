export const ANIMATION_CONFIG = {
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

export const isRouteActive = (
  _navName: string,
  currentLocation: string,
  navTo: string,
): boolean => {
  if (!navTo) return false;
  if (currentLocation === navTo) return true;
  return currentLocation.startsWith(`${navTo}/`);
};

export const getMerchandiseActiveStates = (location: string) => ({
  isProductsActive:
    location === "/merch" ||
    location.startsWith("/merch/variant") ||
    location === "/admin/merch/products",
  isTransactionsActive: location.startsWith("/merch/transactions"),
  isCartActive: location.startsWith("/merch/cart"),
  isOrderActive: location.startsWith("/admin/merch/orders"),
  isCustomersActive: location.startsWith("/admin/merch/customers"),
});

/**
 * Current academic year configuration.
 * This is the frontend single source of truth — must match
 * the backend application.properties values.
 * Updated each August when the new school year begins.
 */
export const CURRENT_YEAR_START = 2025;
export const CURRENT_YEAR_END = 2026;
