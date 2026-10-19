import { useState } from 'react';

function FarmForm({ onAddFarm }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    crop: '',
    area: '',
    soilType: 'Black Soil',
    soilMoisture: '',
    temperature: '',
    humidity: '',
    rainfall: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateForm() {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Farm name is required.';
    }

    if (!formData.location.trim()) {
      validationErrors.location = 'Location is required.';
    }

    if (!formData.crop.trim()) {
      validationErrors.crop = 'Crop type is required.';
    }

    if (formData.area === '' || !Number.isFinite(Number(formData.area)) || Number(formData.area) <= 0) {
      validationErrors.area = 'Farm area must be greater than 0.';
    }

    if (
      formData.soilMoisture === '' ||
      !Number.isFinite(Number(formData.soilMoisture)) ||
      Number(formData.soilMoisture) < 0 ||
      Number(formData.soilMoisture) > 100
    ) {
      validationErrors.soilMoisture = 'Soil moisture must be between 0 and 100.';
    }

    if (
      formData.temperature === '' ||
      !Number.isFinite(Number(formData.temperature)) ||
      Number(formData.temperature) < -20 ||
      Number(formData.temperature) > 60
    ) {
      validationErrors.temperature = 'Temperature must be between -20°C and 60°C.';
    }

    if (formData.humidity === '' || !Number.isFinite(Number(formData.humidity)) || Number(formData.humidity) < 0 || Number(formData.humidity) > 100) {
      validationErrors.humidity = 'Humidity must be between 0 and 100.';
    }

    if (formData.rainfall === '' || !Number.isFinite(Number(formData.rainfall)) || Number(formData.rainfall) < 0) {
      validationErrors.rainfall = 'Rainfall must be zero or more millimetres.';
    }

    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newFarm = {
      name: formData.name,
      location: formData.location,
      crop: formData.crop,
      area: Number(formData.area),
      soilType: formData.soilType,
      soilMoisture: Number(formData.soilMoisture),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      rainfall: Number(formData.rainfall),
    };

    setSaving(true);
    setSubmitError('');
    try {
      await onAddFarm(newFarm);
      setFormData({ name: '', location: '', crop: '', area: '', soilType: 'Black Soil', soilMoisture: '', temperature: '', humidity: '', rainfall: '' });
      setErrors({});
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card form-card">
      <h3>Add New Farm Data</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Farm Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" placeholder="Village, Maharashtra" value={formData.location} onChange={handleChange} />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label>Crop Type:</label>
          <input type="text" name="crop" value={formData.crop} onChange={handleChange} />
          {errors.crop && <span className="error-text">{errors.crop}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Farm Area (acres):</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} />
            {errors.area && <span className="error-text">{errors.area}</span>}
          </div>

          <div className="form-group">
            <label>Soil Type:</label>
            <select name="soilType" value={formData.soilType} onChange={handleChange}>
              <option value="Black Soil">Black Soil</option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Soil Moisture (%):</label>
            <input
              type="number"
              name="soilMoisture"
              value={formData.soilMoisture}
              onChange={handleChange}
            />
            {errors.soilMoisture && <span className="error-text">{errors.soilMoisture}</span>}
          </div>

          <div className="form-group">
            <label>Temperature (°C):</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
            />
            {errors.temperature && <span className="error-text">{errors.temperature}</span>}
          </div>

          <div className="form-group">
            <label>Humidity (%):</label>
            <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} />
            {errors.humidity && <span className="error-text">{errors.humidity}</span>}
          </div>

          <div className="form-group">
            <label>Rainfall (mm):</label>
            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} />
            {errors.rainfall && <span className="error-text">{errors.rainfall}</span>}
          </div>
        </div>

        {submitError && <div className="auth-error" role="alert">{submitError}</div>}
        <button type="submit" className="btn-submit" disabled={saving}>{saving ? 'Saving...' : 'Add Farm Data'}</button>
      </form>
    </div>
  );
}

export default FarmForm;
