import { useState } from "react";
import CspsLogo from "@/assets/CSPSLogo.png";
import UCLogo from "@/assets/uc_LOGO 1.png";
import CcsLogo from "@/assets/CSSLogo.png";
import AccountCircleIcon from "@/assets/SVG/icons8-profile-100 2.svg";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import StoreIcon from "@mui/icons-material/Store";
import ProfileSample from "@/assets/ProfileSample.png"

const LogoSection = ({
  withNav = false,
  authenticated = true,
}: {
  withNav?: boolean;
  authenticated?: boolean;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  return (
    <>
      {/* Logo Section */}
      <div className="w-full relative lg:top-14 lg:left-8 p-5 lg:p-0 flex items-center gap-3 z-50 justify-between ">
        <div className="flex items-center gap-2">
          <a href="https://uc.edu.ph/">
            <img
              src={UCLogo}
              alt="UC Logo"
              className="w-16 h-16 lg:w-[103px] lg:h-[103px] rounded-full"
            />
          </a>
          <a href="http://ccs.uc.edu.ph/">
            <img
              src={CcsLogo}
              alt="CCS Logo"
              className="w-15 h-15 lg:w-[97px] lg:h-[98px] rounded-full"
            />
          </a>
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
          <img
            src={CspsLogo}
            alt="CSPS Logo"
            className="w-15 h-15 lg:w-[98px] lg:h-[98px] rounded-full"
          />
          </Link>
        </div>

        {withNav && (
          <>
            {/* Desktop Nav */}
            {isAuthenticated ? (
              <nav className="hidden lg:flex gap-5 text-white font-semibold items-center px-30 text-xl">
                <li className="list-none text-gray-400 hover:text-white cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px]  after:w-0 after:h-[4px] after:rounded-md after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                  <Link to="/dashboard" className="flex items-center gap-2 ">
                    <HomeIcon />
                    <span>Home</span>
                  </Link>
                </li>
                <li className="list-none text-gray-400 hover:text-white cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px]  after:w-0 after:h-[4px] after:rounded-md after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                  <Link to="/bulletin" className="flex items-center gap-2 ">
                    <StickyNote2Icon />
                    <span>Bulletin</span>
                  </Link>
                </li>
                <li className="list-none text-gray-400 hover:text-white cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px]  after:w-0 after:h-[4px] after:rounded-md after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                  <Link to="/merch" className="flex items-center gap-2 ">
                    <StoreIcon />
                    <span>Merch</span>
                  </Link>
                </li>
                {authenticated && (
                  <li className="list-none cursor-pointer ml-5">
                   <Link to="/profile">
                    <img
                      src={ProfileSample}
                      alt="profile-icon"
                      className="w-10 h-10"
                    />
                   </Link>
                  </li>
                )}
              </nav>
            ) : (
              <nav className="hidden lg:flex gap-10  font-semibold items-center px-30 text-xl">
                <li className="list-none text-gray-400 hover:text-white cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px]  after:w-0 after:h-[4px] after:rounded-md after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                  <Link to="/about" className="flex items-center gap-2 ">
                    <InfoIcon /> <span>About</span>
                  </Link>
                </li>
                <li className="list-none text-gray-400 hover:text-white  cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[4px] after:rounded-md after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                  <Link to="/login" className="flex items-center gap-2">
                    <LoginIcon /> <span>Login</span>
                  </Link>
                </li>
              </nav>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsClicked(true)}
              className="lg:hidden p-2 text-white px-10"
            >
              <MenuIcon fontSize="large" />
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isClicked && (
                <MobileMenu
                  onClose={() => setIsClicked(false)}
                  authenticated={authenticated}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
};

export default LogoSection;
