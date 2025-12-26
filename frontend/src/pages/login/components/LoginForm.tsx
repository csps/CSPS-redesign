import React from "react";
import { FaHashtag, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
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
  );
};

export default LoginForm;
