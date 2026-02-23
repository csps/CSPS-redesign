// Define the shape of the data
interface PostData {
  id: number | string;
  title: string;
  username: string;
  description: string;
  timestamp?: string;
}

interface PendingPostCardProps {
  post: PostData;
  logo: string; // Added prop for the logo
  onApprove: (id: number | string) => void;
  onDecline: (id: number | string) => void;
}

const PendingPostCard = ({
  post,
  logo,
  onApprove,
  onDecline,
}: PendingPostCardProps) => {
  return (
    <div className="w-full bg-[#0F033C] border border-gray-600 rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-lg">
      {/* LEFT: CSPS Logo / Avatar */}
      <div className="flex-1 flex gap-5">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
            <img
              src={logo}
              alt="CSPS Logo"
              className="w-full h-full object-contain p-1" // 'object-contain' keeps the logo from getting cut off
            />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div>
            <h3 className="text-xl font-bold text-white">{post.title}</h3>
            <p className="text-sm text-gray-400">{post.username}</p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {post.description}
          </p>
        </div>
      </div>

      {/* RIGHT: Action Buttons */}
      <div className="flex flex-col gap-3 min-w-[140px] justify-center">
        <button
          onClick={() => onApprove(post.id)}
          className="w-full py-2 px-4 bg-[#AB83C2] hover:bg-[#9a75b0] text-white font-semibold rounded-md transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onDecline(post.id)}
          className="w-full py-2 px-4 bg-[#7D4B99] hover:bg-[#6a3f82] text-white font-semibold rounded-md transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default PendingPostCard;
