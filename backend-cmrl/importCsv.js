const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const WheelData = require('./Models/wheelData');

const MONGO_URI = 'mongodb://127.0.0.1:27017/wheel-analyser';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    importAllCSVs();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const csvDir = path.join(__dirname, 'data');

const importCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rawMap = {}; // wheelId → { TrainID, before, after }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const state = data.State?.trim().toLowerCase(); // "before" or "after"
        const side = data.Side?.trim().toUpperCase();   // "LH" or "RH"
        const trainId = data.TrainID?.trim().toLowerCase();
        const axle = data.Axle?.trim().toUpperCase();

        if (!state || !side || !trainId || !axle) return;

        const wheelId = `${axle}-${side}`; // e.g., "L9-R9-LH"

        if (!rawMap[wheelId]) {
          rawMap[wheelId] = {
            wheelId,
            TrainID: trainId
          };
        }

        rawMap[wheelId][state] = {
          diameter: parseFloat(data['Wheel Diameter']),
          flangeHeight: parseFloat(data['Flange Height']),
          flangeThickness: parseFloat(data['Flange Thickness']),
          qr: parseFloat(data['QR']),
          timestamp: new Date() // or use: new Date(data.timestamp)
        };
      })
      .on('end', async () => {
        try {
          const documents = Object.values(rawMap).filter(
            entry => entry.before && entry.after
          );

          await WheelData.insertMany(documents);
          console.log(`✅ Imported ${documents.length} entries from ${path.basename(filePath)}`);
          resolve();
        } catch (err) {
          console.error(`❌ Error importing ${path.basename(filePath)}:`, err.message);
          reject(err);
        }
      });
  });
};

const importAllCSVs = async () => {
  try {
    const files = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));

    for (const file of files) {
      const filePath = path.join(csvDir, file);
      try {
        await importCSV(filePath);
      } catch {
        // Error already logged
      }
    }

    console.log('✅ All CSVs processed.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error reading CSV directory:', err);
    mongoose.disconnect();
  }
};
