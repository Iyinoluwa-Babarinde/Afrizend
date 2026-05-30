import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Wallet, ShieldCheck, Settings } from 'lucide-react';
import './Components.css';

const Sidebar = () => {
  const location = useLocation();
  const isFreelancer = location.pathname.includes('/freelancer');

  const links = isFreelancer
    ? [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/freelancer' },
        { name: 'My Jobs', icon: <Briefcase size={20} />, path: '/dashboard/freelancer/jobs' },
        { name: 'Wallet & Payouts', icon: <Wallet size={20} />, path: '/dashboard/freelancer/wallet' },
      ]
    : [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard/client' },
        { name: 'Post a Job', icon: <Briefcase size={20} />, path: '/dashboard/client/post' },
        { name: 'Vetted Talent', icon: <ShieldCheck size={20} />, path: '/dashboard/client/talent' },
      ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <h2>Afri<span className="text-gradient-blue">zend</span></h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
