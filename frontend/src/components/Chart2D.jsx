// Chart2DPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

export default function Chart2DPage() {
  const [realData, setRealData] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.coindesk.com/v1/bpi/historical/close.json")
      .then((response) => {
        const categories = Object.keys(response.data.bpi);
        const data = Object.values(response.data.bpi);
        setRealData({ categories, data });
      });
  }, []);

  const createOptions = (type, title, categories, data) => ({
    chart: {
      type,
      backgroundColor: "black",
    },
    title: {
      text: title,
      style: { color: "#fff" },
    },
    xAxis: {
      categories: categories,
      labels: { style: { color: "#ccc" } },
    },
    yAxis: {
      title: {
        text: "Values",
        style: { color: "#ccc" },
      },
      labels: { style: { color: "#ccc" } },
    },
    legend: {
      itemStyle: { color: "#ccc" },
    },
    series: [
      {
        name: title,
        data: data,
        color: "#4A90E2",
      },
    ],
    credits: {
  enabled: false,
},

  });

  const staticCategories = ["Jan", "Feb", "Mar", "Apr", "May"];
  const staticData = [29, 71, 45, 60, 90];

  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-purple-400 mb-8">
         2D Charts Demo
      </h1>

      <div className="overflow-x-auto whitespace-nowrap space-x-6 flex pb-4 px-2">
        {[
          { type: "column", title: "📦 Monthly Sales" },
          { type: "line", title: "📈 Growth Trends" },
          { type: "pie", title: "🎯 Market Share" },
          { type: "scatter", title: "🔬 Performance Scatter" },
          { type: "area", title: "💰 Revenue Area Chart" },
        ].map(({ type, title }, idx) => (
          <div
            key={idx}
            className="bg-black p-6 rounded-2xl shadow-lg border border-neutral-800 min-w-[400px] hover:scale-[1.02] transition-transform duration-200"
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={createOptions(type, title, staticCategories, staticData)}
            />
          </div>
        ))}

        {/* Real-Time Bitcoin Line Chart */}
        {realData?.data && (
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg border border-neutral-800 min-w-[400px] hover:scale-[1.02] transition-transform duration-200">
            <HighchartsReact
              highcharts={Highcharts}
              options={createOptions(
                "line",
                "🪙 Bitcoin Price History",
                realData.categories,
                realData.data
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
