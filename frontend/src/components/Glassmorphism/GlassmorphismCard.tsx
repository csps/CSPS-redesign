import { motion } from "framer-motion";
import React from "react";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  custom?: number;
  variants?: any;
  initial?: string;
  animate?: string;
  className?: string;
  borderRadius?: number;
  glassCard?: number;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  custom,
  variants,
  initial = "hidden",
  animate = "visible",
  className,
  borderRadius = 34,
  glassCard = 1,
}) => {
  return (
    <motion.div
      className="relative h-full"
      custom={custom}
      variants={variants}
      initial={initial}
      animate={animate}
    >
      <div
        className={`glass-card-${glassCard} w-full  rounded-[${borderRadius}px]  p-6 relative overflow-hidden group `}
      >
        {/* Glassmorphism background */}
        <div
          className={`absolute inset-0 rounded-[${borderRadius}px]   backdrop-blur-[4px] border border-white/10 shadow-lg`}
        ></div>

        {/* Content layer */}
        <div
          className={
            "relative z-10 flex items-center justify-center gap-2 " + className
          }
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default GlassmorphismCard;
