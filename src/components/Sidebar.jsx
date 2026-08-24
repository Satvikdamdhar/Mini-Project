function Sidebar({ items, selectedPage, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand-box">IN</div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={selectedPage === item.label ? 'nav-item active' : 'nav-item'}
            onClick={() => onSelect(item.label)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
