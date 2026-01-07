import React, { useState } from "react";
import Footer from "../../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { IoMdAdd } from "react-icons/io";

import AddEventModal from "./addEventModal"; 
import AuthenticatedNav from "../../../components/AuthenticatedNav";

const Page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleEventClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="flex flex-col sm:flex-row items-center justify-between py-10 gap-4 sm:gap-0">
            <p className="text-lg w-full sm:w-auto md:text-2xl lg:text-3xl font-semibold flex ">
              Upcoming Events
            </p>
            
            <button 
              onClick={handleEventClick}
              className="flex w-full sm:w-auto items-center border px-2 py-4 text-sm rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <IoMdAdd className="text-white" />
              <span>Add new Event</span>
            </button>
          </div>

          <div className="mb-10">
            <Swiper
              slidesPerView="auto"
              spaceBetween={20}
              pagination={{ clickable: true }}
              modules={[Pagination]}
            >
              {[1, 2, 3, 4, 5].map((index) => (
                <SwiperSlide
                  key={index}
                  className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg cursor-pointer"
      
                  onClick={() => alert(index)}
                >
                  <div className="p-4 flex items-center justify-center h-full text-white/50">
                     Slide {index}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="">
            <p className="text-lg md:text-2xl lg:text-3xl font-semibold mb-10">
              Recent Events
            </p>
            <Swiper
              slidesPerView="auto"
              spaceBetween={20}
              pagination={{ clickable: true }}
              modules={[Pagination]}
            >
              {[1, 2, 3, 4, 5].map((index) => (
                <SwiperSlide
                  key={index}
                  className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg"
                >
                   <div className="p-4 flex items-center justify-center h-full text-white/50">
                     Slide {index}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <Footer />

      {isOpen && (
        <AddEventModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Page;