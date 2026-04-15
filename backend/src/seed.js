/**
 * IMPORT GUIDE: backend/src/seed.js
 * Script de utilidad para poblar la base de datos con datos iniciales.
 * Ejecutar una sola vez para tener servicios que mostrar en la demo.
 */

require('dotenv').config();
const { Service } = require('./models');

const seedDatabase = async () => {
    try {
        const tenantId = '123e4567-e89b-12d3-a456-426614174000'; // ID de prueba

        console.log('Insertando servicios iniciales...');
        
        await Service.bulkCreate([
            {
                tenantId,
                name: 'Manicura Premium',
                durationMinutes: 45,
                price: 35.00,
                isActive: true
            },
            {
                tenantId,
                name: 'Diseño de Cejas',
                durationMinutes: 30,
                price: 20.00,
                isActive: true
            },
            {
                tenantId,
                name: 'Masaje Descontracturante',
                durationMinutes: 60,
                price: 65.00,
                isActive: true
            }
        ]);

        console.log('¡Servicios creados con éxito en Neon.tech!');
        process.exit(0);
    } catch (error) {
        console.error('Error al insertar datos:', error);
        process.exit(1);
    }
};

seedDatabase();