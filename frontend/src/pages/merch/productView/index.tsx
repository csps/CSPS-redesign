import React, { useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { BiSolidCartAdd } from "react-icons/bi";
import Footer from "../../../components/Footer";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const items = [1, 2, 3, 4, 5];

  const handleClick = (index: number) => setActiveIndex(index);

  const getSlidePosition = (index: number) => {
    let diff = index - activeIndex;
    if (diff < -2) diff += items.length;
    if (diff > 2) diff -= items.length;

    const positions: Record<
      number,
      { translateY: number; scale: number; opacity: number; z: number }
    > = {
      "-2": { translateY: -240, scale: 0.7, opacity: 0.4, z: 5 },
      "-1": { translateY: -120, scale: 0.85, opacity: 0.7, z: 10 },
      0: { translateY: 0, scale: 1.1, opacity: 1, z: 20 },
      1: { translateY: 120, scale: 0.85, opacity: 0.7, z: 10 },
      2: { translateY: 240, scale: 0.7, opacity: 0.4, z: 5 },
    };

    return positions[diff];
  };

  return (
    <>
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative w-full max-w-[90rem] p-6 text-white">
        <AuthenticatedNav />

        {/* === Main Layout === */}
        <div className="flex flex-col lg:flex-row justify-between w-full gap-12 lg:gap-16">
          {/* === Left: Carousel (Desktop only) === */}
          <div className="hidden lg:flex justify-center items-center gap-6 flex-shrink-0">
            {/* Pagination Dots */}
            <div className="flex flex-col justify-center gap-3">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex
                      ? "bg-white opacity-100 scale-125"
                      : "bg-white opacity-40 hover:opacity-70"
                  }`}
                />
              ))}
            </div>

            {/* Vertical Carousel (Desktop) */}
            <div className="relative w-[250px] h-[700px] overflow-visible">
              {items.map((n, index) => {
                const pos = getSlidePosition(index);
                const isActive = index === activeIndex;
                return (
                  <div
                    key={n}
                    onClick={() => handleClick(index)}
                    className="absolute top-1/2 left-1/2 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer backdrop-blur-md"
                    style={{
                      transform: `translate(-50%, calc(-50% + ${pos.translateY}px)) scale(${pos.scale})`,
                      opacity: pos.opacity,
                      zIndex: pos.z,
                    }}
                  >
                    <div
                      className={`w-[200px] h-[200px]  rounded-2xl flex flex-col justify-center items-center transition duration-500 ${
                        isActive
                          ? "bg-purple-200/20 border-t-2 border-b-2 border-purple-200/40"
                          : "bg-purple-200/5 border-t-2 border-b-2 border-purple-200/40"
                      }`}
                    >
                      <img
                        src={SAMPLE}
                        alt={`slide-${n}`}
                        className={`w-[80%] h-auto object-contain ${
                          isActive && "scale-150"
                        }`}
                      />
                      <p className="text-sm mt-2 opacity-80">{n}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-10 lg:py-20 w-full">
            {/* === Preview Image === */}
            <img
              src={SAMPLE}
              alt="Preview"
              className="w-[85%] max-w-[400px] rounded-xl object-contain"
            />

            {/* === Horizontal Carousel (Mobile) === */}
            <div className="lg:hidden w-full flex flex-col items-center mt-6">
              {/* Scrollable Row */}
              <div className="flex justify-center gap-3 overflow-x-scroll scrollbar-hidden px-4 py-4 w-full ">
                {items.map((n, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={n}
                      onClick={() => handleClick(index)}
                      className={`flex-shrink-0 w-[110px] h-[110px] rounded-xl flex flex-col justify-center items-center transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-purple-200/20 border-t-2 border-b-2 border-purple-200/40 scale-105"
                          : "bg-white/5 border-t-2 border-b-2 border-purple-200/40 opacity-70"
                      }`}
                    >
                      <img
                        src={SAMPLE}
                        alt={`slide-${n}`}
                        className={`w-[75%] h-auto object-contain ${
                          isActive && "scale-110"
                        }`}
                      />
                      <p className="text-[11px] mt-2 opacity-80">{n}</p>
                    </div>
                  );
                })}
              </div>

              {/* === Navigation Dots === */}
              <div className="flex justify-center gap-2 mt-4">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "bg-white opacity-100 scale-125"
                        : "bg-white/40 hover:opacity-70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* === Right: Info === */}
          <div className="flex flex-col gap-6 flex-1 text-left py-10 lg:py-20">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-widest">
                BSCS Uniform
              </h1>
              <p className="text-lg text-purple-200">₱ 800</p>
              <p className="text-sm text-gray-300">Stock: 500</p>
            </div>

            <div>
              <p className="font-medium mt-6">Color:</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white rounded-full border"></div>
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <p className="font-medium mt-6">Size:</p>
              <div className="flex gap-3 flex-wrap">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <div
                    key={size}
                    className="border-b-4 transition-all px-4 py-1 cursor-pointer hover:border-purple-300"
                  >
                    <p className="text-lg font-semibold">{size}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 mt-10">
              <button className="text-black bg-white flex items-center justify-center gap-2 px-4 py-3 rounded-full">
                <BiSolidCartAdd className="text-xl" />
                <span className="font-semibold">Add to cart</span>
              </button>
              <button className="text-black bg-[#FDE006] px-6 py-3 rounded-full">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Index;
