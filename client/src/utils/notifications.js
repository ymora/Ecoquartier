/**
 * Utilitaires pour les notifications
 */

/**
 * Affiche une notification temporaire
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification ('success', 'warning', 'error', 'info')
 * @param {number} duration - Durée d'affichage en ms (défaut: 2000)
 */
export const showNotification = (message, type = 'info', duration = 2000) => {
  const notification = document.createElement('div');
  notification.textContent = message;
  
  // Styles de base
  const baseStyles = `
    position: fixed;
    top: 80px;
    right: 20px;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease;
  `;
  
  // Couleurs selon le type
  const typeColors = {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3'
  };
  
  notification.style.cssText = `${baseStyles} background: ${typeColors[type] || typeColors.info};`;
  
  // Ajouter l'animation CSS si elle n'existe pas
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Supprimer après la durée spécifiée
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, duration);
};

/**
 * Notifications prédéfinies
 */
export const notifications = {
  planLoaded: () => showNotification('🔄 Plan par défaut chargé', 'success'),
  planSaved: () => showNotification('💾 Plan sauvegardé', 'success'),
  planExported: () => showNotification('📤 Plan exporté', 'success'),
  error: (message) => showNotification(`❌ ${message}`, 'error'),
  warning: (message) => showNotification(`⚠️ ${message}`, 'warning'),
  info: (message) => showNotification(`ℹ️ ${message}`, 'info')
};
