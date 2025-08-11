import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import React from "react";
import CSPSLogo from "@/assets/CSPSLogo.png";
import { GlassTextField } from "@/components/Glassmorphism/GlassTextField";
import Layout from "@/components/Layouts/Layout";
import { Checkbox } from "@mui/material";
import { ThinCircleIcon } from "@/components/CustomIcon/ThinCircleIcon";
import GlassButton from "@/components/Glassmorphism/GlassButton";
import { motion } from "framer-motion";
import Logo from "@/assets/CSPS_LOGO.png";

const Index = () => {
  return (
    <Layout className="relative flex items-center justify-center px-4 sm:px-8 lg:px-20 py-8 sm:py-12">
      <div className="hidden md:flex absolute top-42 left-0 w-[84vw] h-[84vw] max-w-[950px] max-h-[950px] lg:top-0 lg:right-[-17rem]">
        <img
          src={Logo}
          alt="CSPS Background"
          className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        {/* Optional: Keep image relative to container */}

        <GlassmorphismCard className="w-full py-10 sm:py-20 lg:py-36 flex flex-col md:flex-row gap-10 md:gap-0">
          {/* Left */}
          <div className="text-white px-4 w-full flex flex-col justify-center">
            <img
              src={CSPSLogo}
              alt="CSPS-Logo"
              className="w-32 sm:w-40 md:w-48"
            />
            <p className="mt-5 mb-5 text-2xl sm:text-4xl md:text-5xl font-semibold px-2">
              Sign in
            </p>
            <p className="font-normal text-lg sm:text-xl md:text-2xl px-2 text-gray-300">
              Connect, Collaborate, and Grow Together
            </p>
          </div>

          {/* Right */}
          <div className="w-full p-4">
            <form action="" method="post" className="space-y-5 w-full">
              <GlassTextField
                label="ID Number"
                type="text"
                blur={8}
                borderRadius="1rem"
              />

              <GlassTextField
                label="Password"
                type="password"
                blur={8}
                borderRadius="1rem"
              />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-gray-500 hover:underline cursor-pointer text-sm sm:text-base">
                  Forgot password?
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    icon={<ThinCircleIcon color="gray" strokeWidth={1} />}
                    checkedIcon={
                      <ThinCircleIcon color="#00bcd4" strokeWidth={1} checked />
                    }
                    sx={{
                      padding: 0,
                      "& .MuiSvgIcon-root": {
                        fontSize: 24,
                      },
                    }}
                  />
                  <p className="text-white text-sm sm:text-base">Remember me</p>
                </div>
              </div>

              <div className="w-full">
                <GlassButton className="w-full cursor-pointer">
                  <span className="py-4 sm:py-5 text-sm sm:text-base">
                    Sign in
                  </span>
                </GlassButton>
              </div>
            </form>
          </div>
        </GlassmorphismCard>
      </motion.div>
    </Layout>
  );
};

export default Index;
