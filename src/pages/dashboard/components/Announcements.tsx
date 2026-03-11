import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllAnnouncements } from "../../../api/announcement";
import type { AnnouncementResponse } from "../../../interfaces/announcement/AnnouncementResponse";
import AnnouncementCard from "./AnnouncementCard";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAllAnnouncements();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div  className="w-full">
      <div className="w-full flex justify-between mb-5">
        <p className="md:text-xl lg:text-4xl font-semibold">Announcements</p>
        <p
          className="text-xs mt-[.3rem] text-purple-400 cursor-pointer hover:text-purple-300 lg:text-lg font-semibold"
          onClick={() =>
            window.open("https://www.facebook.com/UCMainCSPS", "_blank")
          }
        >
          Read more
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px] lg:h-[665px]">
          <p className="text-gray-500">Loading announcements...</p>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px] lg:h-[665px]">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px] lg:h-[665px]">
          <p className="text-gray-500">No announcements available</p>
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full h-full pb-10"
        >
          {announcements.map((announcement, index) => (
            <SwiperSlide
              key={announcement.id || index}
              className={`
                   !flex flex-col md:flex-row gap-10 justify-center items-center 
                    !h-[300px] sm:!h-[400px] md:!h-[500px] lg:!h-[665px]
                    rounded-xl
                  `}
            >
              <AnnouncementCard announcement={announcement} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Announcements;
