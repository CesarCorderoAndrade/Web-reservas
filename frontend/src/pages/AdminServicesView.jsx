/**
 * IMPORT GUIDE: frontend/src/pages/AdminServicesView.jsx
 * Interfaz de administración para gestionar el catálogo de servicios.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const AdminServicesView = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({ name: '', durationMinutes: 60, price: 0 });

  const colors = {
    bg: '#0F172A', card: '#1E293B', text: '#F8FAFC',
    muted: '#94A3B8', accent: '#10B981', danger: '#F43F5E', border: '#334155'
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/services');
      setServices(response.data);
    } catch (error) {
      alert('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/services', newService);
      setNewService({ name: '', durationMinutes: 60, price: 0 });
      fetchServices();
    } catch (error) {
      alert('Error al crear servicio');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await apiClient.put(`/services/${id}`, { isActive: !currentStatus });
      fetchServices();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.text, padding: '40px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ maxWidth: '800px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Servicios</h1>
          <p style={{ color: colors.muted }}>Configura los tratamientos y precios de tu centro.</p>
        </div>
        <button onClick={() => navigate('/admin')} style={{ padding: '10px 20px', backgroundColor: colors.card, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: '10px', cursor: 'pointer' }}>Volver al Panel</button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Formulario de creación */}
        <section style={{ backgroundColor: colors.card, padding: '24px', borderRadius: '16px', marginBottom: '32px', border: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Añadir Nuevo Servicio</h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '5px' }}>Nombre</label>
              <input type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required style={{ width: '100%', padding: '12px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '5px' }}>Duración (min)</label>
              <input type="number" value={newService.durationMinutes} onChange={e => setNewService({...newService, durationMinutes: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: colors.muted, marginBottom: '5px' }}>Precio (€)</label>
              <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', color: 'white' }} />
            </div>
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar</button>
          </form>
        </section>

        {/* Lista de servicios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {services.map(service => (
            <div key={service.id} style={{ backgroundColor: colors.card, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{service.name}</h3>
                <p style={{ margin: '5px 0 0 0', color: colors.muted, fontSize: '14px' }}>{service.durationMinutes} min — {service.price}€</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => toggleStatus(service.id, service.isActive)}
                  style={{ padding: '8px 16px', backgroundColor: service.isActive ? '#064E3B' : '#451A03', color: service.isActive ? colors.accent : '#FBBF24', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminServicesView;