// src/pages/UploadSuccess.jsx
"use client";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconFileSpreadsheet,
  IconArrowLeft,
  IconChartBar,
  IconDatabase,
  IconRobotFace
} from "@tabler/icons-react";

export default function UploadSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get uploaded file name from state passed during navigation
  // This is typically set after uploading the file in a previous page/component
  const fileName = location.state?.fileName || "your_excel_file.xlsx";

  // ================================================
  // 🚀 Backend Integration Placeholder (Not Logic)
  // ================================================
  // At this point, you may:
  // ✅ Trigger a backend call to fetch post-upload metadata
  // ✅ Trigger chart processing via backend
  // ✅ Trigger AI analysis processing on backend
  // Example:
  // useEffect(() => {
  //   fetch("/api/process-ai", { method: "POST", body: JSON.stringify({ fileName }) })
  // }, []);
  // NOTE: Not implemented here; just a placeholder.
  // ================================================

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6">
      <div className="max-w-2xl w-full bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-lg text-center">

        {/* ✅ Upload confirmation icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-600 text-white p-3 rounded-full">
            <IconCheck size={32} />
          </div>
        </div>

        {/* ✅ Upload Success Message */}
        <h1 className="text-2xl font-bold text-green-400 mb-2">Upload Successful!</h1>
        <p className="text-neutral-300 mb-6">
          Your file <span className="text-white font-semibold">{fileName}</span> has been uploaded.
        </p>

        {/* ✅ File Processing Status Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-4 flex flex-col items-center">
            <IconFileSpreadsheet size={32} className="text-purple-400 mb-2" />
            <p className="text-sm">Excel Detected</p>
          </div>
          <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-4 flex flex-col items-center">
            <IconChartBar size={32} className="text-blue-400 mb-2" />
            <p className="text-sm">Chart Ready</p>
          </div>
          <div className="bg-neutral-900 rounded-lg border border-neutral-700 p-4 flex flex-col items-center">
            <IconRobotFace size={32} className="text-yellow-300 mb-2" />
            <p className="text-sm">AI Insight Activated</p>
          </div>
        </div>

        {/* ✅ Fun Quote */}
        <p className="text-purple-300 text-sm italic mb-6">
          “Spreadsheets are like relationships... complicated, but full of data.” 😄
        </p>

        {/* ✅ Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow-md flex items-center gap-2 mx-auto"
        >
          <IconArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
