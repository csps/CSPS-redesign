import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Group from "@/assets/SVG/Group.svg";
import Shield from "@/assets/SVG/ph_shield-check-thin.svg";

const Cards = () => {
  return (
    <div
      data-aos="fade-up"
      className=" flex flex-wrap justify-center items-stretch gap-10"
    >
      <GlassmorphismCard className="flex flex-col items-center justify-evenly px-8 py-10 text-center w-60 min-h-[250px]">
        <div className="mb-4">
          <img src={Group} className="mx-auto h-20" />
        </div>
        <h3 className="text-white text-2xl lg:text-4xl font-normal mt-2">
          200+
        </h3>
      </GlassmorphismCard>

      <GlassmorphismCard className="flex flex-col items-center justify-evenly px-8 py-10 text-center w-60 min-h-[250px]">
        <div className="mb-4">
          <img src={Shield} className="mx-auto h" />
        </div>
        <h3 className="text-white text-2xl lg:text-4xl font-normal">
          accredited
        </h3>
      </GlassmorphismCard>

      <GlassmorphismCard className="flex flex-col items-center justify-center px-8 py-10 text-center w-60 min-h-[250px]">
        <h3 className="text-white text-8xl font-normal">2023</h3>
      </GlassmorphismCard>
    </div>
  );
};

export default Cards;
