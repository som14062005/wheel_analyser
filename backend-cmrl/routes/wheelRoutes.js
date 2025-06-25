const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

// GET /api/wheels/:trainId
router.get('/:trainId', async (req, res) => {
  const trainId = req.params.trainId.trim().toLowerCase();

  try {
    const entries = await WheelData.find({ TrainID: trainId });

    const wheelMap = {};

    entries.forEach((entry) => {
      // Skip invalid entries missing important fields
      if (!entry.Axle || !entry.Side || !entry.State) {
        console.warn("⚠️ Skipping invalid entry (missing Axle, Side or State):", entry);
        return;
      }

      const key = `${entry.Axle}-${entry.Side}`; // e.g., L9-R9-LH
      const state = entry.State.toLowerCase();

      if (!wheelMap[key]) {
        wheelMap[key] = {
          wheelId: key,
          TrainID: entry.TrainID
        };
      }

      wheelMap[key][state] = {
        diameter: entry.diameter,
        flangeHeight: entry.flangeHeight,
        flangeThickness: entry.flangeThickness,
        qr: entry.qr,
        timestamp: entry.timestamp || null
      };
    });

    const result = Object.values(wheelMap).filter(w => w.before && w.after);

    if (!result.length) {
      return res.status(404).json({ message: `No complete wheel data found for train '${trainId}'` });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching wheel data:", err);
    res.status(500).json({ error: 'Failed to fetch wheel data' });
  }
});

// POST /api/wheels/add
router.post('/add', async (req, res) => {
  try {
    const entry = new WheelData(req.body);
    await entry.save();
    res.status(201).json({ message: '✅ Entry saved successfully' });
  } catch (err) {
    console.error("❌ Error saving wheel data:", err);
    res.status(400).json({ error: 'Failed to save data', details: err.message });
  }
});

module.exports = router;
