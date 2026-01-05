import Layout from "../../../../components/Layout";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import StatusCard from "./components/StatusCard";
import StatusHeader from "./components/StatusHeader";

const Index = () => {
  return (
    <Layout>
      <AuthenticatedNav />

      <div className="w-full">
        <StatusHeader />

        <div className="p-5 sm:p-10 space-y-5">
          {[1, 2, 3].map((index) => (
            <StatusCard key={index} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
