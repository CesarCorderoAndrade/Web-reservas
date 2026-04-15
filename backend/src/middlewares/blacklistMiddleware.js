/**
 * IMPORT GUIDE: backend/src/middlewares/blacklistMiddleware.js
 * Interceptor de seguridad para proteger la agenda del negocio.
 * Valida si el cliente ha superado el límite de inasistencias permitidas.
 */

const { Client } = require('../models');

const checkBlacklist = async (req, res, next) => {
    // tenantId debe venir inyectado previamente por el middleware de multi-tenant
    const { clientId } = req.body;
    const tenantId = req.tenantId; 

    try {
        const client = await Client.findOne({
            where: { id: clientId, tenantId: tenantId }
        });

        const MAX_NO_SHOWS = 2;

        if (client && (client.noShowCount >= MAX_NO_SHOWS || client.isBlocked)) {
            return res.status(403).json({
                error: 'Reserva Bloqueada',
                message: 'Has superado el límite de inasistencias permitidas. Por favor, llama al local para gestionar tu reserva.'
            });
        }

        // Si el cliente es válido, permitimos que la petición continúe
        next();
    } catch (error) {
        console.error('[Blacklist Validation Error]:', error);
        res.status(500).json({ error: 'Error interno validando el estado del cliente.' });
    }
};

module.exports = { checkBlacklist };