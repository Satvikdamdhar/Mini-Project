const express = require('express');
const { connectToDatabase } = require('../db');

const router = express.Router();

function createRecommendation(plot, weather) {
  const rainProbability = weather ? weather.rainProbability : 0;
  if (plot.soilMoisture < 30 && rainProbability < 50) {
    return { status: 'Irrigate', text: 'Irrigation is recommended soon.', reason: `Soil moisture is low at ${plot.soilMoisture}% and rain probability is ${rainProbability}%.` };
  }
  if (plot.soilMoisture >= 30 && plot.soilMoisture < 60 && rainProbability < 70) {
    return { status: 'Monitor', text: 'Continue monitoring soil moisture.', reason: `Soil moisture is moderate at ${plot.soilMoisture}%.` };
  }
  return { status: 'Delay irrigation', text: 'Delay irrigation and check conditions again.', reason: plot.soilMoisture >= 60 ? `Soil moisture is adequate at ${plot.soilMoisture}%.` : `Rain probability is ${rainProbability}%, so rain may provide water.` };
}

router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const [plots, weather] = await Promise.all([
      db.collection('plots').find({}).toArray(),
      db.collection('weather').find({}).toArray(),
    ]);
    const weatherByLocation = new Map(weather.map((item) => [item.location, item]));
    res.json(plots.map((plot) => ({
      plotId: plot._id,
      plotName: plot.plotName,
      ...createRecommendation(plot, weatherByLocation.get(plot.location)),
      ruleBasedPrototype: true,
    })));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
