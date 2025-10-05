import Footer from "../../components/Footer";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import DeanAdviserSection from "./components/DeanAdviserSection";
import OfficersSection from "./components/OfficersSection";
import VolunteersSection from "./components/VolunteersSection";
import DevsSection from "./components/DevsSection";
import CcsVisionMission from "./components/CcsVisionMission";
import Navbar from "../../components/Navbar";
import MobileNav from "../../components/MobileNav";

const Index = () => {
  /*const NAVBARS = [
    { name: "Home" },
    { name: "Forum" },
    { name: "Merchandise" },
    { name: "Bulletin" },
    { name: "Events" },
    { name: "Resources" },
    { name: "Showcase" },
    { name: "Contact Us" },
  ]; */

  return (
    <div className="relative">
      {/* First Layout */}

      <div className="h-[900px] w-full bg-gradient-to-b from-[#41169C] via-[#20113F]  to-black flex justify-center">
        <div className="w-full max-w-[90rem] p-6 text-white ">
          {/* Navigatiosn */}
          <Navbar />
          <MobileNav />

          {/* First Section - First Page*/}
          <HeroSection />
        </div>
      </div>

      {/* Second Layout */}
      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white">
          {/* Second Section - Who We Are*/}
          <AboutSection />

          {/* Third Section - Dean & Adviser*/}
          <DeanAdviserSection />

          {/* Fourth Section - CSP-S Officers */}
          <OfficersSection />

          {/* Fifth Section - Voluteers*/}
          <VolunteersSection />

          {/* Sixth Section - Dev Team*/}
          <DevsSection />

          {/* Seventh Section */}
          <CcsVisionMission />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
