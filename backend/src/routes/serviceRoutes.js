/**
 * IMPORT GUIDE: backend/src/routes/serviceRoutes.js
 * Definición de rutas para el catálogo de servicios.
 */

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/services -> Devuelve todos los servicios
router.get('/', serviceController.getAllServices);

module.exports = router;