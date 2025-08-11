import React from "react";

const ActionButtons = () => {
  return (
    <button className="relative px-6 py-3 rounded-[20px] bg-white/10 backdrop-blur-md border border-white/10 shadow-md text-white font-medium overflow-hidden group transition-all duration-300 hover:bg-white/20">
      <span className="relative z-10">Click Me</span>

      {/* optional shine overlay */}
      <span className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"></span>
    </button>
  );
};

export default ActionButtons;
