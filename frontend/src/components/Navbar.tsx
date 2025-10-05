import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

type NavProps = {
  LOGOS: string[];
  NAVBARS: { name: string }[];
};
const Navbar = () => {
  const LOGOS: string[] = [UCLOGO, CCSLOGO, CSPSLOGO];

  const NAVBARS: { name: string }[] = [
    { name: "Home" },
    { name: "About" },
    { name: "People" },
    { name: "Contact us" },
  ];

  return (
    <>
      <DesktopNav LOGOS={LOGOS} NAVBARS={NAVBARS} />
      <MobileNav LOGOS={LOGOS} NAVBARS={NAVBARS} />
    </>
  );
};

const DesktopNav: React.FC<NavProps> = ({ LOGOS, NAVBARS }) => {
  const navigate = useNavigate();
  return (
    <nav className="hidden  bg-white/4 backdrop-blur-lg border-1 border-white/20 rounded-[25px] shadow-lg py-4 px-8 max-w-full text-white lg:flex items-center justify-between">
      {/* Logos*/}
      <div className="flex">
        {LOGOS.map((logo, index) => (
          <img src={logo} key={index} />
        ))}
      </div>
      {/* Links */}
      <ul className="flex gap-2 ">
        <div className="flex gap-20">
          {NAVBARS.map((navs, index) => (
            <li key={index}>
              <p>{navs.name}</p>
            </li>
          ))}
        </div>
      </ul>
      {/* Login Button */}
      <div className="">
        <button
          onClick={() => navigate("/login")}
          className=" bg-white/5 backdrop-blur-[40px] border-t-2 border-l-1 border-r-1 border-[#9a52d1] px-4 py-2 text-xs rounded-lg cursor-pointer"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

const MobileNav: React.FC<NavProps> = ({ LOGOS, NAVBARS }) => {
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
              {NAVBARS.map((name, index) => (
                <p className="text-white text-xl mt-5" key={index}>
                  {name.name}
                </p>
              ))}
              <div className="mt-8">
                <button className=" bg-white/5 backdrop-blur-[40px] shadow-md px-4 py-2 text-lg rounded-lg w-full ">
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Navbar;
