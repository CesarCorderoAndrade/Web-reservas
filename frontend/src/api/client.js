/**
 * IMPORT GUIDE: frontend/src/api/client.js
 * Cliente Axios conectado explícitamente al backend local.
 */

import axios from 'axios';

const apiURL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;