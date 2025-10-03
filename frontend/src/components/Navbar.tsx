import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const LOGOS = [UCLOGO, CCSLOGO, CSPSLOGO];
  const navigate = useNavigate();

  const NAVBARS = [
    { name: "Home" },
    { name: "About" },
    { name: "People" },
    { name: "Contact us" },
  ];
  
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
        <button onClick={() => navigate('/login')} className=" bg-white/5 backdrop-blur-[40px] border-t-2 border-l-1 border-r-1 border-[#9a52d1] px-4 py-2 text-xs rounded-lg cursor-pointer">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
