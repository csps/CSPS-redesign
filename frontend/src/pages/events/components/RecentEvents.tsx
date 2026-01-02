import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const RecentEvents = () => {
  return (
    <div>
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
            className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200  rounded-lg"
          >
            Slide {index}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentEvents;
