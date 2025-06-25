// backend-cmrl/Models/wheelData.js

const mongoose = require('mongoose');

const paramSchema = new mongoose.Schema({
  diameter: Number,
  flangeHeight: Number,
  flangeThickness: Number,
  qr: Number,
}, { _id: false });

const wheelDataSchema = new mongoose.Schema({
  trainId: { type: String, required: true },
  wheelId: { type: String, required: true },  // e.g. L1-R1-LH
  before: { type: paramSchema, required: true },
  after: { type: paramSchema, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WheelData', wheelDataSchema);
