const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

router.get('/:trainId', async (req, res) => {
  const trainId = req.params.trainId.trim().toLowerCase();

  try {
    const entries = await WheelData.find({
      TrainID: { $regex: `^${trainId}$`, $options: 'i' }
    });

    const wheelMap = {};

    entries.forEach((entry) => {
      const key = entry.Axle; // Only group by Axle, not Side

      if (!wheelMap[key]) {
        wheelMap[key] = {
          wheelId: key,
          TrainID: entry.TrainID,
          before: {},
          after: {}
        };
      }

      const state = entry.State?.toLowerCase(); // "before" or "after"
      const side = entry.Side?.toUpperCase();   // "LH" or "RH"

      if (state && side) {
        wheelMap[key][state][side] = {
          diameter: entry.diameter,
          flangeHeight: entry.flangeHeight,
          flangeThickness: entry.flangeThickness,
          qr: entry.qr,
          date: entry.date || null,
          timestamp: entry.timestamp || null
        };
      }
    });

    // Filter for complete wheels (both before and after with both sides)
    const result = Object.values(wheelMap).filter(w =>
      w.before?.LH && w.before?.RH && w.after?.LH && w.after?.RH
    );

    if (!result.length) {
      return res.status(404).json({ message: `No complete wheel data found for train '${trainId}'` });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching wheel data:", err);
    res.status(500).json({ error: 'Failed to fetch wheel data' });
  }
});

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
