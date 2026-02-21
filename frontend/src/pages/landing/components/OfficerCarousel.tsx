import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Card } from "../../../components/CardStack";

interface OfficerCarouselProps {
  officers: Card[];
  onOfficerClick: (officer: Card) => void;
  year: string;
}

const OfficerCarousel = ({
  officers,
  onOfficerClick,
  year,
}: OfficerCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, itemsPerPage, officers.length]);

  const handlePrev = () => {
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(officers.length - itemsPerPage, prev + 1));
  };

  const visibleOfficers = officers.slice(index, index + itemsPerPage);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-12 py-8 flex flex-col items-center justify-center min-h-[400px]">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        disabled={index === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#1c1c1c]/80 border border-white/10 backdrop-blur-md transition-all ${
          index === 0
            ? "opacity-30 cursor-not-allowed text-gray-500"
            : "text-white hover:bg-[#ba44df] hover:text-black hover:scale-110 shadow-lg"
        }`}
        aria-label="Previous Officers"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={handleNext}
        disabled={index >= officers.length - itemsPerPage}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[#1c1c1c]/80 border border-white/10 backdrop-blur-md transition-all ${
          index >= officers.length - itemsPerPage
            ? "opacity-30 cursor-not-allowed text-gray-500"
            : "text-white hover:bg-[#ba44df] hover:text-black hover:scale-110 shadow-lg"
        }`}
        aria-label="Next Officers"
      >
        <ChevronRight size={32} />
      </button>

      {/* Cards Container */}
      <div
        ref={containerRef}
        className="flex gap-4 sm:gap-6 md:gap-8 w-full justify-center perspective-1000"
      >
        <AnimatePresence mode="popLayout">
          {visibleOfficers.map((officer) => (
            <motion.div
              key={`${year}-${officer.name}`}
              layoutId={`${year}-${officer.name}`}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOfficerClick(officer)}
              className="relative w-full sm:w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-2xl group border border-white/5 bg-[#141414]"
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full">
                {officer.image ? (
                  <img
                    src={officer.image}
                    alt={officer.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#141414] flex items-center justify-center">
                    <span className="text-4xl text-white/20 font-bold">
                      N/A
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ba44df] transition-colors leading-tight mb-1">
                  {officer.name}
                </h3>
                <p className="text-sm text-gray-300 font-medium tracking-wide uppercase">
                  {officer.role}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-xs font-semibold bg-[#ba44df] text-black px-3 py-1 rounded-full">
                    View Profile
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Indicators */}
      <div className="flex gap-2 mt-8">
        {Array.from({ length: Math.ceil(officers.length / itemsPerPage) }).map(
          (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                Math.floor(index / itemsPerPage) === i
                  ? "w-8 bg-[#ba44df]"
                  : "w-2 bg-white/20"
              }`}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default OfficerCarousel;
