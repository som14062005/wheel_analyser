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
}, { _id: false });

const wheelDataSchema = new mongoose.Schema({
  wheelId: { type: String, required: true }, // Example: "L9-R9-LH"
  before: { type: paramSchema, required: true },
  after: { type: paramSchema, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WheelData', wheelDataSchema);
