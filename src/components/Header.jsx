function Header({ onRefresh, page, onPageChange }) {
  const navItems = [
    'Dashboard',
    'Farm Management',
    'Irrigation Advisory',
    'Weather & Soil',
    'About',
  ];

  return (
    <header className="app-header">
      <div>
        <h1>Smart Irrigation Recommendation System</h1>
        <p className="subtitle">AI-Assisted Agriculture Decision Support</p>
      </div>

      <div className="header-status">
        <span className="status-badge">● Monitoring Active</span>
        <button type="button" className="btn-refresh" onClick={onRefresh}>
          Refresh Data
        </button>
      </div>

      <nav className="nav-bar" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={page === item ? 'nav-button active' : 'nav-button'}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
