import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const slides = Array.from({ length: 20 });

const CARD_W = 220;
//const CARD_H = 300;
const GAP = 260;

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const [offset, setOffset] = useState(-4);

  useEffect(() => {
    let animationFrameId: number;

    const updateOffset = () => {
      setOffset((prev) => prev + 0.025);
      animationFrameId = requestAnimationFrame(updateOffset);
    };

    animationFrameId = requestAnimationFrame(updateOffset);

    return () => cancelAnimationFrame(animationFrameId); // Clean up on unmount
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full">
        {slides.map((_, i) => {
          const total = slides.length;

          // 1. Calculate raw distance (Linear)
          let d = i - offset;

          // 2. INFINITE LOOP LOGIC (One-Way)
          if (d < -9) {
            const remainder = d % total;
            if (remainder < -9) {
              d = remainder + total;
            } else {
              d = remainder;
            }
          }

          const abs = Math.abs(d);

          // Optimization: Hide cards far off-screen
          if (abs > 9) return null;

          const x = d * GAP;
          const y = abs * abs * 15;
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
              }}
            >
              <div className="w-[220px] h-[300px] rounded-xl bg-gray-200 shadow-xl border border-white/20 flex items-center justify-center text-gray-400 text-2xl font-bold">
                {i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default Carousel;
