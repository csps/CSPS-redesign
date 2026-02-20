import Footer from "../../components/Footer";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
// import OfficersSection from "./components/OfficersSection";
// import VolunteersSection from "./components/VolunteersSection";
// import DevsSection from "./components/DevsSection";
import CcsVisionMission from "./components/CcsVisionMission";
import Navbar from "../../components/Navbar";
import Layout from "../../components/Layout";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const peopleRef = useRef<HTMLDivElement>(null);

  // Scroll handler for navigation links
  const scrollToDiv = (section: string) => {
    switch (section) {
      case "home":
        homeRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "about":
        aboutRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "people":
        peopleRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  };

  const [isSticky, setIsSticky] = useState(false);
  const navHeightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Check if screen is Desktop (Tailwind lg breakpoint is usually 1024px)
      const isDesktop = window.innerWidth >= 1024;

      // 2. Only enable sticky if it's Desktop AND scrolled past 50px
      if (isDesktop && window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Add listeners for both scroll and resize (to handle orientation changes)
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-[rgb(65,22,156)] via-[#20113F] to-black overflow-x-hidden"
      ref={homeRef}
      style={{ touchAction: "pan-y" }}
    >
      {/* Prevent dragging and ensure full background coverage */}
      <style>{`
        body {
          background: linear-gradient(
            to bottom,
            rgb(65, 22, 156),
            rgb(32, 17, 63),
            black
          ) !important;
          overflow-x: hidden;
        }
        * {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-drag: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
      {/* First Layout */}
      <Layout containerScreen="900px" withFooter={false}>
        {/* Dynamic Sticky Wrapper */}
        <div
          ref={navHeightRef}
          // Placeholder: Reserves space when the real navbar becomes fixed to prevent "jumping"
          // We assume the navbar is approx 80px. Adjust h-[80px] if your nav is taller/shorter.
          className={`${isSticky ? "h-[80px]" : ""}`}
        >
          <div
            className={`
                ${
                  isSticky
                    ? // FIXED STATE (Desktop Only):
                      // - fixed top-0: Sticks to top
                      // - left-1/2 -translate-x-1/2: Centers it
                      // - max-w-[900px]: Matches Layout width manually
                      "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] z-50 backdrop-blur-sm shadow-md transition-all duration-300"
                    : // RELATIVE STATE (Mobile or Top of Page):
                      "relative w-full transition-all duration-300"
                }
              `}
          >
            <Navbar scrollToDiv={scrollToDiv} />
          </div>
        </div>

        {/* Padding added to separate Hero from Nav */}
        <div className="pt-24">
          <HeroSection />
        </div>
      </Layout>

      {/* Second Layout (Black Section) */}
      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white">
          <AboutSection refer={aboutRef as React.RefObject<HTMLDivElement>} />
          {/* <OfficersSection
            refer={peopleRef as React.RefObject<HTMLDivElement>}
          /> */}
          {/* <VolunteersSection />
          <DevsSection /> */}
          <CcsVisionMission />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
