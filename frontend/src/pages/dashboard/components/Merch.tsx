import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllMerchWithoutVariants } from "../../../api/merch";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import { S3_BASE_URL } from "../../../constant";

const Merch = () => {
  const [merchandise, setMerchandise] = useState<MerchSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMerchandise = async () => {
      setLoading(true);
      try {
        const merchData = await getAllMerchWithoutVariants();
        setMerchandise(merchData);
      } catch (err) {
        console.error("Error fetching merchandise:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchandise();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full mb-10">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm md:text-xl lg:text-4xl font-semibold">
            Show Your CSP-S Pride
          </p>
          <button className="bg-[#4A2558] px-4 py-2 text-xs md:text-lg rounded-full">
            Discover
          </button>
        </div>
        <p className="text-gray-400 text-xs md:text-lg">
          Every purchase supports our mission and community
        </p>
      </div>
      <div className="">
        {loading ? (
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
          <div className="flex justify-center items-center h-[400px]">
            <p className="text-gray-400">No merchandise available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merch;
