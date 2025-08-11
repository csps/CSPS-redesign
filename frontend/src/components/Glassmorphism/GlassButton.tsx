import React from "react";

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`glass-card relative rounded-full px-6 py-2 overflow-hidden group ${className}`}
    >
      {/* Glassy background */}
      <span className="absolute inset-0 rounded-full backdrop-blur-[6px] border border-white/10  shadow-md group-hover:border-white/20 transition-all duration-200"></span>

      {/* Content layer */}
      <span className="relative z-10 text-white font-medium flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default GlassButton;
