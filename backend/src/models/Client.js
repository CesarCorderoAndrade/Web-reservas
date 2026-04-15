/**
 * IMPORT GUIDE: backend/src/models/Client.js
 * Definición del modelo Client.
 * Gestiona la información de contacto y las estadísticas de fiabilidad del cliente.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Client', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: 'Identificador del negocio (Estética/Taller) al que pertenece el cliente'
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Principal vía de contacto y login secundario'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        noShowCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Contador de inasistencias sin aviso para activar bloqueo automático'
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Bandera manual/automática para impedir nuevas reservas'
        }
    }, {
        tableName: 'clients',
        timestamps: true,
        indexes: [
            // Índice compuesto para búsquedas rápidas por negocio y teléfono
            {
                unique: true,
                fields: ['tenantId', 'phone']
            }
        ]
    });
};