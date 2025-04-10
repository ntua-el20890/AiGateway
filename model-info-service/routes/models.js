const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// @route   GET /api/models
// @desc    Get all models
// @access  Public
router.get('/', async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;