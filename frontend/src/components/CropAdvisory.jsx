function CropAdvisory({ farm, status }) {
  if (!farm) {
    return null;
  }

  let advice = 'Maintain the current moisture level and continue monitoring.';

  if (status === 'Irrigation Required') {
    advice = 'Provide irrigation and monitor soil moisture regularly.';
  } else if (status === 'Delay Irrigation') {
    advice = 'Delay irrigation because moisture or rainfall conditions are high.';
  }

  return (
    <div className="card advisory-card">
      <h3>Crop Advisory</h3>

      <div className="advisory-item">
        <strong>Crop: </strong>
        {farm.crop}
      </div>

      <div className="advisory-item">
        <strong>Advice: </strong>
        {advice}
      </div>

      <div className="advisory-item">
        <strong>Fertilizer Recommendation: </strong>
        Use balanced fertilizer according to crop and soil requirements.
      </div>
    </div>
  );
}

export default CropAdvisory;
