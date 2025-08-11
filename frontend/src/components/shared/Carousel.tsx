import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import GlassmorphismCard from "../Glassmorphism/GlassmorphismCard";
import Dean from "@/assets/Dean_CCS.png";

export function Carousel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative pb-12">
      {" "}
      {/* Gives space for pagination */}
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        className="!pb-10" // Pushes pagination down
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <SwiperSlide key={index}>
            <GlassmorphismCard className="min-h-[350px] w-full flex flex-col gap-5">
              <div className="h-[250px] w-full relative">
                <img
                  src={Dean}
                  alt=""
                  className="w-full h-full  object-top rounded-2xl"
                />
                <button
                  className="glass-card absolute bottom-[-20px] right-2 px-6 py-2 rounded-[34px] overflow-hidden backdrop-blur-[4px] border border-white/10 shadow-lg text-white font-semibold group cursor-pointer"
                  onClick={() => setIsOpen((open) => !open)}
                >
                  <span className="absolute inset-0 rounded-[34px] bg-white/5 group-hover:bg-white/10 transition-all duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    ...
                  </span>
                </button>
                {isOpen && (
                  <div className="absolute right-3 bottom-0">
                    <GlassmorphismCard className=" h-20 flex-col"></GlassmorphismCard>
                  </div>
                )}
              </div>
              <div className="w-full text-justify space-y-4">
                <p className="text-2xl text-white font-bold">
                  Neil A. BASABE, MIT
                </p>
                <p className="text-gray-400">
                  Dean, College of Computer Studies UC main campus
                </p>
              </div>
            </GlassmorphismCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
