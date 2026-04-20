/**
 * IMPORT GUIDE: frontend/src/pages/CustomerBookingView.jsx
 * Vista de reservas de clientes.
 * Incluye navegación integrada hacia el área personal (Dashboard) y cierre de sesión.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const CustomerBookingView = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Recuperación de sesión desde almacenamiento persistente o temporal
  const userName = localStorage.getItem('user_name') || sessionStorage.getItem('user_name') || 'Cliente';
  const userEmail = localStorage.getItem('user_email') || sessionStorage.getItem('user_email'); 

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    accent: '#10B981', danger: '#F43F5E', border: '#334155'
  };

  useEffect(() => {
    // Protección de ruta: Redirección si no existe sesión activa
    if (!userEmail) {
      navigate('/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await apiClient.get('/services');
        if (Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (error) {
        console.error('[Network Error]: Error al cargar catálogo de servicios:', error);
      }
    };
    
    fetchServices();
  }, [userEmail, navigate]);

  const days = Array.from({ length: 28 }, (_, i) => ({
    num: i + 1,
    isFull: i === 5 || i === 12
  }));

  const hours = [
    { t: '09:00', free: true }, { t: '10:00', free: false },
    { t: '11:00', free: true }, { t: '12:00', free: true },
    { t: '16:00', free: false }, { t: '17:00', free: true }
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const formattedDay = String(selectedDay).padStart(2, '0');
      const appointmentDate = `2026-04-${formattedDay}`;

      const appointmentData = {
        serviceId: selectedService.id,
        date: appointmentDate,
        time: selectedTime,
        customerName: userName,
        customerEmail: userEmail,
        status: 'pending'
      };

      const response = await apiClient.post('/appointments', appointmentData);
      
      if (response.status === 201 || response.status === 200) {
        alert('¡Cita confirmada con éxito!');
        // Redirección automática al dashboard tras el éxito para que vea su nueva cita
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('[Network Error]: Fallo en la persistencia de la cita:', error);
      alert('Hubo un problema al procesar la reserva. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) return null; 

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: colors.card, padding: '10px', borderRadius: '12px' }}>
            <span style={{ color: colors.accent, fontWeight: '800' }}>CCA</span>
          </div>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>{userName}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Botón de acceso al Dashboard del cliente */}
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', backgroundColor: colors.card, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          >
            Mis Citas
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: 'transparent', color: colors.danger, border: `1px solid ${colors.danger}`, borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            Salir
          </button>
        </div>
      </header>

      <div style={{ textAlign: 'center', margin: '30px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Reserva tu Cita</h1>
      </div>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', color: colors.accent, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>1. Selecciona el día</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', backgroundColor: colors.card, padding: '15px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>
            {['L','M','X','J','V','S','D'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: colors.accent }}>{d}</div>)}
            {days.map(d => (
              <button
                key={d.num}
                onClick={() => !d.isFull && setSelectedDay(d.num)}
                style={{
                  aspectRatio: '1/1', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: d.isFull ? 'default' : 'pointer',
                  backgroundColor: selectedDay === d.num ? colors.accent : (d.isFull ? 'transparent' : colors.bg),
                  color: selectedDay === d.num ? 'white' : (d.isFull ? colors.danger : colors.text),
                  opacity: d.isFull ? 0.4 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {d.num}
              </button>
            ))}
          </div>
        </section>

        {selectedDay && (
          <section style={{ marginBottom: '32px', animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '14px', color: colors.accent, textTransform: 'uppercase', marginBottom: '16px' }}>2. Horas Disponibles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {hours.map(h => (
                <button
                  key={h.t}
                  onClick={() => h.free && setSelectedTime(h.t)}
                  style={{
                    padding: '14px 0', borderRadius: '12px', border: `1px solid ${h.free ? colors.accent : colors.danger}`,
                    backgroundColor: selectedTime === h.t ? (h.free ? colors.accent : colors.danger) : 'transparent',
                    color: selectedTime === h.t ? 'white' : (h.free ? colors.accent : colors.danger),
                    fontWeight: 'bold', cursor: h.free ? 'pointer' : 'not-allowed', opacity: h.free ? 1 : 0.5,
                    transition: 'all 0.2s'
                  }}
                >
                  {h.t}
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedTime && (
          <section style={{ animation: 'fadeIn 0.4s ease', paddingBottom: '40px' }}>
            <h2 style={{ fontSize: '14px', color: colors.accent, textTransform: 'uppercase', marginBottom: '16px' }}>3. Elige el servicio</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map(s => (
                <div 
                  key={s.id} onClick={() => setSelectedService(s)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', padding: '20px', borderRadius: '16px', backgroundColor: colors.card,
                    border: `2px solid ${selectedService?.id === s.id ? colors.accent : 'transparent'}`, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{s.name}</span>
                  <span style={{ color: colors.accent, fontWeight: '800' }}>Seleccionar</span>
                </div>
              ))}
            </div>
            
            {selectedService && (
              <button 
                onClick={handleConfirm}
                disabled={loading}
                style={{ 
                  width: '100%', marginTop: '20px', padding: '18px', backgroundColor: loading ? '#059669' : colors.accent, 
                  color: 'white', borderRadius: '15px', border: 'none', fontWeight: '800', fontSize: '17px', 
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Confirmando...' : 'Confirmar Cita'}
              </button>
            )}
          </section>
        )}
      </main>

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default CustomerBookingView;