import React, { useState, useEffect } from 'react';
import { IconBrain, IconChevronDown, IconChevronUp, IconSparkles } from '@tabler/icons-react';
import axios from '../api/config';

const AIInsights = ({ fileId, fileName, xAxis, yAxis, zAxis, chartType }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!fileId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/ai/insights/${fileId}`, {
        xAxis,
        yAxis,
        zAxis,
        chartType,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setError('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      fetchInsights();
    }
  }, [fileId, xAxis, yAxis, zAxis, chartType]);

  if (!fileId) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-600/30 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-purple-800/20 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <IconBrain className="text-purple-400" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white">🤖 AI Insights</h3>
            <p className="text-sm text-purple-200">Smart analysis of your data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
          )}
          {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-purple-600/30">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
              <p className="text-purple-200">Analyzing your data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={fetchInsights}
                className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                Try again
              </button>
            </div>
          ) : insights ? (
            <div className="space-y-4 mt-4">
              {/* Summary */}
              <div className="bg-purple-800/30 rounded-lg p-3">
                <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <IconSparkles size={16} />
                  Summary
                </h4>
                <p className="text-sm text-white">{insights.summary}</p>
              </div>

              {/* Key Insights */}
              {insights.insights && insights.insights.length > 0 && (
                <div>
                  <h4 className="font-medium text-purple-300 mb-2">📊 Key Insights</h4>
                  <ul className="space-y-1">
                    {insights.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-purple-100 bg-purple-800/20 rounded px-3 py-2">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-purple-300 mb-2">💡 Recommendations</h4>
                  <ul className="space-y-1">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-100 bg-blue-800/20 rounded px-3 py-2">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats */}
              {insights.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{insights.stats.totalRows}</div>
                    <div className="text-xs text-neutral-400">Rows</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{insights.stats.totalColumns}</div>
                    <div className="text-xs text-neutral-400">Columns</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{insights.stats.numericColumns}</div>
                    <div className="text-xs text-neutral-400">Numeric</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{insights.stats.dateColumns}</div>
                    <div className="text-xs text-neutral-400">Dates</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-purple-200">No insights available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;