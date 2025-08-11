import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Logo from "@/assets/CSPS_LOGO.png";

const Announcements = () => {
  return (
    <div className="w-full  mb-36 space-y-10">
      <div className="text-center">
        <p className="text-3xl md:text-6xl font-semibold text-white">
          Announcements
        </p>
      </div>
      <div className="min-h-[500px]">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper h-full"
          style={
            {
              "--swiper-navigation-color": "#fefefefe",
            } as React.CSSProperties
          }
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <SwiperSlide key={num} className="h-full rounded-[20px]">
              <GlassmorphismCard
                className="h-full w-full flex items-center justify-center"
                borderRadius={20}
                glassCard={2}
              >
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-full">
                    <img src={Logo} className="object-cover" />
                  </div>
                </div>
              </GlassmorphismCard>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="text-white font-semibold mt-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
          porttitor turpis. Pellentesque ut metus fermentum risus laoreet
          fringilla ultricies eu mi. Sed porttitor quam hendrerit sapien
          volutpat accumsan. Proin dictum sed ligula cursus egestas. Etiam at
          fringilla quam. Vivamus at nibh malesuada, efficitur ante vel, lacinia
          enim. Ut vel justo odio. Pellentesque nec aliquam odio. Nulla luctus
          congue enim vitae dignissim. Aliquam vitae interdum dolor. Nunc non
          facilisis dui, eu porta nisi. Etiam ac augue eu risus placerat
          facilisis. In hac habitasse platea dictumst. Phasellus sed maximus
          quam. Vestibulum non interdum risus, nec venenatis nibh. Aenean
          iaculis nulla in lobortis condimentum.
        </p>
      </div>
    </div>
  );
};

export default Announcements;
