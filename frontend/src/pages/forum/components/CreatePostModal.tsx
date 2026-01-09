import { useState } from "react";
import { FaTimes, FaUpload, FaTag } from "react-icons/fa";

const AVAILABLE_TAGS = [
  "DSA",
  "Java",
  "Math",
  "Python",
  "DiffCal",
  "C",
  "C++",
  "C#",
];

const SimpleCreatePostModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#130b29] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animation-fade-in overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Main Content Area - Two Columns */}
        <div className="flex p-6 h-full gap-6">
          {/* Left Column: Image Upload */}
          <div className="w-1/3 flex items-start">
            <label className="w-full aspect-square bg-[#1e1438] border-2 border-dashed border-purple-500/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/10 transition-all group">
              <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors mb-3">
                <FaUpload className="text-3xl text-purple-300" />
              </div>
              <span className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors">
                Upload Image
              </span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Right Column */}
          <div className="w-2/3 flex flex-col h-full">
            {/* Title */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-300 pl-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter post title"
                className="w-full bg-[#1e1438] text-white placeholder-gray-500 rounded-xl py-3 px-4 border border-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 flex-1 flex flex-col mb-4">
              <label className="text-sm font-medium text-gray-300 pl-1">
                Description
              </label>
              <textarea
                className="w-full flex-1 min-h-[120px] bg-[#1e1438] text-white placeholder-gray-500 rounded-xl py-3 px-4 border border-white/10 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none custom-scrollbar"
                placeholder="Write your post content here..."
              ></textarea>
            </div>

            {/* Tags Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 pl-1 flex items-center gap-2">
                <FaTag className="text-xs" /> Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-[#632FBC] border-[#632FBC] text-white shadow-[0_0_10px_rgba(99,47,188,0.4)]"
                          : "bg-[#1e1438] border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-white"
                      }`}
                    >
                      {tag} {isSelected && "+"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#130b29]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[#632FBC] hover:bg-[#5225a0] shadow-lg shadow-purple-900/20 transition-all transform active:scale-95">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleCreatePostModal;
