import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useUnifiedState } from '../contexts/UnifiedStateContext';

/**
 * Hook pour l'optimisation des performances
 * Gère le throttling, la mémorisation et la réduction des re-renders
 */

export function usePerformanceOptimization() {
  const { state } = useUnifiedState();
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const performanceMetricsRef = useRef({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    memoryUsage: 0
  });
  
  // Throttling des fonctions coûteuses
  const createThrottledFunction = useCallback((func, delay = 100) => {
    let timeoutId = null;
    let lastExecTime = 0;
    
    return (...args) => {
      const now = Date.now();
      
      if (now - lastExecTime >= delay) {
        func(...args);
        lastExecTime = now;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (now - lastExecTime));
      }
    };
  }, []);
  
  // Debouncing des fonctions
  const createDebouncedFunction = useCallback((func, delay = 300) => {
    let timeoutId = null;
    
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);
  
  // Mémorisation des calculs coûteux
  const memoizedCalculations = useMemo(() => {
    const startTime = performance.now();
    
    // Calculs mémorisés
    const calculations = {
      // Calcul des bounds du terrain
      terrainBounds: calculateTerrainBounds(state.planData),
      
      // Calcul des distances entre objets
      objectDistances: calculateObjectDistances(state.planData),
      
      // Calcul des zones de validation
      validationZones: calculateValidationZones(state.planData),
      
      // Calcul des optimisations de rendu
      renderOptimizations: calculateRenderOptimizations(state.planData)
    };
    
    const endTime = performance.now();
    performanceMetricsRef.current.lastRenderTime = endTime - startTime;
    
    return calculations;
  }, [state.planData]);
  
  // Optimisation des re-renders
  const shouldRender = useCallback((componentName, props) => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    // Éviter les re-renders trop fréquents
    if (timeSinceLastRender < 16) { // 60 FPS max
      return false;
    }
    
    // Vérifier si les props ont vraiment changé
    const propsString = JSON.stringify(props);
    const lastPropsString = useRef.current?.[componentName];
    
    if (propsString === lastPropsString) {
      return false;
    }
    
    useRef.current = useRef.current || {};
    useRef.current[componentName] = propsString;
    lastRenderTimeRef.current = now;
    
    return true;
  }, []);
  
  // Optimisation de la mémoire
  const optimizeMemory = useCallback(() => {
    // Nettoyer les références inutiles
    if (window.gc) {
      window.gc();
    }
    
    // Optimiser les objets volumineux
    const optimizedData = {
      ...state.planData,
      // Compresser les données si nécessaire
      _compressed: true
    };
    
    return optimizedData;
  }, [state.planData]);
  
  // Lazy loading des composants
  const createLazyComponent = useCallback((importFunc, fallback = null) => {
    return React.lazy(importFunc);
  }, []);
  
  // Optimisation des listes
  const optimizeListRendering = useCallback((items, renderItem, keyExtractor) => {
    return useMemo(() => {
      return items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return {
          key,
          component: renderItem(item, index)
        };
      });
    }, [items, renderItem, keyExtractor]);
  }, []);
  
  // Optimisation des calculs de position
  const optimizePositionCalculations = useCallback((objects) => {
    return useMemo(() => {
      const startTime = performance.now();
      
      const optimized = objects.map(obj => {
        // Pré-calculer les positions
        const position = obj.position || [0, 0, 0];
        const dimensions = obj.dimensions || { largeur: 1, profondeur: 1, hauteur: 1 };
        
        return {
          ...obj,
          _cached: {
            position,
            dimensions,
            bounds: {
              minX: position[0] - dimensions.largeur / 2,
              maxX: position[0] + dimensions.largeur / 2,
              minZ: position[2] - dimensions.profondeur / 2,
              maxZ: position[2] + dimensions.profondeur / 2
            }
          }
        };
      });
      
      const endTime = performance.now();
      console.log(`⚡ Optimisation positions: ${endTime - startTime}ms`);
      
      return optimized;
    }, [objects]);
  }, []);
  
  // Optimisation des textures et matériaux
  const optimizeTextures = useCallback((textures) => {
    return useMemo(() => {
      const optimized = {};
      
      Object.keys(textures).forEach(key => {
        const texture = textures[key];
        
        // Optimiser la taille des textures
        if (texture.width > 512) {
          optimized[key] = {
            ...texture,
            width: 512,
            height: 512,
            _optimized: true
          };
        } else {
          optimized[key] = texture;
        }
      });
      
      return optimized;
    }, [textures]);
  }, []);
  
  // Métriques de performance
  const getPerformanceMetrics = useCallback(() => {
    const now = Date.now();
    renderCountRef.current++;
    
    const metrics = {
      ...performanceMetricsRef.current,
      renderCount: renderCountRef.current,
      currentTime: now,
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
    };
    
    return metrics;
  }, []);
  
  // Nettoyage automatique
  useEffect(() => {
    const cleanup = () => {
      // Nettoyer les références inutiles
      if (window.gc) {
        window.gc();
      }
    };
    
    // Nettoyage périodique
    const interval = setInterval(cleanup, 30000); // 30 secondes
    
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);
  
  // Optimisations mémorisées
  const optimizations = useMemo(() => ({
    // Fonctions optimisées
    createThrottledFunction,
    createDebouncedFunction,
    shouldRender,
    optimizeMemory,
    createLazyComponent,
    optimizeListRendering,
    optimizePositionCalculations,
    optimizeTextures,
    
    // Métriques
    getPerformanceMetrics,
    
    // Calculs mémorisés
    ...memoizedCalculations
  }), [
    createThrottledFunction,
    createDebouncedFunction,
    shouldRender,
    optimizeMemory,
    createLazyComponent,
    optimizeListRendering,
    optimizePositionCalculations,
    optimizeTextures,
    getPerformanceMetrics,
    memoizedCalculations
  ]);
  
  return optimizations;
}

// Fonctions utilitaires pour les calculs
function calculateTerrainBounds(planData) {
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  Object.values(planData).forEach(objects => {
    objects.forEach(obj => {
      if (obj.position) {
        const [x, , z] = obj.position;
        const dimensions = obj.dimensions || { largeur: 1, profondeur: 1 };
        
        minX = Math.min(minX, x - dimensions.largeur / 2);
        maxX = Math.max(maxX, x + dimensions.largeur / 2);
        minZ = Math.min(minZ, z - dimensions.profondeur / 2);
        maxZ = Math.max(maxZ, z + dimensions.profondeur / 2);
      }
    });
  });
  
  return {
    minX: minX === Infinity ? 0 : minX,
    maxX: maxX === -Infinity ? 0 : maxX,
    minZ: minZ === Infinity ? 0 : minZ,
    maxZ: maxZ === -Infinity ? 0 : maxZ
  };
}

function calculateObjectDistances(planData) {
  const distances = new Map();
  
  Object.values(planData).forEach(objects => {
    objects.forEach((obj1, i) => {
      objects.forEach((obj2, j) => {
        if (i !== j && obj1.position && obj2.position) {
          const [x1, , z1] = obj1.position;
          const [x2, , z2] = obj2.position;
          const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
          
          const key = `${obj1.id}-${obj2.id}`;
          distances.set(key, distance);
        }
      });
    });
  });
  
  return distances;
}

function calculateValidationZones(planData) {
  const zones = [];
  
  // Zones de validation pour les arbres
  if (planData.arbres) {
    planData.arbres.forEach(arbre => {
      if (arbre.position && arbre.dimensions) {
        const [x, , z] = arbre.position;
        const { envergure } = arbre.dimensions;
        
        zones.push({
          type: 'arbre',
          center: [x, z],
          radius: envergure / 2,
          objectId: arbre.id
        });
      }
    });
  }
  
  // Zones de validation pour les maisons
  if (planData.maisons) {
    planData.maisons.forEach(maison => {
      if (maison.position && maison.dimensions) {
        const [x, , z] = maison.position;
        const { largeur, profondeur } = maison.dimensions;
        
        zones.push({
          type: 'maison',
          center: [x, z],
          radius: Math.max(largeur, profondeur) / 2,
          objectId: maison.id
        });
      }
    });
  }
  
  return zones;
}

function calculateRenderOptimizations(planData) {
  const optimizations = {
    // Objets à rendre en priorité (proches de la caméra)
    priorityObjects: [],
    
    // Objets à culler (trop loin)
    culledObjects: [],
    
    // Niveau de détail selon la distance
    lodLevels: new Map()
  };
  
  // Calculer les optimisations basées sur la position
  Object.values(planData).forEach(objects => {
    objects.forEach(obj => {
      if (obj.position) {
        const [x, , z] = obj.position;
        const distance = Math.sqrt(x ** 2 + z ** 2);
        
        if (distance < 50) {
          optimizations.priorityObjects.push(obj.id);
        } else if (distance > 200) {
          optimizations.culledObjects.push(obj.id);
        }
        
        // Niveau de détail
        if (distance < 20) {
          optimizations.lodLevels.set(obj.id, 'high');
        } else if (distance < 100) {
          optimizations.lodLevels.set(obj.id, 'medium');
        } else {
          optimizations.lodLevels.set(obj.id, 'low');
        }
      }
    });
  });
  
  return optimizations;
}

export default usePerformanceOptimization;
