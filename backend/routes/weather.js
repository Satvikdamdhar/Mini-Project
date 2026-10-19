const express = require('express');
const { connectToDatabase } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const weather = await db.collection('weather').find({}).toArray();
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
