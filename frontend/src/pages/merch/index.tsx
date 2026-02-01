import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import SAMPLE from "../../assets/image 8.png";
import Layout from "../../components/Layout";
import { MerchType } from "../../enums/MerchType";
import type { MerchSummaryResponse } from "../../interfaces/merch/MerchResponse";
import {
  getAllMerchWithoutVariants,
  getMerchById,
  getMerchByType,
} from "../../api/merch";
import { S3_BASE_URL } from "../../constant";

const prefetchCache = new Map<number, any>();

const Index = () => {
  const TAGS = ["ALL", ...Object.values(MerchType)];
  const [merch, setMerch] = useState<MerchSummaryResponse[]>([]);
  const [activeTag, setActiveTag] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMerch = async (type: string) => {
    setLoading(true);
    try {
      const data =
        type === "ALL"
          ? await getAllMerchWithoutVariants()
          : await getMerchByType(type as MerchType);
      setMerch(data);
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch(activeTag);
  }, [activeTag]);

  const prefetchMerch = (id: number) => {
    if (!id || prefetchCache.has(id)) return;
    getMerchById(id).then((data) => prefetchCache.set(id, data));
  };

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="max-w-[90rem] mx-auto px-6 mt-10">
        {/* Header Section mimicking the "Popular products" style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-[2rem] font-bold text-white tracking-tight">
            CSPS Products
          </h2>

          <div className="flex flex-wrap gap-3">
            {TAGS.map((t) => {
              const isActive = activeTag === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`transition-all duration-300 rounded-full px-6 py-2.5 text-sm font-medium border ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Display - Refined spacing and 4-column desktop layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-white font-medium">Loading products...</p>
            </div>
          ) : merch.length > 0 ? (
            merch.map((c) => (
              <Link
                to={`/merch/${c.merchId}`}
                key={c.merchId}
                onMouseEnter={() => prefetchMerch(c.merchId)}
                className="group flex flex-col"
              >
                {/* Image Container - Updated to CSPS Glassmorphism Style */}
                <div className="relative aspect-square bg-[#242050] border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-900/40">
                  {/* Subtle Gradient Glow behind the image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <img
                    src={c.s3ImageKey ? S3_BASE_URL + c.s3ImageKey : SAMPLE}
                    alt={c.merchName}
                    className="w-full h-full object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-110"
                  />

                  {/* Floating Action Button - Glass Style */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <span className="text-white text-lg">♡</span>
                  </div>
                </div>

                {/* Info Section - Clean and left-aligned */}
                <div className="mt-5 px-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                        CSPS Official
                      </p>
                      <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-[#FDE006] transition-colors">
                        {c.merchName}
                      </h3>
                    </div>
                    <p className="text-white font-bold text-lg">
                      ₱{c.basePrice}
                    </p>
                  </div>

                  {/* Primary Action Button from Design System */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <div className="w-full bg-[#FDE006] text-black text-center py-3 rounded-xl font-bold text-sm">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white/4 rounded-3xl border border-white/10 border-dashed">
              <p className="text-[#D2D2D2] italic">
                No items found in {activeTag.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
