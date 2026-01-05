import React from "react";
import sampleTshirt from "../../../../../assets/carrot 1.png";
import StatusDropdown from "./StatusDropdown";

const StatusCard = () => {
  return (
    <div className="w-full bg-[#170657] border border-gray-500 flex flex-col sm:flex-row items-center sm:justify-evenly px-4 py-6 rounded-lg gap-4">
      
      <div className="flex flex-col items-center sm:items-start">
        <img src={sampleTshirt} className="w-36 sm:w-32" />
        <p className="text-sm sm:text-base text-center sm:text-left">
          Cataluna - 21438171
        </p>
      </div>

      <div className="text-sm text-center sm:text-left">
        <p className="flex flex-col sm:flex-row gap-2 sm:gap-10 text-xl sm:text-2xl">
          BSCS Uniform <span>x1</span>
        </p>
        <p>Batch: 1</p>
        <p>Size: M</p>
        <p>Total Price: 800</p>
      </div>

      <div className="mt-2 sm:mt-0">
        <StatusDropdown />
      </div>
    </div>
  );
};


export default StatusCard;
