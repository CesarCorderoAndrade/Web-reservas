/**
 * IMPORT GUIDE: frontend/src/pages/CustomerBookingView.jsx
 * Vista principal de reservas para clientes autenticados.
 * Maneja la carga dinámica de servicios, selección de fecha/hora y envío de la reserva.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const CustomerBookingView = () => {
  // Estado de la aplicación
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Recuperamos el nombre del usuario de la sesión para personalizar la UI
  const userName = localStorage.getItem('user_name') || 'Cliente';

  // Horarios de ejemplo. En producción, esto debería cruzarse con las citas existentes en la BD.
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'];

  // Carga inicial de datos
  useEffect(() => {
    fetchServices();
  }, []);

  /**
   * Obtiene el catálogo de servicios desde el backend.
   * Implementa validación de tipo para evitar crashes en el renderizado.
   */
  const fetchServices = async () => {
    try {
      const response = await apiClient.get('/services');
      
      // Validación estricta: garantizamos que el estado sea siempre un array iterativo
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        console.error('[Error de Datos] El endpoint no devolvió un array:', response.data);
        setServices([]);
      }
    } catch (error) {
      console.error('[Network Error] Fallo al cargar servicios:', error);
      setServices([]);
    }
  };

  /**
   * Invalida la sesión actual y devuelve al usuario a la pantalla de acceso.
   */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  /**
   * Procesa la confirmación de la cita hacia el backend.
   */
  const handleConfirmAppointment = async () => {
    // Validación de formulario
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor, completa todos los pasos (Servicio, Fecha y Hora) para confirmar tu reserva.');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customerName: userName,
        status: 'pending'
      };

      const response = await apiClient.post('/appointments', appointmentData);
      
      if (response.status === 201 || response.status === 200) {
        alert('Cita confirmada con éxito. Te esperamos.');
        // Limpiamos el formulario tras una reserva exitosa
        setSelectedService(null);
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('[Network Error] Fallo al crear la cita:', error);
      alert('Se produjo un error al registrar la cita. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', padding: '20px', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header de la aplicación con Logo y Controles de Usuario */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo CCA en formato SVG embebido */}
          <svg width="45" height="45" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="192" height="192" rx="32" fill="#1E293B"/>
            <circle cx="96" cy="96" r="70" stroke="#10B981" strokeWidth="4" opacity="0.3"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial" fontSize="40" fontWeight="bold" fill="#10B981">CCA</text>
          </svg>
          <span style={{ fontWeight: '600', fontSize: '18px', letterSpacing: '0.5px' }}>Hola, {userName}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenedor Principal del Formulario de Reserva */}
      <main style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700' }}>Reserva tu cita</h1>
        <p style={{ color: '#94A3B8', marginBottom: '32px', fontSize: '15px' }}>Selecciona el servicio y el momento ideal</p>

        {/* Sección 1: Selección de Servicio */}
        <div style={{ marginBottom: '28px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#10B981', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            1. ¿Qué necesitas hoy?
          </label>
          
          {services.length === 0 ? (
            <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '12px', textAlign: 'center', border: '1px dashed #334155' }}>
              <p style={{ color: '#94A3B8', margin: 0 }}>No hay servicios disponibles en este momento.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {services.map(service => (
                <button 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    border: selectedService?.id === service.id ? '2px solid #10B981' : '1px solid #334155',
                    backgroundColor: selectedService?.id === service.id ? 'rgba(16, 185, 129, 0.1)' : '#1E293B',
                    color: '#F8FAFC',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedService?.id === service.id ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  {service.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sección 2: Selección de Fecha */}
        <div style={{ marginBottom: '28px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#10B981', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            2. Selecciona la fecha
          </label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            // Restringimos para que no se puedan seleccionar días pasados
            min={new Date().toISOString().split('T')[0]}
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '12px', 
              border: '1px solid #334155', 
              backgroundColor: '#1E293B', 
              color: '#F8FAFC', 
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Sección 3: Selección de Hora */}
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#10B981', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            3. Selecciona la hora
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {timeSlots.map(time => (
              <button 
                key={time}
                onClick={() => setSelectedTime(time)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '10px',
                  border: selectedTime === time ? '2px solid #10B981' : '1px solid #334155',
                  backgroundColor: selectedTime === time ? 'rgba(16, 185, 129, 0.1)' : '#1E293B',
                  color: '#F8FAFC',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Acción Principal: Confirmar Reserva */}
        <button 
          onClick={handleConfirmAppointment}
          disabled={loading || services.length === 0}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: (loading || services.length === 0) ? '#059669' : '#10B981',
            color: 'white',
            borderRadius: '14px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            cursor: (loading || services.length === 0) ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? 'Procesando solicitud...' : 'Confirmar Reserva'}
        </button>
      </main>
    </div>
  );
};

export default CustomerBookingView;