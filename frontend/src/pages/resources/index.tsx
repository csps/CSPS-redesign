import Navbar from "../../components/Navbar";
import CSPSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import Layout from "../../components/Layout";
import { TOPICS } from "../../data/topics";
const Index = () => {
  return (
    <Layout classNameInner="relative">
      <Navbar />
      <img
        src={CSPSLOGO}
        className=" absolute w-[90%] h-screen md:object-contain top-90 opacity-80 md:w-[80%] md:h-auto xl:left-60 xl:top-47"
      />
      <div className="space-y-10 py-30">
        {TOPICS.map((topic, index) => (
          <div key={index}>
            <p className="text-2xl font-semibold mb-5">{topic.title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-0 xl:gap-30 ">
              {topic.contents.map((content, index) => (
                <div
                  className=" sm:w-[16rem] sm:h-[20rem] bg-gradient-to-b from-white/10 to-white/5 shadow-[0px_0px_33px_5px_rgba(52,_21,_168,_0.2)] rounded-2xl border-b-2 border-t-2 border-gray-700 p-6 text-white flex flex-col justify-between"
                  key={index}
                >
                  <img src={content.logo} alt={content.name} />
                  <p className="font-semibold">{content.name}</p>
                  <p className="text-xs">{content.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Index;
