/**
 * Configuration de debug professionnelle
 * Permet d'activer/désactiver les logs selon l'environnement
 */

// Flag de debug global (seulement en développement)
export const DEBUG = import.meta.env.DEV || localStorage.getItem('debug') === 'true';

/**
 * Logger conditionnel (seulement en dev)
 */
export const debugLog = (...args) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Logger pour les erreurs (toujours actif, envoyé au monitoring en prod)
 */
export const debugError = (...args) => {
  // eslint-disable-next-line no-console
  console.error('[ERROR]', ...args);
  
  // TODO: Envoyer à Sentry/LogRocket en production
  if (!DEBUG && typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(args[0]);
  }
};

/**
 * Logger pour les warnings (toujours actif)
 */
export const debugWarn = (...args) => {
  // eslint-disable-next-line no-console
  console.warn('[WARN]', ...args);
};

/**
 * Logger pour les informations importantes (toujours actif)
 */
export const debugInfo = (...args) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.info('[INFO]', ...args);
  }
};

/**
 * Logger de performance (seulement en dev)
 */
export const debugPerf = (label, fn) => {
  if (!DEBUG) return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  // eslint-disable-next-line no-console
  console.log(`[PERF] ${label}: ${(end - start).toFixed(2)}ms`);
  
  return result;
};

// Export d'un logger central
export default {
  log: debugLog,
  error: debugError,
  warn: debugWarn,
  info: debugInfo,
  perf: debugPerf,
  DEBUG
};
