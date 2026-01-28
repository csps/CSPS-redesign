import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { LOGOS } from "./nav.config";

type NavProps = {
  LOGOS: string[];
  NAVBARS: { name: string }[];
  scrollToDiv?: (section: string) => void;
  HandleNavigate?: (name: string) => void;
};

const Navbar = ({
  scrollToDiv,
}: {
  scrollToDiv?: (section: string) => void;
}) => {
  const navigate = useNavigate();

  const NAVBARS: { name: string }[] = [
    { name: "Home" },
    { name: "About" },
    { name: "People" },
    { name: "Contact us" },
  ];

  const HandleNavigate = (name: string) => {
    if (name !== "Contact us") {
      if (scrollToDiv) scrollToDiv(name.toLowerCase());
      return;
    }

    navigate("/contact-us");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <DesktopNav
        LOGOS={LOGOS}
        NAVBARS={NAVBARS}
        HandleNavigate={HandleNavigate}
      />
      <MobileNav
        LOGOS={LOGOS}
        NAVBARS={NAVBARS}
        HandleNavigate={HandleNavigate}
      />
    </>
  );
};

const DesktopNav: React.FC<NavProps> = ({ LOGOS, NAVBARS, HandleNavigate }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 hidden  bg-white/4 backdrop-blur-lg border-1 border-white/20 rounded-[25px] shadow-lg py-4 px-8 max-w-full text-white lg:flex items-center justify-between">
      {/* Logos*/}
      <div className="flex">
        {LOGOS.map((logo, index) => (
          <img src={logo} key={index} />
        ))}
      </div>
      {/* Links */}
      <ul className="flex gap-2 ">
        <div className="flex items-center justify-center gap-18">
          {NAVBARS.map((navs, index) => (
            <li
              key={index}
              className="relative flex items-center justify-center hover:cursor-pointer"
              onClick={() => HandleNavigate && HandleNavigate(navs.name)}
            >
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

const MobileNav: React.FC<NavProps> = ({ LOGOS, NAVBARS, HandleNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="flex  lg:hidden  ">
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
                <p
                  className="text-white text-xl mt-5"
                  key={index}
                  onClick={() => HandleNavigate && HandleNavigate(name.name)}
                >
                  {name.name}
                </p>
              ))}
              <div className="mt-8">
                <button
                  className=" bg-white/5 backdrop-blur-[40px] shadow-md px-4 py-2 text-lg rounded-lg w-full "
                  onClick={() => navigate("/login")}
                >
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
