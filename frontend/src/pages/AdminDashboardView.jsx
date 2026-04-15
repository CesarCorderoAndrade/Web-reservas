/**
 * IMPORT GUIDE: frontend/src/pages/AdminDashboardView.jsx
 * Panel de Administración principal blindado contra errores de tipo.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const AdminDashboardView = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    muted: '#94A3B8', accent: '#10B981', danger: '#F43F5E', border: '#334155'
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/appointments');
        
        // Validacion estricta: Asegurar que la respuesta es un Array
        if (Array.isArray(response.data)) {
            setAppointments(response.data);
        } else {
            throw new Error('Formato de datos incorrecto desde el servidor');
        }
      } catch (err) {
        console.error('[AdminDashboard] Error:', err);
        setError('Sin conexión con la base de datos. Mostrando modo local.');
        setAppointments([
          { id: 'uuid-1', appointmentTime: '10:00', clientName: 'Ana Martínez', serviceName: 'Manicura Premium', status: 'CONFIRMADA' },
          { id: 'uuid-2', appointmentTime: '11:30', clientName: 'Pedro López', serviceName: 'Diseño de Cejas', status: 'COMPLETADA' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const previousAppointments = [...appointments];
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));

    try {
      await apiClient.put(`/appointments/${id}/status`, { status: newStatus });
    } catch (err) {
      setAppointments(previousAppointments);
      alert('Error de red. No se pudo actualizar.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMADA': return { color: '#60A5FA', bg: '#1E3A8A' };
      case 'COMPLETADA': return { color: '#34D399', bg: '#064E3B' };
      case 'PENDIENTE': return { color: '#FBBF24', bg: '#78350F' };
      case 'CANCELADA': return { color: '#F87171', bg: '#7F1D1D' };
      default: return { color: colors.muted, bg: '#334155' };
    }
  };

  // Variable segura para evitar el TypeError: filter is not a function
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const completedAppointments = safeAppointments.filter(a => a.status === 'COMPLETADA').length;
  const estimatedRevenue = completedAppointments * 35; 

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: colors.accent, fontWeight: '600' }}>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Dashboard</h1>
          <p style={{ color: colors.muted, fontSize: '14px', margin: 0 }}>Agenda en tiempo real</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '8px 14px', backgroundColor: colors.danger, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          Salir
        </button>
      </header>

      {error && (
        <div style={{ backgroundColor: '#7F1D1D', color: '#FECACA', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #DC2626' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: colors.card, padding: '16px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: '12px', color: colors.muted }}>Citas Totales</span>
          <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>{safeAppointments.length}</div>
        </div>
        <div style={{ backgroundColor: colors.card, padding: '16px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: '12px', color: colors.muted }}>Ingresos (Completadas)</span>
          <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: colors.accent }}>{estimatedRevenue}€</div>
        </div>
      </div>

      <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: colors.accent, letterSpacing: '0.1em', marginBottom: '16px', fontWeight: '700' }}>Registro de Citas</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {safeAppointments.length === 0 ? (
          <p style={{ color: colors.muted, textAlign: 'center', padding: '20px' }}>No hay citas registradas.</p>
        ) : (
          safeAppointments.map(app => {
            const style = getStatusStyle(app.status);
            return (
              <div key={app.id} style={{ backgroundColor: colors.card, padding: '16px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>{app.appointmentTime}</div>
                    <div style={{ fontSize: '15px', color: colors.text, marginTop: '2px' }}>{app.clientName || 'Cliente No Registrado'}</div>
                    <div style={{ fontSize: '13px', color: colors.muted }}>{app.serviceName || 'Servicio General'}</div>
                  </div>
                  <span style={{ backgroundColor: style.bg, color: style.color, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    {app.status}
                  </span>
                </div>
                <select 
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADA">Confirmar</option>
                  <option value="COMPLETADA">Finalizar</option>
                  <option value="CANCELADA">Cancelar</option>
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminDashboardView;