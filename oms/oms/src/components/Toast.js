// src/components/Toast.js
import React from 'react';

export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{flex:1}}>{message}</div>
        <button onClick={onClose} style={{border:'none',background:'transparent',cursor:'pointer'}}>✕</button>
      </div>
    </div>
  );

}
