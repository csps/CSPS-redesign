import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home/HomePage"));
const About = lazy(() => import("@/pages/About/AboutPage"));
const Login = lazy(() => import("@/pages/Login/LoginPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard/DashboardPage"));
const Merch = lazy(() => import("@/pages/Merch/MerchPage"));
const Transactions = lazy(() => import("@/pages/Transactions/TransactionsPage"));
const Cart = lazy(() => import("@/pages/Cart/CartPage"))

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/merch",
    element: <Merch />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  },
  {
    path: "/cart",
    element: <Cart />
  }
];

export default routes;
