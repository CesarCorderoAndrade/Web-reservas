/**
 * IMPORT GUIDE: frontend/src/pages/LoginView.jsx
 * Interfaz de acceso. Incluye persistencia de sesion opcional y enlace a registro.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Nota: Aqui se implementara la llamada Axios a /api/auth/login
    // Si rememberMe es true, el token JWT se guardara en localStorage, si no, en sessionStorage.
    
    if (email.toLowerCase().includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1E293B', padding: '40px', borderRadius: '24px', border: '1px solid #334155' }}>
        <h1 style={{ color: '#F8FAFC', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>Bienvenido</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>Accede para gestionar tus citas</p>
        
        <input 
          type="email" placeholder="Email" required 
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
        />
        <input 
          type="password" placeholder="Contraseña" required 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <input 
            type="checkbox" 
            id="remember" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          <label htmlFor="remember" style={{ color: '#94A3B8', fontSize: '14px', cursor: 'pointer' }}>Recordar usuario</label>
        </div>
        
        <button style={{ width: '100%', padding: '16px', backgroundColor: '#10B981', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginBottom: '20px' }}>
          Iniciar Sesión
        </button>

        <div style={{ textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <span style={{ color: '#94A3B8', fontSize: '14px' }}>¿No tienes cuenta? </span>
          <Link to="/register" style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginView;