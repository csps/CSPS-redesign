import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";

const ActiveIndicator: React.FC = () => (
  <AnimatePresence mode="wait">
    <motion.div
      key="line"
      {...ANIMATION_CONFIG.line}
      className="absolute top-[-8px] left-0 h-[2px] bg-gray-400"
    />
    <motion.div
      key="trapezoid"
      {...ANIMATION_CONFIG.trapezoid}
      className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-[3px] bg-white [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]"
    />
  </AnimatePresence>
);

export default ActiveIndicator;
