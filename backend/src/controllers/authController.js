/**
 * IMPORT GUIDE: backend/src/controllers/authController.js
 * Lógica de autenticación completa: Login y Registro.
 */

const { User } = require('../models');

/**
 * Registra un nuevo usuario en la base de datos.
 */
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Verificamos si el usuario ya existe para evitar duplicados
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });
        }

        // Creamos el nuevo usuario con rol de cliente por defecto
        const newUser = await User.create({
            email,
            password, // Senior Note: En producción usar bcrypt para encriptar
            fullName,
            role: 'client'
        });

        res.status(201).json({ 
            message: 'Usuario registrado correctamente', 
            userId: newUser.id 
        });
    } catch (error) {
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

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            role: user.role
        });
    } catch (error) {
        console.error('[Auth Controller - Login]:', error);
        res.status(500).json({ error: 'Error interno en el inicio de sesión.' });
    }
};

module.exports = { login, register };