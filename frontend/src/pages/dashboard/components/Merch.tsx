import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TSHIRT from "../../../assets/carrot 1.png";

const Merch = () => {
  return (
    <div className="w-full">
      <div className="w-full mb-10">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm md:text-xl lg:text-4xl font-semibold">
            Show Your CSP-S Pride
          </p>
          <button className="bg-[#4A2558] px-4 py-2 text-xs md:text-lg rounded-full">
            Discover
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-lg">
          Every purchase supports our mission and community
        </p>
      </div>
      <div className="">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t, index) => (
            <SwiperSlide
              key={index}
              className={`
                  !bg-[#BBBBBB]/20 flex justify-center items-center 
                  !h-[400px]
                  rounded-xl
                `}
            >
              <div className="border-b-2 border-t-2 border-[#919191] shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] w-full h-full rounded-3xl flex justify-center items-center flex-col">
                <img src={TSHIRT} alt="" />
                <p>T-Shirt</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Merch;
