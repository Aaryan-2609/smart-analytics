// src/pages/History.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  IconFileSpreadsheet,
  IconChartLine,
  IconArrowLeft,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from '../api/config';
import { downloadFileById, downloadChart } from '../utils/downloadHelper';

export default function History() {
  const navigate = useNavigate();
  const [chartHistory, setChartHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterChartType, setFilterChartType] = useState("");
  const [filterIs3D, setFilterIs3D] = useState("all"); // 'all' | 'true' | 'false'
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchChartHistory = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit,
          fileName: searchName || undefined,
          chartType: filterChartType || undefined,
          is3D: filterIs3D === 'all' ? undefined : filterIs3D,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        };
        const response = await axios.get('/analysis/chart-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params
        });
        setChartHistory(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } catch (error) {
        console.error('Error fetching chart history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartHistory();
  }, [page, limit, searchName, filterChartType, filterIs3D, dateFrom, dateTo]);

  const handleViewChart = (chart) => {
    navigate("/charts", {
      state: {
        fileName: chart.fileName,
        fileId: chart.fileId._id,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        zAxis: chart.zAxis,
        chartType: chart.chartType,
        is3D: chart.is3D
      }
    });
  };

  const handleDownload = async (chart) => {
    try {
      await downloadChart(chart);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Top left back to dashboard button */}
        <div className="flex justify-start mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-lg"
          >
            <IconArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-purple-400 mb-6">
          Chart History
        </h1>
        {/* Filters */}
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Search by File</label>
            <input
              value={searchName}
              onChange={(e) => { setPage(1); setSearchName(e.target.value); }}
              placeholder="e.g. sales"
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Chart Type</label>
            <select
              value={filterChartType}
              onChange={(e) => { setPage(1); setFilterChartType(e.target.value); }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="line">Line</option>
              <option value="column">Column</option>
              <option value="pie">Pie</option>
              <option value="scatter">Scatter</option>
              <option value="3d-column">3D Column</option>
              <option value="3d-pie">3D Pie</option>
              <option value="3d-scatter">3D Scatter</option>
              <option value="3d-donut">3D Donut</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">2D/3D</label>
            <select
              value={filterIs3D}
              onChange={(e) => { setPage(1); setFilterIs3D(e.target.value); }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="false">2D</option>
              <option value="true">3D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setPage(1); setDateFrom(e.target.value); }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setPage(1); setDateTo(e.target.value); }}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {chartHistory.length === 0 ? (
          <p className="text-neutral-400 italic">
            No charts generated yet... Time to create some amazing visualizations! 📊
          </p>
        ) : (
          <div className="space-y-4">
            {chartHistory.map((chart) => (
              <div
                key={chart._id}
                className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-800 rounded-lg px-6 py-4 shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-700 p-2 rounded-full">
                    <IconChartLine size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{chart.fileName}</p>
                    <p className="text-sm text-neutral-400">
                      {formatDate(chart.createdAt)} • {chart.chartType.toUpperCase()}
                    </p>
                    <p className="text-xs text-purple-300">
                      {chart.xAxis} vs {chart.yAxis} {chart.zAxis && `vs ${chart.zAxis}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-cyan-300 mb-1">
                    {chart.is3D ? '3D Chart' : '2D Chart'}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleDownload(chart)}
                      className="bg-neutral-700 hover:bg-neutral-600 text-sm px-3 py-1 rounded shadow flex items-center gap-2"
                    >
                      <IconDownload size={16} />
                      Download Chart
                    </button>
                    <button
                      onClick={() => handleViewChart(chart)}
                      className="bg-purple-600 hover:bg-purple-700 text-sm px-3 py-1 rounded shadow flex items-center gap-2"
                    >
                      <IconEye size={16} />
                      View Chart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-neutral-400">Showing page {page} of {totalPages} • {totalItems} total</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className={`px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-sm ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-700'}`}
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className={`px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-sm ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-700'}`}
              >
                Next
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
