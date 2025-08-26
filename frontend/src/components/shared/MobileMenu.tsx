import React from "react";
import { motion } from "framer-motion";
import FormatListBulletedSharpIcon from "@mui/icons-material/FormatListBulletedSharp";
import StoreMallDirectorySharpIcon from "@mui/icons-material/StoreMallDirectorySharp";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import LoginIcon from "@mui/icons-material/Login";
import InfoIcon from "@mui/icons-material/Info";

interface MobileMenuProps {
  onClose: () => void;
  authenticated?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, authenticated }) => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  return (
    <>
      <motion.div
        className="fixed top-0 right-0 h-screen w-64" // full viewport height and fixed width
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="glass-card-2 w-full   p-6 relative overflow-hidden group h-full">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 rbackdrop-blur-[4px] border border-white/10 shadow-lg"></div>

          {/* Content layer */}
          <div className="relative z-10 flex items-center justify-center gap-2 flex-col text-white">
            <button onClick={onClose} className="text-end w-full p-2 mb-4">
              <CloseIcon fontSize="large" />
            </button>

            <ul className="space-y-5 text-3xl">
              {isAuthenticated ? (
                <>
                  <li className="cursor-pointer ">
                    <Link
                      to="/dashboard"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <HomeIcon fontSize="large" />
                      Home
                    </Link>
                  </li>

                  <li className="cursor-pointer ">
                    <Link
                      to="/bulletin"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <FormatListBulletedSharpIcon fontSize="large" />
                      Bulletin
                    </Link>
                  </li>

                  <li className="cursor-pointer ">
                    <Link
                      to="/merch"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <StoreMallDirectorySharpIcon fontSize="large" />
                      Merch
                    </Link>
                  </li>
                  <li className="cursor-pointer">
                    <Link to="/profile" className="flex gap-4 items-center">
                      <AccountCircleSharpIcon fontSize="large" />
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="cursor-pointer ">
                    <Link
                      to="/dashboard"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <InfoIcon fontSize="large" />
                      About
                    </Link>
                  </li>

                  <li className="cursor-pointer ">
                    <Link
                      to="/bulletin"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      <LoginIcon fontSize="large" />
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileMenu;
