import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../AuthService';
import Toast from '../components/Toast';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [busy,setBusy] = useState(false);
  const [toast,setToast] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try{
      await AuthService.login(email.trim(), password);
      setToast('Logged in successfully!');
      setTimeout(() => nav('/dashboard'), 600);
    } catch(err) {
      console.error(err);
      setToast('Login failed — check credentials');
    }finally{ setBusy(false); }
  };

  return (
    <div className="card slide-up" style={{ maxWidth: 420, margin: '60px auto' }}>
      
      {/* Product putting in a box Animation */}
      <div className="login-animation-wrapper">
        <svg viewBox="0 0 200 200" className="login-box-svg" xmlns="http://www.w3.org/2000/svg">
          {/* Back of the box */}
          <path d="M 60 110 L 140 110 L 140 160 L 60 160 Z" fill="#d2a679" />
          
          {/* The Product (Phone/Box) */}
          <g className="anim-product">
            <rect x="85" y="40" width="30" height="45" rx="4" fill="var(--blue-fantastic)" />
            <rect x="90" y="45" width="20" height="30" rx="2" fill="#fff" opacity="0.3" />
          </g>
          
          {/* Front of the box */}
          <path d="M 50 120 L 150 120 L 140 170 L 60 170 Z" fill="#e6b88a" />
          
          {/* Front shadow/fold */}
          <path d="M 50 120 L 150 120 L 145 130 L 55 130 Z" fill="#d2a679" />
          
          {/* Left Flap */}
          <path className="anim-flap-left" d="M 50 120 L 100 120 L 60 90 L 10 90 Z" fill="#c3986a" />
          
          {/* Right Flap */}
          <path className="anim-flap-right" d="M 150 120 L 100 120 L 140 90 L 190 90 Z" fill="#c3986a" />
        </svg>
      </div>

      <h2 style={{ marginBottom: 24, textAlign: 'center', fontSize: 28 }}>Welcome Back</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>

        <div style={{display:'flex',gap:10}}>
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Signing...' : 'Log in'}</button>
          <button type="button" className="btn btn-muted" onClick={()=>nav('/register')}>Create User</button>
        </div>
      </form>

      <Toast message={toast} onClose={()=>setToast('')} />
    </div>
  );
}
