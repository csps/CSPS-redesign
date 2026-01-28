import { useEffect, useState } from "react"; // 1. Import useState
import Footer from "../../../components/Footer";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import SAMPLE from "../../../assets/image 8.png";
import { IoMdAdd } from "react-icons/io";
import ProductModal from "./components/ProductModal"; // 2. Import your Modal Component\i
import { MerchType } from "../../../enums/MerchType";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import { getAllMerchWithoutVariants, getMerchByType } from "../../../api/merch";
import { useNavigate } from "react-router-dom";
import { S3_BASE_URL } from "../../../constant";

const Index = () => {
  // 3. Create state to track if modal is open or closed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const TAGS = ["ALL", ...Object.values(MerchType)];
  const [merch, setMerch] = useState<MerchSummaryResponse[]>([]);
  const [activeTag, setActiveTag] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);

  const navigator = useNavigate();
  const navigate = (merchVaraintId: number) => {
    navigator(`/admin/merch/${merchVaraintId}`);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch(activeTag);
  }, [activeTag]);

  useEffect(() => {
    console.log(`MERCH: ${JSON.stringify(merch)}`);
  }, [merch]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="py-4">
            <div className="flex justify-end gap-5">
              <button
                // 4. Add onClick handler to open the modal
                onClick={() => setIsModalOpen(true)}
                className="flex w-full sm:w-auto items-center border px-2 py-4 text-sm rounded-lg hover:bg-white/10 transition"
              >
                <IoMdAdd className="mr-2" />
                <span>Add Product</span>
              </button>
            </div>
            {TAGS.map((t) => {
              const isActive = activeTag === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`transition-all rounded-full px-7 py-2 cursor-pointer border ${
                    isActive
                      ? "bg-purple-600 border-purple-400 text-white shadow-lg"
                      : "border-purple-200/40 text-gray-300 hover:border-purple-300"
                  }`}
                >
                  {t}
                </button>
              );
            })}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-10 py-10 transition-opacity duration-300 ${
                loading ? "opacity-50" : "opacity-100"
              }`}
            >
              {merch.length > 0
                ? merch.map((c) => (
                    <div
                      key={c.merchId}
                      className="group w-full bg-[#290B54] p-4 flex flex-col justify-center border border-purple-200/40 rounded-2xl transition-transform duration-300 hover:scale-110 relative z-10 cursor-pointer"
                    >
                      <div className="flex justify-center aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            c.s3ImageKey ? S3_BASE_URL + c.s3ImageKey : SAMPLE
                          }
                          alt={c.merchName}
                          className="w-[80%]"
                        />
                      </div>
                      <div className="mt-4">
                        <p className="font-bold">{c.merchName}</p>
                        <p className="text-purple-300">₱{c.basePrice}</p>
                        <p className="text-gray-500">
                          Stock {c.totalStockQuantity}
                        </p>
                        <button
                          className="w-full cursor-pointer bg-white rounded-full text-black py-2 mt-5 font-bold hover:bg-[#341677] hover:text-white transition"
                          onClick={() => navigate(c.merchId)}
                        >
                          View Merch
                        </button>
                      </div>
                    </div>
                  ))
                : !loading && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                      <p className="text-gray-300 italic">
                        No {activeTag.toLowerCase()} items found.
                      </p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Render the Modal and pass the state props */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </>
  );
};

export default Index;
