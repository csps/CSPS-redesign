import React from "react";

const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={"min-h-screen relative overflow-hidden " + className}>
      {/* Complex gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(25.71% 30.27% at 89.86% 20.02%, rgba(193, 19, 251, 0.20) 0%, rgba(193, 19, 251, 0.16) 27.88%, rgba(193, 19, 251, 0.00) 100%),
            radial-gradient(93.78% 51.58% at 0% 19.29%, rgba(255, 204, 0, 0.20) 0%, rgba(207, 176, 19, 0.15) 29.33%, rgba(194, 164, 18, 0.13) 43.75%, rgba(126, 99, 10, 0.00) 100%),
            radial-gradient(88.77% 62.89% at 67.78% 70.61%, rgba(52, 21, 168, 0.80) 0%, #290F86 14.42%, #210C71 28.37%, #160651 46.15%, #0F033D 57.21%, #0D0233 100%)
          `,
        }}
      />

      {/* Transition Element 
      <div
        className="absolute bottom-0 left-0 w-full h-32 lg:h-[213px]"
        style={{
          background: `
            radial-gradient(277.08% 64.26% at -20.12% 150%, rgba(255, 204, 0, 0.20) 0%, rgba(207, 176, 19, 0.15) 29.33%, rgba(194, 164, 18, 0.13) 43.75%, rgba(173, 144, 15, 0.09) 69.79%, rgba(126, 99, 10, 0.00) 100%),
            radial-gradient(28.99% 62.7% at 72.96% 76.53%, rgba(52, 21, 168, 0.80) 0%, #290F86 14.42%, #210C71 28.37%, #160651 46.15%, #0F033D 57.21%, #0D0233 100%)
          `
        }}
      /> */}

      {/* Main content */}
      {children}
    </div>
  );
};

export default Layout;
