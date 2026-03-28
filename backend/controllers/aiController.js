const File = require('../models/FileModel');
const XLSX = require('xlsx');  // ← Change this to xlsx
const path = require('path');

const generateInsights = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { xAxis, yAxis, zAxis, chartType } = req.body || {};
    
    // Find the uploaded file
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and parse Excel file with xlsx
    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    // Check if file exists
    if (!require('fs').existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Analyze the data
    const insights = analyzeData(jsonData, file.originalName, { xAxis, yAxis, zAxis, chartType });
    
    // Prevent caching so insights reflect the latest data and parameters
    res.set('Cache-Control', 'no-store');
    res.json({
      success: true,
      insights,
      fileName: file.originalName
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(400).json({ message: error.message });
  }
};

const analyzeData = (data, fileName, context = {}) => {
  if (!data || data.length === 0) {
    return {
      summary: "No data available for analysis",
      insights: [],
      recommendations: []
    };
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => 
    data.some(row => typeof row[col] === 'number' && !isNaN(row[col]))
  );

  const insights = [];
  const recommendations = [];

  // Basic statistics
  const rowCount = data.length;
  const columnCount = columns.length;
  
  insights.push(`📊 Dataset contains ${rowCount} rows and ${columnCount} columns`);
  
  if (numericColumns.length > 0) {
    insights.push(`🔢 Found ${numericColumns.length} numeric columns: ${numericColumns.slice(0, 5).join(', ')}${numericColumns.length > 5 ? '...' : ''}`);
    
    // Analyze numeric columns (limit to first 5 for performance)
    numericColumns.slice(0, 5).forEach(col => {
      const values = data.map(row => row[col]).filter(val => typeof val === 'number' && !isNaN(val));
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        insights.push(`📈 ${col}: Average ${avg.toFixed(2)}, Range ${min} - ${max}`);
        
        // Growth analysis
        if (values.length > 1) {
          const growth = ((values[values.length - 1] - values[0]) / values[0] * 100);
          if (Math.abs(growth) > 5 && isFinite(growth)) {
            insights.push(`📊 ${col} shows ${growth > 0 ? 'growth' : 'decline'} of ${Math.abs(growth).toFixed(1)}%`);
          }
        }
      }
    });
  }

  // Date analysis
  const dateColumns = columns.filter(col => 
    data.some(row => {
      const val = row[col];
      return val instanceof Date || (typeof val === 'string' && !isNaN(Date.parse(val)));
    })
  );

  if (dateColumns.length > 0) {
    insights.push(`📅 Found date columns: ${dateColumns.slice(0, 3).join(', ')}`);
    recommendations.push("Consider creating time-series charts to show trends over time");
  }

  // Recommendations based on data structure
  if (numericColumns.length >= 2) {
    recommendations.push("Try creating scatter plots to find correlations between numeric variables");
    recommendations.push("Consider 3D visualizations for multi-dimensional analysis");
  }

  if (rowCount > 100) {
    recommendations.push("Large dataset detected - consider filtering or grouping for better visualization");
  }

  if (columns.some(col => col.toLowerCase().includes('category') || col.toLowerCase().includes('type'))) {
    recommendations.push("Categorical data found - pie charts and bar charts would work well");
  }

  // Performance insights
  const duplicateRows = rowCount - new Set(data.map(row => JSON.stringify(row))).size;
  if (duplicateRows > 0) {
    insights.push(`⚠️ Found ${duplicateRows} duplicate rows - consider data cleaning`);
  }

  // Missing values analysis
  const missingByColumn = {};
  columns.slice(0, 10).forEach(col => {  // Limit to first 10 columns
    missingByColumn[col] = data.reduce((acc, row) => acc + (row[col] === null || row[col] === undefined || row[col] === '' ? 1 : 0), 0);
  });
  const colsWithMissing = Object.entries(missingByColumn).filter(([, cnt]) => cnt > 0);
  if (colsWithMissing.length > 0) {
    insights.push(`🧹 Missing values detected in ${colsWithMissing.length} columns`);
  }

  // Axis-aware insights if provided
  const { xAxis, yAxis } = context || {};
  if (xAxis && yAxis && columns.includes(xAxis) && columns.includes(yAxis)) {
    const xValues = data.map(r => r[xAxis]).filter(v => typeof v === 'number' && !isNaN(v));
    const yValues = data.map(r => r[yAxis]).filter(v => typeof v === 'number' && !isNaN(v));
    const n = Math.min(xValues.length, yValues.length);
    if (n > 2) {
      const mean = arr => arr.reduce((a,b)=>a+b,0)/arr.length;
      const mx = mean(xValues.slice(0, n));
      const my = mean(yValues.slice(0, n));
      const cov = xValues.slice(0, n).reduce((acc, xv, i) => acc + ((xv - mx) * (yValues[i] - my)), 0) / (n - 1);
      const sd = (arr, m) => Math.sqrt(arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (arr.length - 1));
      const sdx = sd(xValues.slice(0, n), mx);
      const sdy = sd(yValues.slice(0, n), my);
      const corr = (sdx > 0 && sdy > 0) ? (cov / (sdx * sdy)) : 0;
      const slope = (sdx > 0) ? (corr * (sdy / sdx)) : 0;
      insights.push(`🔗 Correlation between ${xAxis} and ${yAxis}: ${corr.toFixed(3)}`);
      if (Math.abs(corr) >= 0.7) {
        recommendations.push(`Strong ${corr > 0 ? 'positive' : 'negative'} relationship detected between ${xAxis} and ${yAxis}; regression or trend analysis recommended`);
      }
      insights.push(`📐 Estimated linear trend slope (Δ${yAxis}/Δ${xAxis}): ${slope.toFixed(3)}`);
    } else {
      insights.push(`ℹ️ Not enough numeric data points to analyze relationship between ${xAxis} and ${yAxis}`);
    }
  }

  // Top categories for categorical columns
  const categoricalColumns = columns.filter(col => !numericColumns.includes(col));
  categoricalColumns.slice(0, 3).forEach(col => {  // Limit to first 3 categorical columns
    const freq = new Map();
    data.forEach(row => {
      const val = row[col];
      if (val !== null && val !== undefined && val !== '') {
        freq.set(val, (freq.get(val) || 0) + 1);
      }
    });
    const sorted = Array.from(freq.entries()).sort((a,b) => b[1]-a[1]);
    if (sorted.length > 0) {
      const top = sorted.slice(0, 3).map(([v,c]) => `${v} (${c})`).join(', ');
      insights.push(`🏷️ Top ${col} categories: ${top}`);
    }
  });

  return {
    summary: `Analysis of ${fileName}: ${rowCount} records with ${numericColumns.length} numeric fields`,
    insights,
    recommendations,
    stats: {
      totalRows: rowCount,
      totalColumns: columnCount,
      numericColumns: numericColumns.length,
      dateColumns: dateColumns.length
    }
  };
};

module.exports = { generateInsights };