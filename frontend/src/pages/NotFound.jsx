// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { IconMoodSadDizzy, IconFileSpreadsheet } from "@tabler/icons-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <IconFileSpreadsheet size={80} className="mx-auto text-green-500 animate-pulse" />
        <h1 className="text-5xl font-bold mt-4 text-purple-400">404 - Cell Not Found</h1>

        <p className="text-lg mt-2 text-neutral-300">You tried to access <code>=A404</code>, but the spreadsheet screamed "REF!" 😵‍💫</p>
        <p className="mt-1 text-sm text-neutral-500">Even Excel couldn't SUM this page.</p>

        <div className="bg-neutral-800 p-4 mt-6 rounded-lg text-sm text-left">
          <p>🔍 Error: FileNotFoundException.xlsx</p>
          <p>📅 Last seen: In a mysterious pivot table</p>
          <p>🧪 Tried: =IF(page="exist", "Load", "Cry")</p>
        </div>

        <button
          onClick={() => navigate("/dashboard")} // ✅ This is a frontend redirect — no backend API call needed
          className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition shadow"
        >
          🧾 Return to Dashboard
        </button>

        <div className="mt-6 text-xs text-neutral-500 italic">
          Or stay here and cry over a missing Excel row 😭
        </div>
      </div>
    </div>
  );
};

export default NotFound;

/**
 * 🔧 Backend Integration Notes:
 * 
 * ✅ No backend logic is required here.
 * This is a static 404 error page shown when the user visits a route 
 * that doesn't exist in the frontend route definitions.
 * 
 * 📌 If you want to log 404 hits (analytics), you could:
 *   - Optionally send a POST request to your backend logging system
 *     inside a useEffect() like:
 *     useEffect(() => {
 *       axios.post('/api/log-404', { path: window.location.pathname });
 *     }, []);
 * 
 * But for general use in an SPA (Single Page App), this page works entirely in the frontend.
 */
