/**
 * REEMPLAZO COMPLETO: backend/src/controllers/appointmentController.js
 */
const { Appointment } = require('../models');

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        // Garantizamos que devolvemos un array, aunque sea []
        return res.status(200).json(Array.isArray(appointments) ? appointments : []);
    } catch (error) {
        console.error('Error:', error);
        // Si falla la DB, devolvemos array vacío para no romper el frontend
        return res.status(200).json([]);
    }
};

const createAppointment = async (req, res) => {
    try {
        const newApp = await Appointment.create(req.body);
        res.status(201).json(newApp);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear' });
    }
};

const updateStatus = async (req, res) => {
    try {
        await Appointment.update({ status: req.body.status }, { where: { id: req.params.id } });
        res.status(200).json({ message: 'Actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

module.exports = { getAllAppointments, createAppointment, updateStatus };