const mongoose = require('mongoose');

const wheelDataSchema = new mongoose.Schema({
  TrainID: String,
  Axle: String,
  State: String,
  Side: String,
  diameter: Number,
  flangeHeight: Number,
  flangeThickness: Number,
  qr: Number,
});

module.exports = mongoose.model('WheelData', wheelDataSchema);
