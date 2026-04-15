/**
 * IMPORT GUIDE: frontend/src/main.jsx
 * Punto de entrada principal de la aplicación React.
 * Inicializa el Virtual DOM y monta la aplicación en el contenedor 'root'.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Montaje de la aplicación con StrictMode activado para 
// detectar problemas potenciales durante el desarrollo.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);