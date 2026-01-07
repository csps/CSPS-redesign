import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";

type ProtectedRouteProps = {
  allowedRole?: "ADMIN" | "STUDENT";
};

/**
 * ProtectedRoute - Checks authentication and user role before rendering
 * @param allowedRole 
 *   - "ADMIN": Only admins can access
 *   - "STUDENT": Only students can access
 */
export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  // Not authenticated - redirect to login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRole === "ADMIN") {
    if (user.role !== "ADMIN") {
      // Non-admin trying to access admin route - redirect to student dashboard
      return <Navigate to="/dashboard" replace />;
    }
  } else if (allowedRole === "STUDENT") {
    if (user.role !== "STUDENT") {
      // Non-student trying to access student route - redirect to admin dashboard
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // User is authenticated and has correct role - allow access
  return <Outlet />;
};

export default ProtectedRoute;
