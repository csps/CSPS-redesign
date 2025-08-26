import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-12 lg:mb-24"
    >
      <h1 className="text-4xl lg:text-[89px] font-bold leading-tight mb-4 lg:mb-6 max-w-5xl">
        <span className="text-white">Discover the world of </span>
        <span
          className="text-white"
          style={{
            background: `linear-gradient(270deg, rgba(255, 214, 2, 0.83) 0%, rgba(255, 204, 0, 0.85) 15.09%, rgba(255, 163, 0, 0.76) 27.38%, rgba(255, 97, 0, 0.65) 35.53%, rgba(255, 69, 0, 0.62) 47.6%, rgba(122, 0, 255, 0.74) 59.13%, rgba(87, 6, 204, 0.85) 68.03%, rgba(68, 10, 175, 0.91) 86.06%, #160651 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Computer Science
        </span>
      </h1>
      <p className="text-white text-xl lg:text-[40px] font-normal">
        Connect, Collaborate, and Grow Together
      </p>
    </motion.div>
  );
};

export default HeroSection;
