import CardSwap from "@/pages/About/components/CardSwap";
import Footer from "@/components/shared/Footer";
import HeroSection from "./components/HeroSection";
import Cards from "./components/Cards";
import GetToKnowCards from "./components/GetToKnowCards";
import OfficerCarousel from "./components/OfficerCarousel";
import RepsCarousel from "./components/RepsCarousel";
import GetToKnowCcsCards from "./components/GetToKnowCcsCards";
import AboutLayout from "@/components/Layouts/AboutLayout";
import { Link } from "react-router-dom";
import LogoSection from "@/components/shared/LogoSection";

const Index = () => {
  return (
    <AboutLayout >
        <LogoSection withNav={true} authenticated={false}/>

      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20 flex justify-center flex-col items-center ">

        <HeroSection />

        <div
          data-aos="fade-up"
          className="flex flex-col sm:flex-row gap-4 lg:gap-13 mb-12 lg:mb-24 py-10"
        >
          <button className="px-8 py-4 lg:px-10 lg:py-6 rounded-full border border-[#3B0AED] bg-transparent text-white text-lg lg:text-xl font-medium hover:bg-[#3B0AED]/10 transition-colors">
            Get Started
          </button>
          <Link
            to="/login"
            className="px-8 py-4 lg:px-10 lg:py-6 rounded-full border border-[rgba(207,176,19,0.83)] bg-transparent text-white text-lg lg:text-xl font-medium underline hover:bg-[rgba(207,176,19,0.1)] transition-colors"
          >
            Log in
          </Link>
        </div>

        <Cards />

        <GetToKnowCards />

        <div
          data-aos="fade-up"
          className="flex flex-col justify-center items-center space-y-5 w-full py-32"
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white">
            Be Part of Something Bigger
          </h2>
          <p className="text-base lg:text-lg text-gray-300 md:text-center ">
            Join CSP-S and grow with a community that celebrates diversity and
            supports your journey. And we will welcome you with open arms.
          </p>
        </div>

        <div data-aos="fade-up" className="w-full py-12 mb-25 md:mb-0">
          <div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white">
              Meet our dean and adviser
            </h2>
            <p className="text-lg lg:text-xl text-gray-300">
              Discover the guidance and vision that drive your academic and
              professional development.
            </p>
          </div>
          <CardSwap />
        </div>

        <OfficerCarousel />

        <RepsCarousel />

        <GetToKnowCcsCards />
      </div>

      <Footer withBackgroud={false} />
    </AboutLayout>
  );
};

export default Index;
