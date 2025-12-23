import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

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

const routers = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/contact-us", element: <ContactUsPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/resources", element: <ResourcesPage /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/view/:id", element: <EventViewPage /> },
  { path: "/merch", element: <MerchPage /> },
  { path: "/merch/product", element: <ProductViewPage /> },
  { path: "/merch/transactions", element: <TransactionsPage /> },
  { path: "/merch/cart", element: <CartPage /> },
  { path: "/bulletin", element: <BulletinPage /> },
  { path: "/admin/dashboard", element: <AdminDashboardPage /> },
  { path: "/admin/event", element: <AdminEventPage /> },
  { path: "/admin/dashboard/finance", element: <AdminFinancePage /> },
];

const AppRoutes = () => {
  const elements = useRoutes(routers);
  return <Suspense fallback={<div>Loading...</div>}>{elements}</Suspense>;
};

export default AppRoutes;
