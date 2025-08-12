import React from "react";
import { motion } from "framer-motion";
import FormatListBulletedSharpIcon from "@mui/icons-material/FormatListBulletedSharp";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import StoreMallDirectorySharpIcon from "@mui/icons-material/StoreMallDirectorySharp";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import CloseIcon from "@mui/icons-material/Close";

interface MobileMenuProps {
  onClose: () => void;
  authenticated?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, authenticated }) => {
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
              <li className="cursor-pointer flex gap-4 items-center">
                <FormatListBulletedSharpIcon fontSize="large" />
                Bulletin
              </li>
              <li className="cursor-pointer flex gap-4 items-center">
                <CalendarMonthSharpIcon fontSize="large" />
                Events
              </li>
              <li className="cursor-pointer flex gap-4 items-center">
                <StoreMallDirectorySharpIcon fontSize="large" />
                Merch
              </li>
            {authenticated &&  <li className="cursor-pointer flex gap-4 items-center">
                <AccountCircleSharpIcon fontSize="large" />
                Profile
              </li>}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileMenu;
