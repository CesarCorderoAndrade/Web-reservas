/**
 * IMPORT GUIDE: frontend/src/pages/CustomerDashboardView.jsx
 * Área personal del cliente.
 * VERSIÓN INFALIBLE: Utiliza la ruta general de citas para garantizar la recepción de datos
 * y filtra localmente para el usuario activo.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const CustomerDashboardView = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = localStorage.getItem('user_name') || sessionStorage.getItem('user_name') || '';
  const userEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email');

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    muted: '#94A3B8', accent: '#10B981', danger: '#F43F5E', border: '#334155'
  };

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }

    const fetchMyAppointments = async () => {
      try {
        setLoading(true);

        // Utilizamos la ruta general que sabemos con certeza que funciona en el panel de Admin
        const response = await apiClient.get('/appointments');
        const allAppointments = Array.isArray(response.data) ? response.data : [];

        // Filtramos la lista para conservar únicamente las citas del usuario actual
        const myAppointments = allAppointments.filter(app => app.clientName === userName);

        setAppointments(myAppointments);
      } catch (err) {
        console.error('[CustomerDashboard] Error de red:', err);
        setError('Error al cargar tus citas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAppointments();
  }, [userEmail, userName, navigate]);

  const handleCancelAppointment = async (id) => {
    const confirmCancel = window.confirm('¿Estás seguro de que deseas cancelar esta cita?');
    if (!confirmCancel) return;

    try {
      await apiClient.put(`/appointments/${id}/status`, { status: 'CANCELLED' });
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: 'CANCELLED' } : app));
      alert('Tu cita ha sido cancelada.');
    } catch (err) {
      alert('Hubo un error al intentar cancelar la cita.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return { label: 'Confirmada', color: '#60A5FA', bg: '#1E3A8A' };
      case 'COMPLETED': return { label: 'Completada', color: '#34D399', bg: '#064E3B' };
      case 'PENDING': return { label: 'Pendiente', color: '#FBBF24', bg: '#78350F' };
      case 'CANCELLED': return { label: 'Cancelada', color: '#F87171', bg: '#7F1D1D' };
      default: return { label: status, color: colors.muted, bg: '#334155' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: colors.accent, fontWeight: '600' }}>Cargando área personal...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, padding: '20px', fontFamily: 'Inter, sans-serif' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Mis Citas</h1>
          <p style={{ color: colors.muted, fontSize: '14px', margin: 0 }}>Hola, {userName}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/booking')} style={{ padding: '8px 14px', backgroundColor: colors.accent, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Nueva Reserva</button>
          <button onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate('/'); }} style={{ padding: '8px 14px', backgroundColor: 'transparent', color: colors.danger, border: `1px solid ${colors.danger}`, borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Salir</button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && (
          <div style={{ backgroundColor: '#7F1D1D', color: '#FECACA', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #DC2626', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: colors.card, borderRadius: '16px' }}>
              <p style={{ color: colors.muted, marginBottom: '16px' }}>Aún no tienes citas registradas.</p>
              <button onClick={() => navigate('/booking')} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Reservar ahora</button>
            </div>
          ) : (
            appointments.map(app => {
              const badge = getStatusBadge(app.status);
              const canCancel = app.status === 'CONFIRMED' || app.status === 'PENDING';

              return (
                <div key={app.id} style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{app.appointmentTime}</div>
                    <div style={{ fontSize: '14px', color: colors.muted }}>{app.serviceName}</div>
                    <span style={{ display: 'inline-block', marginTop: '8px', backgroundColor: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{badge.label}</span>
                  </div>
                  {canCancel && <button onClick={() => handleCancelAppointment(app.id)} style={{ padding: '8px 12px', backgroundColor: 'transparent', color: colors.danger, border: `1px solid ${colors.danger}`, borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboardView;