import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      navigate("/login");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Session Expired
        </h2>
        <p className="text-zinc-400 text-center mb-8">
          Your session has expired. Please log in again to continue.
        </p>

        {/* Button */}
        <button
          onClick={handleClose}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
