import React from "react";
import Footer from "./Footer";
import SessionExpiredModal from "./SessionExpiredModal";
import LogoutLoadingModal from "./LogoutLoadingModal";
import { useAuthStore } from "../store/auth_store";

type LayoutProps = {
  children: React.ReactNode;
  overflowHidden?: boolean;
  containerScreen?: string;
  classNameContainer?: string;
  classNameInner?: string;
  withFooter?: boolean;
};

const Layout = ({
  children,
  overflowHidden,
  containerScreen,
  classNameContainer,
  classNameInner,
  withFooter = true,
}: LayoutProps) => {
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const setSessionExpired = useAuthStore((state) => state.setSessionExpired);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);

  return (
    <>
      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
      />
      <LogoutLoadingModal isOpen={isLoggingOut} />
      <div
        className={
          `min-h-${
            containerScreen ? "[" + containerScreen + "]" : "screen"
          } w-full bg-gradient-to-b from-[rgb(65,22,156)] via-[#20113F] to-black flex justify-center ` +
          classNameContainer
        }
      >
        <div
          className={
            `w-full max-w-[90rem] p-6 text-white ${
              overflowHidden ? "overflow-hidden" : ""
            }` + classNameInner
          }
        >
          {children}
        </div>
      </div>
      {withFooter && <Footer />}
    </>
  );
};

export default Layout;
