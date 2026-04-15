/**
 * IMPORT GUIDE: frontend/src/pages/RegisterView.jsx
 * Formulario de registro público para nuevos clientes.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const RegisterView = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Peticion al backend para crear el usuario en Neon.tech
      // await apiClient.post('/auth/register', formData);
      
      // Simulacion de exito temporal: redirigir a login
      alert('Cuenta creada con éxito. Por favor, inicia sesión.');
      navigate('/login');
    } catch (err) {
      console.error('[Register] Error:', err);
      setError('Ocurrió un error al crear la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1E293B', padding: '40px', borderRadius: '24px', border: '1px solid #334155' }}>
        <h1 style={{ color: '#F8FAFC', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>Crear Cuenta</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>Regístrate para reservar tu cita</p>
        
        {error && (
          <div style={{ backgroundColor: '#7F1D1D', color: '#FECACA', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <input 
          type="text" placeholder="Nombre completo" required 
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
        />
        <input 
          type="email" placeholder="Email" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
        />
        <input 
          type="password" placeholder="Contraseña" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '32px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
        />
        
        <button style={{ width: '100%', padding: '16px', backgroundColor: '#10B981', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginBottom: '20px' }}>
          Registrarse
        </button>

        <div style={{ textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <span style={{ color: '#94A3B8', fontSize: '14px' }}>¿Ya tienes cuenta? </span>
          <Link to="/login" style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Entra aquí
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterView;