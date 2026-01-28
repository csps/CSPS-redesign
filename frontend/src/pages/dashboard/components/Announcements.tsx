import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Announcements = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between mb-5">
        <p className="md:text-xl lg:text-4xl font-semibold">Announcements</p>
        <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">Read more</p>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full h-full pb-10"
      >
        {[1, 2, 3, 4, 5].map((t, index) => (
          <SwiperSlide
            key={index}
            className={`
                 !flex flex-col md:flex-row gap-10 justify-center items-center 
                  !h-[300px] sm:!h-[400px] md:!h-[500px] lg:!h-[665px]
                  rounded-xl
                `}
          >
            <div className="border-b-2 !bg-[#BBBBBB]/20 border-t-2 border-[#919191] w-full md:w-[70%] h-full rounded-3xl flex justify-center items-center">
              slide {t}
            </div>
            <div className="border-b-2 !bg-[#BBBBBB]/20 border-t-2 border-[#919191] w-full md:w-[30%] h-full rounded-3xl flex justify-center items-center">
              slide {t}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Announcements;
