import AuthenticatedNav from "../../components/AuthenticatedNav";
import CustomCalendar from "./components/GlassCalendar";
import Layout from "../../components/Layout";

const index = () => {
  return (
    <Layout>
      <AuthenticatedNav />

      <CustomCalendar />
    </Layout>
  );
};

export default index;
