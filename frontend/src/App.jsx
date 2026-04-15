/**
 * IMPORT GUIDE: frontend/src/App.jsx
 * Enrutador principal. Incluye el aviso de instalación PWA global.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import CustomerBookingView from './pages/CustomerBookingView.jsx';
import AdminDashboardView from './pages/AdminDashboardView.jsx';
import LoginView from './pages/LoginView.jsx';
import RegisterView from './pages/RegisterView.jsx';

// Importación del nuevo componente de instalación PWA
import InstallPrompt from './components/InstallPrompt.jsx';

const App = () => {
  return (
    <BrowserRouter>
      {/* Contenedor global Dark Mode */}
      <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Aviso de instalación PWA. Aparecerá automáticamente si es compatible */}
        <InstallPrompt />

        <Routes>
          {/* URL raíz "/" carga directamente el Login */}
          <Route path="/" element={<LoginView />} />
          
          {/* Ruta para que los nuevos clientes se registren */}
          <Route path="/register" element={<RegisterView />} />
          
          {/* Ruta del calendario (accesible tras el login) */}
          <Route path="/booking" element={<CustomerBookingView />} />
          
          {/* Panel de administración privado */}
          <Route path="/admin" element={<AdminDashboardView />} />

          {/* Cualquier otra ruta vuelve al Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;