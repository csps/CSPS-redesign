import ProtectedRoute from "@/components/shared/ProtectedRoute";
import RedirectHome from "@/components/shared/test/RedirectHome";
import BulletinPage from "@/pages/Bulletin/BulletinPage";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("@/pages/Home/HomePage"));
const About = lazy(() => import("@/pages/About/AboutPage"));
const Login = lazy(() => import("@/pages/Login/LoginPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard/DashboardPage"));
const Merch = lazy(() => import("@/pages/Merch/MerchPage"));
const Transactions = lazy(
  () => import("@/pages/Transactions/TransactionsPage"),
);
const Cart = lazy(() => import("@/pages/Cart/CartPage"));
const ProductView = lazy(() => import("@/pages/ProductView/ProductViewPage"));
const Bulletin = lazy(() => import("@/pages/Bulletin/BulletinPage"));
const Profile = lazy(() => import("@/pages/Profile/ProfilePage"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RedirectHome />,
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
    element: <ProtectedRoute />,
    children: [{ path: "", element: <Dashboard /> }],
  },
  {
    path: "/merch",
    element: <Merch />,
  },
  {
    path: "/transactions",
    element: <ProtectedRoute />,
    children: [{ path: "", element: <Transactions /> }],
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/product-view",
    element: <ProductView />,
  },
  {
    path: "/bulletin",
    element: <ProtectedRoute />,
    children: [{ path: "", element: <Bulletin /> }],
  },
  {
    path: "/profile",
    element: <ProtectedRoute />,
    children: [{ path: "", element: <Profile /> }],
  },
];

export default routes;
