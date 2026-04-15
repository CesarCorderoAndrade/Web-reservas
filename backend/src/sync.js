/**
 * IMPORT GUIDE: backend/src/sync.js
 * Script de utilería para sincronizar los modelos de Sequelize con la base de datos.
 * ATENCIÓN: Usar con precaución en producción.
 */

require('dotenv').config();
const { sequelize } = require('./models');

const syncDatabase = async () => {
    try {
        console.log('Iniciando conexión con la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');

        // alter: true modifica las tablas existentes para que coincidan con los modelos
        // sin borrar los datos. force: true borraría todo.
        console.log('Sincronizando modelos...');
        await sequelize.sync({ alter: true });
        
        console.log('¡Base de datos sincronizada y lista para usar!');
        process.exit(0);
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
        process.exit(1);
    }
};

syncDatabase();