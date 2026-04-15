/**
 * IMPORT GUIDE: frontend/src/pages/CustomerBookingView.jsx
 * Vista de reservas para el cliente. 
 * Incluye gestión de estado de cita, logo corporativo y cierre de sesión.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const CustomerBookingView = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Cliente';

  // Horas disponibles simuladas (esto debería venir del backend en una fase avanzada)
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleLogout = () => {
    // Senior Note: Limpiamos storage y redirigimos al login
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleConfirmAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor, completa todos los campos para confirmar.');
      return;
    }

    setLoading(true);
    try {
      // Preparamos el payload con los datos de la reserva
      const appointmentData = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customerName: userName,
        status: 'pending'
      };

      const response = await apiClient.post('/appointments', appointmentData);
      
      if (response.status === 201 || response.status === 200) {
        alert('¡Cita confirmada con éxito! Te esperamos.');
        // Resetear selección
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      alert('Hubo un error al procesar tu cita. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', padding: '20px', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER: Logo y Botón Salir */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo CCA SVG */}
          <svg width="40" height="40" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" rx="32" fill="#1E293B"/>
            <circle cx="96" cy="96" r="70" stroke="#10B981" strokeWidth="4" opacity="0.3"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial" fontSize="40" fontWeight="bold" fill="#10B981">CCA</text>
          </svg>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Hola, {userName}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          Cerrar Sesión
        </button>
      </header>

      <main style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Reserva tu cita</h1>
        <p style={{ color: '#94A3B8', marginBottom: '30px' }}>Elige el momento perfecto para tu tratamiento</p>

        {/* PASO 1: Servicio */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#10B981', fontWeight: 'bold' }}>1. Selecciona el servicio</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {services.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedService(s)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: selectedService?.id === s.id ? '2px solid #10B981' : '1px solid #334155',
                  backgroundColor: selectedService?.id === s.id ? '#1E293B' : '#0F172A',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* PASO 2: Fecha */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#10B981', fontWeight: 'bold' }}>2. Elige el día</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1E293B', color: 'white', fontSize: '16px' }}
          />
        </div>

        {/* PASO 3: Hora */}
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#10B981', fontWeight: 'bold' }}>3. Selecciona la hora</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {timeSlots.map(t => (
              <button 
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: selectedTime === t ? '2px solid #10B981' : '1px solid #334155',
                  backgroundColor: selectedTime === t ? '#1E293B' : '#0F172A',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* BOTÓN FINAL */}
        <button 
          onClick={handleConfirmAppointment}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#10B981',
            color: 'white',
            borderRadius: '15px',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
          }}
        >
          {loading ? 'Procesando...' : 'Confirmar Cita'}
        </button>
      </main>
    </div>
  );
};

export default CustomerBookingView;