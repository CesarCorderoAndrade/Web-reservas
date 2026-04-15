/**
 * IMPORT GUIDE: backend/src/server.js
 * Servidor de producción CCA-RESERVAS.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// --- API ---
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');

app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);
app.get('/api/appointments', appCtrl.getAllAppointments);

// --- FRONTEND (PWA) ---

// Usamos path.resolve para evitar errores de ruta en Linux/Render
const publicPath = path.resolve(__dirname, '..', 'public_web');

// Servimos los estáticos
app.use(express.static(publicPath));

// Ruta comodín: Si no es API, entrega la WEB
app.get('*', (req, res) => {
    const indexFile = path.join(publicPath, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            console.error('[SISTEMA] Error: No encuentro el index.html en:', indexFile);
            res.status(404).send('La web no se ha desplegado correctamente. Revisa que public_web existe en GitHub.');
        }
    });
});

const PORT = process.env.PORT || 10000; // Render prefiere el 10000
app.listen(PORT, async () => {
    console.log(`[Servidor] Online en puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('[DB] Neon.tech Conectado');
    } catch (e) { console.error('[DB] Error:', e); }
});