import React from "react";
import { LOGOS } from "../nav.config";

const LogoSection: React.FC = () => (
  <div className="hidden xl:flex items-center gap-6 px-4">
    {LOGOS.map((logo, index) => (
      <img
        key={`logo-${index}`}
        src={logo}
        alt={`Logo ${index + 1}`}
        className="w-10 h-auto object-contain"
      />
    ))}
  </div>
);

export default LogoSection;
