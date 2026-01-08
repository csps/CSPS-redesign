import React, { useState } from "react";
import { PiGearSixLight } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { LOGOS, NAVBARSAUTHENTICATED } from "./nav.config";

const AuthenticatedNav = () => {
  const locationPath = useLocation();
  
  const location = locationPath.pathname;

  return (
    <>
      <DesktopAuthenticatedNav location={location}/>
      <MobileAuthenticatedNav />
    </>
  );
};

const DesktopAuthenticatedNav = ({ location = "/dashboard" }: {location: string}) => {

  
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
          {NAVBARSAUTHENTICATED.map((navs, index) => { 
             
             const isActivate = location === navs.to;
            
            return (
            <Link
              to={navs.to}
              key={index}
              className={`relative cursor-pointer text-lg font-medium transition-all ${
               isActivate
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => console.log(navs.name)}
            >
              <div className="relative flex items-center">
                {isActivate && (
                  <>
                    <AnimatePresence mode="wait">
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
                    </AnimatePresence>

                    {navs.name === "Merchandise" && (
                      <div
                        className="text-xs absolute top-16 left-0 w-62 p-4 space-y-1  text-white bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/40
                          before:content-[''] before:absolute before:left-[-2px] before:border-l before:border-purple-200/40 before:rotate-180 before:z-100 before:top-1/2 before:-translate-y-1/2 before:w-[5px] before:h-8 before:bg-[#310d80] before:rounded-l-xs before:shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)] z-100"
                      >
                        <div className="tab-shape flex items-center gap-3 px-4 py-1 bg-[#2d0d70] text-white">
                          <div className="w-1 h-6 bg-gray-200 rounded-r-md"></div>
                          <span className="text-base font-medium">
                            Products
                          </span>
                        </div>

                        <div className="flex items-center gap-3 hover:bg-[#2d0d70]/60 rounded-xl px-4 py-3 transition-all cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-5h-8m0 0l3 3m-3-3l3-3"
                            />
                          </svg>
                          <span className="text-base font-medium">
                            Transaction
                          </span>
                        </div>

                        <div className="flex items-center gap-3 hover:bg-[#2d0d70]/60 rounded-xl px-4 py-3 transition-all cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h18l-1 9H4L3 3zm0 9h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm5 7h8"
                            />
                          </svg>
                          <span className="text-base font-medium">Cart</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isActivate && (
                  <img src={navs.icon} alt="" className="w-5 h-5 mr-2" />
                )}
                <span>{navs.name}</span>
              </div>
            </Link>
          ) 
          })}
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
      <button onClick={() => setIsOpen(!isOpen)} className="text-2xl p-2">
        {<FaBars />}
      </button>

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
