/**
 * Optimiseur de performance avancé pour l'application 3D
 * Inspiré des techniques utilisées par Kazaplan et autres sites 3D performants
 */

class PerformanceOptimizer {
  constructor() {
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.fps = 60;
    this.isLowEndDevice = this.detectLowEndDevice();
    this.qualityLevel = this.isLowEndDevice ? 'low' : 'high';
    this.cache = new Map();
    this.textureCache = new Map();
    this.geometryCache = new Map();
    this.materialCache = new Map();
  }

  // Détection d'appareil bas de gamme
  detectLowEndDevice() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return true;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Détecter les GPU intégrés bas de gamme
      return renderer.includes('Intel') || 
             renderer.includes('Mali') || 
             renderer.includes('Adreno 3') ||
             renderer.includes('PowerVR');
    }
    
    // Détecter par la mémoire disponible
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
    
    // Détecter par le nombre de cores
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
    
    return false;
  }

  // Optimisation des textures
  optimizeTexture(texture, maxSize = 1024) {
    const cacheKey = `${texture.uuid}_${maxSize}`;
    
    if (this.textureCache.has(cacheKey)) {
      return this.textureCache.get(cacheKey);
    }

    const optimizedTexture = texture.clone();
    
    // Réduire la taille selon la qualité
    if (this.qualityLevel === 'low') {
      optimizedTexture.image.width = Math.min(texture.image.width, 512);
      optimizedTexture.image.height = Math.min(texture.image.height, 512);
    } else if (this.qualityLevel === 'medium') {
      optimizedTexture.image.width = Math.min(texture.image.width, 1024);
      optimizedTexture.image.height = Math.min(texture.image.height, 1024);
    }

    // Optimiser les paramètres
    optimizedTexture.generateMipmaps = true;
    optimizedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    optimizedTexture.magFilter = THREE.LinearFilter;
    optimizedTexture.wrapS = THREE.RepeatWrapping;
    optimizedTexture.wrapT = THREE.RepeatWrapping;
    optimizedTexture.anisotropy = this.isLowEndDevice ? 1 : 4;

    this.textureCache.set(cacheKey, optimizedTexture);
    return optimizedTexture;
  }

  // Optimisation des géométries
  optimizeGeometry(geometry, quality = 'high') {
    const cacheKey = `${geometry.uuid}_${quality}`;
    
    if (this.geometryCache.has(cacheKey)) {
      return this.geometryCache.get(cacheKey);
    }

    let optimizedGeometry = geometry;

    if (quality === 'low') {
      // Simplifier la géométrie pour les appareils bas de gamme
      if (geometry.attributes.position && geometry.attributes.position.count > 1000) {
        // Décimer la géométrie (réduire le nombre de vertices)
        const decimatedGeometry = this.decimateGeometry(geometry, 0.5);
        optimizedGeometry = decimatedGeometry;
      }
    }

    // Optimiser les attributs
    optimizedGeometry.computeBoundingBox();
    optimizedGeometry.computeBoundingSphere();
    
    // Disposer de l'ancienne géométrie si elle a été modifiée
    if (optimizedGeometry !== geometry) {
      geometry.dispose();
    }

    this.geometryCache.set(cacheKey, optimizedGeometry);
    return optimizedGeometry;
  }

  // Décimation de géométrie (simplification)
  decimateGeometry(geometry, ratio = 0.5) {
    const positionAttribute = geometry.attributes.position;
    const newCount = Math.floor(positionAttribute.count * ratio);
    
    const newGeometry = new THREE.BufferGeometry();
    const newPositions = new Float32Array(newCount * 3);
    const newNormals = new Float32Array(newCount * 3);
    const newUvs = new Float32Array(newCount * 2);

    // Copier les vertices en sautant certains
    const step = Math.floor(1 / ratio);
    for (let i = 0; i < newCount; i++) {
      const sourceIndex = i * step;
      newPositions[i * 3] = positionAttribute.array[sourceIndex * 3];
      newPositions[i * 3 + 1] = positionAttribute.array[sourceIndex * 3 + 1];
      newPositions[i * 3 + 2] = positionAttribute.array[sourceIndex * 3 + 2];
    }

    newGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    newGeometry.setAttribute('normal', new THREE.BufferAttribute(newNormals, 3));
    newGeometry.setAttribute('uv', new THREE.BufferAttribute(newUvs, 2));

    return newGeometry;
  }

  // Optimisation des matériaux
  optimizeMaterial(material, quality = 'high') {
    const cacheKey = `${material.uuid}_${quality}`;
    
    if (this.materialCache.has(cacheKey)) {
      return this.materialCache.get(cacheKey);
    }

    const optimizedMaterial = material.clone();

    if (quality === 'low') {
      // Désactiver les fonctionnalités coûteuses
      optimizedMaterial.shadowSide = THREE.FrontSide;
      optimizedMaterial.side = THREE.FrontSide;
      optimizedMaterial.transparent = false;
      optimizedMaterial.alphaTest = 0.5;
    } else if (quality === 'medium') {
      // Paramètres équilibrés
      optimizedMaterial.shadowSide = THREE.DoubleSide;
      optimizedMaterial.side = THREE.DoubleSide;
    }

    // Optimisations communes
    optimizedMaterial.needsUpdate = true;

    this.materialCache.set(cacheKey, optimizedMaterial);
    return optimizedMaterial;
  }

  // Gestion du LOD (Level of Detail)
  createLODSystem(objects, camera) {
    const lodLevels = {
      high: 0,    // Distance 0-50m
      medium: 50, // Distance 50-100m
      low: 100    // Distance 100m+
    };

    return objects.map(obj => {
      const distance = camera.position.distanceTo(obj.position);
      
      if (distance < lodLevels.medium) {
        return { ...obj, lod: 'high' };
      } else if (distance < lodLevels.low) {
        return { ...obj, lod: 'medium' };
      } else {
        return { ...obj, lod: 'low' };
      }
    });
  }

  // Frustum culling optimisé
  frustumCull(objects, camera) {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4();
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    return objects.filter(obj => {
      if (!obj.geometry || !obj.geometry.boundingSphere) return true;
      
      const sphere = obj.geometry.boundingSphere.clone();
      sphere.applyMatrix4(obj.matrixWorld);
      
      return frustum.intersectsSphere(sphere);
    });
  }

  // Occlusion culling basique
  occlusionCull(objects, camera) {
    // Tri par distance à la caméra
    const sortedObjects = objects.sort((a, b) => {
      const distA = camera.position.distanceTo(a.position);
      const distB = camera.position.distanceTo(b.position);
      return distA - distB;
    });

    // Garder seulement les objets les plus proches
    const maxObjects = this.isLowEndDevice ? 50 : 100;
    return sortedObjects.slice(0, maxObjects);
  }

  // Optimisation des instances
  optimizeInstances(instances, maxInstances = 1000) {
    if (instances.length <= maxInstances) return instances;

    // Sélectionner les instances les plus importantes
    return instances
      .sort((a, b) => b.importance - a.importance)
      .slice(0, maxInstances);
  }

  // Mise à jour de la qualité en temps réel
  updateQuality(performance) {
    if (performance.fps < 30) {
      this.qualityLevel = 'low';
    } else if (performance.fps < 45) {
      this.qualityLevel = 'medium';
    } else {
      this.qualityLevel = 'high';
    }
  }

  // Nettoyage du cache
  clearCache() {
    this.textureCache.clear();
    this.geometryCache.clear();
    this.materialCache.clear();
    this.cache.clear();
  }

  // Métriques de performance
  getPerformanceMetrics() {
    return {
      fps: this.fps,
      qualityLevel: this.qualityLevel,
      isLowEndDevice: this.isLowEndDevice,
      cacheSize: this.cache.size,
      textureCacheSize: this.textureCache.size,
      geometryCacheSize: this.geometryCache.size,
      materialCacheSize: this.materialCache.size
    };
  }
}

// Instance globale
export const performanceOptimizer = new PerformanceOptimizer();

// Hook React pour utiliser l'optimiseur
export function usePerformanceOptimizer() {
  const [metrics, setMetrics] = React.useState(performanceOptimizer.getPerformanceMetrics());
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceOptimizer.getPerformanceMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    optimizer: performanceOptimizer,
    metrics
  };
}

export default PerformanceOptimizer;
