/**
 * IMPORT GUIDE: backend/src/controllers/serviceController.js
 * Controlador para la gestión del catálogo de servicios.
 * Recupera la información directamente de la base de datos PostgreSQL.
 */

const { Service } = require('../models');

/**
 * Obtiene todos los servicios activos del sistema.
 */
const getAllServices = async (req, res) => {
    try {
        // Buscamos todos los servicios que estén marcados como activos
        const services = await Service.findAll({
            where: { isActive: true },
            order: [['name', 'ASC']]
        });

        res.status(200).json(services);
    } catch (error) {
        console.error('[Service Controller Error]:', error);
        res.status(500).json({ 
            error: 'Error al recuperar el catálogo de servicios',
            message: error.message 
        });
    }
};

module.exports = {
    getAllServices
};