import Layout from "../../components/Layout";
import LeftSide from "./components/LeftSide";
import RightSide from "./components/RightSide";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // go back in history
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-md transition"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full py-10 gap-10">
        {/* Left Side - Mapa */}
        <LeftSide />

        {/* Right Side - Form */}
        <RightSide />
      </div>
    </Layout>
  );
};

export default Index;
