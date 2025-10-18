/**
 * Système de logging centralisé pour le planificateur
 * Facilite le debug, l'analyse et la correction d'erreurs
 */

// ========== CONFIGURATION ==========
const IS_PRODUCTION = import.meta.env.PROD;

const LOG_CONFIG = {
  enabled: !IS_PRODUCTION,          // Désactivé en production
  level: IS_PRODUCTION ? 'error' : 'debug', // Seulement erreurs en prod
  showTimestamp: true,              // Afficher timestamp
  showComponent: true,              // Afficher nom composant
  maxHistorySize: IS_PRODUCTION ? 50 : 100, // Moins de logs en prod
  saveToLocalStorage: !IS_PRODUCTION, // Pas de sauvegarde en prod
  localStorageKey: 'planificateur_logs'
};

// Niveaux de log avec priorités
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Historique des logs en mémoire
let logHistory = [];

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Obtient le timestamp formaté
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 3
  });
};

/**
 * Vérifie si le niveau de log doit être affiché
 */
const shouldLog = (level) => {
  if (!LOG_CONFIG.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_CONFIG.level];
};

/**
 * Formate le message de log
 */
const formatMessage = (level, component, message, data) => {
  let formatted = '';
  
  if (LOG_CONFIG.showTimestamp) {
    formatted += `[${getTimestamp()}] `;
  }
  
  formatted += `[${level.toUpperCase()}]`;
  
  if (LOG_CONFIG.showComponent && component) {
    formatted += ` [${component}]`;
  }
  
  formatted += ` ${message}`;
  
  return { formatted, data };
};

/**
 * Ajoute à l'historique
 */
const addToHistory = (level, component, message, data) => {
  const entry = {
    timestamp: Date.now(),
    timestampFormatted: getTimestamp(),
    level,
    component,
    message,
    data
  };
  
  logHistory.push(entry);
  
  // Limiter la taille de l'historique
  if (logHistory.length > LOG_CONFIG.maxHistorySize) {
    logHistory.shift();
  }
  
  // Sauvegarder dans localStorage si activé
  if (LOG_CONFIG.saveToLocalStorage) {
    try {
      localStorage.setItem(
        LOG_CONFIG.localStorageKey, 
        JSON.stringify(logHistory)
      );
    } catch (e) {
      console.warn('Impossible de sauvegarder les logs:', e);
    }
  }
};

/**
 * Charge l'historique depuis localStorage
 */
const loadHistory = () => {
  if (!LOG_CONFIG.saveToLocalStorage) return;
  
  try {
    const saved = localStorage.getItem(LOG_CONFIG.localStorageKey);
    if (saved) {
      logHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Impossible de charger les logs:', e);
  }
};

// Charger l'historique au démarrage
loadHistory();

// ========== FONCTIONS DE LOGGING ==========

/**
 * Log de debug (détails techniques)
 */
export const logDebug = (component, message, data = null) => {
  if (!shouldLog('debug')) return;
  
  const { formatted, data: logData } = formatMessage('debug', component, message, data);
  console.log(formatted, logData || '');
  addToHistory('debug', component, message, data);
};

/**
 * Log d'information (événements normaux)
 */
export const logInfo = (component, message, data = null) => {
  if (!shouldLog('info')) return;
  
  const { formatted, data: logData } = formatMessage('info', component, message, data);
  console.info(formatted, logData || '');
  addToHistory('info', component, message, data);
};

/**
 * Log d'avertissement (problèmes potentiels)
 */
export const logWarn = (component, message, data = null) => {
  if (!shouldLog('warn')) return;
  
  const { formatted, data: logData } = formatMessage('warn', component, message, data);
  console.warn(formatted, logData || '');
  addToHistory('warn', component, message, data);
};

/**
 * Log d'erreur (problèmes critiques)
 */
export const logError = (component, message, error = null) => {
  if (!shouldLog('error')) return;
  
  const errorData = error ? {
    name: error.name,
    message: error.message,
    stack: error.stack
  } : null;
  
  const { formatted } = formatMessage('error', component, message, errorData);
  console.error(formatted, error || '');
  addToHistory('error', component, message, errorData);
};

// ========== LOGS SPÉCIALISÉS ==========

/**
 * Log de validation d'arbre
 */
export const logValidation = (arbre, statut, problemes, avertissements) => {
  logInfo('Validation', `Arbre "${arbre.name}" - Statut: ${statut}`, {
    arbreId: arbre.id,
    statut,
    nbProblemes: problemes.length,
    nbAvertissements: avertissements.length,
    problemes,
    avertissements
  });
};

/**
 * Log de calcul géométrique
 */
export const logCalcul = (type, params, resultat) => {
  logDebug('Geometrie', `Calcul ${type}`, {
    params,
    resultat
  });
};

/**
 * Log d'interaction utilisateur
 */
export const logInteraction = (action, details) => {
  logInfo('UI', `Action: ${action}`, details);
};

/**
 * Log de performance
 */
export const logPerformance = (operation, durationMs) => {
  const level = durationMs > 1000 ? 'warn' : 'debug';
  const message = `${operation} - ${durationMs.toFixed(2)}ms`;
  
  if (level === 'warn') {
    logWarn('Performance', message, { operation, durationMs });
  } else {
    logDebug('Performance', message, { operation, durationMs });
  }
};

/**
 * Log de modification de données
 */
export const logDataChange = (entity, action, before, after) => {
  logInfo('Data', `${entity} - ${action}`, {
    entity,
    action,
    before,
    after
  });
};

/**
 * Log de chargement de ressources
 */
export const logResourceLoad = (resource, success, duration) => {
  if (success) {
    logInfo('Resources', `${resource} chargé (${duration}ms)`, { resource, duration });
  } else {
    logError('Resources', `Échec chargement ${resource}`, { resource });
  }
};

// ========== GESTION DE L'HISTORIQUE ==========

/**
 * Obtient l'historique des logs
 */
export const getLogHistory = (filters = {}) => {
  let filtered = [...logHistory];
  
  // Filtrer par niveau
  if (filters.level) {
    filtered = filtered.filter(log => log.level === filters.level);
  }
  
  // Filtrer par composant
  if (filters.component) {
    filtered = filtered.filter(log => log.component === filters.component);
  }
  
  // Filtrer par période
  if (filters.since) {
    filtered = filtered.filter(log => log.timestamp >= filters.since);
  }
  
  return filtered;
};

/**
 * Exporte les logs en JSON
 */
export const exportLogs = () => {
  const data = {
    exported: new Date().toISOString(),
    config: LOG_CONFIG,
    logs: logHistory
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `planificateur-logs-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  logInfo('Logger', 'Logs exportés', { count: logHistory.length });
};

/**
 * Efface l'historique
 */
export const clearLogs = () => {
  const count = logHistory.length;
  logHistory = [];
  
  if (LOG_CONFIG.saveToLocalStorage) {
    localStorage.removeItem(LOG_CONFIG.localStorageKey);
  }
  
  console.log(`✅ ${count} logs effacés`);
};

/**
 * Affiche les statistiques des logs
 */
export const showLogStats = () => {
  const stats = {
    total: logHistory.length,
    byLevel: {},
    byComponent: {},
    recent: logHistory.slice(-10)
  };
  
  logHistory.forEach(log => {
    stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    if (log.component) {
      stats.byComponent[log.component] = (stats.byComponent[log.component] || 0) + 1;
    }
  });
  
  console.table(stats.byLevel);
  console.table(stats.byComponent);
  console.log('10 derniers logs:', stats.recent);
  
  return stats;
};

// ========== HELPER POUR MESURER PERFORMANCES ==========

/**
 * Mesure le temps d'exécution d'une fonction
 */
export const measurePerformance = (operation, fn) => {
  const start = performance.now();
  
  try {
    const result = fn();
    const duration = performance.now() - start;
    logPerformance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logError(operation, `Erreur après ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

/**
 * Mesure async
 */
export const measurePerformanceAsync = async (operation, fn) => {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logPerformance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logError(operation, `Erreur après ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

// ========== HELPER POUR TRY/CATCH ==========

/**
 * Wrapper try/catch avec logging automatique
 */
export const tryCatch = (component, operation, fn) => {
  try {
    logDebug(component, `Début: ${operation}`);
    const result = fn();
    logDebug(component, `Fin: ${operation}`);
    return result;
  } catch (error) {
    logError(component, `Erreur dans ${operation}`, error);
    throw error;
  }
};

/**
 * Wrapper async try/catch
 */
export const tryCatchAsync = async (component, operation, fn) => {
  try {
    logDebug(component, `Début: ${operation}`);
    const result = await fn();
    logDebug(component, `Fin: ${operation}`);
    return result;
  } catch (error) {
    logError(component, `Erreur dans ${operation}`, error);
    throw error;
  }
};

// ========== EXPORT GLOBAL (pour console) ==========

// Exposer les fonctions dans window pour debug console
if (typeof window !== 'undefined') {
  window.planificateurLogs = {
    getHistory: getLogHistory,
    export: exportLogs,
    clear: clearLogs,
    stats: showLogStats,
    config: LOG_CONFIG
  };
  
  console.log('🔍 Logs disponibles via: window.planificateurLogs');
}

// ========== EXPORT PAR DÉFAUT ==========

export default {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  validation: logValidation,
  calcul: logCalcul,
  interaction: logInteraction,
  performance: logPerformance,
  dataChange: logDataChange,
  resourceLoad: logResourceLoad,
  getHistory: getLogHistory,
  exportLogs,
  clearLogs,
  showLogStats,
  measurePerformance,
  measurePerformanceAsync,
  tryCatch,
  tryCatchAsync
};

