"use client";

import React, { useState, useEffect } from "react";
import {
  IconDatabase,
  IconFileText,
  IconBrain,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { cn } from "../lib/utils";
import axios from "../api/config";
import { getUserProfile } from "../api/auth";

import StatCard from "../components/StatCard";
import FileUploadDemo from "../components/FileUploadDemo";
import Chart2DPreview from "../components/Chart2D";
import Chart3DPreview from "../components/Chart3D";
import TopNavbar from "../components/TopNavbar";

export default function Dashboard() {
  const [showUploadInline, setShowUploadInline] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUploads: 0,
    chartsCreated: 0,
    lastUpload: null,
    storageUsed: "0 MB",
    recentUploads: []
  });
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user profile
        const profileResponse = await getUserProfile();
        setUsername(profileResponse.data.name);
        
        // Get dashboard stats
        const statsResponse = await axios.get('/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setDashboardData(statsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUsername(userData.name || "User");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No uploads yet";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className={cn(
        "relative flex w-full min-h-screen flex-col overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 text-white"
      )}
    >
      <TopNavbar username={username} />

      <main className="flex-1 p-6 bg-neutral-900 text-white transition-all duration-300">
        <div className="mb-6 pt-14">
          <h1 className="text-3xl font-bold text-purple-400">
            Welcome, {username} 👋
          </h1>
          <p className="text-neutral-400 mt-1">
            Here's a quick look at your analytics activity.
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowUploadInline(!showUploadInline)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md transition"
          >
            + Upload New File
          </button>
        </div>

        {showUploadInline && (
          <div className="mb-10">
            <FileUploadDemo />
          </div>
        )}

        {/* Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-neutral-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-neutral-700 rounded mb-2"></div>
                <div className="h-8 bg-neutral-700 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <StatCard 
                title="Total Uploads" 
                value={dashboardData.totalUploads.toString()} 
                icon={<IconFileText size={28} />} 
              />
              <StatCard 
                title="Charts Created" 
                value={dashboardData.chartsCreated.toString()} 
                icon={<IconDatabase size={28} />} 
              />
              <StatCard 
                title="Last Upload" 
                value={formatDate(dashboardData.lastUpload)} 
                icon={<IconArrowUpRight size={28} />} 
              />
              <StatCard 
                title="Storage Used" 
                value={dashboardData.storageUsed} 
                icon={<IconBrain size={28} />} 
              />
            </>
          )}
        </div>

        {/* Dynamic Recent Uploads */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">📁 Recent Uploads</h2>
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-neutral-800">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between animate-pulse">
                    <div className="h-4 bg-neutral-700 rounded w-1/3"></div>
                    <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : dashboardData.recentUploads.length === 0 ? (
              <p className="text-neutral-400 italic">No files uploaded yet. Upload your first Excel file to get started! 📊</p>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentUploads.map((upload, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-700 last:border-b-0">
                    <span className="text-white font-medium">{upload.name}</span>
                    <span className="text-neutral-400 text-sm">{formatDate(upload.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Previews */}
        <div className="mb-10">
          <div className="overflow-x-auto md:overflow-x-scroll scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-neutral-800">
            <div className="flex space-x-6 min-w-[800px] md:min-w-full">
              <Chart2DPreview />
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="overflow-x-auto md:overflow-x-scroll scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-neutral-800">
            <div className="flex space-x-6 min-w-[800px] md:min-w-full">
              <Chart3DPreview />
            </div>
          </div>
        </div>

        {/* Dynamic Smart Insights */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 p-6 rounded-lg shadow-lg border border-purple-600">
          <h3 className="text-lg font-semibold text-white mb-2">🧠 Smart Insight</h3>
          <p className="text-sm text-purple-100">
            {loading ? (
              "Loading insights..."
            ) : dashboardData.totalUploads > 0 ? (
              `You've uploaded ${dashboardData.totalUploads} files and created ${dashboardData.chartsCreated} charts. ${
                dashboardData.chartsCreated > dashboardData.totalUploads 
                  ? "Great job exploring different visualizations!" 
                  : "Try creating more charts to discover insights in your data!"
              }`
            ) : (
              "Upload your first Excel file to start discovering insights with AI-powered analytics!"
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
