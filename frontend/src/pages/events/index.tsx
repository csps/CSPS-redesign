import Layout from "../../components/Layout";
import RecentEvents from "./components/RecentEvents";
import UpcomingEvents from "./components/UpcomingEvents";
import AuthenticatedNav from "../../components/AuthenticatedNav";

const Index = () => {
  return (
    <Layout>
      <AuthenticatedNav />
      
      {/* Page Header */}
      <div className="py-8 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Events
        </h1>
        <p className="text-white/60">Stay updated with our latest activities and gatherings</p>
      </div>
      
      {/* Events Sections */}
      <UpcomingEvents />
      <RecentEvents />
    </Layout>
  );
};

export default Index;
