function WeatherCard({ day, temperature, humidity, rain, wind, icon }) {
  return (
    <div className="weather-forecast-card">
      <div className="weather-day">{day}</div>
      <div className="forecast-icon">{icon}</div>
      <div className="forecast-temp">{temperature}</div>
      <div className="forecast-meta">Humidity {humidity}</div>
      <div className="forecast-meta">Rain {rain}</div>
      <div className="forecast-meta">Wind {wind}</div>
    </div>
  );
}

export default WeatherCard;
