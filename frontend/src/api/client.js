import axios from 'axios';

// Cambia 'api-reservas' por el nombre que le hayas puesto en Render
const API_URL = import.meta.env.PROD 
  ? 'https://cca-reservas.onrender.com/api' 
  : '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;