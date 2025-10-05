import React from "react";
import Navbar from "../../components/Navbar";
import SAMPLEIMAGE from "../../assets/sampleImage.png";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative  w-full max-w-[90rem] p-6 text-white">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, index) => (
            <Link
              to={`/events/view/${n}`}
              key={n}
              className="bg-purple-600/40 p-2 relative rounded-xl overflow-hidden group"
            >
              <img
                src={SAMPLEIMAGE}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 hover:cursor-pointer"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
