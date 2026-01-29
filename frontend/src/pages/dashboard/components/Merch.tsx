import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllMerchWithoutVariants } from "../../../api/merch";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import { S3_BASE_URL } from "../../../constant";
import { useNavigate } from "react-router-dom";

const Merch = () => {
  const [merchandise, setMerchandise] = useState<MerchSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMerchandise = async () => {
      setLoading(true);
      setError(null);
      try {
        const merchData = await getAllMerchWithoutVariants();
        setMerchandise(merchData);
      } catch (err: any) {
        console.error("Error fetching merchandise:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load merchandise. Please check your connection and try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchandise();
  }, []);

  const retryFetchMerchandise = () => {
    const fetchMerchandise = async () => {
      setLoading(true);
      setError(null);
      try {
        const merchData = await getAllMerchWithoutVariants();
        setMerchandise(merchData);
      } catch (err: any) {
        console.error("Error fetching merchandise:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load merchandise. Please check your connection and try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchandise();
  };

  return (
    <div className="w-full">
      <div className="w-full mb-10">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm md:text-xl lg:text-4xl font-semibold">
            Show Your CSP-S Pride
          </p>
          <button
            onClick={() => navigate("/merch")}
            className="bg-[#4A2558] px-4 py-2 text-xs md:text-lg rounded-full hover:bg-[#3a1e45] transition-colors"
          >
            Discover
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-lg">
          Every purchase supports our mission and community
        </p>
      </div>
      <div className="">
        {error ? (
          <div className="flex flex-col justify-center items-center h-[400px] bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="text-red-400 text-center mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="font-semibold mb-2">Failed to Load Merchandise</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={retryFetchMerchandise}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : merchandise.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {merchandise.map((item) => (
              <SwiperSlide
                key={item.merchId}
                className={`
                  !bg-[#BBBBBB]/20 flex justify-center items-center 
                  !h-[400px]
                  rounded-xl
                `}
              >
                <div className="border-b-2 border-t-2 border-[#919191] shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] w-full h-full rounded-3xl flex justify-center items-center flex-col p-4">
                  {item.s3ImageKey && (
                    <img
                      src={S3_BASE_URL + item.s3ImageKey}
                      alt={item.merchName}
                      className="w-24 h-24 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-1 text-center">
                    {item.merchName}
                  </h3>
                  <p className="text-gray-300 text-xs mb-2 text-center line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center w-full mt-auto">
                    <span className="text-purple-400 text-sm font-medium">
                      {item.merchType}
                    </span>
                    <span className="text-white font-semibold">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  {item.totalStockQuantity !== undefined && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.totalStockQuantity} in stock
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex flex-col justify-center items-center h-[400px] bg-gray-500/10 border border-gray-500/20 rounded-xl p-6">
            <div className="text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="font-semibold mb-2">No Merchandise Available</p>
              <p className="text-sm">
                Check back later for new CSP-S merchandise!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merch;
