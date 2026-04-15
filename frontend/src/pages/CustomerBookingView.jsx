/**
 * IMPORT GUIDE: frontend/src/pages/CustomerBookingView.jsx
 * Diseño Premium: Calendario visual en primer plano.
 * Flujo: Calendario -> Slots (Colores) -> Servicios.
 */
import React, { useState } from 'react';

const CustomerBookingView = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    accent: '#10B981', danger: '#F43F5E', border: '#334155'
  };

  // Generación simple de días para el calendario (Demo)
  const days = Array.from({ length: 28 }, (_, i) => ({
    num: i + 1,
    isFull: i === 5 || i === 12 // Simulamos días llenos
  }));

  const hours = [
    { t: '09:00', free: true }, { t: '10:00', free: false },
    { t: '11:00', free: true }, { t: '12:00', free: true },
    { t: '16:00', free: false }, { t: '17:00', free: true }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ textAlign: 'center', margin: '30px 0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Reserva tu Cita</h1>
      </header>

      {/* 1. CALENDARIO VISUAL */}
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
                opacity: d.isFull ? 0.4 : 1
              }}
            >
              {d.num}
            </button>
          ))}
        </div>
        
        {/* Selectores de Mes/Año (Debajo del calendario como pediste) */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <select style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: colors.card, color: 'white', border: `1px solid ${colors.border}` }}>
            <option>Abril 2026</option>
            <option>Mayo 2026</option>
          </select>
        </div>
      </section>

      {/* 2. SLOTS DE HORA (Solo tras elegir día) */}
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
                  fontWeight: 'bold', cursor: h.free ? 'pointer' : 'not-allowed', opacity: h.free ? 1 : 0.5
                }}
              >
                {h.t}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. SERVICIOS (Solo tras elegir hora) */}
      {selectedTime && (
        <section style={{ animation: 'fadeIn 0.4s ease', paddingBottom: '40px' }}>
          <h2 style={{ fontSize: '14px', color: colors.accent, textTransform: 'uppercase', marginBottom: '16px' }}>3. Elige el servicio</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{id:1, n:'Manicura', p:'35€'}, {id:2, n:'Cejas', p:'20€'}].map(s => (
              <div 
                key={s.id} onClick={() => setSelectedService(s)}
                style={{
                  display: 'flex', justifyContent: 'space-between', padding: '20px', borderRadius: '16px', backgroundColor: colors.card,
                  border: `2px solid ${selectedService?.id === s.id ? colors.accent : 'transparent'}`, cursor: 'pointer'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{s.n}</span>
                <span style={{ color: colors.accent, fontWeight: '800' }}>{s.p}</span>
              </div>
            ))}
          </div>
          {selectedService && (
            <button style={{ width: '100%', marginTop: '20px', padding: '18px', backgroundColor: colors.accent, color: 'white', borderRadius: '15px', border: 'none', fontWeight: '800', fontSize: '17px', cursor: 'pointer' }}>
              Confirmar Cita
            </button>
          )}
        </section>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default CustomerBookingView;