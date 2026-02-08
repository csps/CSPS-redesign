import { IoWarning } from "react-icons/io5";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: "approve" | "reject";
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0F033C] border border-purple-500/20 w-full max-w-sm rounded-2xl flex flex-col items-center p-6 text-center shadow-2xl animate-scale-in">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            type === "approve"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          <IoWarning size={24} />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl ${
              type === "approve"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                : "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500"
            }`}
          >
            {type === "approve" ? "Confirm" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
