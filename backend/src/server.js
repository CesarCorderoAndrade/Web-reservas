/**
 * IMPORT GUIDE: backend/src/server.js
 * Configuración preparada para despliegue en Render.com
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controladores
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');
const servCtrl = require('./controllers/serviceController');

// Rutas API
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);
app.get('/api/services', servCtrl.getAllServices);
app.get('/api/appointments', appCtrl.getAllAppointments);
app.post('/api/appointments', appCtrl.createAppointment);
app.put('/api/appointments/:id/status', appCtrl.updateStatus);

// El puerto debe ser dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`[Server] Running on port ${PORT}`);
    try {
        // En producción, esto verifica la conexión con Neon.tech
        await sequelize.authenticate();
        console.log('[DB] Connected to Neon.tech');
    } catch (e) {
        console.error('[DB] Connection error:', e);
    }
});