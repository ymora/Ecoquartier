/**
 * Configuration de debug
 * Permet d'activer/désactiver les logs selon l'environnement
 */

// Flag de debug global
// eslint-disable-next-line no-undef
export const DEBUG = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
                    localStorage.getItem('debug') === 'true';

/**
 * Logger conditionnel
 */
export const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

/**
 * Logger pour les erreurs (toujours actif)
 */
export const debugError = (...args) => {
  console.error(...args);
};

/**
 * Logger pour les warnings (toujours actif)
 */
export const debugWarn = (...args) => {
  console.warn(...args);
};

/**
 * Logger pour les informations importantes (toujours actif)
 */
export const debugInfo = (...args) => {
  console.info(...args);
};
