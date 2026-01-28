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
      console.error(err);
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

      <div className="mt-5">
        <div className="flex flex-wrap gap-5">
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
        </div>

        {/* Grid Display */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5 gap-10 py-26 transition-opacity duration-300 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {merch.length > 0
            ? merch.map((c) => (
                <Link
                  to={`/merch/${c.merchId}`}
                  key={c.merchId}
                  onMouseEnter={() => prefetchMerch(c.merchId)}
                  className="group w-full bg-[#290B54] p-4 flex flex-col justify-center border border-purple-200/40 rounded-2xl transition-transform duration-300 hover:scale-110 relative z-10 cursor-pointer"
                >
                  <div className="flex justify-center aspect-[4/3] overflow-hidden">
                    <img
                      src={c.s3ImageKey ? S3_BASE_URL + c.s3ImageKey : SAMPLE}
                      alt={c.merchName}
                      className="w-[70%] transition-transform duration-500 ease-out group-hover:scale-150 relative z-20"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">{c.merchName}</p>
                    <p className="text-purple-300">₱{c.basePrice}</p>
                    <button className="w-full bg-white rounded-full text-black py-2 mt-5 font-bold">
                      View Merch
                    </button>
                  </div>
                </Link>
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
    </Layout>
  );
};

export default Index;
