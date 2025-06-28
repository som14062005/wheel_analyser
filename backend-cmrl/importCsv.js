// importCsv.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const WheelData = require('./Models/wheelData');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wheeldb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const dataDir = path.join(__dirname, 'data');

const normalizeKey = key => key.trim().toLowerCase().replace(/\s+/g, '');

function parseDate(input) {
  if (!input) return null;

  // Handle both `10.05.2024` and `2025.06.10` formats
  const dotFormat = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/); // dd.mm.yyyy
  const revDotFormat = input.match(/^(\d{4})\.(\d{2})\.(\d{2})$/); // yyyy.mm.dd

  if (dotFormat) {
    const [, day, month, year] = dotFormat;
    return new Date(`${year}-${month}-${day}`);
  }

  if (revDotFormat) {
    const [, year, month, day] = revDotFormat;
    return new Date(`${year}-${month}-${day}`);
  }

  return null;
}


async function importAllCSVs() {
  try {
    const files = fs.readdirSync(dataDir).filter(file => file.startsWith('cmrltr') && file.endsWith('.csv'));

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const trainID = path.basename(file, '.csv');

      try {
        const rawJson = await csv().fromFile(filePath);

        const formatted = rawJson.map(row => {
          const keys = Object.keys(row).reduce((acc, k) => {
            acc[normalizeKey(k)] = row[k];
            return acc;
          }, {});

          const parsedDate = parseDate(keys['date']);

          return {
            TrainID: trainID,
            Axle: keys['axle'],
            Side: keys['side']?.toUpperCase(),
            State: keys['state']?.toLowerCase(),
            diameter: parseFloat(keys['wheeldiameter'] || keys['diameter']),
            flangeHeight: parseFloat(keys['flangeheight']),
            flangeThickness: parseFloat(keys['flangethickness']),
            qr: parseFloat(keys['qr']),
            date: parsedDate
          };
        });

        const cleaned = formatted.filter(e =>
          e.TrainID && e.Axle && e.Side && e.State && !isNaN(e.diameter)
        );

        await WheelData.insertMany(cleaned);
        console.log(`✅ Imported ${cleaned.length} entries from ${file}`);
      } catch (err) {
        console.error(`❌ Error importing ${file}: ${err.message}`);
      }
    }

    console.log('✅ All CSVs processed.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error reading CSV directory:', err);
    mongoose.disconnect();
  }
}

importAllCSVs();
