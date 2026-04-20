/**
 * IMPORT GUIDE: frontend/src/pages/AdminDashboardView.jsx
 * Panel de administración avanzado.
 * Incluye filtros dinámicos por nombre y fecha, además de acceso a servicios.
 * Senior Note: Se utiliza filtrado en cliente para una respuesta de interfaz inmediata.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const AdminDashboardView = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]); // Por defecto: Hoy

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    accent: '#10B981', border: '#334155', danger: '#F43F5E', muted: '#94A3B8'
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Lógica de filtrado: Se ejecuta cada vez que cambian las citas, el texto de búsqueda o la fecha

  useEffect(() => {
    let result = appointments;

    // 1. Filtrado por cliente
    if (searchTerm) {
      result = result.filter(app => 
        app.clientName && app.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtrado por fecha
    if (searchDate) {
      result = result.filter(app => {
        if (!app.appointmentTime) return false;

        // Caso A: Formato nativo ISO de PostgreSQL en producción (YYYY-MM-DD)
        if (app.appointmentTime.includes(searchDate)) {
            return true;
        }

        // Caso B: Formato convertido a cadena local (DD/MM/YYYY)
        const [y, m, d] = searchDate.split('-');
        const dateVariation1 = `${d}/${m}/${y}`;
        const dateVariation2 = `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
        
        return app.appointmentTime.includes(dateVariation1) || 
               app.appointmentTime.includes(dateVariation2);
      });
    }

    setFilteredAppointments(result);
  }, [searchTerm, searchDate, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/appointments');
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('[AdminDashboard] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToToday = () => {
    setSearchDate(new Date().toISOString().split('T')[0]);
    setSearchTerm('');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Panel Admin</h1>
          <p style={{ color: colors.muted, marginTop: '5px' }}>Visualizando {filteredAppointments.length} citas filtradas.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/admin/services')} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: colors.accent, border: `1px solid ${colors.accent}`, borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Servicios</button>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '10px 20px', backgroundColor: colors.danger, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Salir</button>
        </div>
      </header>

      {/* Barra de Herramientas de Filtro */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px', marginBottom: '30px', backgroundColor: colors.card, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}` }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '8px' }}>Buscar por cliente</label>
          <input 
            type="text" 
            placeholder="Ej: Cesar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '10px', color: 'white' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '8px' }}>Filtrar por fecha</label>
          <input 
            type="date" 
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{ width: '100%', padding: '12px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '10px', color: 'white', colorScheme: 'dark' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            onClick={resetToToday}
            style={{ padding: '12px 20px', backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Hoy
          </button>
        </div>
      </section>

      <main>
        {loading ? (
          <p style={{ textAlign: 'center', color: colors.accent }}>Cargando agenda...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAppointments.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', backgroundColor: colors.card, borderRadius: '20px', border: `1px dashed ${colors.border}` }}>
                <p style={{ color: colors.muted }}>No se han encontrado citas para estos criterios.</p>
              </div>
            ) : (
              filteredAppointments.map(app => (
                <div key={app.id} style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{app.clientName}</div>
                    <div style={{ color: colors.accent, fontSize: '14px', fontWeight: '600' }}>{app.serviceName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{app.appointmentTime}</div>
                    <div style={{ fontSize: '11px', color: colors.muted, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{app.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardView;