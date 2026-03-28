import React from "react";
import { BackgroundLines } from "../components/ui/background-lines";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-black text-white relative overflow-hidden ">
      {/* Left: Form Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right: Branding with Background Lines */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center px-6 ">
        {/* Background animation */}
        <BackgroundLines className="absolute inset-0 z-0 bg-black" />

        {/* Text content */}
        <div className="relative z-10 text-center ">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 text-4xl font-bold tracking-tight leading-tight">
          Simple Analytics
          </h2>
          <p className="mt-4 text-neutral-400 text-base max-w-md">
          Simple Analytics is a modern platform that turns Excel and CSV files into powerful, interactive visual insights. With features like 2D/3D charting, upload history, and responsive dashboards, Xlense makes spreadsheet analysis fast, intuitive, and impactful — all within your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
