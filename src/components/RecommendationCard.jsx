function RecommendationCard({ title, status, message, icon, actionText, secondaryText }) {
  return (
    <div className="recommendation-panel">
      <div className="recommendation-header">
        <div className="recommendation-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
      </div>

      <div className="recommendation-status-row">
        <span className="recommendation-status">{status}</span>
      </div>

      <div className="recommendation-actions">
        <button type="button" className="primary-action">{actionText}</button>
        <button type="button" className="secondary-action">{secondaryText}</button>
      </div>
    </div>
  );
}

export default RecommendationCard;
