import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal = ({ isOpen, message = "Processing..." }: LoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F033C] border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center gap-4 animate-scale-in shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AiOutlineLoading3Quarters className="text-purple-400 animate-pulse" size={24} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-xl font-bold text-white">Please Wait</h3>
          <p className="text-zinc-400 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
