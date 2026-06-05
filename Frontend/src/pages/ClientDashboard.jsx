import React from 'react';
import { PlusCircle, Search, Star } from 'lucide-react';
import './Pages.css';

const ClientDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Global Tech LLC Dashboard</h1>
          <p>Manage your African talent pipeline and milestones.</p>
        </div>
        <button className="btn btn-primary">
          <PlusCircle size={18} />
          Post New Job
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card card glass-panel">
          <div className="stat-title">Active Contracts</div>
          <div className="stat-value">4</div>
          <div className="stat-meta">$4,800 currently in escrow</div>
        </div>
        <div className="stat-card card glass-panel">
          <div className="stat-title">Milestones Awaiting Approval</div>
          <div className="stat-value">1</div>
          <div className="stat-meta text-warning">Action required</div>
        </div>
        <div className="stat-card card glass-panel">
          <div className="stat-title">Total Talent Hired</div>
          <div className="stat-value">12</div>
          <div className="stat-meta text-success">From 3 African countries</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Milestones Needing Attention</h2>
        </div>
        
        <div className="job-list">
          <div className="job-item card glass-panel" style={{ borderLeft: '4px solid var(--warning-color)' }}>
            <div className="job-info">
              <h4>UI/UX Redesign for Fintech App - Milestone 2</h4>
              <p>Freelancer: Praise (Nigeria) • Submitted 2 hours ago</p>
            </div>
            <div className="job-meta" style={{ alignItems: 'flex-end', gap: '8px' }}>
              <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>AI Confidence: 94%</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>View AI Report</button>
                <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Approve & Pay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Discover Vetted Talent</h2>
          <button className="icon-button"><Search size={20} /></button>
        </div>
        
        <div className="job-list">
          <div className="job-item card glass-panel">
            <div className="job-info">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Iyinoluwa <span className="badge badge-blue">Verified</span>
              </h4>
              <p>Senior Full-stack Engineer • Lagos, Nigeria</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-secondary)' }}>React</span>
                <span className="badge" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-secondary)' }}>Node.js</span>
                <span className="badge" style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-secondary)' }}>PostgreSQL</span>
              </div>
            </div>
            <div className="job-meta">
              <div className="job-amount" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="var(--warning-color)" color="var(--warning-color)" /> 5.0
              </div>
              <button className="btn btn-outline" style={{ marginTop: '8px', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Invite to Job</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
