// src/components/RoleRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../AuthService';

export default function RoleRoute({ allowedRoles = [], children }) {
  // agar koi roles pass hi nahi kiye, toh direct allow
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const role = AuthService.getUserRole();

  // role hi nahi mila (user info nahi) -> login pe bhej do
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // role allowed list me nahi hai
  if (!AuthService.hasRole(allowedRoles)) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Access denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // role allowed hai -> asli page dikhao
  return children;
}
