import React from "react";

const HeroSection = () => {
  return (
    <div
      data-aos="fade-up"
      className="flex flex-col justify-center items-center text-center"
    >
      <h1 className="text-5xl lg:text-8xl font-bold leading-tight mb-4 lg:mb-6 max-w-5xl">
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

      <p className="text-lg lg:text-xl font-semibold text-white">
        {" "}
        Discover more about CSP-S{" "}
      </p>
    </div>
  );
};

export default HeroSection;
