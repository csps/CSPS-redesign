import React from "react";

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
    className="overflow-x-hidden"
      style={{
        backgroundImage: `
      radial-gradient(126.59% 74% at 81.35% 27.09%, rgba(193, 19, 251, 0.10) 0%, rgba(193, 19, 251, 0.08) 27.88%, rgba(193, 19, 251, 0.00) 42.03%),
      radial-gradient(69.42% 47.34% at -0.14% 31.81%, rgba(255, 204, 0, 0.20) 0%, rgba(207, 176, 19, 0.15) 29.33%, rgba(194, 164, 18, 0.13) 43.75%, rgba(126, 99, 10, 0.00) 100%),
      linear-gradient(2deg, #000 -7.33%, #0A0422 49.9%, #0C042A 90.5%, #100536 108.96%, rgba(29, 10, 100, 0.11) 136.7%, rgba(32, 11, 108, 0.04) 174.4%, rgba(33, 12, 113, 0.00) 215.72%)`,
      }}
    >
      {children}
    </div>
  );
};

export default AboutLayout;
