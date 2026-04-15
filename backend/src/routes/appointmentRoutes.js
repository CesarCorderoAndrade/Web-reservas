/**
 * IMPORT GUIDE: backend/src/routes/appointmentRoutes.js
 * Definición de las rutas RESTful para las citas.
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { checkBlacklist } = require('../middlewares/blacklistMiddleware');

// Middleware simulado para inyectar el tenantId en esta fase de desarrollo
const tenantInjector = (req, res, next) => {
    // En producción, esto se extrae del subdominio (ej: ana.tuapp.com)
    // Por ahora forzamos un UUID de prueba
    req.tenantId = '123e4567-e89b-12d3-a456-426614174000'; 
    next();
};

router.use(tenantInjector);

/**
 * POST /api/appointments
 * Endpoint protegido por la validación de la lista negra.
 */
router.post('/', checkBlacklist, appointmentController.createAppointment);

/**
 * GET /api/appointments/:id/cancel/:cancelToken
 * Endpoint público para la cancelación en un click.
 */
router.get('/:id/cancel/:cancelToken', appointmentController.cancelAppointment);

module.exports = router;