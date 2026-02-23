import { useState } from "react";
import Layout from "../../components/Layout";
import AuthenticatedNav from "../../components/AuthenticatedNav";
import Glass from "../../assets/icons/glass.svg";
import CreateIcon from "../../assets/icons/create.svg";
import { FaFilter } from "react-icons/fa";
import ForumPostCard from "./components/ForumPostCard";
import PostModal from "./components/PostModal";
import CreatePostModal from "./components/CreatePostModal";

const FILTER_TAGS = [
  "DSA",
  "Java",
  "Math",
  "Python",
  "DiffCal",
  "C",
  "C++",
  "C#",
];

export type postDataProps = {
  id: number;
  author: string;
  year: string;
  topic: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  image: string;
};

const Index = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const postData: postDataProps[] = [
    {
      id: 1,
      author: "Jc Atillo",
      year: "2nd Year",
      topic: "Tips & Tricks",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a porttitor turpis. Pellentesque ut metus fermentum risus laoreet fringilla ultricies eu mi.",
      time: "3 hours ago",
      likes: 12,
      comments: 2,
      image: "https://via.placeholder.com/900x400",
    },
    {
      id: 2,
      author: "Alice",
      year: "3rd Year",
      topic: "JavaScript",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel justo odio. Pellentesque nec aliquam odio. Nullam luctus.",
      time: "1 day ago",
      likes: 8,
      comments: 5,
      image: "https://via.placeholder.com/900x400",
    },
    {
      id: 3,
      author: "Bob",
      year: "1st Year",
      topic: "Python",
      content:
        "Sed porttitor quam hendrerit sapien volutpat accumsan. Proin dictum sed ligula cursus egestas. Etiam at fringilla quam.",
      time: "2 days ago",
      likes: 15,
      comments: 3,
      image: "https://via.placeholder.com/900x400",
    },
  ];

  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter((t) => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="flex justify-center w-full py-6 md:py-10 mb-10">
        <div className="flex flex-col w-full max-w-5xl px-4">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            
            {/* Search and Filter Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full md:w-auto">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-64 lg:w-80">
                <input
                  type="text"
                  placeholder="Search forum"
                  className="w-full bg-white/5 border-t border-b border-purple-200/40 backdrop-blur-lg shadow-2xl outline-none rounded-md p-2 pl-10 text-white"
                />
                <img
                  src={Glass}
                  className="absolute top-3.5 left-4"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex gap-2 px-4 py-2 items-center justify-center rounded-lg transition-all w-full sm:w-auto ${
                    isFilterOpen
                      ? "bg-[#5225a0] text-white ring-2 ring-purple-400/50"
                      : "bg-[#632FBC] text-white hover:bg-[#5225a0]"
                  }`}
                >
                  <FaFilter />
                  Filter
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full sm:w-72 bg-[#4c1d95] rounded-2xl shadow-2xl border border-purple-400/30 p-4 z-50 animation-fade-in origin-top-left">
                    <div className="flex items-center justify-between text-white border-b border-white/20 pb-2 mb-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <FaFilter className="text-sm" /> Filter
                      </div>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-white/70 hover:text-white text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {FILTER_TAGS.map((tag) => {
                        const isActive = activeFilters.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleFilter(tag)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                              isActive
                                ? "bg-white text-[#4c1d95] shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {tag} <span>+</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeFilters.length > 0 && (
                      <button
                        onClick={() => setActiveFilters([])}
                        className="w-full mt-4 py-1.5 text-xs text-purple-200 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#632FBC] text-white flex gap-2 px-4 py-2 items-center justify-center rounded-lg hover:bg-[#5225a0] transition w-full md:w-auto"
            >
              <img
                src={CreateIcon}
                className="h-6 w-6"
                alt=""
                aria-hidden="true"
              />
              Create Post
            </button>
          </div>

          {/* Post List */}
          <div className="space-y-4">
            {postData.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className="cursor-pointer"
              >
                <ForumPostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Post Modal */}
      {selectedPost && (
        <PostModal
          onClose={() => setSelectedPost(null)}
          postData={postData.find((post) => post.id === selectedPost)}
        />
      )}

      {/* Create Post Modal  */}
      {isCreateModalOpen && (
        <CreatePostModal onClose={() => setCreateModalOpen(false)} />
      )}


    </Layout>
  );
};

export default Index;