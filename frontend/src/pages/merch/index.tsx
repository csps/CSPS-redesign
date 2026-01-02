import React from "react";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import { button } from "framer-motion/client";
import Footer from "../../components/Footer";
import SAMPLE from "../../assets/image 8.png";
import Layout from "../../components/Layout";

const index = () => {
  const TAGS = ["ALL", "T-SHIRT", "PINS", "STICKERS"];

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="mt-5">
        <div className="flex flex-wrap gap-5">
          {TAGS.map((t) => (
            <button
              key={t}
              className="border-t border-b border-purple-200/40 rounded-full px-7 py-2"
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5 gap-10 py-26">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
            <div
              className="group w-full bg-[#290B54] p-4 flex flex-col justify-center border border-purple-200/40 rounded-2xl 
             transition-transform duration-300 hover:scale-110 relative z-10 cursor-pointer"
              key={c}
            >
              <div className="w-full flex justify-center">
                <img
                  src={SAMPLE}
                  alt=""
                  className="w-[70%] transition-transform duration-500 ease-out group-hover:scale-150 relative z-20"
                />
              </div>
              <div>
                <p>CSP-S Pin</p>
                <p>&#8369;30</p>
                <p className="text-[gray] mt-2">Stock 10</p>
                <button className="w-full bg-white rounded-full text-black py-2 mt-5 cursor-pointer hover:bg-[#d6d2d2] transition-all">
                  View Merch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default index;
