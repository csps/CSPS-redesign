import Logo from "@/assets/CSPS_LOGO.png";
import HeroSection from "@/pages/Home/components/HeroSection";
import Footer from "@/components/shared/Footer";
import Layout from "@/components/Layouts/Layout";
import { Link } from "react-router-dom";


const Index = () => {
  return (
    <Layout>
      {/* CSPS Background Image */}

      {/* Logo Section */}

      {/* Main Content */}
      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20">
        <div className="absolute md:top-[-12rem]  right-0 w-[84vw] h-[84vw] max-w-[950px] max-h-[950px] lg:top-0 lg:right-[-17rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
          />
        </div>

        <div className="max-w-6xl">
          {/* Hero Section */}
          <HeroSection />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-13 mb-12 lg:mb-24">
            <button className=" px-8 py-4 lg:px-10 lg:py-6 rounded-full border border-[#3B0AED] bg-transparent text-white text-lg lg:text-2xl font-normal hover:bg-[#3B0AED]/10 transition-colors">
              Download App
            </button>
            <button className="px-8 py-4 lg:px-10 lg:py-6 rounded-full border border-[rgba(207,176,19,0.83)] bg-transparent text-white text-lg lg:text-2xl font-normal underline hover:bg-[rgba(207,176,19,0.1)] transition-colors text-center z-100">
              <Link to="/login"> Log in</Link>
            </button>
          </div>

          {/* Feature Cards 
          <FeatureCards cards={cards} /> */}
        </div>
      </div>

      {/* Foot
      er */}
      <Footer />
    </Layout>
  );
};

export default Index;
