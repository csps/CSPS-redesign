import React from "react";
import Navbar from "../../components/Navbar";
import UCMAP from "../../assets/ucLoc.png";
import { FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="w-full max-w-[90rem] p-6 text-white">
        {/* Navigation */}
        <Navbar />

        <div className="flex flex-col lg:flex-row w-full py-10 gap-10">
          {/* Left Side - Mapa */}
          <div className=" space-y-5">
            <div>
              <img src={UCMAP} alt="MAPA" className="w-full rounded-lg" />
              <p className="font-semibold text-center mt-5">
                University of Cebu - Main Campus
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col sm:justify-between gap-6 lg:gap-10">
              <div className="flex gap-3 items-center">
                <div className="flex bg-[#2d0f52]/10 rounded-4xl border-b-2 border-b-white/20 border-t-2 border-t-white/20 shadow-lg w-12 h-12 items-center justify-center">
                  <FaMapMarkerAlt className="text-[20px]" />
                </div>
                <div>
                  <p className="text-lg">Office</p>
                  <p className="text-sm text-gray-400">5th floor room 541</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="flex bg-[#2d0f52]/10 rounded-4xl border-b-2 border-b-white/20 border-t-2 border-t-white/20 shadow-lg w-12 h-12 items-center justify-center">
                  <FaEnvelope className="text-[20px]" />
                </div>
                <div>
                  <p className="text-lg">Email</p>
                  <p className="text-sm text-gray-400">ucmncsps@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="flex bg-[#2d0f52]/10 rounded-4xl border-b-2 border-b-white/20 border-t-2 border-t-white/20 shadow-lg w-12 h-12 items-center justify-center">
                  <FaClock className="text-[20px]" />
                </div>
                <div>
                  <p className="text-lg">Working Hours</p>
                  <p className="text-sm text-gray-400">00:00 AM - 00:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug">
                Don't Hesitate to Contact Us
              </p>
              <p className="text-base sm:text-lg max-w-xl text-gray-100 mt-2">
                Whether you have a question, feedback, or just want to say
                hello, we'd love to hear from you.
              </p>
            </div>

            <form action="" method="post" className="w-full space-y-5">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 flex-wrap">
                <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="bg-purple-900/40 rounded-xl py-4 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="bg-purple-900/40 rounded-xl py-4 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="bg-purple-900/40 rounded-xl py-4 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={11}
                  className="bg-purple-900/40 rounded-xl py-3 px-5 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-800/50 resize-none"
                />
              </div>

              <div className="w-full flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-white text-black font-semibold px-10 py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
