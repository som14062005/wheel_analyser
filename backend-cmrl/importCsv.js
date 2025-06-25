const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const WheelData = require('./Models/wheelData');

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wheeldb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Directory where CSV files are stored
const dataDir = path.join(__dirname, 'data');

// Helper to clean keys (make case-insensitive matching easy)
const normalizeKey = key => key.trim().toLowerCase().replace(/\s+/g, '');

async function importAllCSVs() {
  const files = fs.readdirSync(dataDir).filter(file => file.startsWith('cmrltr') && file.endsWith('.csv'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const trainID = path.basename(file, '.csv'); // e.g., cmrltr1

    try {
      const rawJson = await csv().fromFile(filePath);

      const formatted = rawJson.map(entry => {
        const keys = Object.keys(entry).reduce((acc, k) => {
          acc[normalizeKey(k)] = entry[k];
          return acc;
        }, {});

        return {
          TrainID: trainID,
          Axle: keys['axle'],
          State: keys['state'],
          Side: keys['side'] || null,
          diameter: parseFloat(keys['wheeldiameter'] || keys['diameter']),
          flangeHeight: parseFloat(keys['flangeheight']),
          flangeThickness: parseFloat(keys['flangethickness']),
          qr: parseFloat(keys['qr'])
        };
      });

      const cleaned = formatted.filter(e =>
        e.Axle && e.State && !isNaN(e.diameter)
      );

      await WheelData.insertMany(cleaned);
      console.log(`✅ Imported ${cleaned.length} entries from ${file}`);
    } catch (error) {
      console.error(`❌ Error importing ${file}: ${error.message}`);
    }
  }

    console.log('✅ All CSVs processed.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error reading CSV directory:', err);
    mongoose.disconnect();
  }
};
