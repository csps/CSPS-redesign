import type { RouteObject } from "react-router-dom";
import { lazy } from "react";

const LandingPage = lazy(() => import(".././pages/landing"));
const LoginPage = lazy(() => import("../pages/login"));
const ContactUsPage = lazy(() => import("../pages/contact"));
const ForgotPasswordPage = lazy(() => import("../pages/forgotPassword"));
const DashboardPage = lazy(() => import("../pages/dashboard"));
const ResourcesPage = lazy(() => import("../pages/resources"));
const EventsPage = lazy(() => import("../pages/events"));
const EventViewPage = lazy(() => import("../pages/events/eventView"));
const MerchPage = lazy(() => import("../pages/merch"));
const BulletinPage = lazy(() => import("../pages/bulletin"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/contact-us",
    element: <ContactUsPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/resources",
    element: <ResourcesPage />,
  },
  {
    path: "/events",
    element: <EventsPage />,
  },
  {
    path: "/events/view/:id",
    element: <EventViewPage />,
  },
  {
    path: "/merch",
    element: <MerchPage />,
  },
  {
    path: "/bulletin",
    element: <BulletinPage  />
  }
];

export default routes;
