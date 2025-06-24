const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

// Get all wheel data
router.get('/getAll', async (req, res) => {
  try {
    const data = await WheelData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching wheel data' });
  }
});

// Add one entry (optional POST route for testing)
router.post('/add', async (req, res) => {
  try {
    const newEntry = new WheelData(req.body);
    await newEntry.save();
    res.json({ message: 'Entry saved successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to save data' });
  }
});

module.exports = router;
