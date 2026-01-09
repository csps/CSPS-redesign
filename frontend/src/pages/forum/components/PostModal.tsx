import { useState } from "react";
import {
  FaTimes,
  FaRegHeart,
  FaRegComment,
  FaPaperPlane,
} from "react-icons/fa";


interface CommentType {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  replies: CommentType[];
}

const PostModal = ({
  onClose,
  postData,
}: {
  onClose: () => void;
  postData: any;
}) => {
  // Enhanced mock data to demonstrate deep nesting (Reddit style)
  const [comments, setComments] = useState<CommentType[]>([
    {
      id: 1,
      author: "JC Atillo",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "3 hours ago",
      likes: 12,
      replies: [
        {
          id: 2,
          author: "Alice",
          content:
            "This is a reply to the first comment. Notice how the line connects us.",
          time: "2 hours ago",
          likes: 5,
          replies: [
            {
              id: 3,
              author: "Bob",
              content:
                "I am replying to Alice. This is the third level of nesting!",
              time: "1 hour ago",
              likes: 3,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      author: "Megan",
      content: "This is a separate top-level comment.",
      time: "5 hours ago",
      likes: 8,
      replies: [],
    },
    {
      id: 5,
      author: "Megan",
      content: "This is a separate top-level comment.",
      time: "5 hours ago",
      likes: 8,
      replies: [],
    },
    {
      id: 6,
      author: "Megan",
      content: "This is a separate top-level comment.",
      time: "5 hours ago",
      likes: 8,
      replies: [],
    },
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-[#130b29] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Post Header */}
          <div className="flex gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-600 border border-purple-400 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold text-lg">
                {postData?.author || "Author"}
              </h3>
              <p className="text-gray-400 text-xs">
                {postData?.year || "2nd Year"} • {postData?.topic || "Topic"}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <div className="text-gray-300 text-sm leading-relaxed space-y-4">
            <div className="w-full bg-[#1e1e1e] rounded-lg border border-gray-700 p-8 flex items-center justify-center text-gray-500 font-mono text-sm mb-4">
              [Code/Image Content]
            </div>
            <p>{postData?.content || "Post content goes here..."}</p>
          </div>

          {/* --- NEW STATS ROW HERE --- */}
          <div className="flex items-center gap-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-white">
              <FaRegHeart /> <span>{postData?.likes || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <FaRegComment /> <span>{comments.length}</span>
            </div>
            <span className="ml-auto text-xs text-gray-500">
              {postData?.time || "Just now"}
            </span>
          </div>

          {/* Comments Section */}
          <div className="pt-2">
            {comments.map((comment) => (
              <CommentNode key={comment.id} comment={comment} />
            ))}
          </div>
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-white/10 bg-[#130b29]">
          <div className="relative">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-[#1e1438] text-white placeholder-gray-400 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-white/5"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-purple-400 transition">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- RECURSIVE COMPONENT ---
const CommentNode = ({ comment }: { comment: CommentType }) => {
  return (
    <div className="flex flex-col mt-4">
      {/* 1. The Comment Itself */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-gray-500 flex-shrink-0 mt-1" />

        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm hover:underline cursor-pointer">
              {comment.author}
            </span>
            <span className="text-gray-500 text-xs">{comment.time}</span>
          </div>

          {/* Body */}
          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>

          {/* Actions */}
          <div className="flex gap-4 text-xs text-gray-400 mt-2 font-medium">
            <button className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded transition">
              <FaRegHeart /> {comment.likes}
            </button>
            <button className="flex items-center gap-1 hover:bg-white/10 px-1 py-0.5 rounded transition">
              <FaRegComment /> Reply
            </button>
          </div>
        </div>
      </div>

      {/* 2. The Nested Replies (Recursion) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex">
          {/* The Vertical Thread Line */}
          <div className="flex flex-col items-center w-8 flex-shrink-0">
            <div className="w-[2px] bg-gray-700/50 h-full mt-1 mb-2 rounded-full hover:bg-gray-500 transition-colors cursor-pointer" />
          </div>

          {/* Container for children */}
          <div className="flex-1">
            {comment.replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostModal;
