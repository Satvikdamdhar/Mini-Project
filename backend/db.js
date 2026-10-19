const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

let database;

async function connectToDatabase() {
  if (!database) {
    await client.connect();
    database = client.db('SugarcaneDB');

    const plots = database.collection('plots');
    const count = await plots.countDocuments();

    if (count === 0) {
      await plots.insertMany([
        { plotName: 'Green Valley Plot', location: 'Kolhapur, Maharashtra', area: 5, crop: 'Sugarcane', soilMoisture: 24, temperature: 34, humidity: 62, rainfall: 0, soilType: 'Black Soil', irrigationStatus: 'Needs irrigation' },
        { plotName: 'River Bend Plot', location: 'Pune, Maharashtra', area: 4, crop: 'Sugarcane', soilMoisture: 46, temperature: 31, humidity: 68, rainfall: 2, soilType: 'Clay Soil', irrigationStatus: 'Monitor' },
        { plotName: 'Sunrise Plot', location: 'Sangli, Maharashtra', area: 6, crop: 'Sugarcane', soilMoisture: 67, temperature: 29, humidity: 74, rainfall: 8, soilType: 'Black Soil', irrigationStatus: 'Delay irrigation' },
      ]);
    }

    const weather = database.collection('weather');
    const weatherCount = await weather.countDocuments();
    if (weatherCount === 0) {
      await weather.insertMany([
        { location: 'Kolhapur, Maharashtra', temperature: 34, humidity: 62, rainfall: 0, rainProbability: 10, windSpeed: 12, source: 'Demo data (not live weather)' },
        { location: 'Pune, Maharashtra', temperature: 31, humidity: 68, rainfall: 2, rainProbability: 35, windSpeed: 10, source: 'Demo data (not live weather)' },
        { location: 'Sangli, Maharashtra', temperature: 29, humidity: 74, rainfall: 8, rainProbability: 80, windSpeed: 14, source: 'Demo data (not live weather)' },
      ]);
    }
  }

  return database;
}

module.exports = { connectToDatabase };
