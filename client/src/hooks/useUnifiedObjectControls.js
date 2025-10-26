import { useCallback, useMemo } from 'react';
import { useUnifiedState } from '../contexts/UnifiedStateContext';

/**
 * Hook pour gérer les contrôles d'objets unifiés entre 2D et 3D
 * Centralise toutes les opérations de modification d'objets
 */

export function useUnifiedObjectControls() {
  const { state, actions, getters, syncHandlers } = useUnifiedState();
  
  // Mise à jour des propriétés d'un objet
  const updateObjectProperty = useCallback((objectId, property, value) => {
    actions.updateObjectProperties(objectId, { [property]: value });
    
    // Déclencher la synchronisation si nécessaire
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, null, { [property]: value });
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Mise à jour de la position d'un objet
  const updateObjectPosition = useCallback((objectId, newPosition) => {
    actions.updateObjectProperties(objectId, { position: newPosition });
    
    // Synchronisation bidirectionnelle
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, newPosition);
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Mise à jour des dimensions d'un objet
  const updateObjectDimensions = useCallback((objectId, dimensions) => {
    actions.updateObjectProperties(objectId, { dimensions });
    
    // Synchronisation bidirectionnelle
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, null, { dimensions });
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Mise à jour de la rotation d'un objet
  const updateObjectRotation = useCallback((objectId, angle) => {
    actions.updateObjectProperties(objectId, { angle });
    
    // Synchronisation bidirectionnelle
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, null, { angle });
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Mise à jour de l'élévation d'un objet
  const updateObjectElevation = useCallback((objectId, elevation) => {
    actions.updateObjectProperties(objectId, { elevationSol: elevation });
    
    // Synchronisation bidirectionnelle
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, null, { elevationSol: elevation });
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Mise à jour de plusieurs propriétés en une fois
  const updateObjectProperties = useCallback((objectId, properties) => {
    actions.updateObjectProperties(objectId, properties);
    
    // Synchronisation bidirectionnelle
    if (state.viewMode === '2d') {
      syncHandlers.handle2DTo3DSync();
    } else {
      syncHandlers.handle3DTo2DSync(objectId, null, properties);
    }
  }, [actions, syncHandlers, state.viewMode]);
  
  // Sélection d'un objet
  const selectObject = useCallback((objectId) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      actions.setSelectedObject(found.object);
    }
  }, [actions, getters]);
  
  // Désélection d'un objet
  const deselectObject = useCallback(() => {
    actions.clearSelection();
  }, [actions]);
  
  // Suppression d'un objet
  const removeObject = useCallback((objectId) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      actions.removeObject(found.type, objectId);
      
      // Si l'objet supprimé était sélectionné, désélectionner
      if (state.selectedObjectId === objectId) {
        actions.clearSelection();
      }
      
      // Synchronisation bidirectionnelle
      if (state.viewMode === '2d') {
        syncHandlers.handle2DTo3DSync();
      } else {
        syncHandlers.handle3DTo2DSync();
      }
    }
  }, [actions, getters, state.selectedObjectId, state.viewMode, syncHandlers]);
  
  // Duplication d'un objet
  const duplicateObject = useCallback((objectId) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      const duplicatedObject = {
        ...found.object,
        id: `${found.object.id}-copy-${Date.now()}`,
        position: [
          found.object.position[0] + 1, // Décaler légèrement
          found.object.position[1],
          found.object.position[2] + 1
        ]
      };
      
      actions.addObject(found.type, duplicatedObject);
      
      // Synchronisation bidirectionnelle
      if (state.viewMode === '2d') {
        syncHandlers.handle2DTo3DSync();
      } else {
        syncHandlers.handle3DTo2DSync();
      }
    }
  }, [actions, getters, state.viewMode, syncHandlers]);
  
  // Validation d'un objet
  const validateObject = useCallback((objectId) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      // Ici, on pourrait ajouter la logique de validation
      // Pour l'instant, on retourne un statut par défaut
      return { status: 'ok', messages: [] };
    }
    return { status: 'error', messages: ['Objet non trouvé'] };
  }, [getters]);
  
  // Obtenir les propriétés modifiables d'un objet selon son type
  const getEditableProperties = useCallback((objectType) => {
    const propertiesMap = {
      maison: [
        { key: 'dimensions.largeur', label: 'Largeur', unit: 'm', min: 2, max: 30, step: 0.1 },
        { key: 'dimensions.profondeur', label: 'Profondeur', unit: 'm', min: 2, max: 30, step: 0.1 },
        { key: 'dimensions.hauteur', label: 'Hauteur', unit: 'm', min: 3, max: 15, step: 0.5 },
        { key: 'properties.angle', label: 'Rotation', unit: '°', min: 0, max: 360, step: 5 },
        { key: 'properties.elevationSol', label: 'Élévation sol', unit: 'm', min: -5, max: 10, step: 0.1 },
        { key: 'properties.profondeurFondations', label: 'Prof. fondations', unit: 'm', min: -2, max: 3, step: 0.1 }
      ],
      citerne: [
        { key: 'dimensions.diametre', label: 'Diamètre', unit: 'm', min: 0.5, max: 3, step: 0.1 },
        { key: 'dimensions.profondeur', label: 'Profondeur', unit: 'm', min: 1, max: 5, step: 0.5 },
        { key: 'properties.elevationSol', label: 'Élévation sol', unit: 'm', min: -5, max: 5, step: 0.1 }
      ],
      canalisation: [
        { key: 'properties.profondeur', label: 'Profondeur', unit: 'm', min: 0.1, max: 2, step: 0.1 },
        { key: 'properties.diametre', label: 'Diamètre', unit: 'm', min: 0.05, max: 0.5, step: 0.05 },
        { key: 'properties.elevationSol', label: 'Élévation sol', unit: 'm', min: -2, max: 5, step: 0.1 }
      ],
      cloture: [
        { key: 'properties.hauteur', label: 'Hauteur', unit: 'm', min: 0.5, max: 3, step: 0.1 },
        { key: 'properties.epaisseur', label: 'Épaisseur', unit: 'cm', min: 5, max: 20, step: 1 }
      ],
      terrasse: [
        { key: 'dimensions.largeur', label: 'Largeur', unit: 'm', min: 1, max: 20, step: 0.1 },
        { key: 'dimensions.profondeur', label: 'Profondeur', unit: 'm', min: 1, max: 20, step: 0.1 },
        { key: 'dimensions.hauteur', label: 'Hauteur dalle', unit: 'm', min: -1, max: 1, step: 0.05 },
        { key: 'properties.angle', label: 'Rotation', unit: '°', min: 0, max: 360, step: 5 },
        { key: 'properties.elevationSol', label: 'Élévation sol', unit: 'm', min: -2, max: 2, step: 0.1 }
      ],
      pave: [
        { key: 'dimensions.largeur', label: 'Largeur', unit: 'm', min: 1, max: 20, step: 0.1 },
        { key: 'dimensions.profondeur', label: 'Profondeur', unit: 'm', min: 1, max: 20, step: 0.1 },
        { key: 'dimensions.hauteur', label: 'Hauteur pavés', unit: 'm', min: -0.5, max: 0.5, step: 0.05 },
        { key: 'properties.angle', label: 'Rotation', unit: '°', min: 0, max: 360, step: 5 },
        { key: 'properties.elevationSol', label: 'Élévation sol', unit: 'm', min: -2, max: 2, step: 0.1 },
        { key: 'properties.profondeurGravier', label: 'Prof. gravier', unit: 'm', min: -0.5, max: 0.5, step: 0.05 }
      ],
      arbre: [
        { key: 'dimensions.hauteur', label: 'Hauteur', unit: 'm', min: 2, max: 30, step: 0.5 },
        { key: 'dimensions.envergure', label: 'Envergure', unit: 'm', min: 1, max: 20, step: 0.5 },
        { key: 'dimensions.profondeurRacines', label: 'Prof. racines', unit: 'm', min: 0.5, max: 5, step: 0.5 }
      ]
    };
    
    return propertiesMap[objectType] || [];
  }, []);
  
  // Obtenir la valeur d'une propriété imbriquée
  const getNestedProperty = useCallback((object, key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], object);
  }, []);
  
  // Définir la valeur d'une propriété imbriquée
  const setNestedProperty = useCallback((object, key, value) => {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, k) => {
      if (!obj[k]) obj[k] = {};
      return obj[k];
    }, object);
    target[lastKey] = value;
  }, []);
  
  // Mise à jour d'une propriété imbriquée
  const updateNestedProperty = useCallback((objectId, propertyKey, value) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      const updatedObject = { ...found.object };
      setNestedProperty(updatedObject, propertyKey, value);
      
      actions.updateObjectProperties(objectId, updatedObject);
      
      // Synchronisation bidirectionnelle
      if (state.viewMode === '2d') {
        syncHandlers.handle2DTo3DSync();
      } else {
        syncHandlers.handle3DTo2DSync(objectId, null, updatedObject);
      }
    }
  }, [actions, getters, state.viewMode, syncHandlers, setNestedProperty]);
  
  // Obtenir la valeur actuelle d'une propriété
  const getPropertyValue = useCallback((objectId, propertyKey) => {
    const found = getters.getObjectById(objectId);
    if (found) {
      return getNestedProperty(found.object, propertyKey);
    }
    return null;
  }, [getters, getNestedProperty]);
  
  // Contrôles mémorisés
  const controls = useMemo(() => ({
    // Actions de base
    updateObjectProperty,
    updateObjectPosition,
    updateObjectDimensions,
    updateObjectRotation,
    updateObjectElevation,
    updateObjectProperties,
    updateNestedProperty,
    
    // Sélection
    selectObject,
    deselectObject,
    
    // Gestion des objets
    removeObject,
    duplicateObject,
    validateObject,
    
    // Propriétés
    getEditableProperties,
    getPropertyValue,
    getNestedProperty,
    setNestedProperty
  }), [
    updateObjectProperty,
    updateObjectPosition,
    updateObjectDimensions,
    updateObjectRotation,
    updateObjectElevation,
    updateObjectProperties,
    updateNestedProperty,
    selectObject,
    deselectObject,
    removeObject,
    duplicateObject,
    validateObject,
    getEditableProperties,
    getPropertyValue,
    getNestedProperty,
    setNestedProperty
  ]);
  
  return {
    controls,
    selectedObject: state.selectedObject,
    selectedObjectId: state.selectedObjectId,
    isObjectSelected: (objectId) => state.selectedObjectId === objectId
  };
}

export default useUnifiedObjectControls;
