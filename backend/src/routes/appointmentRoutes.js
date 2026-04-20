/**
 * IMPORT GUIDE: backend/src/routes/appointmentRoutes.js
 * Definición central de las rutas RESTful para las citas.
 * Gestiona inyección de contexto (tenant) y protección de rutas.
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Nota: Si el middleware blacklist no existe en tu proyecto actual, 
// puedes comentar esta línea y quitarlo de la ruta POST.
const { checkBlacklist } = require('../middlewares/blacklistMiddleware');

const tenantInjector = (req, res, next) => {
    // Simulación de inyección multi-tenant
    req.tenantId = '123e4567-e89b-12d3-a456-426614174000'; 
    next();
};

router.use(tenantInjector);

// Obtener todas las citas (Panel Admin)
router.get('/', appointmentController.getAllAppointments);

// Obtener historial de citas de un cliente (Área Personal)
// Requiere ?email=correo@dominio.com en la petición
router.get('/my-appointments', appointmentController.getClientAppointments);

// Crear nueva cita
router.post('/', checkBlacklist, appointmentController.createAppointment);

// Actualizar estado de cita (Admin Dashboard / Cancelaciones internas)
router.put('/:id/status', appointmentController.updateStatus);

// Cancelación pública mediante token único
router.get('/:id/cancel/:cancelToken', appointmentController.cancelAppointment);

module.exports = router;