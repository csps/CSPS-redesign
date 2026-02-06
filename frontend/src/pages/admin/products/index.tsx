import { useEffect, useState } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { IoMdAdd } from "react-icons/io";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import ProductModal from "./components/ProductModal";
import { MerchType } from "../../../enums/MerchType";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import { getAllMerchWithoutVariants, getMerchByType } from "../../../api/merch";
import { useNavigate } from "react-router-dom";
import { S3_BASE_URL } from "../../../constant";
import Layout from "../../../components/Layout";
import CSPSLOGO from "../../../assets/logos/CSPS PNG (1) 1.png";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [merch, setMerch] = useState<MerchSummaryResponse[]>([]);
  const [activeTag, setActiveTag] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);

  const navigator = useNavigate();
  const navigate = (merchId: number) => {
    navigator(`/admin/merch/${merchId}`);
  };

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

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AuthenticatedNav />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-12 mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Products Inventory
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#FFB800] text-black px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <IoMdAdd className="text-lg sm:text-xl" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Filter Bar Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:mb-10">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none focus:border-white/20 placeholder:text-white/40"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <select className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none min-w-[180px] [&>option]:bg-[#1E293B] [&>option]:text-white">
              <option>All Stock Status</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
            <select
              value={activeTag}
              onChange={(e) => setActiveTag(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none min-w-[180px] [&>option]:bg-[#1E293B] [&>option]:text-white"
            >
              <option value="ALL">All Categories</option>
              {Object.values(MerchType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Display */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={CSPSLOGO}
                  alt="Loading"
                  className="w-24 h-24 animate-spin"
                />
                <p className="text-white text-lg font-medium">
                  Loading products...
                </p>
              </div>
            </div>
          )}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 transition-all duration-500 ${loading ? "opacity-30 blur-sm" : "opacity-100"}`}
          >
            {merch.map((item) => (
              <div
                key={item.merchId}
                className="bg-[#1E293B]/40 border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col group transition-all hover:bg-[#1E293B]/60"
              >
                {/* Product Image Box */}
                <div className="aspect-[4/3] bg-[#0F172A]/60 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden mb-3 sm:mb-4">
                  <img
                    src={
                      item.s3ImageKey ? S3_BASE_URL + item.s3ImageKey : SAMPLE
                    }
                    alt={item.merchName}
                    className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1">
                  <span className="text-[#9f8fd8] font-bold mb-1 text-xs sm:text-sm">
                    MERCH {item.merchId}
                  </span>
                  <h3 className="text-white font-medium text-sm sm:text-base mb-1 truncate">
                    {item.merchName}
                  </h3>
                  <p className="text-[#FFB800] font-bold text-base sm:text-lg mb-3 sm:mb-4">
                    ₱{item.basePrice.toLocaleString()}
                  </p>
                  {/* Stock Info Area */}
                  <div className="bg-[#0F172A]/40 rounded-xl p-2 sm:p-3 border border-white/5 flex justify-between items-center mt-auto mb-3 sm:mb-4">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] font-bold uppercase">
                        Stock
                      </span>
                      <span className="text-white font-bold text-sm sm:text-base">
                        {item.totalStockQuantity}
                      </span>
                    </div>

                    {(item.totalStockQuantity ?? 0) > 0 ? (
                      <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] px-2 sm:px-3 py-1 rounded-lg font-bold uppercase border border-[#10B981]/20">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-[#EF4444]/20 text-[#EF4444] text-[10px] px-2 sm:px-3 py-1 rounded-lg font-bold uppercase border border-[#EF4444]/20">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  {/* Action Buttons (Visible on hover or card bottom) */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(item.merchId)}
                      className="flex-1 bg-[#f9a8f1] text-black py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:brightness-110"
                    >
                      <FiEdit3 className="text-sm" /> Edit
                    </button>
                    <button className="flex-1 bg-[#EF4444] text-white py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold hover:brightness-110">
                      <FiTrash2 className="text-sm" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default Index;
