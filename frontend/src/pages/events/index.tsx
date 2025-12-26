import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SAMPLEIMAGE from "../../assets/sampleImage.png";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Footer from "../../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "../../components/Layout";
import RecentEvents from "./components/RecentEvents";
import UpcomingEvents from "./components/UpcomingEvents";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      {/*
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, index) => (
            <Link
              to={`/events/view/${n}`}
              key={index}
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
        
        */}

      <UpcomingEvents />
      <RecentEvents />
    </Layout>
  );
};

export default Index;
