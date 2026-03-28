"use client";

import Highcharts from "highcharts";

import HighchartsReact from "highcharts-react-official";

// 3D Pie Chart
const pieOptions = {
  chart: {
    type: "pie",
    options3d: { enabled: true, alpha: 45, beta: 0 },
    backgroundColor: "black",
  },
  title: {
    text: "Global Smartphone Shipments Market Share, Q1 2022",
    style: { color: "#ffffff" },
  },
  subtitle: {
    text: 'Source: <a href="https://www.counterpointresearch.com/global-smartphone-share/" target="_blank">Counterpoint Research</a>',
    style: { color: "#cccccc" },
  },
  accessibility: {
    point: { valueSuffix: "%" },
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      depth: 35,
      dataLabels: {
        enabled: true,
        format: "{point.name}",
        style: { color: "#ffffff" },
      },
    },
  },
  series: [
    {
      type: "pie",
      name: "Share",
      data: [
        ["Samsung", 23],
        ["Apple", 18],
        { name: "Xiaomi", y: 12, sliced: true, selected: true },
        ["Oppo", 9],
        ["Vivo", 8],
        ["Others", 30],
      ],
    },
  ],
  credits: {
    enabled: false,
  },

};

// 3D Column Chart
const columnOptions = {
  chart: {
    type: "column",
    options3d: { enabled: true, alpha: 10, beta: 25, depth: 70 },
    backgroundColor: "black",
  },
  title: {
    text: "Smartphone Shipments by Brand",
    style: { color: "#ffffff" },
  },
  xAxis: {
    categories: ["Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", "Others"],
    labels: { style: { color: "#cccccc" } },
  },
  yAxis: {
    title: { text: "Market Share (%)", style: { color: "#cccccc" } },
    labels: { style: { color: "#cccccc" } },
  },
  series: [
    {
      name: "Q1 2022",
      data: [23, 18, 12, 9, 8, 30],
      colorByPoint: true,
    },
  ],
  credits: {
    enabled: false,
  },

};

// 3D Scatter Chart
const scatterOptions = {
  chart: {
    type: "scatter",
    options3d: { enabled: true, alpha: 10, beta: 30, depth: 250 },
    margin: 100,
    backgroundColor: "black",
  },
  title: {
    text: "Random Data Distribution (3D)",
    style: { color: "#ffffff" },
  },
  xAxis: {
    min: 0,
    max: 10,
    gridLineWidth: 1,
    labels: { style: { color: "#cccccc" } },
  },
  yAxis: {
    min: 0,
    max: 10,
    title: null,
    labels: { style: { color: "#cccccc" } },
  },
  zAxis: {
    min: 0,
    max: 10,
    labels: { style: { color: "#cccccc" } },
  },
  legend: { enabled: false },
  plotOptions: {
    scatter: { width: 10, height: 10, depth: 10 },
  },
  series: [
    {
      name: "Data",
      colorByPoint: true,
      data: [
        [1, 6, 5],
        [8, 7, 9],
        [1, 3, 4],
        [4, 6, 8],
        [5, 7, 7],
        [6, 9, 6],
        [7, 0, 5],
        [2, 3, 3],
        [3, 9, 8],
        [3, 6, 5],
      ],
    },
  ],
  credits: {
    enabled: false,
  },

};

// 3D Donut Chart
const donutOptions = {
  chart: {
    type: "pie",
    options3d: { enabled: true, alpha: 45, beta: 0 },
    backgroundColor: "black",
  },
  title: {
    text: "Global Smartphone Market - Donut",
    style: { color: "#ffffff" },
  },
  subtitle: {
    text: "3D Donut Visualization",
    style: { color: "#cccccc" },
  },
  plotOptions: {
    pie: {
      innerSize: 100,
      depth: 45,
      dataLabels: {
        enabled: true,
        style: { color: "#ffffff" },
      },
    },
  },
  series: [
    {
      name: "Market Share",
      data: [
        ["Samsung", 23],
        ["Apple", 18],
        ["Xiaomi", 12],
        ["Oppo", 9],
        ["Vivo", 8],
        ["Others", 30],
      ],
    },
  ],
  credits: {
    enabled: false,
  },

};

export default function Chart3DOlympics() {
  return (
    <div className="p-6 bg-black text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-purple-400 mb-8">
        3D Charts Demo
      </h1>

      <div className="overflow-x-auto whitespace-nowrap space-x-6 flex pb-4 px-2">
        {[
          { title: "📈 3D Pie Chart", options: pieOptions },
          { title: "📊 3D Column Chart", options: columnOptions },
          { title: "🔘 3D Scatter Chart", options: scatterOptions },
          { title: "🍩 3D Donut Chart", options: donutOptions },
        ].map(({ title, options }, idx) => (
          <div
            key={idx}
            className="bg-black p-6 rounded-2xl shadow-lg border border-neutral-800 min-w-[400px] hover:scale-[1.02] transition-transform duration-200"
          >
            <h2 className="text-xl font-semibold text-purple-300 mb-4 bg-black p-2 rounded-lg">
              {title}
            </h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        ))}
      </div>
    </div>
  );
}
