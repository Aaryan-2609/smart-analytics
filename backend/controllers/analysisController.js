const File = require('../models/FileModel');
const Chart = require('../models/ChartModel');
const ExcelJS = require('exceljs');  // ← Using exceljs
const path = require('path');
const fs = require('fs');

const generateCharts = async (req, res) => {
  try {
    const { id } = req.params;
    const { xAxis, yAxis, zAxis, chartType } = req.body;
    
    const axes = [xAxis, yAxis, zAxis].filter(axis => axis && axis.trim() !== '');
    const uniqueAxes = [...new Set(axes)];
    
    if (axes.length !== uniqueAxes.length) {
      return res.status(400).json({ 
        message: 'Duplicate axis selection detected. X, Y, and Z axes must be unique.' 
      });
    }
    
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and parse Excel file with exceljs
    const filePath = path.join(__dirname, '../uploads', file.filename);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    
    // Convert worksheet to JSON
    const jsonData = [];
    const headers = [];
    
    // Get headers from first row
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value;
    });
    
    // Get data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        if (headers[colNumber]) {
          rowData[headers[colNumber]] = cell.value;
        }
      });
      jsonData.push(rowData);
    });

    // Extract data for selected axes
    const categories = jsonData.map(row => row[xAxis]);
    const seriesData = jsonData.map(row => row[yAxis]);
    const zData = zAxis ? jsonData.map(row => row[zAxis]) : null;

    res.json({
      success: true,
      data: {
        categories,
        seriesData,
        zData,
        chartType,
        xAxis,
        yAxis,
        zAxis,
        fileName: file.originalName
      }
    });
  } catch (error) {
    console.error('Error in generateCharts:', error);
    res.status(400).json({ message: error.message });
  }
};

const mapData = async (req, res) => {
  try {
    const { id } = req.params;
    
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    // Read with exceljs
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.worksheets[0];
    
    // Get headers from first row
    const columns = [];
    worksheet.getRow(1).eachCell((cell) => {
      if (cell.value) {
        columns.push(cell.value);
      }
    });

    res.json({
      success: true,
      columns,
      fileName: file.originalName,
      fileId: id
    });
  } catch (error) {
    console.error('Error in mapData:', error);
    res.status(400).json({ message: error.message });
  }
};

const getChartHistory = async (req, res) => {
  try {
    console.log('Fetching chart history for user:', req.user._id);

    const {
      page = 1,
      limit = 10,
      chartType,
      is3D,
      dateFrom,
      dateTo,
      fileName
    } = req.query;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = { user: req.user._id };

    if (chartType) {
      filter.chartType = chartType;
    }

    if (typeof is3D !== 'undefined' && is3D !== '') {
      const is3DBool = String(is3D).toLowerCase() === 'true';
      filter.is3D = is3DBool;
    }

    if (fileName && fileName.trim().length > 0) {
      filter.fileName = { $regex: fileName.trim(), $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!isNaN(from.getTime())) filter.createdAt.$gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (!isNaN(to.getTime())) filter.createdAt.$lte = to;
      }
    }

    const totalItems = await Chart.countDocuments(filter);

    const charts = await Chart.find(filter)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .populate('fileId', 'originalName size');

    const totalPages = Math.max(Math.ceil(totalItems / numericLimit), 1);

    res.json({
      success: true,
      data: charts,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        totalPages,
        totalItems
      }
    });
  } catch (error) {
    console.error('Error in getChartHistory:', error);
    res.status(400).json({ message: error.message });
  }
};

const saveChart = async (req, res) => {
  try {
    console.log('Save chart request received:', req.body);
    const { fileName, fileId, chartType, xAxis, yAxis, zAxis, is3D } = req.body;
    
    const axes = [xAxis, yAxis, zAxis].filter(axis => axis && axis.trim() !== '');
    const uniqueAxes = [...new Set(axes)];
    
    if (axes.length !== uniqueAxes.length) {
      return res.status(400).json({ 
        message: 'Duplicate axis selection detected. X, Y, and Z axes must be unique.' 
      });
    }
    
    const chart = new Chart({
      fileName,
      fileId,
      user: req.user._id,
      chartType,
      xAxis,
      yAxis,
      zAxis,
      is3D
    });

    const savedChart = await chart.save();
    console.log('Chart saved successfully:', savedChart._id);
    
    res.json({
      success: true,
      message: 'Chart saved to history successfully',
      chartId: savedChart._id
    });
  } catch (error) {
    console.error('Error saving chart:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { generateCharts, mapData, getChartHistory, saveChart };