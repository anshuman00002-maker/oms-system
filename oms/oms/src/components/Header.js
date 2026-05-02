import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../AuthService';

export default function Header() {
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
          <Link to="/" className="brand">Order Management</Link>

          {logged && (
            <nav className="nav-links" aria-label="Main">
              
              
              <Link className="nav-link" to="/orders/enquiry">Order Enquiry</Link>
            </nav>
          )}
        </div>

        <div className="nav-links" style={{ gap: 8 }}>
          {logged ? (
            <>
              <span className="pill">Signed in</span>
              <button onClick={doLogout} className="btn btn-muted">Logout</button>
            </>
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
