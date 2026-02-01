import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";

/**
 * PublicRoute - Prevents authenticated users from accessing public routes
 * Redirects authenticated users to their appropriate dashboard
 */
export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  // Not authenticated - allow access to public route
  return <Outlet />;
};

export default PublicRoute;
