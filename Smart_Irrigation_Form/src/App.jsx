import React, { useState } from 'react';
import './App.css';

const INITIAL_FORM_STATE = {
  farmerName: '',
  email: '',
  phone: '',
  farmName: '',
  farmSizeAcres: '',
cropType: '',
  soilType: 'loam',
  irrigationType: 'drip',
  sensorNodeCount: '1',
  agreeToTerms: false,
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newLoginErrors = {};
    if (!loginData.username.trim()) {
      newLoginErrors.username = 'Username is required.';
    }
    if (!loginData.password) {
      newLoginErrors.password = 'Password is required.';
    }
    setLoginErrors(newLoginErrors);

    if (Object.keys(newLoginErrors).length === 0) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setLoginErrors({});
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitted(false);
  };

  // Validation Logic
  const validateField = (name, value) => {
    let errorMsg = '';

    switch (name) {
      case 'farmerName':
        if (!value.trim()) errorMsg = 'Farmer/Owner name is required.';
        else if (value.trim().length < 2) errorMsg = 'Name must be at least 2 characters.';
        break;

      case 'email':
        if (!value) errorMsg = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = 'Enter a valid email address.';
        break;

      case 'phone':
        if (!value) errorMsg = 'Phone number is required.';
        else if (!/^\+?[0-9]{10,14}$/.test(value.replace(/[\s-]/g, ''))) {
          errorMsg = 'Enter a valid 10 to 14 digit phone number.';
        }
        break;

      case 'farmName':
        if (!value.trim()) errorMsg = 'Farm/Plot name is required.';
        break;

      case 'farmSizeAcres':
        if (!value) errorMsg = 'Farm size is required.';
        else if (isNaN(value) || Number(value) <= 0) errorMsg = 'Size must be a positive number.';
        break;

      case 'cropType':
        if (!value.trim()) errorMsg = 'Primary crop type is required.';
        break;

case 'sensorNodeCount':
        if (!value) errorMsg = 'Sensor node count is required.';
        else if (!Number.isInteger(Number(value)) || Number(value) < 1) {
          errorMsg = 'Minimum 1 sensor node required.';
        }
        break;

      case 'agreeToTerms':
        if (!value) errorMsg = 'You must agree to the terms and conditions.';
        break;

      default:
        break;
    }

    return errorMsg;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // Real-time validation clear/update
    const fieldError = validateField(name, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitted(false);
    } else {
      setErrors({});
      setIsSubmitted(true);
      console.log('Registered Smart Irrigation Farm Data:', formData);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitted(false);
  };

return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="card login-card">
          <header className="header">
            <h2>🔐 Login</h2>
            <p>Sign in to access the Smart Irrigation registration.</p>
          </header>

          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleLoginChange}
                className={loginErrors.username ? 'input-error' : ''}
              />
              {loginErrors.username && <span className="error-text">{loginErrors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                className={loginErrors.password ? 'input-error' : ''}
              />
              {loginErrors.password && <span className="error-text">{loginErrors.password}</span>}
            </div>

            <button type="submit" className="btn primary">
              Login
            </button>
          </form>
        </div>
      ) : (
      <div className="card">
        <header className="header">
          <h2>🌾 Smart Irrigation System</h2>
          <p>Register your farm plot to enable automated moisture & flow telemetry.</p>
          <button className="btn secondary logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {isSubmitted ? (
          <div className="success-banner">
            <h3>✅ Farm Successfully Registered!</h3>
            <p><strong>Farm Name:</strong> {formData.farmName}</p>
            <p><strong>Owner:</strong> {formData.farmerName}</p>
            <p><strong>Configured Nodes:</strong> {formData.sensorNodeCount} Sensor Units</p>
            <button className="btn secondary" onClick={handleReset}>
              Register Another Farm
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Personal Information</legend>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="farmerName">Full Name *</label>
<input
                    type="text"
                    id="farmerName"
                    name="farmerName"
                    value={formData.farmerName}
                    onChange={handleChange}
                    className={errors.farmerName ? 'input-error' : ''}
                  />
                  {errors.farmerName && <span className="error-text">{errors.farmerName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
<input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone / WhatsApp Number *</label>
<input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'input-error' : ''}
                  />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </fieldset>

            <fieldset>
              <legend>Farm Details & Agronomics</legend>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="farmName">Farm / Plot Name *</label>
<input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    className={errors.farmName ? 'input-error' : ''}
                  />
                  {errors.farmName && <span className="error-text">{errors.farmName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="farmSizeAcres">Size (Acres) *</label>
<input
                    type="number"
                    step="0.1"
                    id="farmSizeAcres"
                    name="farmSizeAcres"
                    value={formData.farmSizeAcres}
                    onChange={handleChange}
                    className={errors.farmSizeAcres ? 'input-error' : ''}
                  />
                  {errors.farmSizeAcres && <span className="error-text">{errors.farmSizeAcres}</span>}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="cropType">Primary Crop *</label>
<input
                    type="text"
                    id="cropType"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleChange}
                    className={errors.cropType ? 'input-error' : ''}
                  />
                  {errors.cropType && <span className="error-text">{errors.cropType}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="soilType">Soil Profile</label>
                  <select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                  >
                    <option value="loam">Loam</option>
                    <option value="sandy">Sandy</option>
                    <option value="clay">Clay</option>
                    <option value="silt">Silt</option>
                    <option value="peat">Peat</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Irrigation Setup</legend>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="irrigationType">Irrigation System</label>
                  <select
                    id="irrigationType"
                    name="irrigationType"
                    value={formData.irrigationType}
                    onChange={handleChange}
                  >
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Center Pivot / Sprinkler</option>
                    <option value="surface">Surface / Flood</option>
                    <option value="subsurface">Sub-surface Drip</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sensorNodeCount">IoT Sensor Nodes *</label>
                  <input
                    type="number"
                    id="sensorNodeCount"
                    name="sensorNodeCount"
                    min="1"
                    value={formData.sensorNodeCount}
                    onChange={handleChange}
                    className={errors.sensorNodeCount ? 'input-error' : ''}
                  />
                  {errors.sensorNodeCount && <span className="error-text">{errors.sensorNodeCount}</span>}
                </div>
              </div>
            </fieldset>

<div className={`form-group terms-group ${errors.agreeToTerms ? 'has-error' : ''}`}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span>I agree to the Terms &amp; Conditions and Privacy Policy</span>
              </label>
              {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
            </div>

<button type="submit" className="btn primary">
              Register Farm Setup
            </button>
          </form>
        )}
      </div>
      )}
    </div>
  );
}
