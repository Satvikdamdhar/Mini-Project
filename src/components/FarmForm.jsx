import { useState } from 'react';

function FarmForm({ onAddFarm }) {
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    area: '',
    soilType: 'Black Soil',
    soilMoisture: '',
    temperature: '',
    rainfallProb: '',
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.crop.trim()) {
      validationErrors.crop = 'Crop type is required.';
    }

    if (!formData.area || Number(formData.area) <= 0) {
      validationErrors.area = 'Farm area must be greater than 0.';
    }

    if (
      formData.soilMoisture === '' ||
      Number(formData.soilMoisture) < 0 ||
      Number(formData.soilMoisture) > 100
    ) {
      validationErrors.soilMoisture = 'Soil moisture must be between 0 and 100.';
    }

    if (
      formData.temperature === '' ||
      Number(formData.temperature) < -20 ||
      Number(formData.temperature) > 60
    ) {
      validationErrors.temperature = 'Temperature must be between -20°C and 60°C.';
    }

    if (
      formData.rainfallProb === '' ||
      Number(formData.rainfallProb) < 0 ||
      Number(formData.rainfallProb) > 100
    ) {
      validationErrors.rainfallProb = 'Rainfall probability must be between 0 and 100.';
    }

    return validationErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newFarm = {
      id: Date.now(),
      name: formData.name,
      crop: formData.crop,
      area: Number(formData.area),
      soilType: formData.soilType,
      soilMoisture: Number(formData.soilMoisture),
      temperature: Number(formData.temperature),
      rainfallProb: Number(formData.rainfallProb),
    };

    onAddFarm(newFarm);

    setFormData({
      name: '',
      crop: '',
      area: '',
      soilType: 'Black Soil',
      soilMoisture: '',
      temperature: '',
      rainfallProb: '',
    });
    setErrors({});
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
            <label>Rainfall Probability (%):</label>
            <input
              type="number"
              name="rainfallProb"
              value={formData.rainfallProb}
              onChange={handleChange}
            />
            {errors.rainfallProb && <span className="error-text">{errors.rainfallProb}</span>}
          </div>
        </div>

        <button type="submit" className="btn-submit">Add Farm Data</button>
      </form>
    </div>
  );
}

export default FarmForm;
