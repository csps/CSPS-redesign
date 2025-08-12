import Layout from "@/components/Layouts/Layout";
import LogoSection from "@/components/shared/LogoSection";
import Logo from "@/assets/CSPS_LOGO.png";
import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Sample3 from "@/assets/sample3.png";
import Sample1 from "@/assets/Sample1.png";
import Sample2 from "@/assets/Sample2.png";

import { useLocation } from "react-router-dom";

const ProductViewPage = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const productName = params.get('product');


  const productMap: any = {
    "CSPS-S pin": Sample1,
    "T-SHIRT": Sample2,
    "T-SHIRT-2": Sample2,
    "": Sample3
  };

   const image = productMap[productName ?? ""];

  return (
    <Layout>
      <LogoSection withNav={true} />

      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-26 pb-20">
        <div className="absolute top-42  right-0 w-[84vw] h-screen max-w-[950px] max-h-[950px] lg:top-0 lg:right-[18rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Left Column: Thumbnails */}
          <div className="flex md:flex-col gap-4 md:w-[15rem] w-full order-2 md:order-1">
            {[1, 2, 3].map((_, i) => (
              <GlassmorphismCard
                key={i}
                glassCard={2}
                className="aspect-square overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </GlassmorphismCard>
            ))}
          </div>

          {/* Right Column: Main Image + Details */}
          <div className="flex flex-col gap-4 flex-1 h-full order-1 md:order-2">
            {/* Main Image */}
            <GlassmorphismCard
              glassCard={2}
              className="h-[44rem] overflow-hidden"
            >
              <img
                src={image}
                alt="Main product view"
                className="object-contain w-full h-full"
              />
            </GlassmorphismCard>
          </div>

          <div className="space-y-5 px-10 order-3 ">
            <div className="py-2 space-y-2 px-2">
              <p className="text-2xl font-bold text-white">{productName}</p>
              <p className="text-lg text-gray-300">set</p>
            </div>
            <div className="text-gray-300 text-lg py-2 space-y-2 px-2">
              <p>Stock: 500</p>
              <p>Gender: Unisex</p>
            </div>
            <div className="p-2 space-y-4 ">
              <p className="text-gray-300 text-lg">Color</p>
              <div className="flex gap-2">
                <p className="w-7 h-7 bg-white rounded-full"></p>
                <p className="w-7 h-7 bg-[#6238FA] rounded-full"></p>
              </div>
              <div className="py-2 space-y-2">
                <p className="text-gray-300 text-lg">Size:</p>
                <div className="flex gap-2 text-xl text-white space-x-5">
                  <p>XS</p>
                  <p>S</p>
                  <p>M</p>
                  <p>L</p>
                  <p>XL</p>
                </div>
                <div className="flex gap-3 items-center mt-2 py-2 space-y-2">
                  <p className="text-gray-300 text-lg">Quantity:</p>

                  <button className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">
                    −
                  </button>

                  <p className="w-6 text-center text-white">10</p>

                  <button className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center">
                    +
                  </button>
                </div>
                <div className="flex gap-4 mt-6 w-full flex-col">
                  <button className="flex-1 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-semibold">
                    Add to Cart
                  </button>

                  <button className="flex-1 py-2 rounded-xl bg-[#AB83C2] text-white hover:bg-[#b791ce] transition font-semibold">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductViewPage;
