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
  if (
    !items ||
    items.length === 0 ||
    !merchVariants ||
    merchVariants.length === 0
  )
    return null;

  return (
    <div className="hidden lg:flex justify-center items-center gap-6 flex-shrink-0">
      {/* Pagination Dots */}
      <div className="flex flex-col justify-center gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex
                ? "bg-white opacity-100 scale-125"
                : "bg-white opacity-40 hover:opacity-70"
            }`}
          />
        ))}
      </div>

      {/* Vertical Carousel */}
      <div className="relative w-[250px] h-[700px] overflow-visible">
        {items.map((n, index) => {
          const pos = getSlidePosition(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={n}
              onClick={() => setActiveIndex(index)}
              className="absolute top-1/2 left-1/2 transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(-50%, calc(-50% + ${pos.translateY}px)) scale(${pos.scale})`,
                opacity: pos.opacity,
                zIndex: pos.z,
              }}
            >
              <div
                className={`w-[250px] h-[300px] rounded-2xl flex flex-col items-center justify-center ${
                  isActive ? "bg-gray-50/45" : "bg-purple-200/5"
                }`}
              >
                <div
                  className={`${
                    isActive ? `h-[200px] w-[200px]` : `h-[80px] w-[80px]`
                  } overflow-hidden flex items-center justify-center `}
                >
                  <img
                    src={
                      merchVariants[index]?.s3ImageKey
                        ? S3_BASE_URL + merchVariants[index].s3ImageKey
                        : SAMPLE
                    }
                    className={isActive ? "scale-150" : ""}
                  />
                </div>

                <p className="text-sm mt-2 opacity-80">{n}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopCarousel;
