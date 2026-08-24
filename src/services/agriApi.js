const demoFarmData = [
  {
    id: 1,
    name: 'Green Farm',
    crop: 'Sugarcane',
    area: 5,
    soilType: 'Black Soil',
    soilMoisture: 25,
    temperature: 35,
    rainfallProb: 20,
  },
  {
    id: 2,
    name: 'Sunrise Farm',
    crop: 'Cotton',
    area: 4,
    soilType: 'Black Soil',
    soilMoisture: 48,
    temperature: 31,
    rainfallProb: 35,
  },
  {
    id: 3,
    name: 'River Side Farm',
    crop: 'Rice',
    area: 6,
    soilType: 'Clay Soil',
    soilMoisture: 72,
    temperature: 29,
    rainfallProb: 80,
  },
];

export function getFarmData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoFarmData);
    }, 800);
  });
}
