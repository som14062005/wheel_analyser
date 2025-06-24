// routes/wheelRoutes.js
const express = require('express');
const router = express.Router();
const WheelData = require('../Models/wheelData');

router.get('/:trainId', async (req, res) => {
  try {
    const data = await WheelData.find({ TrainID: req.params.trainId.toLowerCase() });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
