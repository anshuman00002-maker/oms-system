// src/pages/Users.js
import React, { useState } from 'react';
import Toast from '../components/Toast';

export default function Users() {
  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Manager User', email: 'manager@example.com', role: 'manager', status: 'active' },
    { id: 3, name: 'Viewer User', email: 'viewer@example.com', role: 'viewer', status: 'active' },
  ]);
  const [toast, setToast] = useState('');
  
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-subtitle">Manage system users and roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setToast('Feature coming soon!')}>
          + Add User
        </button>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td>
                    <span className="status-badge status-completed">{user.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-muted btn-sm" style={{ marginRight: '8px' }}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
