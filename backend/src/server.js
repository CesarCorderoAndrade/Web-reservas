/**
 * IMPORT GUIDE: backend/src/server.js
 * Servidor completo. Rutas POST restauradas para permitir reservas.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/services', require('./routes/serviceRoutes'));

// --- CONTROLADORES ---
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');
const servCtrl = require('./controllers/serviceController');

// --- RUTAS DE LA API ---
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);
app.get('/api/services', servCtrl.getAllServices);

// Rutas de Citas (¡Estas eran las que faltaban!)
app.get('/api/appointments', appCtrl.getAllAppointments);
app.post('/api/appointments', appCtrl.createAppointment);
app.put('/api/appointments/:id/status', appCtrl.updateStatus);

// --- SERVIR FRONTEND (PWA) ---
const publicPath = path.resolve(__dirname, '..', 'public_web');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    const indexFile = path.join(publicPath, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            console.error('[SISTEMA] Error: No encuentro el index.html en:', indexFile);
            res.status(404).send('Error 404: Web no disponible.');
        }
    });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`[Servidor] Online en puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('[DB] Neon.tech Conectado');
    } catch (e) { 
        console.error('[DB] Error:', e); 
    }
});