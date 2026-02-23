import SAMPLE from "../../../../assets/image 8.png";
import { S3_BASE_URL } from "../../../../constant";
import type { MerchVariantResponse } from "../../../../interfaces/merch_variant/MerchVariantResponse";

type Props = {
  items: number[];
  merchVariants: MerchVariantResponse[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  getSlidePosition: (i: number) => any;
};

const DesktopCarousel = ({
  items,
  merchVariants,
  activeIndex,
  setActiveIndex,
  getSlidePosition,
}: Props) => {
  if (!items?.length || !merchVariants?.length) return null;

  return (
    <div className="hidden lg:flex flex-row items-center gap-8 flex-shrink-0 py-4">
      {/* Indicator Bar - Inspired by the "1/5" counter in the image */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-1 rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "h-8 bg-[#FDE006] shadow-[0_0_10px_rgba(253,224,6,0.5)]"
                  : "h-3 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vertical Carousel Container */}
      <div className="relative w-[180px] h-[500px]">
        {items.map((n, index) => {
          const pos = getSlidePosition(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={n}
              onClick={() => setActiveIndex(index)}
              className="absolute top-1/2 left-1/2 transition-all duration-700 ease-in-out cursor-pointer"
              style={{
                transform: `translate(-50%, calc(-50% + ${pos.translateY}px)) scale(${pos.scale})`,
                opacity: pos.opacity,
                zIndex: pos.z,
              }}
            >
              <div
                className={`w-[140px] h-[140px] rounded-3xl flex items-center justify-center p-4 border transition-all duration-500 ${
                  isActive
                    ? "bg-[#242050] border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Subtle Glow behind the active thumbnail */}
                  {isActive && (
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-75" />
                  )}

                  <img
                    src={
                      merchVariants[index]?.s3ImageKey
                        ? S3_BASE_URL + merchVariants[index].s3ImageKey
                        : SAMPLE
                    }
                    alt="variant thumbnail"
                    className={`max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 ${
                      isActive ? "scale-110" : "scale-90"
                    }`}
                  />
                </div>
              </div>

              {/* Variant Badge - Only shown for active */}
              <div
                className={`mt-3 text-center transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                <p className="text-[10px] font-bold text-purple-400 uppercase">
                  {merchVariants[index]?.color || "Select"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopCarousel;
