/**
 * eventManager.js
 * ✅ Gestionnaire d'événements canvas avec protection contre les boucles infinies
 */

/**
 * Créer un gestionnaire d'événements avec protection anti-boucle
 * @param {Function} handler - Fonction à exécuter lors de l'événement
 * @param {number} debounceMs - Délai de debounce en millisecondes
 * @returns {Function} Gestionnaire protégé
 */
export const createProtectedEventHandler = (handler, debounceMs = 50) => {
  let lastCallTime = 0;
  let pendingCall = null;
  
  return (e) => {
    const now = Date.now();
    
    // Ignorer les objets temporaires créés par le code
    if (e && e.target) {
      const isTemporaryObject = 
        e.target.measureLabel || 
        e.target.alignmentGuide || 
        e.target.isGridLine || 
        e.target.isConnectionIndicator || 
        e.target.isSnapIndicator ||
        e.target.isLigneMesure ||
        e.target.isMeasureLine ||
        e.target.isMeasureLabel;
      
      if (isTemporaryObject) return;
    }
    
    // Debounce pour éviter les appels trop fréquents
    if (now - lastCallTime < debounceMs) {
      // Annuler l'appel précédent et programmer un nouveau
      if (pendingCall) clearTimeout(pendingCall);
      
      pendingCall = setTimeout(() => {
        handler(e);
        lastCallTime = Date.now();
      }, debounceMs);
      
      return;
    }
    
    // Appel immédiat si assez de temps s'est écoulé
    handler(e);
    lastCallTime = now;
  };
};

/**
 * Créer un gestionnaire d'événements avec throttling
 * @param {Function} handler - Fonction à exécuter
 * @param {number} throttleMs - Intervalle minimum entre les appels
 * @returns {Function} Gestionnaire throttlé
 */
export const createThrottledEventHandler = (handler, throttleMs = 100) => {
  let lastCallTime = 0;
  
  return (e) => {
    const now = Date.now();
    
    // Ignorer les objets temporaires
    if (e && e.target) {
      const isTemporaryObject = 
        e.target.measureLabel || 
        e.target.alignmentGuide || 
        e.target.isGridLine || 
        e.target.isConnectionIndicator || 
        e.target.isSnapIndicator ||
        e.target.isLigneMesure ||
        e.target.isMeasureLine ||
        e.target.isMeasureLabel;
      
      if (isTemporaryObject) return;
    }
    
    // Throttle
    if (now - lastCallTime >= throttleMs) {
      handler(e);
      lastCallTime = now;
    }
  };
};

/**
 * Désactiver temporairement les événements canvas pendant une opération
 * @param {fabric.Canvas} canvas - Instance du canvas
 * @param {Function} operation - Fonction à exécuter sans déclencher d'événements
 */
export const runWithoutEvents = async (canvas, operation) => {
  if (!canvas) return;
  
  // Sauvegarder les listeners existants
  const eventTypes = ['object:added', 'object:removed', 'object:modified'];
  const savedListeners = {};
  
  // Désactiver temporairement les événements
  eventTypes.forEach(eventType => {
    savedListeners[eventType] = canvas.__eventListeners[eventType];
    canvas.__eventListeners[eventType] = [];
  });
  
  try {
    // Exécuter l'opération
    await operation();
  } finally {
    // Restaurer les listeners
    eventTypes.forEach(eventType => {
      canvas.__eventListeners[eventType] = savedListeners[eventType];
    });
  }
};

