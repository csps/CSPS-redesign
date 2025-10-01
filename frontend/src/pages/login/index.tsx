import React from "react";
import BACKGROUNDCSSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import CSPSLOGO2 from "../../assets/logos/csps_logo 1.png";
import { FaHashtag } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div
      className="px-4 sm:px-8 lg:px-20 xl:px-56 mx-auto min-h-screen w-full flex items-center justify-center  overflow-hidden"
      style={{
        background: `
          radial-gradient(
            40% 50% at 90% 10%, 
            rgba(193, 19, 251, 0.25) 0%, 
            rgba(193, 19, 251, 0.10) 50%, 
            rgba(193, 19, 251, 0) 100%
          ),
          radial-gradient(
            60% 70% at 0% 20%, 
            rgba(255, 204, 0, 0.15) 0%, 
            rgba(207, 176, 19, 0.08) 45%, 
            rgba(126, 99, 10, 0) 100%
          ),
          radial-gradient(
            100% 80% at 70% 70%, 
            rgba(52, 21, 168, 0.85) 0%, 
            #290F86 20%, 
            #210C71 40%, 
            #160651 60%, 
            #0F033D 80%, 
            #0D0233 100%
          )
        `,
      }}
    >
      <div className="relative flex flex-wrap bg-[#2d0f52]/10  rounded-4xl  border-b border-b-white/20 border-t border-t-white/20 shadow-[-11px_10px_5px_0px_rgba(0,_0,_0,_0.3)] min-h-[40rem]">
        <div className="w-full xl:w-1/2 px-5 sm:px-10 py-8 text-white flex xl:block flex-col items-center justify-center">
          <div className="absolute left-[-4rem]  md:bottom-[-10rem]  ">
            <img
              src={BACKGROUNDCSSLOGO}
              alt=""
              className="w-full z-0 drop-shadow-xl/50"
            />
          </div>

          <img src={CSPSLOGO2} alt="" />
          <div className="mt-5 text-center xl:text-start">
            <p className="text-2xl md:text-6xl font-semibold">Welcome Back!</p>
            <p className="text-base sm:text-lg lg:text-xl font-extralight max-w-lg text-gray-400 mt-5 ">
              Connect, Collaborate, and Grow Together
            </p>
          </div>
        </div>

        <div className="text-[#FFFFFF] w-full xl:w-1/2 px-5 sm:px-10 lg:px-20 flex items-center ">
          <form
            action=""
            method="post"
            className="space-y-5 w-full py-6 sm:py-10 z-10"
          >
            <div className="w-full relative">
              <label htmlFor="idNumber" className="absolute top-5 left-3">
                <FaHashtag className="text-lg sm:text-xl text-purple-300/80" />
              </label>
              <input
                type="text"
                id="idNumber"
                className="w-full bg-purple-700/40 rounded-2xl  py-3 sm:py-4  px-10  text-white  placeholder-purple-300/80  focus:outline-none  focus:bg-purple-700/50  transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border border-black  font-bold text-base sm:text-lg lg:text-xl"
                placeholder="ID Number"
              />
            </div>
            <div className="w-full relative">
              <label htmlFor="password" className="absolute top-5 left-3">
                <FaLock className="text-lg sm:text-xl text-purple-300/80" />
              </label>
              <input
                type="password"
                id="password"
                className="w-full bg-purple-700/40 rounded-2xl  py-3 sm:py-4 px-10  text-white  placeholder-purple-300/80  focus:outline-none  focus:bg-purple-700/50  transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border border-black font-bold text-base sm:text-lg lg:text-xl"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-between items-center px-2 sm:px-5 m5-6 sm:mt-10 mb-6 sm:mb-10">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-lg lg:text-xl font-semibold hover:underline transition-all"
              >
                Forgot Password?
              </Link>
              <div className="flex items-center gap-2">
                <input
                  id="CheckBox"
                  type="checkbox"
                  className="w-5 h-5 accent-purple-500"
                />
                <label
                  htmlFor="CheckBox"
                  className="text-xs md:text-lg font-semibold"
                >
                  Remember Me
                </label>
              </div>
            </div>
            <div className="w-full px-2 sm:px-10">
              <button className=" bg-purple-700/40 font-semibold text-lg sm:text-xl lg:text-2xl w-full py-3 sm:py-4 rounded-lg shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] ">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
