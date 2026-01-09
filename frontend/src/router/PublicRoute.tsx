import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth_store";

/**
 * PublicRoute - Prevents authenticated users from accessing public routes
 * Redirects authenticated users to their appropriate dashboard
 */
export const PublicRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  // If authenticated, redirect to appropriate dashboard
  if (accessToken && user) {
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
