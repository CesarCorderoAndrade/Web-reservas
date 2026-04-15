/**
 * IMPORT GUIDE: backend/src/models/index.js
 * Inicializador del ORM (Sequelize) y registro de asociaciones.
 * Centraliza la conexión y asegura la integridad referencial de los datos.
 */

const { Sequelize } = require('sequelize');

// Configuración de la conexión utilizando variables de entorno
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Requisito estándar para conexiones a Neon.tech
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Importación de las definiciones de modelo
const Client = require('./Client')(sequelize);
const Service = require('./Service')(sequelize);
const Appointment = require('./Appointment')(sequelize);
const User = require('./User')(sequelize);

/**
 * Definición de Asociaciones (Relaciones Entidad-Relación)
 */

// Un Cliente tiene muchas Citas
Client.hasMany(Appointment, { foreignKey: 'clientId' });
Appointment.belongsTo(Client, { foreignKey: 'clientId' });

// Un Servicio puede estar presente en muchas Citas
Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

// Un usuario puede ser un cliente
User.hasOne(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    Client,
    Service,
    Appointment,
    User
};