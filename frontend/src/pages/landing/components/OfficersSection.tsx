import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BACKGROUNDCSSLOGO from "../../../assets/logos/Background_Logo.png";
import OfficersGroupPic from "../../../assets/officers/OFFICERS PIC.jpg";
import { type Card } from "../../../components/CardStack";
import OfficerCarousel from "./OfficerCarousel";
import OfficerProfileModal from "./OfficerProfileModal";

// Dynamically import all officer images from year-specific folders
const officers2025Modules = import.meta.glob<{ default: string }>(
  "../../../assets/officers/2025/*.jpg",
  { eager: true },
);

const officers2024Modules = import.meta.glob<{ default: string }>(
  "../../../assets/officers/2024/*.jpg",
  { eager: true },
);

const positionOrder = [
  "President",
  "VP Internal",
  "VP External",
  "Secretary",
  "Treasurer",
  "Assistant Treasurer",
  "Auditor",
  "PIO",
  "PRO",
  "CHIEF VOLUNTEER",
  "4TH YEAR REP",
  "3RD YEAR REP",
  "2ND YEAR REP",
  "1ST YEAR REP",
];

const createOfficerList = (
  modules: Record<string, { default: string }>,
): Card[] => {
  return Object.entries(modules)
    .filter(([path]) => !path.includes("OFFICERS PIC")) // Exclude the group pic
    .map(([path, module]) => {
      const filename = path.split("/").pop()?.replace(".jpg", "") || "";
      const position = filename.replace(/[-_]/g, " ");

      return {
        name: position, // Name inferred from filename
        role: "CSPS Officer", // Placeholder role
        image: module.default,
      };
    })
    .sort((a, b) => {
      // Standardize to lowercase for safe matching
      const indexA = positionOrder.findIndex(
        (pos) => pos.toLowerCase() === a.name.toLowerCase(),
      );
      const indexB = positionOrder.findIndex(
        (pos) => pos.toLowerCase() === b.name.toLowerCase(),
      );

      // If a position isn't found in the array, assign it a high number (999) so it drops to the bottom
      const rankA = indexA === -1 ? 999 : indexA;
      const rankB = indexB === -1 ? 999 : indexB;

      return rankA - rankB;
    });
};

const officersByYear: Record<string, Card[]> = {
  current: createOfficerList(officers2025Modules),
  "2024": createOfficerList(officers2024Modules),
  "2023": [], // Placeholder for 2023 officers
};

const yearOrder = ["current", "2024", "2023"];

const OfficersSection = ({
  refer,
}: {
  refer: React.RefObject<HTMLDivElement>;
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("current");
  const [selectedOfficer, setSelectedOfficer] = useState<Card | null>(null);

  const years = yearOrder;

  return (
    <>
      {/* Landing Page Hero Section */}
      <div
        className="w-full flex flex-col items-center mt-20 overflow-x-hidden xl:overflow-visible px-4 sm:px-6 md:px-10 gap-12  xl:gap-16 relative"
        ref={refer}
      >
        <div className="relative w-full flex flex-col items-center justify-center xl:h-50">
          <img
            src={BACKGROUNDCSSLOGO}
            alt="Background Logo"
            className="hidden xl:block absolute right-0 xl:right-48 -z-10 opacity-50"
          />

          <div className="text-center ">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[3.2rem] font-bold text-[#ba44df] tracking-tight">
              OFFICERS
            </h2>
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl xl:max-w-sm mt-4 font-light leading-relaxed">
              Meet the dedicated leaders shaping the future of CSPS.
            </p>
          </div>
        </div>

        <div className="w-full xl:w-auto flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer relative group rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#ba44df]/20 max-w-2xl w-full"
            onClick={() => setIsGalleryOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsGalleryOpen(true);
            }}
            aria-label="Open Officers Gallery"
          >
            <img
              src={OfficersGroupPic}
              alt="CSPS Officers Group"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-[#ba44df] text-lg font-bold border-2 border-[#ba44df] px-8 py-3 rounded-full bg-black/40 backdrop-blur-sm">
                View All Officers
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 md:p-10 border-b border-white/5 bg-[#0a0a0a]">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#ba44df]">
                  Officers
                </h2>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                  Explore the legacy of leadership through the years.
                </p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-white/60 hover:text-[#ba44df] transition-colors p-2 rounded-full hover:bg-white/5"
                aria-label="Close Gallery"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Timeline Selector */}
            <div className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 py-10">
              <div className="max-w-3xl mx-auto relative px-12">
                {/* Connecting Line */}
                <div className="absolute top-[10px] left-16 right-16 h-[2px] bg-white/10 -translate-y-1/2" />

                <div className="flex justify-between items-start relative">
                  {years.map((year) => {
                    const isSelected = selectedYear === year;
                    return (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className="group flex flex-col items-center focus:outline-none cursor-pointer"
                      >
                        {/* Circle Node */}
                        <div className="relative mb-4">
                          <div
                            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 relative
                              ${
                                isSelected
                                  ? "bg-[#ba44df] border-[#ba44df] shadow-[0_0_15px_rgba(186,68,223,0.5)] scale-125"
                                  : "bg-[#0a0a0a] border-gray-600 group-hover:border-gray-400 scale-100"
                              }`}
                          />
                        </div>

                        {/* Label */}
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-xl font-bold tracking-tight transition-colors duration-300
                                ${
                                  isSelected
                                    ? "text-[#ba44df]"
                                    : "text-gray-600 group-hover:text-gray-400"
                                }`}
                          >
                            {year === "current" ? "Current" : year}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-widest mt-1 transition-colors duration-300 ${isSelected ? "text-white/60" : "text-white/10"}`}
                          >
                            {year === "current" ? "Term" : "Former"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="flex-1 flex items-center justify-center relative w-full p-4 md:p-10 min-h-[60vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {officersByYear[selectedYear]?.length > 0 ? (
                    <OfficerCarousel
                      officers={officersByYear[selectedYear]}
                      onOfficerClick={setSelectedOfficer}
                      year={selectedYear}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-white/30 text-2xl font-light">
                        No records found for {selectedYear}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal (Nested) */}
      <AnimatePresence>
        {selectedOfficer && (
          <OfficerProfileModal
            officer={selectedOfficer}
            onClose={() => setSelectedOfficer(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OfficersSection;
