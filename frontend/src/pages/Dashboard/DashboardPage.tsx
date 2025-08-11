import Layout from "@/components/Layouts/Layout";
import LogoSection from "@/components/shared/LogoSection";
import Logo from "@/assets/CSPS_LOGO.png";
import Announcements from "./components/Announcements";
import RecentActivites from "./components/RecentActivites";

const Index = () => {
  return (
    <Layout>
      <LogoSection withNav={true} />
      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-64 pb-20">
        <div className="absolute top-42  left-0 w-[84vw] h-[84vw] max-w-[950px] max-h-[950px] lg:top-0 lg:right-[-17rem]">
          <img
            src={Logo}
            alt="CSPS Background"
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300 "
          />
        </div>

        <div className="w-full flex  md:justify-end h-[20rem] md:h-[35rem]">
          <div className="flex flex-col md:ml-10">
            <h2 className="text-white font-bold text-3xl">Welcome Back</h2>
            <h1 className="text-3xl md:text-6xl text-[#FFC300] font-bold">
              John Carl Atillo
            </h1>
          </div>
        </div>
        <Announcements />

        <RecentActivites />
      </div>
    </Layout>
  );
};

export default Index;
