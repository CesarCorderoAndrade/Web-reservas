/**
 * IMPORT GUIDE: backend/src/server.js
 * Servidor principal (Entry Point).
 * Inicialización de Express, enrutamiento de la API REST y configuración 
 * para servir archivos estáticos de la Single Page Application (React/Vite).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- IMPORTACIÓN DE CONTROLADORES ---
const authCtrl = require('./controllers/authController');
const appCtrl = require('./controllers/appointmentController');
const servCtrl = require('./controllers/serviceController');

// --- ENRUTAMIENTO DE LA API ---

// Autenticación
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/register', authCtrl.register);

// Servicios
app.get('/api/services', servCtrl.getAllServices);
app.use('/api/services', require('./routes/serviceRoutes'));

// Citas
app.get('/api/appointments', appCtrl.getAllAppointments);
app.post('/api/appointments', appCtrl.createAppointment);
app.put('/api/appointments/:id/status', appCtrl.updateStatus);

// --- INTEGRACIÓN CON EL FRONTEND (PRODUCCIÓN) ---

// Se calcula la ruta absoluta hacia el directorio 'dist' generado por Vite.
// __dirname apunta a backend/src. Se suben dos niveles para alcanzar la raíz del proyecto.
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// Middleware para servir los assets estáticos (JS, CSS, imágenes) del build.
app.use(express.static(frontendDistPath));

// Fallback del Enrutador (React Router): 
// Cualquier petición GET que no coincida con la API REST se redirige al index.html.
// Esto delega la gestión de las URLs (ej. /booking, /admin) al cliente.
app.get('*', (req, res) => {
    const indexFile = path.join(frontendDistPath, 'index.html');
    
    res.sendFile(indexFile, (err) => {
        if (err) {
            console.error('[Sistema] Error crítico: No se encuentra el bundle del frontend en la ruta esperada.', indexFile);
            res.status(500).send('Error interno del servidor: Archivos de interfaz no encontrados. Verifique el pipeline de construcción (Build).');
        }
    });
});

// --- INICIALIZACIÓN DEL SERVIDOR ---
const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`[Servidor] Proceso inicializado correctamente. Escuchando en puerto ${PORT}`);
    
    try {
        await sequelize.authenticate();
        console.log('[Base de Datos] Conexión establecida exitosamente con la instancia.');
    } catch (error) { 
        console.error('[Base de Datos] Fallo en la conexión inicial. Detalles del error:', error); 
    }
});