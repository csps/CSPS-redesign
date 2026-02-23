import BACKGROUNDCSSLOGO from "../../../assets/logos/Background_Logo.png";
import { FaGreaterThan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  scrollToDiv: (section: string) => void;
}

const HeroSection = ({ scrollToDiv }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {
    scrollToDiv("about");
  };

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
          <button
            onClick={handleGetStarted}
            className="bg-[#FDE006] px-7 py-4 text-black font-semibold rounded-xl hover:bg-[#FDE006]/90 transition-colors cursor-pointer"
          >
            GET STARTED
          </button>
          <button
            onClick={handleLearnMore}
            className="flex items-center text-sm font-semibold text-[#D2D2D2] gap-2 hover:text-white transition-colors cursor-pointer"
          >
            Learn more <FaGreaterThan />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
