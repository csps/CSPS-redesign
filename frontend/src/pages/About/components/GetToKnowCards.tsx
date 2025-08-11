import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Laptop from "@/assets/SVG/ic_baseline-laptop.svg";
import Fluent from "@/assets/SVG/fluent-emoji-high-contrast_rainbow.svg";
import Rocket from "@/assets/SVG/material-symbols-light_rocket-outline.svg";

const GetToKnowCards = () => {
  return (
    <div data-aos="fade-up" className="w-full flex flex-col gap-5 mt-60">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl lg:text-6xl font-bold text-white">
          {" "}
          Get to know CSP-S{" "}
        </h2>
        <p className="text-lg lg:text-xl text-gray-300">
          Discover who we are and what we aspire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <GlassmorphismCard className="flex flex-col px-8 py-10 text-center min-h-[250px]">
          <div className="flex items-center gap-5">
            <img src={Laptop} alt="Laptop Icon" />
            <p className="text-3xl text-white">Who we are</p>
          </div>
          <div className="text-justify text-white flex-1 flex items-center ">
            <p>
              We are the Computing Society of the Philippines - Students, an
              organization led by students for all computer science students, at
              the University of Cebu main campus.
            </p>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="flex flex-col px-8 py-10 text-center min-h-[280px]  ">
          <div className="flex items-center gap-5">
            <img src={Fluent} alt="Fluent Icon" />
            <p className="text-3xl text-white">Our Mission</p>
          </div>
          <div className="text-justify text-white flex-1 flex items-center">
            <p>
              Fostering an{" "}
              <span
                className="text-white"
                style={{
                  background: `linear-gradient(270deg, rgba(255, 214, 2, 0.83) 0%, rgba(255, 204, 0, 0.85) 15.09%, rgba(255, 163, 0, 0.76) 27.38%, rgba(255, 97, 0, 0.65) 35.53%, rgba(255, 69, 0, 0.62) 47.6%, rgba(122, 0, 255, 0.74) 59.13%, rgba(87, 6, 204, 0.85) 68.03%, rgba(68, 10, 175, 0.91) 86.06%, #160651 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                inclusive, diverse and supportive
              </span>{" "}
              community in the world of computing.
            </p>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="flex flex-col px-8 py-10 text-center min-h-[280px]">
          <div className="flex items-center gap-5">
            <img src={Rocket} alt="Rocket Icon" />
            <p className="text-3xl text-white">Why join us</p>
          </div>
          <div className="text-justify text-white flex-1 flex items-center">
            <ul className="list-disc ">
              <li>Meet like-minded CS peers</li>
              <li>Collaborate on projects</li>
              <li>Share resources</li>
            </ul>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
};

export default GetToKnowCards;
