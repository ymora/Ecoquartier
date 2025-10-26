import { useState, useMemo, useCallback, useEffect } from 'react';
import { PlanConverter, CalculationUtils, ValidationUtils } from '../../utils/unified/UnifiedPlanSystem';

/**
 * Hook unifié pour la gestion des plans 2D/3D
 * Centralise toute la logique commune
 */

export function useUnifiedPlan(planData, options = {}) {
  const {
    anneeProjection = 0,
    saison = 'ete',
    solTransparent = true,
    dimensions = { largeur: 30, hauteur: 30 }
  } = options;

  const [forceUpdate, setForceUpdate] = useState(0);
  const [selectedObject, setSelectedObject] = useState(null);

  // Conversion 2D → 3D mémorisée
  const data3D = useMemo(() => {
    if (!planData) return null;
    
    return PlanConverter.convert2DTo3D(planData, {
      anneeProjection,
      solTransparent,
      dimensions
    });
  }, [planData, anneeProjection, solTransparent, dimensions, forceUpdate]);

  // Calculs de validation mémorisés
  const validationResults = useMemo(() => {
    if (!data3D) return {};

    const results = {};
    
    // Valider les arbres
    if (data3D.arbres?.length > 0) {
      data3D.arbres.forEach((arbre, index) => {
        results[`arbre-${index}`] = ValidationUtils.validateArbre(arbre, data3D.maisons || []);
      });
    }

    // Valider les maisons
    if (data3D.maisons?.length > 0) {
      data3D.maisons.forEach((maison, index) => {
        results[`maison-${index}`] = ValidationUtils.validateMaison(maison, data3D.maisons || []);
      });
    }

    return results;
  }, [data3D]);

  // Calculs de LOD mémorisés
  const lodLevels = useMemo(() => {
    if (!data3D) return {};

    const levels = {};
    
    // Calculer LOD pour chaque objet
    Object.keys(data3D).forEach(category => {
      if (Array.isArray(data3D[category])) {
        data3D[category].forEach((obj, index) => {
          const key = `${category}-${index}`;
          // Ici on pourrait calculer la distance à la caméra
          levels[key] = 'high'; // Par défaut
        });
      }
    });

    return levels;
  }, [data3D]);

  // Gestionnaire de sélection unifié
  const handleObjectSelect = useCallback((object) => {
    setSelectedObject(object);
  }, []);

  // Gestionnaire de modification unifié
  const handleObjectModify = useCallback((object, newProperties) => {
    // Mettre à jour l'objet dans planData
    // Déclencher la mise à jour
    setForceUpdate(prev => prev + 1);
  }, []);

  // Gestionnaire de suppression unifié
  const handleObjectDelete = useCallback((object) => {
    // Supprimer l'objet de planData
    // Déclencher la mise à jour
    setForceUpdate(prev => prev + 1);
  }, []);

  // Forcer la mise à jour
  const forceRefresh = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Écouter les changements dans planData
  useEffect(() => {
    if (planData) {
      forceRefresh();
    }
  }, [planData, forceRefresh]);

  return {
    data3D,
    validationResults,
    lodLevels,
    selectedObject,
    handleObjectSelect,
    handleObjectModify,
    handleObjectDelete,
    forceRefresh
  };
}

/**
 * Hook pour les calculs de géométrie unifiés
 */
export function useUnifiedGeometry(type, params, lod = 'high') {
  return useMemo(() => {
    const { GeometryFactory } = require('../../utils/unified/UnifiedPlanSystem');
    
    switch (type) {
      case 'toit':
        return GeometryFactory.createToitGeometry(
          params.typeToit,
          params.largeur,
          params.profondeur,
          params.hauteurToit,
          params.orientationToit
        );
      
      case 'arbre':
        return GeometryFactory.createArbreGeometry(
          params.hauteur,
          params.envergure,
          lod
        );
      
      default:
        return null;
    }
  }, [type, params, lod]);
}

/**
 * Hook pour les matériaux unifiés
 */
export function useUnifiedMaterial(type, params) {
  return useMemo(() => {
    const { MaterialFactory } = require('../../utils/unified/UnifiedPlanSystem');
    
    switch (type) {
      case 'toit':
        return MaterialFactory.createToitMaterial(params.typeToit);
      
      case 'arbre':
        return MaterialFactory.createArbreMaterial(params.saison, params.arbreData);
      
      case 'maison':
        return MaterialFactory.createMaisonMaterial();
      
      default:
        return null;
    }
  }, [type, params]);
}

/**
 * Hook pour les calculs de performance
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    objectCount: 0,
    isLowEndDevice: false
  });

  useEffect(() => {
    // Détecter l'appareil
    const isLowEndDevice = navigator.deviceMemory < 4 || 
                          navigator.hardwareConcurrency < 4;

    // Simuler la collecte de métriques
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        isLowEndDevice,
        fps: Math.max(30, prev.fps + (Math.random() - 0.5) * 10)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

export default useUnifiedPlan;
