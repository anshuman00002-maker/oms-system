// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderEnquiry from './pages/OrderEnquiry';
import Products from './pages/Products';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import AuthService from './AuthService';
import './styles/enhanced.css';

function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <div className="app-container">
      <Router>
        {isAuthenticated && <Sidebar />}

        <div className={`main-wrapper ${isAuthenticated ? 'with-sidebar' : ''}`}>
          <Header />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Default route */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" replace />
                  </PrivateRoute>
                }
              />

              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Orders (main listing + enquiry) */}
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrderEnquiry />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders/enquiry"
                element={
                  <PrivateRoute>
                    <OrderEnquiry />
                  </PrivateRoute>
                }
              />

              {/* Products */}
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['admin', 'manager']}>
                      <Products />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['admin', 'manager']}>
                      <Reports />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Users */}
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['admin']}>
                      <Users />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="page-container">
                    <div className="card">
                      <h2>404 - Page Not Found</h2>
                      <p>The page you're looking for doesn't exist.</p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
