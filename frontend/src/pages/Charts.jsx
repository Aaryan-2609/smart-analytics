// src/pages/Charts.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';
import { IconArrowLeft, IconDeviceFloppy, IconCheck } from '@tabler/icons-react';
import axios from '../api/config';
import AIInsights from '../components/AIInsights';

const Charts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { fileName, xAxis, yAxis, zAxis, chartType, is3D, fileId } = location.state || {};
  
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch real data from uploaded Excel file
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.post(`/analysis/generate-charts/${fileId}`, {
          xAxis,
          yAxis,
          zAxis,
          chartType
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setChartData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    };

    if (fileId && xAxis && yAxis) {
      fetchChartData();
    } else {
      setLoading(false);
    }
  }, [fileId, xAxis, yAxis, zAxis, chartType]);

  const handleSaveChart = async () => {
    try {
      setSaving(true);
      console.log('Attempting to save chart with data:', {
        fileName,
        fileId,
        chartType,
        xAxis,
        yAxis,
        zAxis,
        is3D: chartType.includes('3d')
      });
      
      const response = await axios.post('/analysis/save-chart', {
        fileName,
        fileId,
        chartType,
        xAxis,
        yAxis,
        zAxis,
        is3D: chartType.includes('3d')
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Save response:', response.data);

      if (response.data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving chart:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to save chart: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getChartOptions = () => {
    if (!chartData) return {};

    const is3DChart = chartType?.includes('3d');
    const baseChartType = chartType?.replace('3d-', '');

    const baseOptions = {
      chart: {
        backgroundColor: '#1a1a1a',
        type: baseChartType === 'donut' ? 'pie' : baseChartType,
        ...(is3DChart && {
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0,
            depth: baseChartType === 'column' ? 70 : 35
          }
        })
      },
      accessibility: {
        enabled: false
      },
      title: {
        text: `${chartType?.toUpperCase()} Chart - ${fileName}`,
        style: { color: '#ffffff' }
      },
      xAxis: {
        categories: chartData.categories,
        title: { text: xAxis, style: { color: '#cccccc' } },
        labels: { style: { color: '#cccccc' } }
      },
      yAxis: {
        title: { text: yAxis, style: { color: '#cccccc' } },
        labels: { style: { color: '#cccccc' } }
      },
      plotOptions: {
        ...(baseChartType === 'pie' && {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            ...(is3DChart && { depth: 35 }),
            ...(chartType === '3d-donut' && { innerSize: 100 }),
            dataLabels: {
              enabled: true,
              style: { color: '#ffffff' }
            }
          }
        }),
        ...(baseChartType === 'column' && is3DChart && {
          column: {
            depth: 25,
            colorByPoint: true
          }
        })
      },
      series: [{
        name: `${yAxis} vs ${xAxis}`,
        data: chartData.seriesData,
        color: '#8b5cf6'
      }],
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#cccccc' }
      }
    };

    return baseOptions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (!fileName || !xAxis || !yAxis || !chartType) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Missing Chart Configuration</h1>
          <button
            onClick={() => navigate('/axis-selection')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            Go Back to Configuration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
              >
                <IconArrowLeft size={16} />
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/axis-selection', { state: { fileName, fileId } })}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
              >
                <IconArrowLeft size={16} />
                Back to Configuration
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-400">Generated Chart</h1>
              <p className="text-neutral-400 mt-2">File: {fileName}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSaveChart}
              disabled={saving || saved}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : saving 
                    ? 'bg-neutral-600 text-neutral-400' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {saved ? (
                <>
                  <IconCheck size={16} />
                  Saved to History
                </>
              ) : saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <IconDeviceFloppy size={16} />
                  Save to History
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate('/axis-selection', { state: { fileName, fileId } })}
              className="bg-neutral-600 hover:bg-neutral-700 px-4 py-2 rounded-lg"
            >
              Configure New Chart
            </button>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-6">
          <AIInsights 
            fileId={fileId} 
            fileName={fileName}
            xAxis={xAxis}
            yAxis={yAxis}
            zAxis={zAxis}
            chartType={chartType}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-neutral-800 rounded-lg p-6">
          {chartData ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions()}
            />
          ) : (
            <p className="text-center text-neutral-400">No chart data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
