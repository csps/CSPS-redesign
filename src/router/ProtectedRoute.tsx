import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";
import type { UserResponse } from "../interfaces/user/UserResponse";
import { canAccessRoute, getAdminHomeRoute } from "./routePermissions";

type ProtectedRouteProps = {
  allowedRole?: "ADMIN" | "STUDENT";
};

/**
 * ProtectedRoute - Checks authentication, user role, and position-based permissions
 * @param allowedRole
 *   - "ADMIN": Only admins can access (with position-based sub-permissions)
 *   - "STUDENT": Only students can access
 */
export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRole === "ADMIN") {
    if (user.role !== "ADMIN") {
      // Non-admin trying to access admin route - redirect to student dashboard
      return <Navigate to="/dashboard" replace />;
    }

    // Admin user - check position-based permissions
    const adminUser = user as UserResponse;
    const hasAccess = canAccessRoute(location.pathname, adminUser.position);

    if (!hasAccess) {
      // Admin doesn't have permission for this route - redirect to their home
      const adminHome = getAdminHomeRoute(adminUser.position);
      return <Navigate to={adminHome} replace />;
    }
  } else if (allowedRole === "STUDENT") {
    if (user.role !== "STUDENT") {
      // Non-student trying to access student route - redirect to appropriate admin home
      const adminUser = user as UserResponse;
      const adminHome = getAdminHomeRoute(adminUser.position);
      return <Navigate to={adminHome} replace />;
    }
  }

  // User is authenticated and has correct role/permissions - allow access
  return <Outlet />;
};

export default ProtectedRoute;
