import Footer from "../../components/Footer";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import Layout from "../../components/Layout";
import BackgroundLogos from "./components/BackgroundLogos";
import Hero from "./components/Hero";
import Announcements from "./components/Announcements";
import Activities from "./components/Activities";
import Merch from "./components/Merch";
import { useAuthStore } from "../../store/auth_store";
import LoadingPage from "../loading";

const Index = () => {
  const user = useAuthStore((state) => state.user);

  // Show loading until user data is available
  if (!user) {
    return <LoadingPage />;
  }

  return (
    <div className="">
      <Layout overflowHidden={true} withFooter={false}>
        <BackgroundLogos />

        {/* Foreground UI */}
        <AuthenticatedNav />

        <Hero />
      </Layout>

      <div className="min-h-screen w-full bg-black flex justify-center py-20 md:py-56">
        <div className="w-full max-w-[90rem] px-4 md:px-6 text-white space-y-50">
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
