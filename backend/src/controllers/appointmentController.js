/**
 * IMPORT GUIDE: backend/src/controllers/appointmentController.js
 * Controlador de citas (VERSIÓN A PRUEBA DE BALAS).
 * Implementa la "Técnica del Espejo" para garantizar que la lectura de citas
 * utiliza la misma lógica exacta que la creación, evitando fallos de JOIN.
 */
const { Appointment, Service, sequelize } = require('../models');
const crypto = require('crypto');

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await sequelize.query(`
            SELECT 
                a.id, 
                a."startTime", 
                a.status, 
                c."fullName" AS "clientName", 
                s.name AS "serviceName"
            FROM appointments a
            LEFT JOIN clients c ON a."clientId" = c.id
            LEFT JOIN services s ON a."serviceId" = s.id
            ORDER BY a."startTime" ASC
        `, { type: sequelize.QueryTypes.SELECT });

        const formattedAppointments = appointments.map(app => {
            const date = new Date(app.startTime);
            const timeString = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString('es-ES');
            
            return {
                id: app.id,
                appointmentTime: `${dateString} - ${timeString}`,
                clientName: app.clientName || 'Cliente No Registrado',
                serviceName: app.serviceName || 'Servicio Borrado',
                status: app.status
            };
        });

        return res.status(200).json(formattedAppointments);
    } catch (error) {
        console.error('[DB Error - getAllAppointments]:', error);
        return res.status(200).json([]);
    }
};

const createAppointment = async (req, res) => {
    try {
        const service = await Service.findByPk(req.body.serviceId);
        if (!service) return res.status(404).json({ error: 'El servicio seleccionado no existe.' });

        // Extraemos el correo y lo limpiamos de espacios para evitar fallos
        const emailToFind = (req.body.customerEmail || '').trim().toLowerCase();

        const clientRecord = await sequelize.query(
            'SELECT id FROM clients WHERE LOWER(TRIM(email)) = ? LIMIT 1',
            { replacements: [emailToFind], type: sequelize.QueryTypes.SELECT }
        );

        if (!clientRecord || clientRecord.length === 0) {
            return res.status(400).json({ error: 'No se encontró el perfil de cliente.' });
        }

        const clientId = clientRecord[0].id;
        const startTime = new Date(`${req.body.date}T${req.body.time}:00`);
        const durationMinutes = service.durationMinutes || 60;
        const endTime = new Date(startTime.getTime() + (durationMinutes * 60000));

        const dbPayload = {
            id: crypto.randomUUID(),
            tenantId: service.tenantId,
            clientId: clientId,
            serviceId: req.body.serviceId,
            startTime: startTime,
            endTime: endTime,
            status: 'CONFIRMED',
            internalNotes: req.body.internalNotes || null
        };

        const newApp = await Appointment.create(dbPayload);
        res.status(201).json(newApp);

    } catch (error) {
        console.error('\n[ERROR FATAL BD] Error al crear cita:', error.message);
        res.status(500).json({ error: 'Error interno al procesar la reserva.' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Appointment.update({ status }, { where: { id } });
        res.status(200).json({ message: 'Estado actualizado correctamente.' });
    } catch (error) {
        console.error('[DB Error - updateStatus]:', error);
        res.status(500).json({ error: 'Error al intentar actualizar la cita.' });
    }
};

const getClientAppointments = async (req, res) => {
    try {
        // 1. Extraemos el correo venga de donde venga y lo decodificamos por seguridad
        let rawEmail = req.query.email || req.params.email;
        if (!rawEmail) return res.status(200).json([]);
        
        const emailToFind = decodeURIComponent(rawEmail).trim().toLowerCase();

        // 2. Buscamos el ID exactamente igual que al crear la cita
        const clientRecord = await sequelize.query(
            'SELECT id FROM clients WHERE LOWER(TRIM(email)) = ? LIMIT 1',
            { replacements: [emailToFind], type: sequelize.QueryTypes.SELECT }
        );

        if (!clientRecord || clientRecord.length === 0) {
            return res.status(200).json([]); 
        }

        const clientId = clientRecord[0].id;

        // 3. Buscamos las citas directamente con ese ID
        const appointments = await sequelize.query(`
            SELECT 
                a.id, 
                a."startTime", 
                a.status, 
                s.name AS "serviceName"
            FROM appointments a
            LEFT JOIN services s ON a."serviceId" = s.id
            WHERE a."clientId" = ?
            ORDER BY a."startTime" DESC
        `, { replacements: [clientId], type: sequelize.QueryTypes.SELECT });

        // 4. Formateamos para el frontend
        const formattedAppointments = appointments.map(app => {
            const date = new Date(app.startTime);
            return {
                id: app.id,
                appointmentTime: `${date.toLocaleDateString('es-ES')} - ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
                serviceName: app.serviceName || 'Servicio General',
                status: app.status
            };
        });

        return res.status(200).json(formattedAppointments);

    } catch (error) {
        console.error('[DB Error - getClientAppointments]:', error);
        return res.status(500).json({ error: 'Error interno al obtener citas.' });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id, cancelToken } = req.params;
        const appointment = await Appointment.findOne({ where: { id, cancelToken } });
        
        if (!appointment) {
            return res.status(404).json({ error: 'Enlace inválido o expirado.' });
        }
        
        await appointment.update({ status: 'CANCELLED' });
        res.status(200).json({ message: 'Cita cancelada correctamente.' });
    } catch (error) {
        console.error('[DB Error - cancelAppointment]:', error);
        res.status(500).json({ error: 'Error al cancelar.' });
    }
};

module.exports = { 
    getAllAppointments, 
    createAppointment, 
    updateStatus, 
    getClientAppointments,
    cancelAppointment 
};