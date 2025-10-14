import React from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import Footer from "../../../components/Footer";

const index = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="">
            <div className="">
              <select name="" id="">
                <option value="">All</option>
              </select>
            </div>
            <div className="px-4 mt-5">
              <div className="">
                <p>October 10, 2025</p>
              </div>
              <div className="px-6 mt-5 space-y-5">
                <div className="flex w-full relative bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
                  <div className="absolute w-2 h-17 bg-red-500 top-[-9px] left-3 rotate-220" />

                  <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={SAMPLE}
                      alt=""
                      className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
                    />
                  </div>

                  <div className="flex flex-col items-end w-full sm:w-auto text-right">
                    <div>
                      <p className="text-xs sm:text-sm md:text-xl lg:text-xl ">
                        BSCS UNIFORM
                      </p>
                      <p className="text-sm">x1</p>
                      <p className="text-sm">Size: M</p>
                      <p className="text-sm">₱800</p>
                    </div>

                    <div>
                      <p className="text-sm">Total Price: 800</p>
                      <p className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-2xl">
                        Status: To be claimed -
                        <span className="text-red-500 ">Not paid</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full relative bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
                  <div className="absolute w-2 h-17 bg-green-500 top-[-9px] left-3 rotate-220" />

                  <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={SAMPLE}
                      alt=""
                      className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
                    />
                  </div>

                  <div className="flex flex-col items-end w-full sm:w-auto text-right">
                    <div>
                      <p className="text-xs sm:text-sm md:text-xl lg:text-xl ">
                        BSCS UNIFORM
                      </p>
                      <p className="text-sm">x1</p>
                      <p className="text-sm">Size: M</p>
                      <p className="text-sm">₱800</p>
                    </div>

                    <div>
                      <p className="text-sm">Total Price: 800</p>
                      <p className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-2xl">
                        Status: To be claimed -
                        <span className="text-green-500 ">Paid</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 mt-5">
              <div className="">
                <p>October 1, 2025</p>
              </div>
              <div className="px-6 mt-5 space-y-5">
                <div className="flex w-full relative bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
                  <div className="absolute w-2 h-17 bg-red-500 top-[-9px] left-3 rotate-220" />

                  <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={SAMPLE}
                      alt=""
                      className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
                    />
                  </div>

                  <div className="flex flex-col items-end w-full sm:w-auto text-right">
                    <div>
                      <p className="text-xs sm:text-sm md:text-xl lg:text-xl ">
                        BSCS UNIFORM
                      </p>
                      <p className="text-sm">x1</p>
                      <p className="text-sm">Size: M</p>
                      <p className="text-sm">₱800</p>
                    </div>

                    <div>
                      <p className="text-sm">Total Price: 800</p>
                      <p className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-2xl">
                        Status: To be claimed -
                        <span className="text-red-500 ">Not paid</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full relative bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl">
                  <div className="absolute w-2 h-17 bg-green-500 top-[-9px] left-3 rotate-220" />

                  <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={SAMPLE}
                      alt=""
                      className="w-[150px] sm:w-[180px] md:w-[200px] h-auto"
                    />
                  </div>

                  <div className="flex flex-col items-end w-full sm:w-auto text-right">
                    <div>
                      <p className="text-xs sm:text-sm md:text-xl lg:text-xl ">
                        BSCS UNIFORM
                      </p>
                      <p className="text-sm">x1</p>
                      <p className="text-sm">Size: M</p>
                      <p className="text-sm">₱800</p>
                    </div>

                    <div>
                      <p className="text-sm">Total Price: 800</p>
                      <p className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-2xl">
                        Status: To be claimed -
                        <span className="text-green-500 ">Paid</span>
                      </p>
                    </div>
                  </div>
                </div>
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
