const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db');

const router = express.Router();

function validPlot(body) {
  if (!body || typeof body.plotName !== 'string' || !body.plotName.trim() ||
    typeof body.location !== 'string' || !body.location.trim() ||
    typeof body.crop !== 'string' || !body.crop.trim()) return false;

  const measurements = ['area', 'soilMoisture', 'temperature', 'humidity', 'rainfall'];
  if (!measurements.every((key) => typeof body[key] === 'number' && Number.isFinite(body[key]))) return false;
  return body.area > 0 && body.soilMoisture >= 0 && body.soilMoisture <= 100 &&
    body.humidity >= 0 && body.humidity <= 100 && body.rainfall >= 0 &&
    body.temperature >= -20 && body.temperature <= 60;
}

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const plots = await db.collection('plots').find({}).toArray();
    res.json(plots);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid plot ID.' });
  try {
    const db = await connectToDatabase();
    const plot = await db.collection('plots').findOne({ _id: new ObjectId(req.params.id) });
    if (!plot) return res.status(404).json({ error: 'Plot not found.' });
    res.json(plot);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  if (!validPlot(req.body)) return res.status(400).json({ error: 'Provide plotName, location, crop and numeric farm measurements.' });
  try {
    const db = await connectToDatabase();
    const plot = {
      plotName: req.body.plotName.trim(), location: req.body.location.trim(), crop: req.body.crop.trim(),
      area: Number(req.body.area), soilMoisture: Number(req.body.soilMoisture),
      temperature: Number(req.body.temperature), humidity: Number(req.body.humidity), rainfall: Number(req.body.rainfall),
      soilType: req.body.soilType || 'Black Soil', irrigationStatus: 'Pending recommendation',
    };
    const result = await db.collection('plots').insertOne(plot);
    res.status(201).json({ ...plot, _id: result.insertedId });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid plot ID.' });
  if (!validPlot(req.body)) return res.status(400).json({ error: 'Provide plotName, location, crop and numeric farm measurements.' });
  try {
    const db = await connectToDatabase();
    const plot = {
      plotName: req.body.plotName.trim(), location: req.body.location.trim(), crop: req.body.crop.trim(),
      area: Number(req.body.area), soilMoisture: Number(req.body.soilMoisture),
      temperature: Number(req.body.temperature), humidity: Number(req.body.humidity), rainfall: Number(req.body.rainfall),
      soilType: req.body.soilType || 'Black Soil', irrigationStatus: req.body.irrigationStatus || 'Pending recommendation',
    };
    const result = await db.collection('plots').updateOne({ _id: new ObjectId(req.params.id) }, { $set: plot });
    if (!result.matchedCount) return res.status(404).json({ error: 'Plot not found.' });
    res.json({ _id: new ObjectId(req.params.id), ...plot });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid plot ID.' });
  try {
    const db = await connectToDatabase();
    const result = await db.collection('plots').deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: 'Plot not found.' });
    res.json({ message: 'Plot deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
