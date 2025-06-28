// Models/wheelData.js
const mongoose = require('mongoose');

const wheelDataSchema = new mongoose.Schema({
  TrainID: { type: String, required: true },
  Axle: { type: String, required: true },
  Side: { type: String, enum: ['LH', 'RH'], required: true },
  State: { type: String, enum: ['before', 'after'], required: true },
  diameter: { type: Number, required: true },
  flangeHeight: { type: Number, required: true },
  flangeThickness: { type: Number, required: true },
  qr: { type: Number, required: true },
  date: { type: Date },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WheelData', wheelDataSchema);
