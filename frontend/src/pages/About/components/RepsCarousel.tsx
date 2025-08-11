import { Carousel } from "@/components/shared/Carousel";
import React from "react";

const RepsCarousel = () => {
  return (
    <div data-aos="fade-up" className="w-full  py-16">
      <div className="mb-10">
        <h1 className="text-6xl font-bold text-white">Meet our CSPS-S Reps</h1>
        <p className="text-lg text-gray-300">
          Discover the student voices leading CSP-S.
        </p>
      </div>
      <Carousel />
    </div>
  );
};

export default RepsCarousel;
