function IrrigationAlert({ status, message, icon }) {
  let alertClass = 'alert-optimal';

  if (status === 'Irrigation Required') {
    alertClass = 'alert-required';
  } else if (status === 'Delay Irrigation') {
    alertClass = 'alert-delay';
  }

  return (
    <div className={`card recommendation-card ${alertClass}`}>
      <h3>Decision Support Engine</h3>

      <div className="recommendation-status">
        <span className="icon">{icon}</span>
        <h2>{status}</h2>
      </div>

      <p className="reason-text">{message}</p>
    </div>
  );
}

export default IrrigationAlert;
