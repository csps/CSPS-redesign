import React from "react";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import CustomCalendar from "./components/GlassCalendar";
import Footer from "../../components/Footer";

const index = () => {
  return (
   <>
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="w-full max-w-[90rem] p-6 text-white">
        <AuthenticatedNav />

        <CustomCalendar />
      </div>
    </div>
    <Footer />
   </>
  );
};

export default index;
