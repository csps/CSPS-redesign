import Layout from "@/components/Layouts/Layout";
import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Sample1 from "@/assets/Sample1.png";
import Sample2 from "@/assets/Sample2.png";
import { useState } from "react";
import Logo from "@/assets/CSPS_LOGO.png";
import { Link } from "react-router-dom";
import TransactionsNav from "@/components/shared/test/TransactionsNav";

const Index = () => {
  const [sampleStock, setSampleStock] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);

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
      name: "T-SHIRT-2",
      image: Sample2,
    },
  ];

  return (
    <Layout>

      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20">
        <div className="absolute top-42  right-0 w-[84vw] h-screen max-w-[950px] max-h-[950px] lg:top-0 lg:right-[18rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
          />
        </div>

        <TransactionsNav />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleItems.map((item, index) => (
            <Link
              to={`/product-view?product=${encodeURIComponent(item.name)}`}
              key={index}
            >
              <GlassmorphismCard
                glassCard={2}
                borderRadius={20}
                className="flex-col text-white text-lg h-[450px]"
              >
                <div>
                  <img src={item.image} alt="sample1-icon" />
                </div>

                <div className="w-full">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="font-semibold">&#8369;30</p>
                </div>

                <div className="w-full">
                  <p className="text-gray-300">Stock {sampleStock}</p>

                  <div className="flex gap-3 items-center mt-2">
                    <p>Quantity:</p>

                    <button
                      className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
                      onClick={() =>
                        setQuantity((prev) => Math.max(prev - 1, 0))
                      }
                    >
                      −
                    </button>

                    <p className="w-6 text-center">{quantity}</p>

                    <button
                      className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
                      onClick={() =>
                        setQuantity((prev) => Math.min(prev + 1, sampleStock))
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button className="flex-1 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-semibold">
                      Add to Cart
                    </button>

                    <button className="flex-1 py-2 rounded-xl bg-[#AB83C2] text-white hover:bg-[#b791ce] transition font-semibold">
                      Buy Now
                    </button>
                  </div>
                </div>
              </GlassmorphismCard>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
