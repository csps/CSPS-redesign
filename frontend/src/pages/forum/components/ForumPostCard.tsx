import ThumbsUpIcon from "../../../assets/icons/thumbsup.svg";
import CommentIcon from "../../../assets/icons/comments.svg";
import type { postDataProps } from "..";

const ForumPostCard = ({ post }: { post: postDataProps }) => {
  return (
    <div
      className="flex justify-center w-full mt-8 cursor-pointer"
      role="button"
    >
      <div className="w-full max-w-5xl rounded-xl bg-[#290B54] backdrop-blur-xl shadow-2xl p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-600/60" />
          <div className="flex flex-col">
            <span className="text-white font-medium">{post.author}</span>
            <span className="text-xs text-gray-400">
              {post.year} · {post.topic}
            </span>
          </div>
        </div>

        {/* Content  */}
        <div className="w-full rounded-lg overflow-hidden border border-white/10 mb-4">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <img src={ThumbsUpIcon} className="h-5 w-5" alt="Like" />
              <span className="text-sm">{post.likes}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <img src={CommentIcon} className="h-5 w-5" alt="Comments" />
              <span className="text-sm">{post.comments}</span>
            </div>
          </div>

          <span className="text-xs text-gray-400">{post.time}</span>
        </div>
      </div>
    </div>
  );
};

export default ForumPostCard;
