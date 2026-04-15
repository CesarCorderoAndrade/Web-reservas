/**
 * IMPORT GUIDE: backend/src/server.js
 * Configuración para servir el Frontend y el Backend desde la misma URL.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// --- RUTAS DE LA API ---
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');

app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);
app.get('/api/appointments', appCtrl.getAllAppointments);

// --- SERVIR FRONTEND (PWA) ---

// Apuntamos a la carpeta 'dist' que pegaste en el backend
app.use(express.static(path.join(__dirname, '../dist')));

// Cualquier ruta que no sea de la API, entrega el index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`[Servidor] Online en puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('[DB] Neon.tech Conectado');
    } catch (e) { console.error('[DB] Error:', e); }
});