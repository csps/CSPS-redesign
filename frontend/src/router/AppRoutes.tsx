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
import ShowcasePage from "../pages/showcase";
import ForumPage from "../pages/forum";
import SettingsPage from '../pages/settings'

// Admin
import AdminDashboardPage from "../pages/admin/dashboard";
import AdminEventPage from "../pages/admin/event/page";
import AdminFinancePage from "../pages/admin/dashboard/finance";
import AdminProductsPage from "../pages/admin/products";
import AdminSalesPage from "../pages/admin/sales";
import AdminForumPage from "../pages/admin/forum";
import AdminMerchPage from "../pages/admin/merch";
import AdminMerchOrdersPage from "../pages/admin/merch/orders";

import NotFoundPage from "../pages/notFound";
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
  { path: "/forum", element: <ForumPage /> },
  { path: "/showcase", element: <ShowcasePage /> },
  { path: "/settings", element: <SettingsPage />},
  { path: "/admin/dashboard", element: <AdminDashboardPage /> },
  { path: "/admin/event", element: <AdminEventPage /> },
  { path: "/admin/dashboard/finance", element: <AdminFinancePage /> },
  { path: "/admin/products", element: <AdminProductsPage /> },
  { path: "/admin/sales", element: <AdminSalesPage /> },
  { path: "/admin/forum", element: <AdminForumPage /> },
  { path: "/admin/merch", element: <AdminMerchPage /> },
  { path: "/admin/merch/orders", element: <AdminMerchOrdersPage /> },
  { path: "*", element: <NotFoundPage /> },
];

const AppRoutes = () => {
  const elements = useRoutes(routers);
  return <Suspense fallback={<div>Loading...</div>}>{elements}</Suspense>;
};

export default AppRoutes;
