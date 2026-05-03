import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import AuthService from '../AuthService';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const logged = AuthService.isAuthenticated();

  const doLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {logged && (
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <FiMenu />
            </button>
          )}
          <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 2px 4px rgba(255,86,0,0.3))' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--burning-flame)" strokeWidth="8" strokeDasharray="200 40" strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="60" fontFamily="Outfit, sans-serif" fontSize="34" fontWeight="bold" fill="var(--blue-fantastic)" textAnchor="middle">360</text>
            </svg>
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '20px', color: 'var(--truffle-trouble)', fontWeight: 'bold' }}>
              Order Management System
            </span>
          </Link>

          {logged && (
            <nav className="nav-links" aria-label="Main">
              
              
              <Link className="nav-link" to="/orders/enquiry">Order Enquiry</Link>
            </nav>
          )}
        </div>

        <div className="nav-links" style={{ gap: 8 }}>
          {logged ? (
            <div 
              style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }} 
              onClick={doLogout} 
              title="Click to logout"
              className="profile-avatar"
            >
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${AuthService.getUserName() || 'User'}&backgroundColor=0066FF`} 
                alt="Profile" 
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--palladian-blue)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
              />
            </div>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
