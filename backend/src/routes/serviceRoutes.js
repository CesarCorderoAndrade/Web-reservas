/**
 * IMPORT GUIDE: backend/src/routes/serviceRoutes.js
 * Definición de rutas para el mantenimiento de servicios.
 */
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Ruta pública/cliente: Obtener servicios activos (puedes filtrar en el controlador si prefieres)
router.get('/', serviceController.getAllServices);

// Rutas administrativas: Crear y Editar
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);

module.exports = router;