import React from "react";
import { useLocation } from "react-router-dom";
import DesktopAuthenticatedNav from "./nav/DesktopAuthenticatedNav";
import MobileAuthenticatedNav from "./nav/MobileAuthenticatedNav";

const AuthenticatedNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <>
      <DesktopAuthenticatedNav location={pathname} />
      <MobileAuthenticatedNav />
    </>
  );
};

export default AuthenticatedNav;
