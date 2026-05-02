// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiShoppingBag,
  FiBox,
  FiList,
  FiUsers,
  FiSettings,
  FiBarChart2,
} from 'react-icons/fi';

export default function Sidebar() {
  const makeClass = ({ isActive }) =>
    'sidebar-link' + (isActive ? ' sidebar-link-active' : '');

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">IMS</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">Inventory Management</div>
            <div className="sidebar-brand-subtitle">E-commerce Connected</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Overview</div>
          <NavLink to="/dashboard" className={makeClass}>
            <FiHome className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>

          <div className="sidebar-section-label">Orders</div>
          {/* ☑ Yahan ab “Create Order” nahi – sirf Orders + Enquiry */}
          <NavLink to="/orders" className={makeClass}>
            <FiShoppingBag className="sidebar-icon" />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/orders/enquiry" className={makeClass}>
            <FiList className="sidebar-icon" />
            <span>Order Enquiry</span>
          </NavLink>

          <div className="sidebar-section-label">Inventory</div>
          <NavLink to="/products" className={makeClass}>
            <FiBox className="sidebar-icon" />
            <span>Products</span>
          </NavLink>

          <div className="sidebar-section-label">Analytics</div>
          <NavLink to="/reports" className={makeClass}>
            <FiBarChart2 className="sidebar-icon" />
            <span>Reports</span>
          </NavLink>

          <div className="sidebar-section-label">Admin</div>
          <NavLink to="/users" className={makeClass}>
            <FiUsers className="sidebar-icon" />
            <span>Users</span>
          </NavLink>

          <NavLink to="/settings" className={makeClass}>
            <FiSettings className="sidebar-icon" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
