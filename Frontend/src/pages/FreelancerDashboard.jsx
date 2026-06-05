import React from 'react';
import { Lock, CheckCircle, Clock } from 'lucide-react';
import './Pages.css';

const FreelancerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, Praise!</h1>
        <p>Here's what's happening with your contracts today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card glass-panel">
          <div className="stat-title">Kora Virtual Balance (NGN)</div>
          <div className="stat-value">₦ 1,450,000</div>
          <div className="stat-meta text-success">+₦ 450,000 this week</div>
        </div>
        <div className="stat-card card glass-panel">
          <div className="stat-title">Escrow Locked (USD)</div>
          <div className="stat-value">$ 2,400</div>
          <div className="stat-meta text-warning">2 Active Contracts</div>
        </div>
        <div className="stat-card card glass-panel">
          <div className="stat-title">AI Success Rate</div>
          <div className="stat-value">98%</div>
          <div className="stat-meta text-success">Top 5% of talent</div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Active Contracts</h2>
          <button className="btn btn-outline">View All</button>
        </div>
        
        <div className="job-list">
          <div className="job-item card glass-panel">
            <div className="job-info">
              <h4>Full-stack MVP Development</h4>
              <p>Client: Global Tech LLC • Due in 3 days</p>
            </div>
            <div className="job-meta">
              <div className="job-amount">$1,200</div>
              <span className="badge badge-yellow"><Lock size={12} style={{marginRight: '4px'}}/> Escrow Locked</span>
            </div>
          </div>
          
          <div className="job-item card glass-panel">
            <div className="job-info">
              <h4>UI/UX Redesign for Fintech App</h4>
              <p>Client: FinT Africa • Milestone 2 in review</p>
            </div>
            <div className="job-meta">
              <div className="job-amount">$1,200</div>
              <span className="badge badge-blue"><Clock size={12} style={{marginRight: '4px'}}/> AI Verifying...</span>
            </div>
          </div>
          
          <div className="job-item card glass-panel" style={{ opacity: 0.7 }}>
            <div className="job-info">
              <h4>Smart Contract Audit</h4>
              <p>Client: Web3 DAOs • Completed</p>
            </div>
            <div className="job-meta">
              <div className="job-amount">$800</div>
              <span className="badge badge-green"><CheckCircle size={12} style={{marginRight: '4px'}}/> Payout Settled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
