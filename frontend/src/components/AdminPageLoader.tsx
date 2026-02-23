import React from "react";

interface AdminPageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const AdminPageLoader: React.FC<AdminPageLoaderProps> = ({
  isLoading,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Animated Spinner */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>

              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin"></div>

              {/* Inner ring */}
              <div className="absolute inset-2 rounded-full border-2 border-purple-400/10"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading</h2>
            <p className="text-purple-300/80 text-sm animate-pulse">
              Fetching your data...
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-1">
            <div
              className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminPageLoader;
