const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const WheelData = require('./Models/wheelData');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });


// Import Routes
const wheelRoutes = require('./routes/wheelRoutes');
app.use('/api/wheels', wheelRoutes);

// Optional: Load CSV once
const loadCSVToMongo = async () => {
  const filePath = path.join(__dirname, 'data', 'cmrltr1.csv');
  const jsonArray = await csv().fromFile(filePath);

  const formatted = jsonArray.map(row => ({
    TrainID: row["TrainID"],
    Axle: row["Axle"],
    State: row["State"],
    Side: row["Side"],
    diameter: parseFloat(row["Wheel Diameter"]),
    flangeHeight: parseFloat(row["Flange Height"]),
    flangeThickness: parseFloat(row["Flange Thickness"]),
    qr: parseFloat(row["QR"])
  }));

  await WheelData.insertMany(formatted);
  console.log("✅ cmrltr1.csv loaded into MongoDB");
};

// Uncomment this ONCE, run the server, then comment it back
// loadCSVToMongo();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚆 Server running at http://localhost:${PORT}`));
