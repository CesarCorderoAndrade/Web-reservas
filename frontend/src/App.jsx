/**
 * IMPORT GUIDE: frontend/src/App.jsx
 * Enrutador central de la aplicación.
 * Administra el estado global del tema y la navegación entre áreas de cliente y administración.
 * Senior Note: Se mantiene el contenedor de estilo global para garantizar la consistencia visual del Dark Mode.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Vistas de acceso y registro
import LoginView from './pages/LoginView.jsx';
import RegisterView from './pages/RegisterView.jsx';

// Vistas del área de cliente
import CustomerBookingView from './pages/CustomerBookingView.jsx';
import CustomerDashboardView from './pages/CustomerDashboardView.jsx';

// Vistas del área de administración
import AdminDashboardView from './pages/AdminDashboardView.jsx';
import AdminServicesView from './pages/AdminServicesView.jsx';

// Componentes globales
import InstallPrompt from './components/InstallPrompt.jsx';

const App = () => {
  // Configuración de estilo base para evitar saltos de color durante la carga de rutas
  const globalContainerStyle = {
    backgroundColor: '#0F172A',
    minHeight: '100vh',
    color: '#F8FAFC',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <BrowserRouter>
      <div style={globalContainerStyle}>
        
        {/* Lógica de instalación PWA: Se ejecuta de forma independiente al enrutado */}
        <InstallPrompt />

        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LoginView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          
          {/* Rutas de Cliente: Gestión de reservas y área personal */}
          <Route path="/booking" element={<CustomerBookingView />} />
          <Route path="/dashboard" element={<CustomerDashboardView />} />
          
          {/* Rutas de Administración: Panel de control y configuración de servicios */}
          <Route path="/admin" element={<AdminDashboardView />} />
          <Route path="/admin/services" element={<AdminServicesView />} />

          {/* Fallback de seguridad: Redirección automática al inicio ante rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;