import SAMPLE from "../../../../assets/image 8.png";

type Props = {
  items: number[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

const MobileCarousel = ({ items, activeIndex, setActiveIndex }: Props) => {
  if (!items?.length) return null;

  return (
    <div className="lg:hidden w-full flex flex-col gap-6">
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar snap-x snap-mandatory">
        {items.map((n, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={n}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-[100px] aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 snap-center ${
                isActive
                  ? "bg-[#242050] border-purple-500/50 shadow-lg shadow-purple-500/10"
                  : "bg-white/5 border-white/5"
              }`}
            >
              <div className="relative w-full h-full p-3 flex items-center justify-center">
                {isActive && (
                  <div className="absolute inset-0 bg-purple-500/10 blur-lg rounded-full" />
                )}
                <img
                  src={SAMPLE}
                  alt={`variant-${n}`}
                  className={`w-full h-full object-contain transition-transform duration-300 ${
                    isActive ? "scale-110" : "scale-90 opacity-60"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Progress Indicator mimicking the "1/5" logic */}
      <div className="flex justify-center items-center gap-4 px-6">
        <div className="flex gap-1.5 h-1 items-center">
          {items.map((_, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 h-full bg-[#FDE006]"
                  : "w-1.5 h-full bg-white/20"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-white/40 uppercase">
          {activeIndex + 1} / {items.length}
        </span>
      </div>
    </div>
  );
};

export default MobileCarousel;
