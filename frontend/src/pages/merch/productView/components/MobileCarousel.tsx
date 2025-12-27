import SAMPLE from "../../../../assets/image 8.png";

type Props = {
  items: number[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

const MobileCarousel = ({ items, activeIndex, setActiveIndex }: Props) => {
  return (
    <div className="lg:hidden w-full flex flex-col items-center mt-6">
      <div className="flex gap-3 overflow-x-scroll px-4 py-4 w-full">
        {items.map((n, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={n}
              onClick={() => setActiveIndex(index)}
              className={`w-[110px] h-[110px] rounded-xl flex flex-col items-center justify-center ${
                isActive ? "bg-purple-200/20 scale-105" : "bg-white/5"
              }`}
            >
              <img src={SAMPLE} className={isActive ? "scale-110" : ""} />
              <p className="text-[11px] mt-2 opacity-80">{n}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCarousel;
