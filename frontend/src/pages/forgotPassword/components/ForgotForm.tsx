import React from "react";
import { FaEnvelope, FaHashtag } from "react-icons/fa";

const ForgotForm = () => {
  return (
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
  );
};

export default ForgotForm;
