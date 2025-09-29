import React from "react";
import BACKGROUNDCSSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import CSPSLOGO2 from "../../assets/logos/csps_logo 1.png";

const Index = () => {
  return (
    <div
      className="px-56 mx-auto min-h-screen w-full flex items-center justify-center relative overflow-hidden"
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
      {/* <div className="absolute top-0">
        <img src={BACKGROUNDCSSLOGO} alt="" className="w-full z-0" />
      </div> */}
      <div
        className="
        w-full 
        flex
    bg-[#2d0f52]/10   /* transparency only on background */
      rounded-2xl 
    border-b border-b-white/20
    border-t border-t-white/20
    shadow-[-20px_30px_40px_rgba(0,0,0,0.3),0_0_50px_rgba(30,58,138,0.5)]
  "
      >
        {/*<input type="text"       className="w-full bg-purple-700/40 border-2 border-purple-500/60 rounded-lg py-3 px-4 text-white placeholder-purple-300/80 focus:outline-none focus:border-purple-400 focus:bg-purple-700/50 transition-all" placeholder='asdasdas' />*/}

        <div className="text-[#FFFFFF]">
          <img src={CSPSLOGO2} alt="" />
          <p className="text-6xl font-semibold">Welcome Back!</p>
          <p className="text-4xl font-extralight w-[26rem]">
            Connect, Collaborate, and Grow Together{" "}
          </p>
        </div>
        <div className="text-[#FFFFFF]">
          <input
            type="text"
            className="w-full 
    bg-purple-700/40

    rounded-lg 
    py-3 px-4 
    text-white 
    placeholder-purple-300/80 
    focus:outline-none 
    focus:bg-purple-700/50 
    transition-all
    shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)]
    z-10
    "
            placeholder="Username"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
