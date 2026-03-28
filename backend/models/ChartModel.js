const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  chartType: {
    type: String,
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  zAxis: {
    type: String,
    default: null
  },
  is3D: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chart', chartSchema);

