/**
 * IMPORT GUIDE: frontend/src/components/InstallPrompt.jsx
 * Componente que muestra un botón de instalación PWA si es compatible.
 */

import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Escuchamos el evento 'beforeinstallprompt' que lanza el navegador
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenimos que el navegador muestre su propio aviso automático
      e.preventDefault();
      // Guardamos el evento para usarlo después
      setDeferredPrompt(e);
      // Mostramos nuestro propio botón
      setIsVisible(true);
    });

    // Escuchamos si la app ya ha sido instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada con éxito');
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostramos el prompt de instalación del navegador
    deferredPrompt.prompt();

    // Esperamos a la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Limpiamos el prompt diferido
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Si no es instalable o ya está instalada, no renderizamos nada
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '400px',
      backgroundColor: '#1E293B', // Colores de tu Dark Mode
      padding: '16px',
      borderRadius: '16px',
      border: '1px solid #334155',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo192.png" alt="Logo App" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
        <div>
          <h4 style={{ color: '#F8FAFC', margin: 0, fontSize: '15px', fontWeight: '700' }}>Instala nuestra App</h4>
          <p style={{ color: '#94A3B8', margin: '2px 0 0 0', fontSize: '12px' }}>Reserva más rápido y fácil</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#94A3B8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
          Ahora no
        </button>
        <button 
          onClick={handleInstallClick}
          style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
          Instalar
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;