/**
 * IMPORT GUIDE: frontend/src/api/client.js
 * Cliente Axios configurado con rutas relativas para arquitecturas unificadas.
 */

import axios from 'axios';

const apiClient = axios.create({
  // Al estar en el mismo dominio, la ruta relativa es la opción más segura y robusta.
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;