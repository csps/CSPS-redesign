import BACKGROUNDCSSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import CSPSLOGO2 from "../../assets/logos/csps_logo 1.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ForgotForm from "./components/ForgotForm";

const Index = () => {
  const navigate = useNavigate();

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
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10
                            flex items-center gap-2 text-sm text-gray-300
                            hover:text-white transition"
        >
          <FaArrowLeft className="text-xl" />
          Back
        </button>
        <div className="w-full xl:w-1/2 px-5 sm:px-10 py-8 text-white flex xl:block flex-col items-center justify-center">
          <div className="absolute left-[-4rem]  md:bottom-[-10rem]  ">
            <img
              src={BACKGROUNDCSSLOGO}
              alt=""
              className="w-full z-0 drop-shadow-xl/50"
            />
          </div>

          <img
            src={CSPSLOGO2}
            alt=""
            className="max-w-[10rem] sm:max-w-[14rem]"
          />
          <div className="mt-5 text-center xl:text-start">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Forgot Your Password?
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-extralight max-w-lg text-gray-400 mt-5">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="text-white w-full xl:w-1/2 px-5 sm:px-10 lg:px-20 flex items-center">
          <ForgotForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
