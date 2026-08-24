import { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import SummaryCard from './components/SummaryCard';
import RecommendationCard from './components/RecommendationCard';
import FarmCard from './components/FarmCard';
import WeatherCard from './components/WeatherCard';
import AlertCard from './components/AlertCard';
import FarmForm from './components/FarmForm';
import { getFarmData } from './services/agriApi';

const sidebarItems = [
  { label: 'Dashboard', icon: '🌱' },
  { label: 'My Farms', icon: '🌾' },
  { label: 'Irrigation Advisory', icon: '💧' },
  { label: 'Weather & Soil', icon: '🌦' },
  { label: 'Reports', icon: '📊' },
  { label: 'About', icon: 'ℹ' },
];

function App() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [page, setPage] = useState('Dashboard');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [pumpOn, setPumpOn] = useState(false);

  async function loadFarmData() {
    setLoading(true);
    const data = await getFarmData();
    setFarms(data);
    if (data.length > 0) {
      setSelectedFarmId(data[0].id);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadFarmData();
  }, []);

  const currentFarm = farms.find((farm) => farm.id === selectedFarmId);

  useEffect(() => {
    if (!currentFarm) {
      return;
    }

    if (currentFarm.soilMoisture < 30) {
      setStatus('💧 Irrigation Required');
      setIcon('💧');
      setMessage(
        `Irrigation is recommended within the next 3 hours because soil moisture is below the recommended level.`
      );
    } else if (currentFarm.soilMoisture > 60 || currentFarm.rainfallProb >= 70) {
      setStatus('🌦 Delay Irrigation');
      setIcon('🌦');
      setMessage(
        `Delay irrigation because soil moisture and rainfall conditions are currently high.`
      );
    } else {
      setStatus('✅ Optimal Moisture');
      setIcon('✅');
      setMessage(
        `Moisture is balanced and current conditions are suitable for crop growth.`
      );
    }

    setLastUpdated(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, [currentFarm]);

  function handleFarmChange(farmId) {
    setSelectedFarmId(farmId);
  }

  function handleAddFarm(newFarm) {
    setFarms((previousFarms) => [...previousFarms, newFarm]);
    setSelectedFarmId(newFarm.id);
    setPage('Dashboard');
  }

  const moistureStatus =
    currentFarm && currentFarm.soilMoisture < 30
      ? 'Low'
      : currentFarm && currentFarm.soilMoisture > 60
        ? 'High'
        : 'Normal';

  const forecast = [
    { day: 'Mon', temperature: '31°C', humidity: '12%', rain: '10%', wind: '12 km/h', icon: '☀️' },
    { day: 'Tue', temperature: '30°C', humidity: '15%', rain: '20%', wind: '10 km/h', icon: '🌤️' },
    { day: 'Wed', temperature: '27°C', humidity: '18%', rain: '30%', wind: '15 km/h', icon: '⛅' },
    { day: 'Thu', temperature: '28°C', humidity: '16%', rain: '18%', wind: '14 km/h', icon: '🌤️' },
    { day: 'Fri', temperature: '32°C', humidity: '14%', rain: '8%', wind: '18 km/h', icon: '☀️' },
    { day: 'Sat', temperature: '33°C', humidity: '18%', rain: '7%', wind: '20 km/h', icon: '☀️' },
    { day: 'Sun', temperature: '31°C', humidity: '17%', rain: '12%', wind: '16 km/h', icon: '🌤️' },
  ];

  const alerts = [
    currentFarm && currentFarm.soilMoisture < 30
      ? { type: 'critical', message: 'Soil moisture critically low.' }
      : { type: 'info', message: 'Soil moisture is within acceptable range.' },
    { type: 'warning', message: 'Rain expected tomorrow.' },
    { type: 'success', message: 'Pump completed irrigation successfully.' },
  ];

  function renderDashboard() {
    if (loading) {
      return <div className="loading-message">Loading farm data...</div>;
    }

    return (
      <>
        <div className="dashboard-header-row">
          <div className="farm-selector-wrap">
            <label htmlFor="farm-select">Select Farm / Plot</label>
            <select
              id="farm-select"
              value={selectedFarmId ?? ''}
              onChange={(event) => handleFarmChange(Number(event.target.value))}
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="header-user-box">
            <div className="notification-icon">🔔</div>
            <div className="user-profile">
              <span className="user-avatar">👨‍🌾</span>
              <span>Ramesh Kumar</span>
            </div>
            <select className="language-select" defaultValue="English">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>

        <div className="summary-grid">
          <SummaryCard
            icon="🌱"
            title="Soil Moisture"
            value={`${currentFarm ? currentFarm.soilMoisture : 0}%`}
            status={moistureStatus}
            statusType={moistureStatus === 'Low' ? 'low' : moistureStatus === 'High' ? 'high' : 'normal'}
          />
          <SummaryCard
            icon="💧"
            title="Water Tank"
            value="78%"
            status="Normal"
            statusType="normal"
          />
          <SummaryCard
            icon="🌦"
            title="Weather"
            value={`${currentFarm ? currentFarm.temperature : 0}°C`}
            extra={
              <div>
                <span>Humidity 70%</span>
                <span>Rainfall {currentFarm ? currentFarm.rainfallProb : 0}%</span>
              </div>
            }
          />
          <SummaryCard
            icon="🚰"
            title="Pump Status"
            value={pumpOn ? 'ON' : 'OFF'}
            status="Current Status"
            statusType={pumpOn ? 'normal' : 'low'}
            buttonText={pumpOn ? 'Stop Pump' : 'Start Pump'}
            onButtonClick={() => setPumpOn((value) => !value)}
          />
        </div>

        <RecommendationCard
          title="🤖 AI Irrigation Recommendation"
          status={status}
          message={message}
          icon={icon}
          actionText="Start Irrigation"
          secondaryText="View Details"
        />

        <section className="section-block">
          <div className="section-title-row">
            <h3>Farm Overview</h3>
          </div>

          <div className="farm-grid">
            {farms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                isSelected={farm.id === selectedFarmId}
                onSelect={() => handleFarmChange(farm.id)}
              />
            ))}
          </div>
        </section>

        <div className="detail-grid">
          <section className="section-block">
            <div className="section-title-row">
              <h3>Live Environmental Data</h3>
            </div>
            <div className="data-grid">
              <div className="mini-stat">
                <span>🌱 Soil Moisture</span>
                <strong>{currentFarm ? `${currentFarm.soilMoisture}%` : '0%'}</strong>
              </div>
              <div className="mini-stat">
                <span>🌡 Temperature</span>
                <strong>{currentFarm ? `${currentFarm.temperature}°C` : '0°C'}</strong>
              </div>
              <div className="mini-stat">
                <span>💧 Humidity</span>
                <strong>70%</strong>
              </div>
              <div className="mini-stat">
                <span>🌧 Rainfall</span>
                <strong>{currentFarm ? `${currentFarm.rainfallProb}%` : '0%'}</strong>
              </div>
              <div className="mini-stat soil-type">
                <span>🌾 Soil Type</span>
                <strong>{currentFarm ? currentFarm.soilType : 'N/A'}</strong>
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="section-title-row">
              <h3>Weather</h3>
            </div>
            <div className="weather-main">
              <div className="weather-header-small">
                <strong>Today's Weather</strong>
              </div>
              <div className="weather-detail-row">
                <span>Temperature</span>
                <strong>{currentFarm ? `${currentFarm.temperature}°C` : '0°C'}</strong>
              </div>
              <div className="weather-detail-row">
                <span>Humidity</span>
                <strong>70%</strong>
              </div>
              <div className="weather-detail-row">
                <span>Rainfall Probability</span>
                <strong>{currentFarm ? `${currentFarm.rainfallProb}%` : '0%'}</strong>
              </div>
              <div className="weather-detail-row">
                <span>Wind Speed</span>
                <strong>12 km/h</strong>
              </div>
            </div>
          </section>
        </div>

        <section className="section-block">
          <div className="section-title-row">
            <h3>7-Day Weather Forecast</h3>
          </div>
          <div className="forecast-grid">
            {forecast.map((day) => (
              <WeatherCard
                key={day.day}
                day={day.day}
                temperature={day.temperature}
                humidity={day.humidity}
                rain={day.rain}
                wind={day.wind}
                icon={day.icon}
              />
            ))}
          </div>
        </section>

        <div className="detail-grid">
          <section className="section-block">
            <div className="section-title-row">
              <h3>Irrigation Advisory</h3>
            </div>
            {currentFarm && (
              <div className="advisory-panel">
                <div className="advisory-row">
                  <span>Selected Farm</span>
                  <strong>{currentFarm.name}</strong>
                </div>
                <div className="advisory-row">
                  <span>Crop</span>
                  <strong>{currentFarm.crop}</strong>
                </div>
                <div className="advisory-row">
                  <span>Soil Moisture</span>
                  <strong>{currentFarm.soilMoisture}%</strong>
                </div>
                <div className="advisory-row">
                  <span>Rainfall Probability</span>
                  <strong>{currentFarm.rainfallProb}%</strong>
                </div>
                <div className="advisory-row">
                  <span>Temperature</span>
                  <strong>{currentFarm.temperature}°C</strong>
                </div>
                <div className="advisory-row">
                  <span>Decision Support Engine</span>
                  <strong>{status}</strong>
                </div>
                <div className="advisory-row">
                  <span>Reason</span>
                  <strong>{message}</strong>
                </div>
                <div className="advisory-row">
                  <span>Recommendation</span>
                  <strong>
                    {status.includes('Irrigation')
                      ? 'Start irrigation and monitor soil moisture.'
                      : status.includes('Delay')
                        ? 'Delay watering because moisture conditions are high.'
                        : 'Maintain current moisture level and continue regular monitoring.'}
                  </strong>
                </div>
              </div>
            )}
          </section>

          <section className="section-block">
            <div className="section-title-row">
              <h3>Crop Advisory</h3>
            </div>
            {currentFarm && (
              <div className="advisory-panel">
                <div className="advisory-row">
                  <span>Crop</span>
                  <strong>{currentFarm.crop}</strong>
                </div>
                <div className="advisory-row">
                  <span>Crop Stage</span>
                  <strong>
                    {currentFarm.crop === 'Sugarcane'
                      ? 'Vegetative Stage'
                      : currentFarm.crop === 'Cotton'
                        ? 'Flowering Stage'
                        : 'Ripening Stage'}
                  </strong>
                </div>
                <div className="advisory-row">
                  <span>Soil Type</span>
                  <strong>{currentFarm.soilType}</strong>
                </div>
                <div className="advisory-row">
                  <span>Advisory</span>
                  <strong>
                    {status.includes('Irrigation')
                      ? 'Provide irrigation and monitor the soil moisture regularly.'
                      : status.includes('Delay')
                        ? 'Delay irrigation because soil moisture and rainfall probability are high.'
                        : 'Maintain current moisture level and continue monitoring.'}
                  </strong>
                </div>
                <div className="advisory-row">
                  <span>Fertilizer Recommendation</span>
                  <strong>Use balanced fertilizer according to crop and soil requirements.</strong>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="section-block">
          <div className="section-title-row">
            <h3>Recent Alerts</h3>
          </div>
          <div className="alert-list">
            {alerts.map((alert, index) => (
              <AlertCard key={index} type={alert.type} message={alert.message} />
            ))}
          </div>
        </section>

        <section className="section-block quick-actions-box">
          <div className="section-title-row">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button type="button" className="quick-action-btn" onClick={() => setPumpOn(true)}>
              💧 Start Irrigation
            </button>
            <button type="button" className="quick-action-btn" onClick={() => setPumpOn(false)}>
              🛑 Stop Irrigation
            </button>
            <button type="button" className="quick-action-btn" onClick={loadFarmData}>
              🔄 Refresh Data
            </button>
            <button type="button" className="quick-action-btn" onClick={() => setPage('Reports')}>
              📊 View Report
            </button>
          </div>
        </section>

        <div className="timestamp-box top-right-timestamp">
          <strong>Last Updated:</strong> {lastUpdated}
        </div>
      </>
    );
  }

  function renderPageContent() {
    if (page === 'Farm Management') {
      return (
        <div className="management-page">
          <FarmForm onAddFarm={handleAddFarm} />
          <div className="card summary-card">
            <h3>Farm Summary</h3>
            {farms.map((farm) => (
              <div key={farm.id} className="summary-row">
                <span>{farm.name}</span>
                <span>{farm.crop}</span>
                <button type="button" onClick={() => setSelectedFarmId(farm.id)}>
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (page === 'Reports') {
      return (
        <div className="card report-card">
          <h3>Field Report</h3>
          <p>Water usage is stable.</p>
          <p>{currentFarm ? currentFarm.name : 'No farm selected'} is currently under monitoring.</p>
        </div>
      );
    }

    if (page === 'My Farms') {
      return (
        <div className="card my-farms-card">
          <h3>My Farms</h3>
          {farms.map((farm) => (
            <div key={farm.id} className="summary-row">
              <span>{farm.name}</span>
              <span>{farm.crop}</span>
              <button type="button" onClick={() => setSelectedFarmId(farm.id)}>
                Select
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (page === 'Weather & Soil') {
      return (
        <div className="card weather-card-full">
          <h3>Weather & Soil</h3>
          {currentFarm && (
            <div className="weather-grid-full">
              <div className="mini-stat">
                <span>Soil Type</span>
                <strong>{currentFarm.soilType}</strong>
              </div>
              <div className="mini-stat">
                <span>Soil Moisture</span>
                <strong>{currentFarm.soilMoisture}%</strong>
              </div>
              <div className="mini-stat">
                <span>Temperature</span>
                <strong>{currentFarm.temperature}°C</strong>
              </div>
              <div className="mini-stat">
                <span>Rain Probability</span>
                <strong>{currentFarm.rainfallProb}%</strong>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (page === 'About') {
      return (
        <div className="card about-card">
          <h3>About</h3>
          <p>This dashboard helps farmers monitor soil moisture, weather, and irrigation decisions.</p>
          <p>It is designed as a beginner-friendly React project for smart farming and irrigation advisory.</p>
        </div>
      );
    }

    return renderDashboard();
  }

  return (
    <div className="app-shell">
      <Sidebar items={sidebarItems} selectedPage={page} onSelect={setPage} />

      <div className="content-shell">
        <header className="top-header">
          <div>
            <h1>AI Smart Irrigation Advisory System</h1>
            <p>Smart Farming • Irrigation Decision Support</p>
          </div>
        </header>

        <main className="page-content">{renderPageContent()}</main>
      </div>
    </div>
  );
}

export default App;
