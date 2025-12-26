import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const UpcomingEvents = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-[#0F033C] w-full max-w-md rounded-xl p-6 relative z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Modal Title
              </h2>
              <p className="text-gray-300 mb-6">
                This is a modal content example. Click outside to close.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded-md text-white"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-purple-600 rounded-md text-white">
                  Action
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-lg md:text-2xl lg:text-3xl font-semibold mb-10">
        Upcoming Events
      </p>
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <SwiperSlide
            key={index}
            className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200  rounded-lg "
            onClick={() => setIsOpen(true)}
          >
            Slide {index}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UpcomingEvents;
