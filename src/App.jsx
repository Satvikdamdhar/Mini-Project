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

const defaultUsers = [
  { id: 1, fullName: 'Admin Farmer', email: 'admin@farm.com', password: 'farmer123' },
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(defaultUsers);
  const [authError, setAuthError] = useState('');
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginData, setLoginData] = useState({ identifier: 'admin@farm.com', password: 'farmer123' });
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    farmName: '',
    farmSize: '',
    primaryCrop: '',
    soilProfile: 'Loam',
    irrigationSystem: 'Drip Irrigation',
    agreeTerms: false,
  });

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

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  }

  function handleLoginSubmit(event) {
    event.preventDefault();

    const identifier = loginData.identifier.trim();
    const password = loginData.password;

    if (!identifier || !password) {
      setAuthError('Please enter your email/username and password.');
      return;
    }

    const matchedUser = users.find(
      (user) =>
        (user.email.toLowerCase() === identifier.toLowerCase() ||
          user.fullName.toLowerCase() === identifier.toLowerCase()) &&
        user.password === password
    );

    if (!matchedUser) {
      setAuthError('Invalid credentials. Please try again.');
      return;
    }

    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    setAuthError('');
    setPage('Dashboard');
  }

  function handleRegisterSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    const fullName = registerData.fullName.trim();
    const email = registerData.email.trim().toLowerCase();
    const phone = registerData.phone.trim();
    const farmName = registerData.farmName.trim();
    const farmSize = Number(registerData.farmSize);
    const primaryCrop = registerData.primaryCrop.trim();
    const soilProfile = registerData.soilProfile;
    const irrigationSystem = registerData.irrigationSystem;

    if (!fullName) nextErrors.fullName = 'Full Name is required.';
    if (!email) nextErrors.email = 'Email is required.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!phone) nextErrors.phone = 'Phone number is required.';
    if (!farmName) nextErrors.farmName = 'Farm / Plot Name is required.';
    if (!registerData.farmSize || Number.isNaN(farmSize) || farmSize <= 0) {
      nextErrors.farmSize = 'Farm size is required.';
    }
    if (!primaryCrop) nextErrors.primaryCrop = 'Primary crop type is required.';
    if (!soilProfile) nextErrors.soilProfile = 'Soil profile is required.';
    if (!irrigationSystem) nextErrors.irrigationSystem = 'Irrigation system is required.';
    if (!registerData.agreeTerms) nextErrors.agreeTerms = 'You must agree to the terms and conditions.';

    const emailExists = users.some((user) => user.email.toLowerCase() === email);
    if (email && emailExists) {
      nextErrors.email = 'This email is already registered. Please log in instead.';
    }

    setRegisterErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAuthError('Please correct the highlighted fields.');
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      phone,
      farmName,
      farmSize,
      primaryCrop,
      soilProfile,
      irrigationSystem,
      password: 'Farm@123',
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setAuthError('');
    setRegisterErrors({});
    setRegisterData({
      fullName: '',
      email: '',
      phone: '',
      farmName: '',
      farmSize: '',
      primaryCrop: '',
      soilProfile: 'Loam',
      irrigationSystem: 'Drip Irrigation',
      agreeTerms: false,
    });
    setPage('Dashboard');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthError('');
    setAuthMode('login');
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

  function renderAuthScreen() {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">🌱</div>
            <div>
              <h2>AgriSense</h2>
              <p>Smart Irrigation Control</p>
            </div>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setAuthMode('register')}
            >
              New User
            </button>
          </div>

          {authMode === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="field-group">
                <label htmlFor="login-identifier">Email / Username</label>
                <input
                  id="login-identifier"
                  name="identifier"
                  type="text"
                  value={loginData.identifier}
                  onChange={handleLoginChange}
                  placeholder="Enter your email or username"
                />
              </div>

              <div className="field-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
              </div>

              {authError && <div className="auth-error">{authError}</div>}

              <button type="submit" className="auth-submit-button">
                Sign In
              </button>

              <div className="demo-account-box">
                <strong>Demo account:</strong>
                <span>admin@farm.com / farmer123</span>
              </div>
            </form>
          ) : (
            <form className="register-form" onSubmit={handleRegisterSubmit}>
              <div className="register-section">
                <div className="section-title-small">PERSONAL INFORMATION</div>

                <div className="register-grid two-col">
                  <div className="register-field">
                    <label htmlFor="register-fullName">
                      Full Name <span className="asterisk">*</span>
                    </label>
                    <input
                      id="register-fullName"
                      name="fullName"
                      type="text"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      className={registerErrors.fullName ? 'input-error' : ''}
                    />
                    {registerErrors.fullName && <span className="validation-error">{registerErrors.fullName}</span>}
                  </div>

                  <div className="register-field">
                    <label htmlFor="register-email">
                      Email Address <span className="asterisk">*</span>
                    </label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className={registerErrors.email ? 'input-error' : ''}
                    />
                    {registerErrors.email && <span className="validation-error">{registerErrors.email}</span>}
                  </div>
                </div>

                <div className="register-field single-col">
                  <label htmlFor="register-phone">
                    Phone / WhatsApp Number <span className="asterisk">*</span>
                  </label>
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className={registerErrors.phone ? 'input-error' : ''}
                  />
                  {registerErrors.phone && <span className="validation-error">{registerErrors.phone}</span>}
                </div>
              </div>

              <div className="register-section">
                <div className="section-title-small">FARM DETAILS &amp; AGRONOMICS</div>

                <div className="register-grid two-col">
                  <div className="register-field">
                    <label htmlFor="register-farmName">
                      Farm / Plot Name <span className="asterisk">*</span>
                    </label>
                    <input
                      id="register-farmName"
                      name="farmName"
                      type="text"
                      value={registerData.farmName}
                      onChange={handleRegisterChange}
                      className={registerErrors.farmName ? 'input-error' : ''}
                    />
                    {registerErrors.farmName && <span className="validation-error">{registerErrors.farmName}</span>}
                  </div>

                  <div className="register-field">
                    <label htmlFor="register-farmSize">
                      Size (Acres) <span className="asterisk">*</span>
                    </label>
                    <input
                      id="register-farmSize"
                      name="farmSize"
                      type="number"
                      min="0"
                      step="0.1"
                      value={registerData.farmSize}
                      onChange={handleRegisterChange}
                      className={registerErrors.farmSize ? 'input-error' : ''}
                    />
                    {registerErrors.farmSize && <span className="validation-error">{registerErrors.farmSize}</span>}
                  </div>
                </div>

                <div className="register-grid two-col">
                  <div className="register-field">
                    <label htmlFor="register-primaryCrop">
                      Primary Crop <span className="asterisk">*</span>
                    </label>
                    <input
                      id="register-primaryCrop"
                      name="primaryCrop"
                      type="text"
                      value={registerData.primaryCrop}
                      onChange={handleRegisterChange}
                      className={registerErrors.primaryCrop ? 'input-error' : ''}
                    />
                    {registerErrors.primaryCrop && <span className="validation-error">{registerErrors.primaryCrop}</span>}
                  </div>

                  <div className="register-field">
                    <label htmlFor="register-soilProfile">Soil Profile</label>
                    <select
                      id="register-soilProfile"
                      name="soilProfile"
                      value={registerData.soilProfile}
                      onChange={handleRegisterChange}
                    >
                      <option value="Loam">Loam</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Red Soil">Red Soil</option>
                      <option value="Black Soil">Black Soil</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="register-section">
                <div className="section-title-small">IRRIGATION SETUP</div>

                <div className="register-field single-col">
                  <label htmlFor="register-irrigationSystem">
                    Irrigation System <span className="asterisk">*</span>
                  </label>
                  <select
                    id="register-irrigationSystem"
                    name="irrigationSystem"
                    value={registerData.irrigationSystem}
                    onChange={handleRegisterChange}
                    className={registerErrors.irrigationSystem ? 'input-error' : ''}
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Center Pivot / Sprinkler">Center Pivot / Sprinkler</option>
                    <option value="Surface / Flood">Surface / Flood</option>
                    <option value="Sub-surface Drip">Sub-surface Drip</option>
                  </select>
                  {registerErrors.irrigationSystem && (
                    <span className="validation-error">{registerErrors.irrigationSystem}</span>
                  )}
                </div>
              </div>

              {authError && <div className="auth-error">{authError}</div>}

              <div className="terms-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={registerData.agreeTerms}
                    onChange={(event) =>
                      setRegisterData((prev) => ({ ...prev, agreeTerms: event.target.checked }))
                    }
                  />
                  <span>I agree to the Terms &amp; Conditions and Privacy Policy</span>
                </label>
                {registerErrors.agreeTerms && (
                  <span className="validation-error inline-warning">{registerErrors.agreeTerms}</span>
                )}
              </div>

              <button type="submit" className="register-submit-button">
                Register Farm Setup
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

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
              <span>{currentUser ? currentUser.fullName : 'Ramesh Kumar'}</span>
            </div>
            <select className="language-select" defaultValue="English">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
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

  if (!isAuthenticated) {
    return renderAuthScreen();
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
