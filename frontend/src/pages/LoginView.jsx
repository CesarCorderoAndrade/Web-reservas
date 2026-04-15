/**
 * IMPORT GUIDE: frontend/src/pages/LoginView.jsx
 * Vista de autenticación con manejo explícito de errores y estados de carga.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`[Auth] Iniciando petición de login para: ${email}`);
      const response = await apiClient.post('/auth/login', { email, password });
      
      const user = response.data;
      console.log('[Auth] Login exitoso, payload:', user);

      // Persistencia de sesión basada en la preferencia del usuario
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('user_role', user.role);
      storage.setItem('user_name', user.fullName);
      storage.setItem('token', user.token); // Asumiendo que el backend devuelve un JWT

      // Enrutamiento condicional por rol
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/booking');
      }
    } catch (err) {
      console.error('[Auth] Error en la petición:', err);
      // Extraemos el mensaje de error del backend si existe, o mostramos uno genérico
      const errorMessage = err.response?.data?.error || err.message || 'Error desconocido';
      alert(`Fallo al iniciar sesión: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1E293B', padding: '40px', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        <h1 style={{ color: '#F8FAFC', fontSize: '26px', textAlign: 'center', marginBottom: '8px' }}>Bienvenido</h1>
        <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '32px' }}>Inicia sesión para continuar</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px', outline: 'none' }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              id="rem" 
              checked={remember} 
              onChange={(e) => setRemember(e.target.checked)} 
            />
            <label htmlFor="rem" style={{ color: '#94A3B8', fontSize: '14px', cursor: 'pointer' }}>Recordar mi cuenta</label>
          </div>

          <button 
            disabled={isLoading}
            style={{ 
              padding: '16px', 
              backgroundColor: isLoading ? '#059669' : '#10B981', 
              color: 'white', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: 'bold', 
              fontSize: '16px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' 
            }}
          >
            {isLoading ? 'Conectando...' : 'Entrar'}
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <span style={{ color: '#94A3B8' }}>¿Eres nuevo? </span>
          <Link to="/register" style={{ color: '#10B981', fontWeight: 'bold', textDecoration: 'none' }}>Crea tu cuenta</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginView;