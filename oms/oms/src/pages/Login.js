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
      setToast('Logged in');
      setTimeout(()=>nav('/create'), 600);
    }catch(err){
      console.error(err);
      setToast('Login failed — check credentials');
    }finally{ setBusy(false); }
  };

  return (
    <div className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h2 style={{marginBottom:12}}>Sign in</h2>
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
