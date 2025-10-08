import BACKGROUNDCSSLOGO from "../../../assets/logos/Background_Logo.png";
import { FaGreaterThan } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="flex w-full py-10 relative">
      <div className="absolute top-0 left-0 lg:static">
        <img
          src={BACKGROUNDCSSLOGO}
          alt="CSSLOGO"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="w-full lg:w-1/2 py-10 space-y-5 relative z-10">
        <p className="text-[2rem] md:text-[3rem] font-bold">
          Empowering curious minds to code, create, and shape the future of
          technology.
        </p>
        <p className="text-sm md:w-[30rem] text-[#D2D2D2]">
          CSP-S is a community of passionate learners, creators, and
          achievers—empowering each other to excel in academics and beyond.
        </p>

        <div className="flex mt-10 gap-5">
          <button className="bg-[#FDE006] px-7 py-4 text-black font-semibold rounded-xl">
            GET STARTED
          </button>
          <p className="flex items-center text-sm font-semibold text-[#D2D2D2] gap-2">
            Learn more <FaGreaterThan />
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
