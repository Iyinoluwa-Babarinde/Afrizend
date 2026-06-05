import React from 'react';
import { Bell, User } from 'lucide-react';
import './Components.css';

const Navbar = () => {
  return (
    <header className="navbar glass-panel">
      <div className="navbar-search">
        {/* Placeholder for search or breadcrumbs */}
      </div>
      <div className="navbar-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <span className="user-name">Demo User</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
