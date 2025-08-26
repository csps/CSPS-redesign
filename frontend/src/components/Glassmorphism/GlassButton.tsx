import React from "react";

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glassCard?: number;
  borderType?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  className = "",
  glassCard = 1,
  borderType = "full",
}) => {
  return (
    <button
      onClick={onClick}
      className={`glass-card-${glassCard} relative rounded-${borderType} px-6 py-2 overflow-hidden group ${className}`}
    >
      {/* Glassy background */}
      <span
        className={`absolute inset-0 rounded-${borderType} backdrop-blur-[6px] border border-white/10  shadow-md group-hover:border-white/20 transition-all duration-200`}
      ></span>

      {/* Content layer */}
      <span className="relative z-10 text-white font-medium flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default GlassButton;
