import React from "react";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  message: string;
  warningMessage?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title,
  message,
  warningMessage,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-10">
      <div className="bg-gray-900 border border-white/20 rounded-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300">{message}</p>
          {warningMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">⚠️ {warningMessage}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
