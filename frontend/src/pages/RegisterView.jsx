/**
 * IMPORT GUIDE: frontend/src/pages/RegisterView.jsx
 * Formulario de registro completo para nuevos clientes.
 * Se añade el campo 'phone' para cumplir con las restricciones de la base de datos.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

const RegisterView = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    phone: '' // Campo requerido por la tabla 'clients'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Petición al endpoint de registro enviando el objeto con el nuevo campo phone
      await apiClient.post('/auth/register', formData);
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error('[Register Error]:', err);
      setError(err.response?.data?.error || 'Error al conectar con el servidor. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1E293B', padding: '40px', borderRadius: '24px', border: '1px solid #334155' }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#F8FAFC', fontSize: '24px', margin: '0 0 8px 0' }}>Crea tu cuenta</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Regístrate para gestionar tus reservas</p>
        </header>

        {error && (
          <div style={{ backgroundColor: '#7F1D1D', color: '#FECACA', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #DC2626' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" placeholder="Nombre completo" required 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
          />
          <input 
            type="email" placeholder="Email" required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
          />
          {/* Nuevo campo de teléfono añadido para evitar errores de null en la BD */}
          <input 
            type="tel" placeholder="Teléfono" required 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box', padding: '16px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
          />
          <input 
            type="password" placeholder="Contraseña" required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box', padding: '16px', marginBottom: '8px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0F172A', color: 'white', fontSize: '16px' }}
          />
          
          <button 
            disabled={loading}
            style={{ width: '100%', padding: '16px', backgroundColor: '#10B981', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <span style={{ color: '#94A3B8', fontSize: '14px' }}>¿Ya tienes una cuenta? </span>
          <Link to="/login" style={{ color: '#10B981', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterView;