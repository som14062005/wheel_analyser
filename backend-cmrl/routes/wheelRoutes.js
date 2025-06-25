// backend-cmrl/routes/wheelRoutes.js

const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

/**
 * GET /api/wheels/:trainId
 * Combines 'before' and 'after' states into a single object per wheelId
 */
// GET /api/wheels/:trainId
router.get('/:trainId', async (req, res) => {
  const trainId = req.params.trainId.trim().toLowerCase();

  try {
    const entries = await WheelData.find({ trainId });

    if (!entries.length) {
      return res.status(404).json({ message: `No wheel data found for train '${trainId}'` });
    }

    res.json(entries);
  } catch (err) {
    console.error("❌ Error fetching wheel data:", err);
    res.status(500).json({ error: 'Failed to fetch wheel data' });
  }
});


/**
 * POST /api/wheels/add
 * Adds new wheel data (used for testing or admin panel)
 */
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
