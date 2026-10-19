function AlertCard({ type, message }) {
  return (
    <div className={`alert-item ${type}`}>
      <span className="alert-dot" />
      <span>{message}</span>
    </div>
  );
}

export default AlertCard;
