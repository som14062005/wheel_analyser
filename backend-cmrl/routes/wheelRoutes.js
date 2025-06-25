const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

/**
 * GET /api/wheels/:trainId
 * Combines 'before' and 'after' states into a single object per wheelId
 */
router.get('/:trainId', async (req, res) => {
  const trainId = req.params.trainId.trim().toLowerCase();

  try {
    const entries = await WheelData.find({ trainId });

    const wheelMap = {};

    entries.forEach((entry) => {
      const key = `${entry.Axle}-${entry.Side}`; // Ex: "R1-L1-LH"

      if (!wheelMap[key]) {
        wheelMap[key] = {
          wheelId: key,
          TrainID: entry.TrainID
        };
      }

      const state = entry.State.toLowerCase();
      wheelMap[key][state] = {
        diameter: entry.diameter,
        flangeHeight: entry.flangeHeight,
        flangeThickness: entry.flangeThickness,
        qr: entry.qr,
        timestamp: entry.timestamp || null
      };
    });

    // Filter only fully valid wheels (have both before and after)
    const result = Object.values(wheelMap).filter(w => w.before && w.after);

    if (!result.length) {
      return res.status(404).json({ message: `No complete wheel data found for train '${trainId}'` });
    }

    res.json(entries);
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
