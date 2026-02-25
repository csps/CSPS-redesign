import React from "react";
import Footer from "./Footer";
import LogoutLoadingModal from "./LogoutLoadingModal";
import SessionExpiredModal from "./SessionExpiredModal";
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
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);

  return (
    <>
      <LogoutLoadingModal isOpen={isLoggingOut} />
      <SessionExpiredModal
        isOpen={sessionExpired}
        onClose={() => {
          useAuthStore.getState().setSessionExpired(false);
          useAuthStore.getState().clearAuth();
        }}
      />
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
            `w-full max-w-[90rem] px-4 md:px-6 text-white ${
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
