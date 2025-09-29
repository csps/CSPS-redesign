import UCLOGO from "../../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../../assets/logos/CSPS PNG (1) 1.png";
import BACKGROUNDCSSLOGO from "../../assets/logos/Background_Logo.png";
import LAPTOPICON from "../../assets/icons/laptop.svg";
import RAINBOWICON from "../../assets/icons/rainbow.svg";
import ROCKETICON from "../../assets/icons/rocket.svg";
import DEAN1 from "../../assets/Dean/Dean 2.png";
import DEAN2 from "../../assets/Dean/Dean 2(1).png";
import { useState } from "react";
import { FaGreaterThan, FaTimes } from "react-icons/fa";
import ExpandableButton from "../../components/ExpandableButton";
import { CardStack, type Card } from "../../components/CardStack";
import Sample from "../../assets/Dean 2.png";
import Sample2 from "../../assets/Dean 2(1).png";
import Sample3 from "../../assets/Dean 2(2).png";
import Sample4 from "../../assets/Dean 2(3).png";
import Sample5 from "../../assets/Dean 22.png";
import CIRCLELOGO from "../../assets/icons/circol.svg";
import ROCKETLOGO from "../../assets/icons/rocket.svg";
import RAINBOWLOGO from "../../assets/icons/rainbow.svg";
import HANDSHAKELOGO from "../../assets/icons/Vector(1).svg";
import TARGETLOGO from "../../assets/icons/Vector(2).svg";
import Footer from "../../components/Footer";
import { FaBars } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const LOGOS = [UCLOGO, CCSLOGO, CSPSLOGO];
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const NAVBARS = [
    { name: "Home" },
    { name: "About" },
    { name: "People" },
    { name: "Contact us" },
  ];
  const CARDS: Card[] = [
    { name: "John Carl Atillo", role: "VP - External, CSPS-S", image: Sample },
    { name: "John Carl Atillo", role: "VP - External, CSPS-S", image: Sample2 },
    { name: "John Carl Atillo", role: "VP - External, CSPS-S", image: Sample3 },
    { name: "John Carl Atillo", role: "VP - External, CSPS-S", image: Sample4 },
    { name: "John Carl Atillo", role: "VP - External, CSPS-S", image: Sample5 },
  ];
  return (
    <div className="relative">
      {/* First Layout */}
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F]  to-black flex justify-center">
        <div className="w-full max-w-[90rem] p-6 text-white ">
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
              <button className=" bg-white/5 backdrop-blur-[40px] border-t-2 border-l-1 border-r-1 border-[#9a52d1] px-4 py-2 text-xs rounded-lg">
                Login
              </button>
            </div>
          </nav>

          {/* Mobile */}
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

          {/* First Section */}
          <div className="flex w-full py-10 relative">
            <div className="absolute top-0 left-0 xl:static">
              <img
                src={BACKGROUNDCSSLOGO}
                alt="CSSLOGO"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="w-full md:w-1/2 py-10 space-y-5 relative z-10">
              <p className="text-[2rem] md:text-[3rem] font-bold">
                Empowering curious minds to code, create, and shape the future
                of technology.
              </p>
              <p className="text-sm md:w-[30rem] text-[#D2D2D2]">
                CSP-S is a community of passionate learners, creators, and
                achievers—empowering each other to excel in academics and
                beyond.
              </p>

              <div className="flex mt-10 gap-5">
                <button className="bg-white px-7 py-4 text-black font-semibold rounded-xl">
                  GET STARTED
                </button>
                <p className="flex items-center text-sm font-semibold text-[#D2D2D2] gap-2">
                  Learn more <FaGreaterThan />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Layout */}
      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white">
          {/* Second Section */}
          <div className="w-full ">
            <div className="space-y-5">
              <p className="text-5xl font-semibold">Get to know CSP-S</p>
              <p className="md:w-[20rem] text-lg">
                Discover who we are and what we aspire.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 py-10">
              <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
                <div className="flex items-center justify-evenly gap-5">
                  <img src={LAPTOPICON} alt="LAPTAP" />
                  <p className="text-3xl">Who we are</p>
                </div>
                <p className="px-10 py-3 text-base/6">
                  We are the Computing Society of the Philippines - Students, an
                  organization led by students for all computer science
                  students, at the University of Cebu main campus.
                </p>
              </div>
              <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
                <div className="flex items-center justify-evenly gap-5">
                  <img src={RAINBOWICON} alt="RAINBAW" />
                  <p className="text-3xl">Our Mission</p>
                </div>
                <p className="px-10 py-3 text-base/6">
                  Fostering an inclusive, diverse, and supportive community in
                  the world of computing.
                </p>
              </div>
              <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
                <div className="flex items-center justify-evenly gap-5">
                  <img src={ROCKETICON} alt="RACKET" />
                  <p className="text-3xl">Why join us</p>
                </div>
                <div className="px-10 py-3 text-base/6">
                  <li>Meet like-minded CS peers</li>
                  <li>Explore your tech interests</li>
                  <li>Grow academically and professionally</li>
                </div>
              </div>
            </div>
            <p className="mt-20 w-full md:px-18 md:text-3xl  text-center ">
              Join CSP-S and grow with a community that celebrates diversity and
              supports your journey. And we will welcome you with open arms.
            </p>
          </div>

          {/* Third Section */}
          <div className="w-full mt-56">
            <div className="space-y-5">
              <p className="text-5xl font-semibold text-[#FDE006]">
                Meet our dean and adviser
              </p>
              <p className="md:w-[30rem] text-lg">
                Discover the guidance and vision that drive your academic and
                professional development.
              </p>
            </div>
            <div className="flex flex-wrap gap-20 py-10 w-full  justify-center">
              <div className="w-96 relative">
                <img src={DEAN1} alt="DEAN" className="h-full rounded-3xl " />
                <div className="absolute bottom-0 w-full h-20  max-w-sm p-4 rounded-b-3xl bg-gradient-to-r from-[#141414]/60 via-[#1c1c1c]/60 to-[#222222]/60 backdrop-blur-[6px] shadow-lg text-white py-2">
                  <p className="font-semibold">
                    Heubert Martinez Ferolino, MSTCS
                  </p>
                  <p className="text-sm text-[#FFFFFF]">
                    Dean, College of Computer Studies UC main campus
                  </p>
                  <ExpandableButton className=" bottom-14 right-5" />
                </div>
              </div>
              <div className="w-96 relative">
                <img src={DEAN2} alt="DEAN" className="h-full rounded-3xl " />
                <div className="absolute bottom-0 w-full h-20  max-w-sm p-4 rounded-b-3xl bg-gradient-to-r from-[#141414]/60 via-[#1c1c1c]/60 to-[#222222]/60 backdrop-blur-[6px] shadow-lg text-white py-2">
                  <p className="font-semibold">Neil A. Basabe, MIT</p>
                  <p className="text-sm text-[#FFFFFF]">
                    Dean, College of Computer Studies UC main campus
                  </p>
                  <ExpandableButton className=" bottom-14 right-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Fourth Section */}
          <div className="w-full flex flex-col items-center mt-56 overflow-x-hidden xl:overflow-visible px-4 sm:px-6 md:px-10 gap-12 xl:flex-row xl:gap-16">
            <div className="relative w-full flex flex-col items-center xl:items-start justify-center xl:h-64">
              <img
                src={BACKGROUNDCSSLOGO}
                alt="BACKGROUND"
                className="hidden  xl:block absolute right-0 xl:right-48"
              />

              <div className="text-center xl:text-left">
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[3.2rem] font-semibold text-[#FDE006]">
                  CSP-S Officers
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl  xl:max-w-sm mt-3">
                  Discover the leaders shaping CSP-S, and beyond.
                </p>
              </div>
            </div>
            <div className="w-full xl:w-auto flex justify-center">
              <CardStack cards={CARDS} />
            </div>
          </div>

          {/* Fifth Section */}
          <div className="w-full flex flex-col items-center mt-56 overflow-x-hidden xl:overflow-visible px-4 sm:px-6 md:px-10 gap-12 xl:flex-row xl:gap-16">
            <div className="relative w-full flex flex-col items-center xl:items-start justify-center xl:h-64">
              <img
                src={BACKGROUNDCSSLOGO}
                alt="BACKGROUND"
                className="hidden xl:block absolute right-0 xl:right-48"
              />

              <div className="text-center xl:text-left">
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[3.2rem] font-semibold text-[#FDE006]">
                  CSP-S Officers
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl  xl:max-w-sm mt-3">
                  Discover the leaders shaping CSP-S, and beyond.
                </p>
              </div>
            </div>
            <div className="w-full xl:w-auto flex justify-center">
              <CardStack cards={CARDS} />
            </div>
          </div>

          {/* Six Section */}
          <div className="w-full flex flex-col items-center mt-56 overflow-y-visible py-26 overflow-x-hidden xl:overflow-visible px-4 sm:px-6 md:px-10 gap-12 xl:flex-row xl:gap-16">
            <div className="relative w-full flex flex-col items-center xl:items-start justify-center xl:h-64">
              <img
                src={BACKGROUNDCSSLOGO}
                alt="BACKGROUND"
                className="hidden xl:block absolute right-0 xl:right-48"
              />

              <div className="text-center xl:text-left">
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[3.2rem] font-semibold text-[#FDE006]">
                  CSP-S Officers
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl  xl:max-w-sm mt-3">
                  Discover the leaders shaping CSP-S, and beyond.
                </p>
              </div>
            </div>
            <div className="w-full xl:w-auto flex justify-center">
              <CardStack cards={CARDS} />
            </div>
          </div>
          <div className="w-full py-16 mt-56">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white gap-5">
              {/* CCS Goals */}
              <div className="w-full md:max-w-[490px]">
                <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col gap-5">
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-5">
                      <img src={CIRCLELOGO} alt="global" />
                      <p className="text-3xl">CCS Goals</p>
                    </div>
                    <p className="px-4">
                      We aim to cultivate a teaching-learning environment that:
                    </p>
                  </div>
                  <div className="px-10">
                    <ul className="list-disc space-y-3">
                      <li>
                        Promotes scholarly endeavors for the promotion of moral,
                        social, cultural, and environmental interests.
                      </li>
                      <li>
                        Meets the demands of the industry in terms of technical,
                        personal, and interpersonal skills.
                      </li>
                      <li>
                        Conducts intellectual, technological, and significant
                        researches in computing.
                      </li>
                      <li>
                        Optimizes the use of appropriate technologies in the
                        delivery of instruction.
                      </li>
                      <li>
                        Provides opportunities for faculty and students to
                        participate in community extension services.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CCS Mission */}
              <div className="w-full md:max-w-[450px] space-y-5">
                <div>
                  <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col">
                    <div className="flex items-center gap-5 w-full">
                      <img src={RAINBOWLOGO} alt="Vector" />
                      <p className="text-3xl">CCS Mission</p>
                    </div>
                    <div className="px-4 py-2">
                      <p>
                        We envision being the hub of quality,
                        globally-competitive and socially-responsive information
                        technology education.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 w-full flex-col gap-5">
                    <div className="flex flex-col gap-5 w-full">
                      <div className="flex items-center gap-2">
                        <img src={TARGETLOGO} alt="Target" />
                        <p className="text-3xl">CCS Goals</p>
                      </div>
                      <p className="px-4 py-2 text-justify w-full">
                        We commit to continuously:
                      </p>
                    </div>
                    <div className="px-5">
                      <ul className="list-disc space-y-3">
                        <li>
                          Offer relevant programs that mold well-rounded
                          computing professionals;
                        </li>
                        <li>
                          Engage in accreditation and quality standards; and
                        </li>
                        <li>Facilitate in building an IT-enabled nation.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* CCS Values */}
              <div className="w-full md:max-w-[490px]">
                <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col gap-5">
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-5">
                      <img src={HANDSHAKELOGO} alt="Handshake" />
                      <p className="text-3xl">CCS Values</p>
                    </div>
                    <p className="px-4">
                      These are the core values that CCS believes in:
                    </p>
                  </div>
                  <div className="px-10">
                    <ul className="list-disc space-y-3">
                      <li>
                        Initiative (inceptum) wit, practicality, ingenuity
                      </li>
                      <li>
                        Innovation (innovatio) technology, creativity,
                        resourcefulness
                      </li>
                      <li>
                        Integrity (integritas) honesty, trustworthiness,
                        reliability
                      </li>
                      <li>
                        Intelligence (intelligentia) wisdom, knowledge,
                        expertise
                      </li>
                      <li>
                        Interdependence (interdependentia) teamwork,
                        cooperation, unity
                      </li>
                      <li>
                        Industry (industria) diligence, perseverance, hard work
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
