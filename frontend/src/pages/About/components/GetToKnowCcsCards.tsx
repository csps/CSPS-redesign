import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Target from "@/assets/SVG/Target.svg";
import Global from "@/assets/SVG/arcticons_samsung-global-goals.svg";
import Vector from "@/assets/SVG/Vector.svg";
import Handshake from "@/assets/SVG/fluent_handshake-20-regular.svg";

const GetToKnowCcsCards = () => {
  return (
    <div data-aos="fade-up" className="w-full  py-16">
      <div className="mb-10">
        <h1 className="text-6xl font-bold text-white">Get to know CCS</h1>
        <p className="text-lg text-gray-300">
          Discover what the college of computer studies offer to every aspiring
          professionals.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white gap-5">
        <div className="w-full md:max-w-[490px]">
          <GlassmorphismCard className=" flex-col gap-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-5">
                <img src={Global} alt="global" />
                <p className="text-3xl">CCS Goals</p>
              </div>
              <p className="px-4">
                We aim to cultivate a teaching-learning environment that:
              </p>
            </div>
            <div className="px-10">
              <ul className="list-disc space-y-3">
                <li>
                  Promotes scholarly endeavors for the promotion of moral,
                  social, cultural, and environmental interests.
                </li>
                <li>
                  Meets the demands of the industry in terms of technical,
                  personal, and interpersonal skills.
                </li>
                <li>
                  Conducts intellectual, technological, and significant
                  researches in computing.
                </li>
                <li>
                  Optimizes the use of appropriate technologies in the delivery
                  of instruction.
                </li>
                <li>
                  Provides opportunities for faculty and students to participate
                  in community extension services.
                </li>
              </ul>
            </div>
          </GlassmorphismCard>
        </div>
        <div className="w-full md:max-w-[450px] space-y-5 ">
          <div className="">
            <GlassmorphismCard className=" flex-col ">
              <div className="flex items-center gap-5 w-full">
                <img src={Vector} alt="Vector" />
                <p className="text-3xl">CCS Mission</p>
              </div>
              <div className="px-4 py-2">
                <p>
                  We envision being the hub of quality, globally-competitive and
                  socially-responsive information technology education.
                </p>
              </div>
            </GlassmorphismCard>
          </div>
          <div className="">
            <GlassmorphismCard className="w-full flex-col gap-5">
              <div className="flex flex-col gap-5 w-full">
                <div className="flex items-center gap-2">
                  <img src={Target} alt="Target" />
                  <p className="text-3xl">CCS Goals</p>
                </div>
                <p className="px-4 py-2 text-justify w-full ">
                  We commit to continuously:
                </p>
              </div>
              <div className="px-5">
                <ul className="list-disc space-y-3">
                  <li>
                    Offer relevant programs that mold well-rounded computing
                    professionals;
                  </li>
                  <li>Engage in accreditation and quality standards; and</li>
                  <li>Facilitate in building an IT-enabled nation.</li>
                </ul>
              </div>
            </GlassmorphismCard>
          </div>
        </div>
        <div className="w-full md:max-w-[490px]">
          <GlassmorphismCard className=" flex-col gap-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-5">
                <img src={Handshake} alt="global" />
                <p className="text-3xl">CCS Values</p>
              </div>
              <p className="px-4">
                These are the core values that CCS believes in:
              </p>
            </div>
            <div className="px-10">
              <ul className="list-disc space-y-3">
                <li>Initiative (inceptum) wit, practicality, ingenuity</li>
                <li>
                  Innovation (innovatio) technology, creativity, resourcefulness
                </li>
                <li>
                  Integrity (integritas) honesty, trustworthiness, reliability
                </li>
                <li>
                  Intelligence (intelligentia) wisdom, knowledge, expertise
                </li>
                <li>
                  Interdependence (interdependentia) teamwork, cooperation,
                  unity
                </li>
                <li>Industry (industria) diligence, perseverance, hard work</li>
              </ul>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
};

export default GetToKnowCcsCards;
