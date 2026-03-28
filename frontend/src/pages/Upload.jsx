
import React from "react";
import { useNavigate } from "react-router-dom";
import FileUploadDemo from "../components/FileUploadDemo";

export default function Upload() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">Upload File</h1>
        
        <div className="bg-neutral-800 rounded-lg p-6">
          <p className="text-neutral-300 mb-4">Upload your Excel file for analysis</p>
          
          {/* Use the actual FileUploadDemo component */}
          <FileUploadDemo />
          
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

