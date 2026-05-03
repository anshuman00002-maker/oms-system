// src/pages/Settings.js
import React, { useState } from 'react';
import AuthService from '../AuthService';
import Toast from '../components/Toast';

export default function Settings() {
  const [toast, setToast] = useState('');
  
  return (
    <div className="page-container">
      <div className="page-header slide-up">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Manage your preferences and security</p>
        </div>
      </div>
      
      <div className="settings-grid">
        <div className="card slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="card-title">Profile Information</h3>
          <p className="card-desc">Your personal account details.</p>
          <div className="form-group-max">
            <div className="form-row">
              <label>Name</label>
              <input className="input" defaultValue={AuthService.getUserName()} readOnly />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input className="input" defaultValue={AuthService.getUserEmail()} readOnly />
            </div>
            <div className="form-row">
              <label>Role</label>
              <input className="input" defaultValue={AuthService.getUserRole()} readOnly />
            </div>
          </div>
        </div>
        
        <div className="card slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="card-title">Change Password</h3>
          <p className="card-desc">Ensure your account is using a long, random password to stay secure.</p>
          <div className="form-group-max">
            <div className="form-row">
              <label>Current Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div className="form-row">
              <label>New Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div className="form-row">
              <label>Confirm Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setToast('Password update is currently disabled in demo mode.')}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
      
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
