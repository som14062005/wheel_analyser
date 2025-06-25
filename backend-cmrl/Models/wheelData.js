const mongoose = require('mongoose');

const wheelDataSchema = new mongoose.Schema({
  TrainID: { type: String, required: true },
  Axle: { type: String, required: true },
  Side: { type: String, required: true },
  State: { type: String, required: true },
  diameter: Number,
  flangeHeight: Number,
  flangeThickness: Number,
  qr: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WheelData', wheelDataSchema);
