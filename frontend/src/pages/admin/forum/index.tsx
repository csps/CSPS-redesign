import { useState } from "react";

// --- IMPORTS ---
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import PendingPostCard from "./components/PendingPostCard";
import { LOGOS } from "../../../components/nav.config";

const ForumApproval = () => {
  // Mock Data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Post Title",
      username: "Username",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel dolor nunc. Nunc rhoncus venenatis augue vitae tempor. Nulla malesuada libero magna, sit amet eleifend nunc tincidunt at.",
    },
    {
      id: 2,
      title: "Post Title",
      username: "Username",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel dolor nunc. Nunc rhoncus venenatis augue vitae tempor.",
    },
    {
      id: 3,
      title: "Post Title",
      username: "Username",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ]);

  const cspsLogo = LOGOS[2];

  // Handlers
  const handleApprove = (id: number | string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDecline = (id: number | string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="w-full max-w-5xl mx-auto pt-6 pb-20 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Forum Pending Approval
          </h1>

          <div className="relative inline-block">
            <select className="bg-transparent text-white border-none text-lg font-medium focus:ring-0 cursor-pointer outline-none">
              <option className="text-black" value="january">
                January
              </option>
              <option className="text-black" value="february">
                February
              </option>
            </select>
          </div>
        </div>

        {/* List of Cards */}
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PendingPostCard
              key={post.id}
              post={post}
              logo={cspsLogo}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))}

          {posts.length === 0 && (
            <div className="text-center text-gray-400 py-12 border border-dashed border-gray-600 rounded-lg">
              No pending posts to review.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForumApproval;
