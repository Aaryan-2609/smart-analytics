import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/config";
import { 
  IconTable, 
  IconChartLine, 
  IconChartPie, 
  IconChartDots3, 
  IconChartBar,
  IconCube,
  IconArrowLeft
} from "@tabler/icons-react";

export default function AxisSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, fileId } = location.state || {};
  
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [chartType, setChartType] = useState("");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real columns from uploaded file
  useEffect(() => {
    const fetchColumns = async () => {
      if (!fileId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`/analysis/map-data/${fileId}`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setColumns(response.data.columns);
      } catch (error) {
        console.error('Error fetching columns:', error);
        alert('Failed to load file data');
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [fileId]);

  // Filter available columns for each axis to prevent duplicates
  const getAvailableColumnsForAxis = (axisType) => {
    const selectedAxes = [];
    if (xAxis && axisType !== 'x') selectedAxes.push(xAxis);
    if (yAxis && axisType !== 'y') selectedAxes.push(yAxis);
    if (zAxis && axisType !== 'z') selectedAxes.push(zAxis);
    
    return columns.filter(col => !selectedAxes.includes(col));
  };

  // Handle axis selection with validation
  const handleAxisChange = (axisType, value) => {
    setError(""); // Clear any previous errors
    
    if (axisType === 'x') {
      setXAxis(value);
      // Clear Y and Z if they conflict with new X selection
      if (value === yAxis) setYAxis("");
      if (value === zAxis) setZAxis("");
    } else if (axisType === 'y') {
      setYAxis(value);
      // Clear Z if it conflicts with new Y selection
      if (value === zAxis) setZAxis("");
    } else if (axisType === 'z') {
      setZAxis(value);
    }
  };

  const handleGenerateChart = () => {
    // Clear previous errors
    setError("");

    // Validation
    if (!xAxis || !yAxis || !chartType) {
      setError("Please select X-axis, Y-axis, and chart type");
      return;
    }

    // Check for duplicate axis selections
    if (xAxis === yAxis || xAxis === zAxis || yAxis === zAxis) {
      setError("X, Y, and Z axes must be different columns");
      return;
    }

    // If 3D chart, Z-axis is required
    if (chartType.includes('3d') && !zAxis) {
      setError("Z-axis is required for 3D charts");
      return;
    }

    navigate("/charts", {
      state: {
        fileName,
        fileId,
        xAxis,
        yAxis,
        zAxis,
        chartType,
        is3D: chartType.includes("3d")
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading file data...</p>
        </div>
      </div>
    );
  }

  if (!fileId) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">No File Selected</h1>
          <button
            onClick={() => navigate('/upload')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            Upload a File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
          >
            <IconArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-purple-400 mb-6">Configure Chart Axes</h1>
        <p className="text-neutral-400 mb-8">File: {fileName}</p>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* X-Axis Selection */}
          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <IconTable className="mr-2" size={20} />
              X-Axis (Categories)
            </h2>
            <select
              value={xAxis}
              onChange={(e) => handleAxisChange('x', e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white"
            >
              <option value="">Select X-Axis</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* Y-Axis Selection */}
          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <IconChartBar className="mr-2" size={20} />
              Y-Axis (Values)
            </h2>
            <select
              value={yAxis}
              onChange={(e) => handleAxisChange('y', e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white"
              disabled={!xAxis} // Disable until X-axis is selected
            >
              <option value="">Select Y-Axis</option>
              {getAvailableColumnsForAxis('y').map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            {!xAxis && (
              <p className="text-sm text-neutral-400 mt-2">Please select X-axis first</p>
            )}
          </div>

          {/* Z-Axis Selection - Only show for 3D charts */}
          {chartType?.includes('3d') && (
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <IconCube className="mr-2" size={20} />
                Z-Axis (Depth) - Required for 3D
              </h2>
              <select
                value={zAxis}
                onChange={(e) => handleAxisChange('z', e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white"
                disabled={!xAxis || !yAxis} // Disable until X and Y axes are selected
              >
                <option value="">Select Z-Axis</option>
                {getAvailableColumnsForAxis('z').map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              {(!xAxis || !yAxis) && (
                <p className="text-sm text-neutral-400 mt-2">Please select X and Y axes first</p>
              )}
            </div>
          )}

          {/* Chart Type Selection */}
          <div className="bg-neutral-800 rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Chart Type</h2>
            
            {/* 2D Charts */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-purple-300">2D Charts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: "line", icon: IconChartLine, label: "Line Chart" },
                  { type: "column", icon: IconChartBar, label: "Bar Chart" },
                  { type: "pie", icon: IconChartPie, label: "Pie Chart" },
                  { type: "scatter", icon: IconChartDots3, label: "Scatter Plot" }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`p-4 rounded-lg border-2 transition ${
                      chartType === type
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-neutral-600 hover:border-purple-400"
                    }`}
                  >
                    <Icon className="mx-auto mb-2" size={24} />
                    <p className="text-sm">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Charts */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-cyan-300">3D Charts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: "3d-column", icon: IconCube, label: "3D Column" },
                  { type: "3d-pie", icon: IconChartPie, label: "3D Pie" },
                  { type: "3d-scatter", icon: IconChartDots3, label: "3D Scatter" },
                  { type: "3d-donut", icon: IconChartPie, label: "3D Donut" }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`p-4 rounded-lg border-2 transition ${
                      chartType === type
                        ? "border-cyan-500 bg-cyan-500/20"
                        : "border-neutral-600 hover:border-cyan-400"
                    }`}
                  >
                    <Icon className="mx-auto mb-2" size={24} />
                    <p className="text-sm">{label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleGenerateChart}
            disabled={!xAxis || !yAxis || !chartType || (chartType.includes('3d') && !zAxis)}
            className={`px-6 py-3 rounded-lg transition ${
              !xAxis || !yAxis || !chartType || (chartType.includes('3d') && !zAxis)
                ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Generate Chart
          </button>
        </div>
      </div>
    </div>
  );
}





