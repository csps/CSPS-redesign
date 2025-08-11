import Layout from "@/components/Layouts/Layout";
import LogoSection from "@/components/shared/LogoSection";
import { MenuItem, Select } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Sample1 from "@/assets/Sample1.png";
import Sample2 from "@/assets/Sample2.png";
import Logo from "@/assets/CSPS_LOGO.png";

const Index = () => {
  const sampleItems = [
    { id: 1, name: "CSPS-S pin", image: Sample1, price: 800, quantity: 1 },
    { id: 2, name: "T-SHIRT", image: Sample2, price: 800, quantity: 1 },
    { id: 3, name: "T-SHIRT - 2", image: Sample2, price: 800, quantity: 1 },
  ];

  const totalItems = sampleItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = sampleItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Layout>
      <LogoSection withNav={true} />

      <div className="relative container mx-auto z-10 px-6 lg:px-20 pt-32 lg:pt-64 pb-20">
        {/* Background Logo */}
        <div className="absolute top-42  right-0 w-[84vw] h-screen max-w-[950px] max-h-[950px] lg:top-0 lg:right-[18rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
          />
        </div>

        {/* Top Bar */}
        <div className=" w-full absolute top-20 flex justify-between items-center">
          <p className="bg-white px-6 py-2 text-2xl lg:text-4xl rounded-full text-black font-semibold">
            All
          </p>
          <div className="flex gap-5 text-white">
            <ReceiptIcon fontSize="large" />
            <ShoppingCartIcon fontSize="large" />
          </div>
        </div>

        {/* Product Cards + Checkout */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Product List */}
          <div className="flex flex-col gap-6 w-full lg:w-[70%] relative z-20">
            {sampleItems.map((item) => (
              <GlassmorphismCard
                key={item.id}
                glassCard={2}
                borderRadius={20}
                className="flex flex-col md:flex-row w-full justify-between items-center text-white text-lg p-6 gap-6"
              >
                {/* Image */}
                <div className="w-full md:w-[30%] flex justify-center md:justify-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="w-full md:w-[70%] flex flex-col items-center md:items-end text-center md:text-right gap-2 text-gray-300">
                  <p className="text-3xl font-semibold text-white">
                    {item.name}
                  </p>
                  <p>&#8369;{item.price}</p>
                  <p>Stock: 10</p>

                  {/* Quantity Controls */}
                  <div className="flex gap-3 items-center justify-center md:justify-end mt-2">
                    <p>Quantity:</p>
                    <button className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">
                      −
                    </button>
                    <p className="w-6 text-center">{item.quantity}</p>
                    <button className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
              </GlassmorphismCard>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[30%] relative z-20">
            <GlassmorphismCard
              glassCard={2}
              borderRadius={20}
              className="flex flex-col w-full text-white text-lg p-6 gap-4"
            >
              <div className="w-full">
                <p className="text-4xl font-semibold text-[#D7AAE8]">Summary</p>
              </div>
              <div className="w-full flex flex-col relative after:content-[''] after:block after:w-full after:h-[1px] after:bg-white/20 after:mt-2">
                <div className="flex justify-between w-full">
                  <p>Total</p>
                  <p>&#8369;800</p>
                </div>
              </div>
              <div className="w-full">
                <button className="bg-[#AB83C2] w-full py-2 font-semibold rounded-md">
                  Checkout
                </button>
              </div>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
