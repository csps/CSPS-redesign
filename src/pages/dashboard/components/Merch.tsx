import { useEffect, useState } from "react";
import { getAllMerchWithoutVariants } from "../../../api/merch";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import { S3_BASE_URL } from "../../../constant";
import { useNavigate } from "react-router-dom";
import SAMPLE from "../../../assets/image 8.png";

const Merch = () => {
  const [merchandise, setMerchandise] = useState<MerchSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMerchandise = async () => {
    setLoading(true);
    try {
      const merchData = await getAllMerchWithoutVariants();
      setMerchandise(merchData);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchandise();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl lg:text-[2rem] font-bold text-white ">
            Show Your CSP-S Pride
          </h2>
          <p className="text-white/60 mt-2 font-medium uppercase text-[10px] sm:text-xs">
            Every purchase supports our mission and community
          </p>
        </div>
        <button
          onClick={() => navigate("/merch")}
          className="bg-[#FDE006] text-black px-8 py-3 rounded-xl font-semibold text-sm uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          Discover
        </button>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[450px]">
            <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-white font-medium">Loading merchandise...</p>
          </div>
        ) : merchandise.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Show only first 3 items */}
            {merchandise.slice(0, 3).map((item) => (
              <div
                key={item.merchId}
                className="group cursor-pointer"
                onClick={() => navigate(`/merch/${item.merchId}`)}
              >
                {/* THE GLASS CARD: 
                   - bg-[#1a1a1a]/80: Dark, high-opacity base
                   - backdrop-blur-xl: Deep blur effect
                   - border-white/10: Main outer border
                */}
                <div className="flex flex-col gap-5 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] transition-all duration-500 hover:bg-[#222222]/90 hover:border-white/20 relative overflow-hidden">
                  {/* Internal Glow Effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />

                  {/* IMAGE CONTAINER: 
                     - Inner border-white/10 for the "inset" look
                     - Inset shadow to mimic the image reference depth
                  */}
                  <div className="w-full aspect-square bg-black/40 rounded-[2rem] flex items-center justify-center p-6 overflow-hidden relative border border-white/10 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-50" />
                    <img
                      src={
                        item.s3ImageKey ? S3_BASE_URL + item.s3ImageKey : SAMPLE
                      }
                      alt={item.merchName}
                      className="w-full h-full object-contain relative z-10 transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* TYPOGRAPHY AREA */}
                  <div className="flex flex-col gap-4 px-1 pb-1 relative z-10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-purple-400 uppercase">
                          {item.merchType}
                        </p>
                        <h3 className="text-xl font-bold text-white line-clamp-1">
                          {item.merchName}
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ₱{Math.floor(item.basePrice)}
                      </p>
                    </div>

                    {/* DIVIDER & FOOTER */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                        <p className="text-[11px] font-bold text-white/40 uppercase">
                          Available
                        </p>
                      </div>
                      <p className="text-[11px] font-black text-[#FDE006] uppercase group-hover:underline">
                        Details
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show More Card */}
            <div
              className="group cursor-pointer"
              onClick={() => navigate("/merch")}
            >
              <div className="flex flex-col gap-5 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] transition-all duration-500 hover:bg-[#222222]/90 hover:border-white/20 relative overflow-hidden h-full min-h-[400px]">
                {/* Internal Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />

                {/* IMAGE CONTAINER */}
                <div className="w-full aspect-square bg-black/40 rounded-[2rem] flex items-center justify-center p-6 overflow-hidden relative border border-white/10 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-50" />
                  <div className="flex items-center justify-center w-full h-full">
                    <svg
                      className="w-16 h-16 text-white/40 group-hover:text-white/60 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* TYPOGRAPHY AREA */}
                <div className="flex flex-col gap-4 px-1 pb-1 relative z-10 flex-grow justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Show More
                    </h3>
                    <p className="text-sm text-white/60">
                      Discover all our merchandise
                    </p>
                  </div>

                  {/* DIVIDER & FOOTER */}
                  <div className="flex items-center justify-center pt-4 border-t border-white/10 mt-auto">
                    <p className="text-[11px] font-black text-[#FDE006] uppercase group-hover:underline">
                      View All
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[450px] text-white/60">
            <p className="text-lg font-medium">No merchandise available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merch;
