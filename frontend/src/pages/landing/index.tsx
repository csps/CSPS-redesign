import Footer from "../../components/Footer";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import DeanAdviserSection from "./components/DeanAdviserSection";
import OfficersSection from "./components/OfficersSection";
import VolunteersSection from "./components/VolunteersSection";
import DevsSection from "./components/DevsSection";
import CcsVisionMission from "./components/CcsVisionMission";
import Navbar from "../../components/Navbar";
import Layout from "../../components/Layout";

const Index = () => {
  return (
    <div className="relative">
      {/* First Layout */}

      <Layout containerScreen="900px" withFooter={false}>
        {/* Navigatiosn */}
        <Navbar />

        {/* First Section - First Page*/}
        <HeroSection />
      </Layout>

      {/* Second Layout */}
      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white">
          {/* Second Section - Who We Are*/}
          <AboutSection />

          {/* Third Section - CSP-S Officers */}
          <OfficersSection />

          {/* Fourth Section - Voluteers*/}
          <VolunteersSection />

          {/* Fifth Section - Dev Team*/}
          <DevsSection />

          {/* Sixth Section */}
          <CcsVisionMission />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
