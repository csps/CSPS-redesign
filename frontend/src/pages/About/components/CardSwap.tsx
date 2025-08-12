import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useState } from "react";
import Dean2 from "@/assets/Dean_CCS.png";
import Dean from "@/assets/DEAN_CS.png";
import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard"; // adjust path if needed

export default function CardSwap() {
  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwap = () => setIsSwapped(!isSwapped);

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-20 px-10 mb-10">
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
          <GlassmorphismCard
            glassCard={isSwapped ? 2 : 1}
            className="flex flex-col md:flex-row h-full p-0 overflow-hidden rounded-3xl"
          >
            {/* Image */}
            <div className="w-full md:w-[30%] h-52 md:h-auto flex items-center justify-center">
              <img
                src={Dean2}
                alt="Card 1"
                className="object-center md:object-cover h-full w-full rounded-md"
              />
            </div>

            {/* Text */}
            <div className="w-full md:w-[70%] flex flex-col items-start p-6 text-white text-xs md:text-lg font-semibold">
              <p className=" mb-4 ">
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
                <p className="text-xl font-bold">Neil A. Basabe, MIT</p>
                <p>Dean, College of Computer Studies</p>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="absolute inset-0 cursor-pointer "
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
          <GlassmorphismCard
            glassCard={isSwapped ? 1 : 2}
            className="flex flex-col md:flex-row h-full p-0 overflow-hidden rounded-3xl"
          >
            {/* Image */}
            <div className="w-full md:w-[30%] h-52 md:h-auto flex items-center justify-center">
              <img
                src={Dean}
                alt="Card 2"
                className="object-center md:object-cover h-full w-full rounded-md"
              />
            </div>

            {/* Text */}
            <div className="w-full md:w-[70%] flex flex-col items-start p-6 text-white text-xs md:text-lg font-semibold">
              <p className=" mb-4">
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
                <p className="text-xl font-bold">
                  Heubert Martinez Ferolino, MSTCS
                </p>
                <p>Program Head, Computer Science</p>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </div>
  );
}
