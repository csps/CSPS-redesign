import type { AnnouncementResponse } from "../../../interfaces/announcement/AnnouncementResponse";

interface AnnouncementCardProps {
  announcement: AnnouncementResponse;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center h-full w-full">
      {announcement.fullPicture && (
        <div className="w-full md:w-[65%] h-full cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
          <img
            src={announcement.fullPicture}
            alt="announcement"
            onClick={() => window.open(announcement.permaLink, "_blank")}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div
        className={`relative w-full ${
          announcement.fullPicture ? "md:w-[35%]" : ""
        } h-full rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 overflow-y-auto`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-sm md:text-base lg:text-lg leading-relaxed whitespace-pre-wrap text-gray-100 font-light">
            {announcement.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
