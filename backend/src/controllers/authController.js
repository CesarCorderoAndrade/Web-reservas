/**
 * IMPORT GUIDE: backend/src/controllers/authController.js
 * Lógica de autenticación completa: Login y Registro.
 * Incluye persistencia automática en la tabla 'clients' vinculada al 'users'.
 */

const { User, sequelize } = require('../models');
const crypto = require('crypto');

/**
 * Registra un nuevo usuario y su perfil de cliente asociado.
 * Utiliza una transacción para garantizar la integridad de los datos.
 */
const register = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, password, fullName, phone } = req.body;
        const tenantId = '123e4567-e89b-12d3-a456-426614174000'; // Tenant ID por defecto

        // 1. Verificamos duplicados
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
        }

        // 2. Creamos el nuevo usuario
        const newUser = await User.create({
            id: crypto.randomUUID(),
            email,
            password, // Senior Note: Implementar hashing con bcrypt en fase final
            fullName,
            role: 'client'
        }, { transaction });

        // 3. Creamos el registro en la tabla 'clients' con el teléfono recibido
        // Se utiliza SQL directo para asegurar que coincida con las columnas: fullName, phone, userId
        await sequelize.query(
            `INSERT INTO clients (id, "tenantId", "fullName", phone, email, "userId", "createdAt", "updatedAt") 
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            { 
                replacements: [uuidv4(), tenantId, fullName, phone, email, newUser.id],
                transaction 
            }
        );

        await transaction.commit();
        res.status(201).json({ 
            message: 'Usuario registrado correctamente', 
            userId: newUser.id 
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('[Auth Controller - Register]:', error);
        res.status(500).json({ error: 'Error interno al procesar el registro.' });
    }
};

/**
 * Valida las credenciales de un usuario.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Devolvemos el email también para que el frontend lo guarde en localStorage
        res.status(200).json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        });
    } catch (error) {
        console.error('[Auth Controller - Login]:', error);
        res.status(500).json({ error: 'Error interno en el inicio de sesión.' });
    }
};

module.exports = { login, register };
