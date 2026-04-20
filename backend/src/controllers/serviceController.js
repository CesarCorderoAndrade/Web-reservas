/**
 * IMPORT GUIDE: backend/src/controllers/serviceController.js
 * Controlador para la gestión del catálogo de servicios.
 * Permite CRUD completo: Listar, Crear, Actualizar y eliminar (lógico).
 */
const { Service } = require('../models');

/**
 * Obtiene todos los servicios, incluyendo los inactivos (Para el administrador).
 */
const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(services);
    } catch (error) {
        console.error('[ServiceController] Error al obtener servicios:', error);
        res.status(500).json({ error: 'No se pudo recuperar la lista de servicios.' });
    }
};

/**
 * Crea un nuevo servicio en el sistema.
 */
const createService = async (req, res) => {
    try {
        // En un entorno multi-tenant real, el tenantId vendría del middleware
        const tenantId = '123e4567-e89b-12d3-a456-426614174000';
        
        const serviceData = { ...req.body, tenantId };
        const newService = await Service.create(serviceData);
        res.status(201).json(newService);
    } catch (error) {
        console.error('[ServiceController] Error al crear servicio:', error);
        res.status(400).json({ error: 'Datos de servicio inválidos.' });
    }
};

/**
 * Actualiza un servicio existente o cambia su estado de activación.
 */
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Service.update(req.body, { where: { id } });
        
        if (updated) {
            const updatedService = await Service.findByPk(id);
            return res.status(200).json(updatedService);
        }
        res.status(404).json({ error: 'Servicio no encontrado.' });
    } catch (error) {
        console.error('[ServiceController] Error al actualizar servicio:', error);
        res.status(500).json({ error: 'Error interno al actualizar.' });
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService
};