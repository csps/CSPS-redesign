import React, { useState } from "react";
import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";
import { PiGearSixLight } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import HOME from "../assets/navs/home.svg";
import FORUM from "../assets/navs/forum.svg";
import MERCHANDISE from "../assets/navs/merchandise.svg";
import BULLETIN from "../assets/navs/bulletin.svg";
import EVENTS from "../assets/navs/events.svg";
import RESOURCES from "../assets/navs/resources.svg";
import { FaBars, FaTimes } from "react-icons/fa";

const LOGOS: string[] = [UCLOGO, CCSLOGO, CSPSLOGO];
const NAVBARSAUTHENTICATED: { name: string; icon?: string }[] = [
  { name: "Home", icon: HOME },
  { name: "Forum", icon: FORUM },
  { name: "Merchandise", icon: MERCHANDISE },
  { name: "Bulletin", icon: BULLETIN },
  { name: "Events", icon: EVENTS },
  { name: "Resources", icon: RESOURCES },
  { name: "Showcase", icon: "" },
  { name: "Contact us", icon: "" },
];

const AuthenticatedNav = () => {

  return (
    <>
      <DesktopAuthenticatedNav />
      <MobileAuthenticatedNav />
    </>
  );
};

const DesktopAuthenticatedNav = () => {
  const [selected, setSelected] = useState<string>("Home");

  return (
    <div className="hidden lg:flex w-full justify-center px-6 py-4">
      <nav className="w-full max-w-7xl bg-white/5 backdrop-blur-lg border border-white/20 rounded-[25px] shadow-lg py-4 px-8 flex items-center justify-between text-white">
        <div className="hidden xl:flex items-center gap-6 px-4">
          {LOGOS.map((logo, index) => (
            <img
              src={logo}
              key={index}
              alt={`Logo ${index + 1}`}
              className="w-10 h-auto object-contain"
            />
          ))}
        </div>

        <ul className="flex gap-8 items-center">
          {NAVBARSAUTHENTICATED.map((navs, index) => (
            <li
              key={index}
              className={`relative cursor-pointer text-lg font-medium transition-all ${
                selected === navs.name
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setSelected(navs.name)}
            >
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {selected === navs.name && (
                    <>
                      <motion.div
                        key={"line"}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-[-8px] left-0 h-[2px] bg-gray-400"
                      />
                      <motion.div
                        key={"trapezoid"}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        transition={{ duration: 0.2, delay: 0.25 }}
                        className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-[3px] bg-white [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]"
                      />
                    </>
                  )}
                </AnimatePresence>

                {selected === navs.name && (
                  <img src={navs.icon} alt="" className="w-5 h-5 mr-2" />
                )}
                <span>{navs.name}</span>
              </div>
            </li>
          ))}
          <PiGearSixLight className="text-3xl text-white/90 hover:text-white transition" />
        </ul>
      </nav>
      <div className="hidden lg:flex items-center ml-4 mt-2">
        <div className="hidden xl:flex flex-col items-center">
          <div className="h-14 w-14 bg-purple-700/40 rounded-md"></div>
          <p className="text-xs mt-1 text-gray-300">xxxxxxxx</p>
        </div>
      </div>
    </div>
  );
};

const MobileAuthenticatedNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-end lg:hidden  ">
      {/* Toggle button */}
      <button onClick={() => setIsOpen(!isOpen)} className="text-2xl p-2">
        {<FaBars />}
      </button>

      {/* Slide-in menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white/4 backdrop-blur-lg border-2  border-white/20 min-h-screen fixed top-0 right-0 w-64 shadow-lg p-5 z-20 "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ stiffness: 80 }}
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                <div className="flex">
                  {LOGOS.map((logo, index) => (
                    <img src={logo} key={index} />
                  ))}
                </div>
              </div>
              <button onClick={() => setIsOpen(!isOpen)}>
                <FaTimes size={30} />
              </button>
            </div>
            <div className="mt-10">
              {NAVBARSAUTHENTICATED.map((name, index) => (
                <p className="text-white text-xl mt-5" key={index}>
                  {name.name}
                </p>
              ))}
              <div className="mt-8 flex gap-2">
                <div className="h-16 w-16 bg-purple-700/40 rounded-md"></div>
                <p>xxxxxxxx</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AuthenticatedNav;
