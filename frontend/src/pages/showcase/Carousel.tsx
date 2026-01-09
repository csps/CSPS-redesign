import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const slides = Array.from({ length: 20 });

const CARD_W = 220; // Bigger width
const CARD_H = 300; // Bigger height (used in styles)
const GAP = 260; // Wider gap

const Carousel = () => {
  const [offset, setOffset] = useState(-8);

  useEffect(() => {
    // Adjusted timing for smooth 60fps animation
    const interval = setInterval(() => {
      setOffset((prev) => prev + 0.025);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[600px] w-full bg-[radial-gradient(circle_at_center_bottom,_#2a0a5e_0%,_#000000_100%)] overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full">
        {slides.map((_, i) => {
          const total = slides.length;

          // 1. Standard Linear Position
          let d = i - offset;

          if (d < -9) {
            d += total;
          }

          const abs = Math.abs(d);

          if (abs > 9) return null;

          const x = d * GAP;
          const y = abs * abs * 5;
          const rotate = d * 10;
          const scale = 1 - abs * 0.05;
          const opacity = 1 - abs * 0.15;

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-[100px]"
              style={{
                x: x - CARD_W / 2,
                y,
                rotate,
                scale,
                opacity,
                zIndex: Math.round(100 - abs * 10),
              }}
            >
              <div className="w-[220px] h-[300px] rounded-xl bg-gray-200 shadow-xl border border-white/20 flex items-center justify-center text-gray-400 text-2xl font-bold">
                {i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
