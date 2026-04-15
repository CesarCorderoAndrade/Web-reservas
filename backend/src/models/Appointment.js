/**
 * IMPORT GUIDE: backend/src/models/Appointment.js
 * Definición del modelo Appointment.
 * Gestiona el ciclo de vida de una reserva y los mecanismos de cancelación.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Appointment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'clients',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'services',
                key: 'id'
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Fecha y hora exacta del inicio de la cita'
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Calculado automáticamente (startTime + Service.durationMinutes)'
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW', 'COMPLETED'),
            defaultValue: 'CONFIRMED',
            allowNull: false
        },
        cancelToken: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            comment: 'Token único enviado al cliente para cancelación segura en 1-click sin login'
        },
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Anotaciones del profesional (ej: tipo de aceite, alergias)'
        }
    }, {
        tableName: 'appointments',
        timestamps: true,
        indexes: [
            // Optimización para consultas de disponibilidad por rango de fechas
            {
                fields: ['tenantId', 'startTime', 'endTime']
            }
        ]
    });
};