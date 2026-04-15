/**
 * IMPORT GUIDE: backend/src/services/notificationService.js
 * Servicio centralizado para gestionar las comunicaciones del sistema.
 * Abstrae la lógica de envíos (Email, SMS, WhatsApp) para mantener los controladores limpios.
 */

/**
 * Notifica al dueño del negocio sobre eventos críticos (ej. cancelaciones).
 */
const notifyOwner = async (tenantId, message) => {
    try {
        // Senior Note: Aquí implementaríamos la llamada a Resend (Email) o Twilio (WhatsApp).
        // Por ahora, en fase de desarrollo, lo registramos en la consola.
        console.log(`[ALERTA PROPIETARIO | Tenant: ${tenantId}]: ${message}`);
        
        return true;
    } catch (error) {
        console.error('[Error Notification Service - Owner]:', error);
        return false;
    }
};

/**
 * Envía el token de cancelación segura al cliente.
 */
const sendCancellationLink = async (clientEmail, appointmentId, cancelToken) => {
    try {
        const baseUrl = process.env.FRONTEND_URL;
        const cancelUrl = `${baseUrl}/cancelar/${appointmentId}?token=${cancelToken}`;

        console.log(`[EMAIL ENVIADO A: ${clientEmail}]`);
        console.log(`Cuerpo: Para cancelar tu cita con un click, visita: ${cancelUrl}`);

        return true;
    } catch (error) {
        console.error('[Error Notification Service - Client]:', error);
        return false;
    }
};

module.exports = {
    notifyOwner,
    sendCancellationLink
};