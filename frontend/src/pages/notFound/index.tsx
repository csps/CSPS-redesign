import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import notFound from "../../assets/notFound.png";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <img
          src={notFound}
          alt="404 - Page not found"
          className="w-2/3 max-w-xs md:max-w-sm mb-8"
        />

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Page not found
        </h1>

        <p className="text-gray-400 mb-6">
          Sorry, the page you are looking for doesn’t exist or was moved.
        </p>

        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition"
        >
          Go back home
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
