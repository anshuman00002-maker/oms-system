// src/pages/Settings.js
import React, { useState } from 'react';
import AuthService from '../AuthService';
import Toast from '../components/Toast';

export default function Settings() {
  const [toast, setToast] = useState('');
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Manage your preferences</p>
        </div>
      </div>
      
      <div className="card">
        <h3>Profile Information</h3>
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
      
      <div className="card">
        <h3>Change Password</h3>
        <div className="form-row">
          <label>Current Password</label>
          <input className="input" type="password" />
        </div>
        <div className="form-row">
          <label>New Password</label>
          <input className="input" type="password" />
        </div>
        <div className="form-row">
          <label>Confirm Password</label>
          <input className="input" type="password" />
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setToast('Feature coming soon!')}
        >
          Update Password
        </button>
      </div>
      
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
