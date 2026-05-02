import React from 'react';

export default function Footer(){
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} OMS — Order Management System</div>
    </footer>
  );
}
