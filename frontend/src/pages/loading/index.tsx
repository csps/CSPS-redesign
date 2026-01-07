import React from "react";

const LoadingPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        {/* Animated Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0">
            <div className="w-full h-full border-4 border-purple-900 border-t-purple-500 border-r-purple-500 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full"></div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Loading</h2>
          <p className="text-gray-400 text-sm">Preparing your page...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
