import React from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { FaCheck } from "react-icons/fa";
import Footer from "../../../components/Footer";

const index = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="w-full">
            <div className="">
              <select name="" id="">
                <option value="">All</option>
              </select>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-between gap-4">
              <div className="w-full">
                <div className="flex  items-center gap-2">
                  <button className="w-10 h-5 border border-white active:bg-white"></button>

                  <div className="flex w-full  bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
                    <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                      <img
                        src={SAMPLE}
                        alt=""
                        className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
                      />
                    </div>

                    <div className="flex flex-col items-end w-full sm:w-auto text-right">
                      <div>
                        <p className="text-xs sm:text-sm md:text-xl lg:text-3xl font-semibold">
                          BSCS UNIFORM
                        </p>
                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl">
                          x1
                        </p>
                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl">
                          Size: M
                        </p>
                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl">
                          ₱800
                        </p>
                      </div>

                      <div className="mt-4 md:mt-10 text-xs sm:text-sm md:text-lg lg:text-2xl">
                        <p>Total Price: ₱800</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl w-full lg:max-w-md p-8 relative">
                <div className="flex justify-center mb-6">
                  <div className="bg-indigo-200 rounded-full p-6">
                    <FaCheck
                      className="w-8 h-8 text-indigo-600"
                      strokeWidth={3}
                    />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-purple-900 mb-8">
                  Order Summary
                </h1>
                <div className="border-t-2 border-purple-900 mb-6"></div>
                <div className="flex justify-between mb-4">
                  <span className="text-purple-900 font-semibold text-sm">
                    Item(s)
                  </span>
                  <div className="flex gap-12">
                    <span className="text-purple-900 font-semibold text-sm">
                      Qty
                    </span>
                    <span className="text-purple-900 font-semibold text-sm">
                      Price
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-32">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 text-sm">
                      BSCS UNIFORM (M)
                    </span>
                    <div className="flex gap-16">
                      <span className="text-gray-800 text-sm">1</span>
                      <span className="text-gray-800 text-sm">₱800.00</span>
                    </div>
                  </div>
                </div>
                <div className="border-t-2  border-purple-900 mb-6"></div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-purple-900 font-bold text-lg">
                    Total
                  </span>
                  <span className="text-purple-900 font-bold text-lg">
                    ₱800.00
                  </span>
                </div>
                <div className="border-t-2  border-purple-900 mb-6"></div>

                <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 rounded-full py-3 px-6 font-semibold hover:bg-indigo-50 transition-colors duration-200">
                  Confirm order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default index;
