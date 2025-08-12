import React, { useState, useEffect } from "react";
import CspsLogo from "@/assets/CSPSLogo.png";
import UCLogo from "@/assets/uc_LOGO 1.png";
import CcsLogo from "@/assets/CSSLogo.png";
import AccountCircleIcon from "@/assets/SVG/icons8-profile-100 2.svg";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const LogoSection = ({ withNav = false, authenticated = true }: { withNav?: boolean, authenticated?: boolean }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      {/* Logo Section */}
      <div className="w-full relative lg:top-14 lg:left-8 p-5 lg:p-0 flex items-center gap-3 z-50 justify-between ">
        <div className="flex items-center gap-2">
          <img
            src={UCLogo}
            alt="UC Logo"
            className="w-16 h-16 lg:w-[103px] lg:h-[103px] rounded-full"
          />
          <img
            src={CcsLogo}
            alt="CCS Logo"
            className="w-15 h-15 lg:w-[97px] lg:h-[98px] rounded-full"
          />
          <img
            src={CspsLogo}
            alt="CSPS Logo"
            className="w-15 h-15 lg:w-[98px] lg:h-[98px] rounded-full"
          />
        </div>

        {withNav && (
          <>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-5 text-white font-semibold items-center px-30 text-xl">
              <li className="list-none cursor-pointer">Bulletin</li>
              <li className="list-none cursor-pointer">Events</li>
              <li className="list-none cursor-pointer">
                <Link to="/merch">Merch</Link>
              </li>
             {authenticated && <li className="list-none cursor-pointer">
                <img
                  src={AccountCircleIcon}
                  alt="profile-icon"
                  className="w-10 h-10"
                />
              </li>}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsClicked(true)}
              className="lg:hidden p-2 text-white px-10"
            >
              <MenuIcon fontSize="large" />
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isClicked && <MobileMenu onClose={() => setIsClicked(false)} authenticated={authenticated}/>}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
};

export default LogoSection;
