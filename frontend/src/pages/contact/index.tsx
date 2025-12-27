import React from "react";
import Navbar from "../../components/Navbar";
import UCMAP from "../../assets/ucLoc.png";
import { FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import Layout from "../../components/Layout";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";

const Index = () => {
  return (
    <Layout>
      {/* Navigation */}
      <Navbar />

      <div className="flex flex-col lg:flex-row w-full py-10 gap-10">
        {/* Left Side - Mapa */}
        <LeftSide />

        {/* Right Side - Form */}
        <RightSide />
      </div>
    </Layout>
  );
};

export default Index;
