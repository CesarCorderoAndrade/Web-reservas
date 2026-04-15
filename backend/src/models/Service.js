/**
 * IMPORT GUIDE: backend/src/models/Service.js
 * Definición del modelo Service.
 * Representa el catálogo de servicios ofrecidos por el negocio.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Service', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Ej: Corte de cabello, Cambio de aceite'
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            comment: 'Duración en minutos para calcular la disponibilidad del calendario'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Permite ocultar servicios obsoletos sin borrar el historial'
        }
    }, {
        tableName: 'services',
        timestamps: true
    });
};