import React from "react";
import AboutLayout from "../Layouts/AboutLayout";
import { LinearProgress } from "@mui/material";
import Logo from "@/assets/CSPSLogo.png";

const PageLoader = () => {
  return (
    <div className="bg-[#13021d]">
      <div className="relative h-screen container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20 flex  flex-col  ">
        <div className="w-full space-y-5">
          <div className="w-full flex items-center justify-center">
            <img src={Logo} alt="" />
          </div>
          <LinearProgress color="secondary" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
