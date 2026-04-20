/**
 * IMPORT GUIDE: frontend/src/api/client.js
 * Cliente Axios conectado explícitamente al backend local.
 */

import axios from 'axios';

const apiClient = axios.create({
  // Forzamos que todas las peticiones vayan al puerto 3000 donde vive Express
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;