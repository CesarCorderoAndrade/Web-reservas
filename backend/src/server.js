/**
 * IMPORT GUIDE: backend/src/server.js
 * Servidor de producción CCA-RESERVAS.
 * Integra las rutas de autenticación, citas, servicios y sirve la aplicación web estática.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONTROLADORES ---
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');
const servCtrl = require('./controllers/serviceController');

// --- RUTAS DE LA API ---
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);
app.get('/api/appointments', appCtrl.getAllAppointments);
app.get('/api/services', servCtrl.getAllServices);

// --- SERVIR FRONTEND (PWA) ---

// Definimos la ruta absoluta hacia la carpeta del frontend compilado
const publicPath = path.resolve(__dirname, '..', 'public_web');

// Servir archivos estáticos (JS, CSS, Imágenes)
app.use(express.static(publicPath));

// Enrutador tipo SPA: Cualquier ruta no reconocida por la API devuelve el index.html
app.get('*', (req, res) => {
    const indexFile = path.join(publicPath, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            console.error('[SISTEMA] Error: No encuentro el index.html en:', indexFile);
            res.status(404).send('Error 404: La interfaz web no se encuentra disponible.');
        }
    });
});

// --- INICIALIZACIÓN DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`[Servidor] Online en puerto ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('[DB] Neon.tech Conectado');
    } catch (e) { 
        console.error('[DB] Error en la conexión:', e); 
    }
});