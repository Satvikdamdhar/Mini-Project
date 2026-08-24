function SummaryCard({ icon, title, value, status, statusType, buttonText, onButtonClick, extra }) {
  return (
    <div className="summary-card-box">
      <div className="summary-icon">{icon}</div>
      <div className="summary-content">
        <div className="summary-title">{title}</div>
        <div className="summary-value">{value}</div>
        {status && <div className={`summary-status ${statusType}`}>{status}</div>}
        {extra && <div className="summary-extra">{extra}</div>}
      </div>
      {buttonText && (
        <button type="button" className="pump-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default SummaryCard;
