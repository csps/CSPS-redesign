import React from "react";
import BACKGROUNDCSSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import CSPSLOGO2 from "../../assets/logos/csps_logo 1.png";
import { FaHashtag } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";

const Index = () => {
  return (
    <div
      className="px-4 sm:px-8 lg:px-20 xl:px-56 mx-auto min-h-screen w-full flex items-center justify-center overflow-hidden"
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
      <div className="relative flex flex-wrap bg-[#2d0f52]/10 rounded-4xl border-b border-b-white/20 border-t border-t-white/20 shadow-[-11px_10px_5px_0px_rgba(0,_0,_0,_0.3)] min-h-[40rem] w-full">
        
        {/* Left Side */}
        <div className="w-full xl:w-1/2 px-5 sm:px-10 py-8 text-white flex xl:block flex-col items-center justify-center">
          <div className="absolute left-[-4rem]  md:bottom-[-10rem]  ">
            <img
              src={BACKGROUNDCSSLOGO}
              alt=""
              className="w-full z-0 drop-shadow-xl/50"
            />
          </div>

          <img src={CSPSLOGO2} alt="" className="max-w-[10rem] sm:max-w-[14rem]" />
          <div className="mt-5 text-center xl:text-start">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Forgot Your Password?
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-extralight max-w-lg text-gray-400 mt-5">
              Enter your ID number and the code sent to your email to reset your
              password.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="text-white w-full xl:w-1/2 px-5 sm:px-10 lg:px-20 flex items-center">
          <form
            action=""
            method="post"
            className="space-y-5 w-full py-6 sm:py-10 z-10"
          >
            {/* ID Input */}
            <div className="w-full relative">
              <label htmlFor="idNumber" className="absolute top-5 left-3">
                <FaHashtag className="text-lg sm:text-xl text-purple-300/80" />
              </label>
              <input
                type="text"
                id="idNumber"
                className="w-full bg-purple-700/40 rounded-2xl py-3 sm:py-4 px-10 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-700/50 transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] border border-black font-bold text-base sm:text-lg lg:text-xl"
                placeholder="ID Number"
              />
            </div>

            {/* Code Input */}
            <div className="w-full relative">
              <label htmlFor="verification" className="absolute top-5 left-3">
                <FaEnvelope className="text-lg sm:text-xl text-purple-300/80" />
              </label>
              <input
                type="text"
                id="verification"
                className="w-full bg-purple-700/40 rounded-2xl py-3 sm:py-4 px-10 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-700/50 transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] border border-black font-bold text-base sm:text-lg lg:text-xl"
                placeholder="Verification Code"
              />
            </div>

            {/* Resend */}
            <div className="px-2 sm:px-5 mt-6 sm:mt-10 mb-6 sm:mb-10">
              <p className="text-base sm:text-lg lg:text-xl font-semibold">
                Didn't receive the code?{" "}
                <span className="font-semibold underline">Resend email</span>
              </p>
            </div>

            {/* Button */}
            <div className="w-full px-2 sm:px-10 lg:px-20">
              <button className="bg-purple-700/40 font-semibold text-lg sm:text-xl lg:text-2xl w-full py-3 sm:py-4 rounded-lg shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)]">
                Verify &amp; Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
