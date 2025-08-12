import Layout from "@/components/Layouts/Layout";
import LogoSection from "@/components/shared/LogoSection";
import { MenuItem, Select } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Sample1 from "@/assets/Sample1.png";
import Sample2 from "@/assets/Sample2.png";
import Logo from "@/assets/CSPS_LOGO.png";
import { Link } from "react-router-dom";
import TransactionsNav from "@/components/shared/test/TransactionsNav";

const Index = () => {
  const sampleItems = [
    {
      id: 1,
      name: "CSPS-S pin",
      image: Sample1,
    },
    {
      id: 2,
      name: "T-SHIRT",
      image: Sample2,
    },
    {
      id: 3,
      name: "T-SHIRT - 2",
      image: Sample2,
    },
  ];
  return (
    <Layout>
      <LogoSection withNav={true} />

      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20">
        <div className="absolute top-42  right-0 w-[84vw] h-screen max-w-[950px] max-h-[950px] lg:top-0 lg:right-[18rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
          />
        </div>

        <TransactionsNav />
        <div className="flex flex-col gap-5 w-full">
          {sampleItems.map((item, index) => (
            <GlassmorphismCard
              glassCard={2}
              borderRadius={20}
              className=" text-white text-lg  justify-center items-center md:justify-between  w-full flex-col md:flex-row"
            >
              <div className="w-full flex items-center justify-center md:justify-start    ">
                <img src={item.image} alt={item.name} />
              </div>
              <div className=" w-full flex flex-col md:items-end  text-xl text-gray-300 text-center">
                <p className="text-3xl font-semibold text-white">{item.name}</p>
                <p>x1</p>
                <p>batch</p>
                <p>Size: M</p>
                <p>&#8369;800</p>

                <div className="mt-10 flex flex-col md:items-end">
                  <p>Total price: 800</p>
                  <p className="text-white font-bold">Status: To be claimed</p>
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
