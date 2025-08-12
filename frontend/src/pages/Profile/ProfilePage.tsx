import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Layout from "@/components/Layouts/Layout";
import LogoSection from "@/components/shared/LogoSection";
import AccountCircleIcon from "@/assets/SVG/icons8-profile-100 2.svg";
import SampleProfile2 from "@/assets/SampleProfile2.png";
import EditIcon from "@mui/icons-material/Edit";

import React from "react";
import GlassButton from "@/components/Glassmorphism/GlassButton";
import Bulletin2 from "@/assets/SAm.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const logout = useAuthStore((state: any) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();

    navigate("/");
  };
  return (
    <Layout>
      <LogoSection withNav={true} />
      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-32 pb-20 flex items-center justify-center flex-col gap-20">
        <div className="flex gap-10 flex-col md:flex-row">
          <div className="">
            <GlassmorphismCard glassCard={2}>
              <img src={SampleProfile2} />
            </GlassmorphismCard>
          </div>
          <div className="flex flex-col">
            <div className="space-y-5 py-9">
              <p className="text-2xl text-white font-semibold">
                Phone number:{" "}
                <span className="text-gray-400">0900-888-999</span>
              </p>
              <p className="text-2xl text-white font-semibold">
                Gmail: <span className="text-gray-400">jc@gmail.com</span>
              </p>
              <p className="text-2xl text-white font-semibold">
                Address: <span className="text-gray-400">csps cebu city</span>
              </p>
              <p className="text-2xl text-white font-semibold">
                Year: <span className="text-gray-400">3rd</span>
              </p>
            </div>
            <div className="flex mt-10 gap-5">
              <GlassButton glassCard={2} borderType="lg" className="cursor-pointer">
                <EditIcon />
                <span>Edit Profile</span>
              </GlassButton>
              <GlassButton glassCard={2} borderType="lg" onClick={handleLogout} className="cursor-pointer">
                <LogoutIcon />
                <span>Logout</span>
              </GlassButton>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#d3cece] p-5 rounded-xl space-y-5">
            <div className="flex items-center gap-5">
              <p className="text-xl font-semibold text-[#4B4690]">Stephen V</p>
              <p className="text-gray-500 text-sm">
                2nd year &bull; Tips &amp; Tricks
              </p>
            </div>
            <div className="">
              <img src={Bulletin2} alt="" className="" />
            </div>
          </div>
          <div className="bg-violet-900 p-5 rounded-xl space-y-5">
            <div className="flex items-center gap-5">
              <p className="text-xl font-semibold text-white">Stephen V</p>
              <p className="text-gray-200 text-sm">
                2nd year &bull; Tips &amp; Tricks
              </p>
            </div>
            <div className="">
              <img src={Bulletin2} alt="" className="" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
