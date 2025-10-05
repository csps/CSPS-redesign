import BACKGROUNDCSSLOGO from "../../assets/logos/Background_Logo.png";
import MobileNav from "../../components/MobileNav";
import Navbar from "../../components/Navbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Footer from "../../components/Footer";
import TSHIRT from "../../assets/carrot 1.png";

const Index = () => {
  return (
    <div className="">
      <div className="h-[900px] w-full bg-gradient-to-b from-[#41169C] via-[rgb(32,17,63)] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white overflow-hidden">
          {/* Background Logos */}
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-0 left-[-5rem] sm:left-[-10rem] lg:left-0 opacity-40 w-[10rem] sm:w-[15rem] lg:w-[20rem]"
          />
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[8rem] left-[10%] sm:left-[30%] lg:left-[37rem] opacity-40 w-[8rem] sm:w-[12rem] lg:w-[15rem]"
          />
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[12rem] right-[5%] sm:right-[10%] lg:left-[70rem] opacity-40 w-[12rem] sm:w-[18rem] lg:w-[25rem]"
          />

          {/* Large Center Logo 
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[8rem] left-[20rem] -translate-x-1/2 opacity-70 z-10 
                       w-[22rem] sm:w-[28rem] md:w-[35rem] lg:w-[43rem]"
          />
            */}
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[26rem] left-[15%] sm:left-[-2rem] opacity-20 w-[10rem] sm:w-[15rem] lg:w-[20rem]"
          />
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[28rem] right-[10%] sm:right-[20%] lg:left-[56rem] opacity-40 w-[12rem] sm:w-[16rem] lg:w-[20rem]"
          />
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[32rem] left-[20%] sm:left-[25%] lg:left-[23rem] opacity-20 w-[15rem] sm:w-[20rem] lg:w-[25rem]"
          />

          {/* Foreground UI */}
          <Navbar />
          <MobileNav />

          <div className="w-full flex flex-col md:flex-row items-center md:items-start">
            {/* Left */}
            <div className="relative flex justify-center md:justify-start w-full md:w-1/2">
              <img
                src={BACKGROUNDCSSLOGO}
                alt=""
                className="
                    object-contain
                    
                    py-22
                    absolute
                "
              />
            </div>

            {/* Right */}
            <div className="flex justify-center md:justify-start  flex-col w-full md:w-1/2 text-center md:text-left mt-6 md:mt-0 py-[14rem]">
              <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-semibold">
                Welcome Back
              </h1>
              <h2 className="px-4 sm:px-6 md:px-10 text-3xl sm:text-4xl md:text-4xl lg:text-6xl text-[#FDE006] font-semibold mt-3 md:mt-5">
                John Carl Atillo
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white space-y-50">
          <div className="w-full">
            <div className="w-full flex justify-between mb-5">
              <p className="md:text-xl lg:text-4xl font-semibold">
                Announcements
              </p>
              <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">
                Read more
              </p>
            </div>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={20}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="w-full h-full pb-10"
            >
              {[1, 2, 3, 4, 5].map((t, index) => (
                <SwiperSlide
                  key={index}
                  className={`
        !bg-[#BBBBBB]/20 flex justify-center items-center 
        !w-[90%] sm:!w-[500px] md:!w-[600px] lg:!w-[800px]
        !h-[300px] sm:!h-[400px] md:!h-[500px] lg:!h-[665px]
        rounded-xl
      `}
                >
                  <div className="border-b-2 border-t-2 border-[#919191] w-full h-full rounded-3xl flex justify-center items-center">
                    slide {t}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="">
            <div className="w-full flex justify-between mb-5">
              <p className="md:text-xl lg:text-4xl font-semibold">Activities</p>
              <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">
                Read more
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
              {/* First big slide */}
              <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
                <div className="w-full h-full border-b-2 border-t-2 border-[#727272] rounded-3xl flex justify-center items-center">
                  slide
                </div>
              </div>

              {/* Second big slide */}
              <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
                <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
                  slide
                </div>
              </div>

              {/* Third column stacked */}
              <div className="w-full space-y-8">
                <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
                  <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
                    slide
                  </div>
                </div>
                <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
                  <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
                    slide
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full mb-10">
                <div className="w-full flex justify-between items-center">
                  <p className="text-sm md:text-xl lg:text-4xl font-semibold">Show Your CSP-S Pride</p>
                  <button className="bg-[#4A2558] px-4 py-2 text-xs md:text-lg rounded-full">Discover</button>
                </div>
                <p className="text-gray-400 text-xs md:text-lg">Every purchase supports our mission and community</p>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
