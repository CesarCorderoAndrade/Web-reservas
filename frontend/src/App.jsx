/**
 * IMPORT GUIDE: frontend/src/App.jsx
 * Configuración de rutas con Login como página de inicio.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CustomerBookingView from './pages/CustomerBookingView.jsx';
import AdminDashboardView from './pages/AdminDashboardView.jsx';
import LoginView from './pages/LoginView.jsx';
import RegisterView from './pages/RegisterView.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ 
        fontFamily: 'Inter, system-ui, sans-serif', 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#0F172A', 
        minHeight: '100vh',
        color: '#F8FAFC' 
      }}>
        <Routes>
          {/* Ahora la raíz "/" muestra el Login directamente */}
          <Route path="/" element={<LoginView />} />
          
          {/* Ruta de registro */}
          <Route path="/register" element={<RegisterView />} />
          
          {/* Una vez logueado, el cliente iría aquí para reservar */}
          <Route path="/booking" element={<CustomerBookingView />} />
          
          {/* Panel de administración */}
          <Route path="/admin" element={<AdminDashboardView />} />

          {/* Si el usuario intenta entrar en una ruta que no existe, al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;