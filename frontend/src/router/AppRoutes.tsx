import { useRoutes, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth_store";
import PageTransition from "../components/PageTransition";

import LandingPage from "../pages/landing";
import LoginPage from "../pages/login";
import ContactUsPage from "../pages/contact";
import ForgotPasswordPage from "../pages/forgotPassword";
import DashboardPage from "../pages/dashboard";
import ResourcesPage from "../pages/resources";
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
import AdminFinancePage from "../pages/admin/dashboard/finance";
import AdminProductsPage from "../pages/admin/products";
import AdminSalesPage from "../pages/admin/sales";

import AdminForumPage from "../pages/admin/forum";
import AdminMerchPage from "../pages/admin/merch";
import AdminMercheOrdersPage from "../pages/admin/merch/orders";

import NotFoundPage from "../pages/notFound";
import LoadingPage from "../pages/loading";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

// Home route component - redirects authenticated users to dashboard
const HomeRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  // If authenticated, redirect to appropriate dashboard via protected routes
  if (accessToken && user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }
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
      { path: "/admin/event", element: <AdminEventPage /> },
      { path: "/admin/dashboard/finance", element: <AdminFinancePage /> },
      { path: "/admin/merch/products", element: <AdminProductsPage /> },
      { path: "/admin/sales", element: <AdminSalesPage /> },
      { path: "/admin/forum", element: <AdminForumPage /> },
      { path: "/admin/merch", element: <AdminMerchPage /> },
      { path: "/admin/merch/orders", element: <AdminMercheOrdersPage /> },
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
