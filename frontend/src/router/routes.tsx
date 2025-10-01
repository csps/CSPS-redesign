import type { RouteObject } from "react-router-dom";
import { lazy } from "react";

const LandingPage = lazy(() => import(".././pages/landing"));
const LoginPage = lazy(() => import("../pages/login"));
const ContactUs = lazy(() => import("../pages/contact"));
const ForgotPassword = lazy(() => import("../pages/forgotPassword"));

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
    element: <ContactUs />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];

export default routes;
