import { useRoutes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth_store";
import PageTransition from "../components/PageTransition";

import LoginPage from "../pages/login";
import ContactUsPage from "../pages/contact";
import ForgotPasswordPage from "../pages/forgotPassword";
import DashboardPage from "../pages/dashboard";
import EventsPage from "../pages/events";
import EventViewPage from "../pages/events/eventView";
import MerchPage from "../pages/merch";
import ProductViewPage from "../pages/merch/productView";
import TransactionsPage from "../pages/merch/transactions";
import CartPage from "../pages/merch/cart";
import BulletinPage from "../pages/bulletin";

// Admin
import AdminDashboardPage from "../pages/admin/dashboard";
import AdminEventPage from "../pages/admin/event/page";
import AdminProductsPage from "../pages/admin/products";

import AdminForumPage from "../pages/admin/forum";
import AdminMerchPage from "../pages/admin/student";
import AdminMercheOrdersPage from "../pages/admin/merch/orders";

import NotFoundPage from "../pages/notFound";
import LoadingPage from "../pages/loading";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import AdminMerchProductView from "../pages/admin/merch/productView";
import ProfilePage from "../components/ProfilePage";
import LandingPage from "../pages/landing";

// Home route component - redirects authenticated users to dashboard
const HomeRoute = () => {
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

  // Not authenticated - show landing page
  return <LandingPage />;
};
const routers = [
  // Home route - redirects authenticated users to dashboard
  { path: "/", element: <HomeRoute /> },
  // Public routes - protected by PublicRoute to prevent authenticated access
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/contact-us", element: <ContactUsPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  // Student Protected Routes
  {
    element: <ProtectedRoute allowedRole="STUDENT" />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/profile", element: <ProfilePage /> },
      // { path: "/resources", element: <ResourcesPage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/events/view/:id", element: <EventViewPage /> },
      { path: "/merch", element: <MerchPage /> },
      { path: "/merch/:merchId", element: <ProductViewPage /> },
      { path: "/merch/transactions", element: <TransactionsPage /> },
      { path: "/merch/cart", element: <CartPage /> },
      { path: "/bulletin", element: <BulletinPage /> },
    ],
  },

  // Admin Protected Routes
  {
    element: <ProtectedRoute allowedRole="ADMIN" />,
    children: [
      { path: "/admin/dashboard", element: <AdminDashboardPage /> },
      { path: "/admin/profile", element: <ProfilePage /> },
      { path: "/admin/event", element: <AdminEventPage /> },
      // { path: "/admin/dashboard/finance", element: <AdminFinancePage /> },
      { path: "/admin/merch/products", element: <AdminProductsPage /> },
      // { path: "/admin/sales", element: <AdminSalesPage /> },
      { path: "/admin/forum", element: <AdminForumPage /> },
      { path: "/admin/students", element: <AdminMerchPage /> },
      { path: "/admin/merch/orders", element: <AdminMercheOrdersPage /> },
      { path: "/admin/merch/:merchId", element: <AdminMerchProductView /> },
    ],
  },

  // 404 fallback
  { path: "*", element: <NotFoundPage /> },
];

const AppRoutes = () => {
  const elements = useRoutes(routers);
  return (
    <div className="w-full min-h-screen bg-black">
      <AnimatePresence mode="wait">
        <PageTransition>
          <Suspense fallback={<LoadingPage />}>{elements}</Suspense>
        </PageTransition>
      </AnimatePresence>
    </div>
  );
};

export default AppRoutes;
