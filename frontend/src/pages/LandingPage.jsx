// src/pages/LandingPage.jsx
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { BarChart2, UploadCloud, Eye, ShieldCheck } from "lucide-react";
import { Spotlight } from "../components/ui/spotlight-new";

export function SpotlightNewDemo() {
  return (
    <div className="h-[40rem] w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <section className="text-center px-6 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-400 mb-4">
          Xlense Analytics
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg mb-6">
          Upload your spreadsheet. Instantly visualize your data with powerful 2D & 3D charts.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-purple-600 hover:bg-purple-600 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}

const LandingPage = () => {
  return (<>
    <SpotlightNewDemo />
    <div className="bg-[#0f0f0f] text-white min-h-screen">

      {/* Features Section */}
      <section className="px-6 py-16 bg-[#1a1a1a]">
        <h2 className="text-3xl font-bold text-center text-purple-300 mb-10">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow hover:shadow-purple-500 transition">
            <UploadCloud size={32} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-400 text-sm">
              Upload your Excel or CSV files effortlessly. We support drag & drop with real-time feedback.
            </p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow hover:shadow-purple-500 transition">
            <BarChart2 size={32} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">2D/3D Charts</h3>
            <p className="text-gray-400 text-sm">
              Visualize data in modern 2D or interactive 3D charts using Chart.js and Three.js.
            </p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow hover:shadow-purple-500 transition">
            <Eye size={32} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Preview</h3>
            <p className="text-gray-400 text-sm">
              See a live preview of your data as soon as you upload, before you even save it.
            </p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow hover:shadow-purple-500 transition">
            <ShieldCheck size={32} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm">
              Your data is encrypted and never shared. Built with modern security best practices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-purple-300 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#1f1f1f] p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
            <p className="text-gray-400 text-sm">
              Drop your Excel or CSV files into the uploader.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">2. Analyze</h3>
            <p className="text-gray-400 text-sm">
              Instantly get visual insights with powerful graphs.
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">3. Share / Export</h3>
            <p className="text-gray-400 text-sm">
              Export your charts, download data, or share with your team.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#1a1a1a] text-center px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to visualize your data?</h2>
        <p className="text-gray-400 mb-6">Join thousands of analysts already using Simple Analytics.</p>
        <Link
          to="/signup"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md text-lg font-medium transition"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6 border-t border-gray-700 bg-[#0f0f0f]">
        &copy; {new Date().getFullYear()} Simple Analytics. Built with 💻 by your team.
      </footer>
    </div>
  </>
  );
};

export default LandingPage;