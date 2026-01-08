import Footer from "../../components/Footer";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import Layout from "../../components/Layout";
import BackgroundLogos from "./components/BackgroundLogos";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import Activities from "./components/Activities";
import Merch from "./components/Merch";

const Index = () => {


  return (
    <div className="">
      <Layout overflowHidden={true} withFooter={false}>
        <BackgroundLogos />

        {/* Foreground UI */}
        <AuthenticatedNav />

        <Hero />
      </Layout>

      <div className="min-h-screen w-full bg-black flex justify-center py-56">
        <div className="w-full max-w-[90rem] px-6 text-white space-y-50">

          {/** Announcements Section */}
          <Announcements />

          {/** Activities Section */}
          <Activities />

          {/* Merch Section */}
          <Merch />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
