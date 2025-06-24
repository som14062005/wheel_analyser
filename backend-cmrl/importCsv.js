require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const WheelData = require('./Models/wheelData');

// 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wheeldb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 2. Path to the data folder
const dataDir = path.join(__dirname, 'data');

async function importAllCSVs() {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('cmrltr') && file.endsWith('.csv'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const trainID = path.basename(file, '.csv'); // e.g., cmrltr1

    try {
      const jsonArray = await csv().fromFile(filePath);
      const formatted = jsonArray.map(entry => ({
        TrainID: trainID,
        Axle: entry['Axle'],
        State: entry['State'],
        Side: entry['Side'],
        diameter: parseFloat(entry['Wheel Diameter']),
        flangeHeight: parseFloat(entry['Flange Height']),
        flangeThickness: parseFloat(entry['Flange Thickness']),
        qr: parseFloat(entry['QR'])
      }));

      await WheelData.insertMany(formatted);
      console.log(`✅ Imported: ${file} (${formatted.length} entries)`);
    } catch (error) {
      console.error(`❌ Failed to import ${file}:`, error.message);
    }
  }

  console.log('✅ All CSVs processed.');
  mongoose.disconnect();
}

importAllCSVs();
