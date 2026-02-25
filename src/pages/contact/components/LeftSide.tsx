import UCMAP from "../../../assets/ucLoc.png";
import { FaClock, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const LeftSide = () => {
  return (
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
  );
};

export default LeftSide;
