/**
 * Utilitaires pour optimiser les performances
 */

/**
 * Debounce - Retarde l'exécution d'une fonction
 * @param {Function} func - Fonction à debouncer
 * @param {number} delay - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  
  const debounced = function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };

  debounced.cancel = function() {
    clearTimeout(timeoutId);
  };

  return debounced;
}

/**
 * Throttle - Limite la fréquence d'exécution d'une fonction
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Limite en ms
 * @returns {Function} Fonction throttlée
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  let lastResult;

  return function(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    return lastResult;
  };
}

/**
 * Memoization simple pour les fonctions pures
 * @param {Function} func - Fonction à mémoiser
 * @returns {Function} Fonction mémorisée
 */
export function memoize(func) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy loading d'images avec IntersectionObserver
 * @param {string} selector - Sélecteur CSS des images
 */
export function lazyLoadImages(selector = 'img[data-src]') {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });

    return imageObserver;
  }

  // Fallback pour les navigateurs sans IntersectionObserver
  document.querySelectorAll(selector).forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

/**
 * Préchargement d'images
 * @param {Array<string>} urls - URLs des images à précharger
 * @returns {Promise} Promise résolue quand toutes les images sont chargées
 */
export function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
}

/**
 * Animation frame helper pour les animations performantes
 * @param {Function} callback - Callback à exécuter
 * @returns {Function} Fonction d'annulation
 */
export function rafThrottle(callback) {
  let rafId = null;
  let lastArgs = null;

  const throttled = function(...args) {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        callback.apply(this, lastArgs);
      });
    }
  };

  throttled.cancel = function() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled;
}

/**
 * Batch des mises à jour pour éviter les re-renders multiples
 * @param {Function} callback - Callback à exécuter en batch
 * @returns {Function} Fonction batched
 */
export function batch(callback) {
  const queue = [];
  let scheduled = false;

  return function(...args) {
    queue.push(args);

    if (!scheduled) {
      scheduled = true;
      Promise.resolve().then(() => {
        scheduled = false;
        const allArgs = [...queue];
        queue.length = 0;
        callback.call(this, allArgs);
      });
    }
  };
}

/**
 * Mesure les performances d'une fonction
 * @param {Function} func - Fonction à mesurer
 * @param {string} label - Label pour la mesure
 * @returns {Function} Fonction wrappée
 */
export function measurePerformance(func, label = 'Function') {
  return function(...args) {
    const startTime = performance.now();
    const result = func.apply(this, args);
    const endTime = performance.now();
    
    console.log(`⏱️ ${label} took ${(endTime - startTime).toFixed(2)}ms`);
    
    return result;
  };
}

/**
 * Cache avec expiration
 */
export class ExpiringCache {
  constructor(ttl = 60000) { // TTL par défaut: 1 minute
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    // Nettoyer les éléments expirés avant de compter
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

/**
 * Virtual scrolling helper
 * Calcule les éléments visibles dans une liste
 * @param {Object} config - Configuration { totalItems, itemHeight, containerHeight, scrollTop }
 * @returns {Object} { startIndex, endIndex, offsetY }
 */
export function calculateVisibleRange({ totalItems, itemHeight, containerHeight, scrollTop }) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );
  const offsetY = startIndex * itemHeight;

  return {
    startIndex: Math.max(0, startIndex - 2), // Buffer de 2 éléments avant
    endIndex: Math.min(totalItems - 1, endIndex + 2), // Buffer de 2 éléments après
    offsetY
  };
}

/**
 * Détecte si l'utilisateur est inactif
 * @param {number} timeout - Temps d'inactivité en ms
 * @param {Function} callback - Callback appelée lors de l'inactivité
 * @returns {Function} Fonction de nettoyage
 */
export function detectIdle(timeout = 60000, callback) {
  let timeoutId;

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, timeout);
  };

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimer, { passive: true });
  });

  resetTimer(); // Démarrer le timer

  // Fonction de nettoyage
  return () => {
    clearTimeout(timeoutId);
    events.forEach(event => {
      document.removeEventListener(event, resetTimer);
    });
  };
}

export default {
  debounce,
  throttle,
  memoize,
  lazyLoadImages,
  preloadImages,
  rafThrottle,
  batch,
  measurePerformance,
  ExpiringCache,
  calculateVisibleRange,
  detectIdle
};

