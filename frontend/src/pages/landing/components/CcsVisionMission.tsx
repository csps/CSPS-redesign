import CIRCLELOGO from "../../../assets/icons/circol.svg";
import ROCKETLOGO from "../../../assets/icons/rocket.svg";
import RAINBOWLOGO from "../../../assets/icons/rainbow.svg";
import HANDSHAKELOGO from "../../../assets/icons/Vector(1).svg";
import TARGETLOGO from "../../../assets/icons/Vector(2).svg";

const CcsVisionMission = () => {
  return (
    <div className="w-full py-16 mt-56">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white gap-5">
        {/* CCS Goals */}
        <div className="w-full md:max-w-[490px]">
          <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col gap-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-5">
                <img src={CIRCLELOGO} alt="global" />
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
          </div>
        </div>

        {/* CCS Mission */}
        <div className="w-full md:max-w-[450px] space-y-5">
          <div>
            <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col">
              <div className="flex items-center gap-5 w-full">
                <img src={RAINBOWLOGO} alt="Vector" />
                <p className="text-3xl">CCS Mission</p>
              </div>
              <div className="px-4 py-2">
                <p>
                  We envision being the hub of quality, globally-competitive and
                  socially-responsive information technology education.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 w-full flex-col gap-5">
              <div className="flex flex-col gap-5 w-full">
                <div className="flex items-center gap-2">
                  <img src={TARGETLOGO} alt="Target" />
                  <p className="text-3xl">CCS Goals</p>
                </div>
                <p className="px-4 py-2 text-justify w-full">
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
            </div>
          </div>
        </div>

        {/* CCS Values */}
        <div className="w-full md:max-w-[490px]">
          <div className="border-t-2 border-b-2 border-gray-600 rounded-md space-y-10 py-5 flex-col gap-5">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center gap-5">
                <img src={HANDSHAKELOGO} alt="Handshake" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CcsVisionMission;
