function FarmCard({ farm }) {
  if (!farm) {
    return null;
  }

  return (
    <div className="card farm-card">
      <h3>Farm Information</h3>

      <div className="info-grid">
        <div className="info-item">
          <span className="label">Farm Name:</span>
          <span className="value">{farm.name}</span>
        </div>

        <div className="info-item">
          <span className="label">Crop:</span>
          <span className="value">{farm.crop}</span>
        </div>

        <div className="info-item">
          <span className="label">Location:</span>
          <span className="value">{farm.location}</span>
        </div>

        <div className="info-item">
          <span className="label">Farm Area:</span>
          <span className="value">{farm.area} acres</span>
        </div>

        <div className="info-item">
          <span className="label">Soil Type:</span>
          <span className="value">{farm.soilType}</span>
        </div>

        <div className="info-item">
          <span className="label">Soil Moisture:</span>
          <span className="value">{farm.soilMoisture}%</span>
        </div>

        <div className="info-item">
          <span className="label">Temperature:</span>
          <span className="value">{farm.temperature}°C</span>
        </div>

        <div className="info-item">
          <span className="label">Rainfall Probability:</span>
          <span className="value">{farm.rainfallProb}%</span>
        </div>

        <div className="info-item">
          <span className="label">Humidity:</span>
          <span className="value">{farm.humidity}%</span>
        </div>
      </div>
    </div>
  );
}

export default FarmCard;
