const API_BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The API request failed.');
  return result;
}

export async function getFarmData() {
  const [plots, weather, recommendations] = await Promise.all([
    request('/plots'),
    request('/weather'),
    request('/recommendations'),
  ]);
  const weatherByLocation = new Map(weather.map((item) => [item.location, item]));
  const recommendationById = new Map(recommendations.map((item) => [String(item.plotId), item]));

  return plots.map((plot) => {
    const plotId = String(plot._id);
    const conditions = weatherByLocation.get(plot.location) || {};
    return {
      id: plotId,
      name: plot.plotName,
      location: plot.location,
      crop: plot.crop,
      area: plot.area,
      soilType: plot.soilType,
      soilMoisture: plot.soilMoisture,
      temperature: conditions.temperature ?? plot.temperature,
      humidity: conditions.humidity ?? plot.humidity,
      rainfall: plot.rainfall,
      rainfallProb: conditions.rainProbability ?? 0,
      weatherSource: conditions.source || 'Weather data unavailable',
      windSpeed: conditions.windSpeed,
      recommendation: recommendationById.get(plotId),
    };
  });
}

export async function createFarm(farm) {
  const savedPlot = await request('/plots', {
    method: 'POST',
    body: JSON.stringify({
      plotName: farm.name,
      location: farm.location,
      crop: farm.crop,
      area: farm.area,
      soilType: farm.soilType,
      soilMoisture: farm.soilMoisture,
      temperature: farm.temperature,
      humidity: farm.humidity,
      rainfall: farm.rainfall,
    }),
  });
  const allFarms = await getFarmData();
  return allFarms.find((item) => item.id === String(savedPlot._id));
}

export async function getWeatherData() {
  return request('/weather');
}
