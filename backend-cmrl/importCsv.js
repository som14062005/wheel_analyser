require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const WheelData = require('./Models/wheelData');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wheeldb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const dataDir = path.join(__dirname, 'data');
const normalizeKey = key => key.trim().toLowerCase().replace(/\s+/g, '');

async function importAllCSVs() {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('cmrltr') && file.endsWith('.csv'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const trainId = path.basename(file, '.csv').toLowerCase(); // Ex: cmrltr1

    try {
      const rawJson = await csv().fromFile(filePath);

      const grouped = {}; // { wheelId: { before: {...}, after: {...} } }

      for (const entry of rawJson) {
        const keys = Object.keys(entry).reduce((acc, k) => {
          acc[normalizeKey(k)] = entry[k];
          return acc;
        }, {});

        const axle = keys['axle'];
        const side = keys['side'];
        const state = keys['state']?.toLowerCase();
        const wheelId = `${axle}-${side}`;

        if (!grouped[wheelId]) grouped[wheelId] = { wheelId, trainId };

        grouped[wheelId][state] = {
          diameter: parseFloat(keys['wheeldiameter']),
          flangeHeight: parseFloat(keys['flangeheight']),
          flangeThickness: parseFloat(keys['flangethickness']),
          qr: parseFloat(keys['qr'])
        };
      }

      const validEntries = Object.values(grouped).filter(w => w.before && w.after);

      await WheelData.insertMany(validEntries);
      console.log(`✅ Imported ${validEntries.length} entries from ${file}`);
    } catch (error) {
      console.error(`❌ Error importing ${file}: ${error.message}`);
    }
  }

  console.log('✅ All CSVs processed.');
  mongoose.disconnect();
}

importAllCSVs();
