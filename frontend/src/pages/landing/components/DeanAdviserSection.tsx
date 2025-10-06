import DEAN1 from "../../../assets/Dean/Dean 2.png";
import DEAN2 from "../../../assets/Dean/Dean 2(1).png";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useState } from "react";

const DeanAdviserSection = () => {
  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwap = () => setIsSwapped(!isSwapped);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-20 px-4 sm:px-6 mb-10">
      <div className="relative w-full h-auto min-h-[500px] sm:min-h-[450px]">
        {/* Card 1 */}
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={handleSwap}
          animate={{
            zIndex: isSwapped ? 0 : 1,
            rotate: isSwapped ? -10 : 0,
            x: isSwapped ? -30 : 0,
            y: isSwapped ? 20 : 0,
            scale: isSwapped ? 0.95 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`flex flex-col md:flex-row h-full p-0 overflow-hidden rounded-3xl border-t border-b border-gray-400 ${isSwapped ? "blur-md" : ""}`}
          >
            <div className="w-full md:w-[30%] h-40 sm:h-52 md:h-auto flex items-center justify-center">
              <img
                src={DEAN1}
                alt="Card 1"
                className="object-center md:object-cover h-full w-full rounded-md"
              />
            </div>

            <div className="w-full md:w-[70%] flex flex-col items-start p-4 sm:p-6 text-white text-xs sm:text-sm md:text-lg font-semibold leading-relaxed">
              <p className="mb-4 text-justify text-[12px] sm:text-sm md:text-base ">
                <Typewriter
                  words={[
                    `Welcome to the University of Cebu and the world of Computer Science. We provide quality education, expert faculty, and modern facilities to prepare you for academic and career success. Engage in research, internships, hackathons, and ICT events to grow, stand out, and build valuable connections. We're here to support you every step of the way.`,
                  ]}
                  loop={1}
                  cursor
                  cursorStyle="|"
                  typeSpeed={150}
                  deleteSpeed={50}
                  delaySpeed={500}
                />
              </p>
              <div className="mt-auto">
                <p className="text-sm md:text-xl font-bold">
                  Heubert Martinez Ferolino, MSTCS
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                  Program Head, Computer Science
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={handleSwap}
          animate={{
            zIndex: isSwapped ? 1 : 0,
            rotate: isSwapped ? 0 : 10,
            x: isSwapped ? 0 : 30,
            y: isSwapped ? 0 : 20,
            scale: isSwapped ? 1 : 0.95,
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`flex flex-col md:flex-row h-full p-0 overflow-hidden rounded-3xl border-t border-b border-gray-400 ${isSwapped ? "" : "blur-md"}`}
          >
            <div className="w-full md:w-[30%] h-40 sm:h-52 md:h-auto flex items-center justify-center">
              <img
                src={DEAN2}
                alt="Card 2"
                className="object-center md:object-cover h-full w-full rounded-md"
              />
            </div>

            <div className="w-full md:w-[70%] flex flex-col items-start p-4 sm:p-6 text-white text-xs sm:text-sm md:text-lg font-semibold leading-relaxed">
              <p className="mb-4 text-justify text-[12px] sm:text-sm md:text-base">
                <Typewriter
                  words={[
                    `On behalf of the faculty and staff, welcome to the University of Cebu and the vibrant world of Computer Science!
                    We are dedicated to helping you succeed through hands-on learning, expert guidance, and real-world opportunities.
                    Whether it's research, hackathons, or internships, we encourage you to explore and grow. We're here to support you—every step of the way.`,
                  ]}
                  loop={1}
                  cursor
                  cursorStyle="|"
                  typeSpeed={150}
                  deleteSpeed={50}
                  delaySpeed={500}
                />
              </p>
              <div className="mt-auto">
                <p className="text-sm md:text-xl font-bold">
                  Neil A. Basabe, MIT
                </p>
                <p className="text-xs sm:text-sm md:text-base">
                  Dean, College of Computer Studies
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeanAdviserSection;
