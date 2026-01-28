import { useState } from "react";
import Navbar from "../../../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import SAMPLEIMAGE from "../../../assets/sampleImage.png";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative w-full max-w-[90rem] p-6 text-white">
        <Navbar />

        <div className="py-30">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            modules={[EffectCoverflow]}
            className="w-full pt-[50px] pb-[20px]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_img, index) => (
              <SwiperSlide
                key={index}
                className="
                    bg-center bg-cover 
                    !w-[90%] !h-[250px]          /* default mobile */
                    sm:!w-[400px] sm:!h-[300px]  /* small screens */
                    md:!w-[500px] md:!h-[350px]  /* medium screens */
                    lg:!w-[600px] lg:!h-[400px]  /* large screens */
                    xl:!w-[700px] xl:!h-[500px]  /* extra large */
                    !bg-purple-600/20 p-2 border-t border-b rounded-xl border-gray-400
                "
              >
                <img
                  src={SAMPLEIMAGE}
                  alt={`slide-${index}`}
                  className="block w-full h-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center mt-20 text-gray-300 text-xl">
            {activeIndex + 1} of 9
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
