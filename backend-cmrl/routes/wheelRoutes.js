const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');
const path = require('path');
const csv = require('csvtojson');
const fs = require('fs');
// Get all wheel data
// Route: /api/wheels/:trainId
// wheelRoutes.js

router.get('/:trainId', async (req, res) => {
  const trainId = req.params.trainId.toLowerCase(); // Fix casing issue

  try {
    const entries = await WheelData.find({ TrainID: trainId });

    const grouped = {};
    entries.forEach(entry => {
  const key = `${entry.Axle}-${entry.Side}`;
  if (!grouped[key]) {
    grouped[key] = { wheelId: key };
  }

  if (entry.State.toLowerCase() === 'before') {
    grouped[key].before = {
      diameter: entry.diameter,
      flangeHeight: entry.flangeHeight,
      flangeThickness: entry.flangeThickness,
      qr: entry.qr
    };
  } else if (entry.State.toLowerCase() === 'after') {
    grouped[key].after = {
      diameter: entry.diameter,
      flangeHeight: entry.flangeHeight,
      flangeThickness: entry.flangeThickness,
      qr: entry.qr
    };
  }
});


const result = Object.values(grouped);


    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get wheel data' });
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
