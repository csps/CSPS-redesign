import React from "react";

interface LogoutLoadingModalProps {
  isOpen: boolean;
}

const LogoutLoadingModal: React.FC<LogoutLoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .animation-delay-75 {
          animation-delay: 0.075s;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-2xl shadow-black/50 p-8 max-w-sm w-full mx-4">
          {/* Loading Animation */}
          <div className="flex flex-col items-center text-center">
            {/* Spinning Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-zinc-700/30 border-t-purple-500 animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin animation-delay-75"></div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2">
              Signing Out
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Please wait while we securely log you out...
            </p>

            {/* Progress dots */}
            <div className="flex space-x-1 mt-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutLoadingModal;