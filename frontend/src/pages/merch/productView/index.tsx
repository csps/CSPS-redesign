import React, { useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { BiSolidCartAdd } from "react-icons/bi";
import Footer from "../../../components/Footer";
import Layout from "../../../components/Layout";
import DesktopCarousel from "./components/DesktopCarousel";
import MobileCarousel from "./components/MobileCarousel";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const items: number[] = [1, 2, 3, 4, 5];

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
    <Layout>
      <AuthenticatedNav />

      {/* === Main Layout === */}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left */}
        <DesktopCarousel
          items={items}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          getSlidePosition={getSlidePosition}
        />

        {/* Center */}
        <div className="flex flex-col items-center justify-center flex-1 py-10 lg:py-20">
          <img
            src={SAMPLE}
            alt="Preview"
            className="w-[85%] max-w-[400px] rounded-xl object-contain"
          />

          <MobileCarousel
            items={items}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>

        {/* Right  == Info*/}
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
    </Layout>
  );
};

export default Index;
