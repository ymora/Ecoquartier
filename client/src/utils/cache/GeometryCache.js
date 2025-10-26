/**
 * Cache optimisé pour les géométries Three.js
 * Évite la recréation de géométries identiques
 */

class GeometryCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Limite du cache
  }

  // Générer une clé unique pour une géométrie
  generateKey(type, params) {
    return `${type}_${JSON.stringify(params)}`;
  }

  // Obtenir une géométrie du cache ou la créer
  get(type, params, creator) {
    const key = this.generateKey(type, params);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Créer la géométrie si elle n'existe pas
    const geometry = creator();
    
    // Vérifier la limite du cache
    if (this.cache.size >= this.maxSize) {
      // Supprimer la première entrée (FIFO)
      const firstKey = this.cache.keys().next().value;
      const oldGeometry = this.cache.get(firstKey);
      oldGeometry.dispose();
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, geometry);
    return geometry;
  }

  // Nettoyer le cache
  clear() {
    this.cache.forEach(geometry => geometry.dispose());
    this.cache.clear();
  }

  // Obtenir les statistiques du cache
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize * 100).toFixed(1) + '%'
    };
  }
}

// Instance globale
export const geometryCache = new GeometryCache();

// Hook React pour utiliser le cache
export function useGeometryCache() {
  return geometryCache;
}

export default GeometryCache;
