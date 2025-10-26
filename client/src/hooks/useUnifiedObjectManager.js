import { useState, useCallback, useRef, useMemo } from 'react';
import { UnifiedObject, ObjectFactory } from '../models/UnifiedObject';
import { useUnifiedRendering } from './useUnifiedRendering';

/**
 * Gestionnaire d'objets unifié pour 2D/3D
 * Principe DRY : Un seul gestionnaire pour les deux modes
 * Applique les principes SOLID et les meilleures pratiques 2025
 */
export const useUnifiedObjectManager = (options = {}) => {
  const {
    canvas = null,
    echelle = 40,
    onSync = null,
    onExport = null
  } = options;

  const [objects, setObjects] = useState(new Map());
  const [selectedObject, setSelectedObject] = useState(null);
  const objectsRef = useRef(new Map());
  const { toFabricObject, toThreeObject, createFabricObject, syncFabricToUnified } = useUnifiedRendering();

  /**
   * Ajoute un objet au gestionnaire
   */
  const addObject = useCallback((objectData) => {
    let unifiedObject;
    
    // Créer l'objet unifié selon le type
    switch (objectData.type) {
      case 'maison':
        unifiedObject = ObjectFactory.createMaison(objectData);
        break;
      case 'citerne':
        unifiedObject = ObjectFactory.createCiterne(objectData);
        break;
      case 'terrasse':
        unifiedObject = ObjectFactory.createTerrasse(objectData);
        break;
      case 'arbre':
        unifiedObject = ObjectFactory.createArbre(objectData);
        break;
      default:
        unifiedObject = new UnifiedObject(objectData);
    }
    
    // Ajouter à la collection
    objectsRef.current.set(unifiedObject.id, unifiedObject);
    setObjects(new Map(objectsRef.current));
    
    // Créer la représentation 2D si canvas disponible
    if (canvas) {
      const fabricObj = createFabricObject(unifiedObject, getFabricClass(unifiedObject.type), echelle);
      canvas.add(fabricObj);
      canvas.renderAll();
    }
    
    // Déclencher la synchronisation
    if (onSync) {
      onSync(Date.now());
    }
    
    return unifiedObject;
  }, [canvas, echelle, createFabricObject, onSync]);

  /**
   * Supprime un objet du gestionnaire
   */
  const removeObject = useCallback((objectId) => {
    const unifiedObject = objectsRef.current.get(objectId);
    if (!unifiedObject) return;
    
    // Supprimer de la collection
    objectsRef.current.delete(objectId);
    setObjects(new Map(objectsRef.current));
    
    // Supprimer la représentation 2D si canvas disponible
    if (canvas) {
      const fabricObj = canvas.getObjects().find(obj => obj.unifiedObjectId === objectId);
      if (fabricObj) {
        canvas.remove(fabricObj);
        canvas.renderAll();
      }
    }
    
    // Désélectionner si c'était l'objet sélectionné
    if (selectedObject && selectedObject.id === objectId) {
      setSelectedObject(null);
    }
    
    // Déclencher la synchronisation
    if (onSync) {
      onSync(Date.now());
    }
  }, [canvas, selectedObject, onSync]);

  /**
   * Met à jour un objet
   */
  const updateObject = useCallback((objectId, properties) => {
    const unifiedObject = objectsRef.current.get(objectId);
    if (!unifiedObject) return;
    
    // Mise à jour de l'objet unifié
    Object.assign(unifiedObject, properties);
    
    // Synchronisation avec la représentation 2D
    if (canvas) {
      const fabricObj = canvas.getObjects().find(obj => obj.unifiedObjectId === objectId);
      if (fabricObj) {
        syncFabricToUnified(fabricObj, unifiedObject, echelle);
        canvas.renderAll();
      }
    }
    
    // Déclencher la synchronisation
    if (onSync) {
      onSync(Date.now());
    }
  }, [canvas, echelle, syncFabricToUnified, onSync]);

  /**
   * Sélectionne un objet
   */
  const selectObject = useCallback((objectId) => {
    const unifiedObject = objectsRef.current.get(objectId);
    if (!unifiedObject) return;
    
    setSelectedObject(unifiedObject);
    
    // Sélectionner dans le canvas 2D
    if (canvas) {
      const fabricObj = canvas.getObjects().find(obj => obj.unifiedObjectId === objectId);
      if (fabricObj) {
        canvas.setActiveObject(fabricObj);
        canvas.renderAll();
      }
    }
  }, [canvas]);

  /**
   * Désélectionne l'objet actuel
   */
  const deselectObject = useCallback(() => {
    setSelectedObject(null);
    
    if (canvas) {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas]);

  /**
   * Obtient un objet par ID
   */
  const getObject = useCallback((objectId) => {
    return objectsRef.current.get(objectId);
  }, []);

  /**
   * Obtient tous les objets
   */
  const getAllObjects = useCallback(() => {
    return Array.from(objectsRef.current.values());
  }, []);

  /**
   * Obtient les objets par type
   */
  const getObjectsByType = useCallback((type) => {
    return Array.from(objectsRef.current.values()).filter(obj => obj.type === type);
  }, []);

  /**
   * Convertit tous les objets en données 3D
   */
  const to3DData = useCallback(() => {
    const data3D = {
      maisons: [],
      citernes: [],
      canalisations: [],
      clotures: [],
      terrasses: [],
      arbres: [],
      bounds: { minX: 0, maxX: 0, minZ: 0, maxZ: 0 }
    };
    
    // Si pas d'objets dans le gestionnaire, extraire du canvas 2D
    if (objectsRef.current.size === 0 && canvas) {
      const fabricObjects = canvas.getObjects();
      fabricObjects.forEach((fabricObj, idx) => {
        // ✅ Améliorer la détection des objets (groupes et objets simples)
        if (fabricObj.type === 'rect' || fabricObj.type === 'circle' || fabricObj.type === 'group') {
          const echelle = 40; // Échelle par défaut
          let type = 'maison';
          let customType = fabricObj.customType || 'maison';
          let dimensions = {};
          let position = [fabricObj.left / echelle, 0, fabricObj.top / echelle];
          
          // ✅ Déterminer le type selon customType (plus fiable)
          if (fabricObj.customType === 'citerne' || fabricObj.customType === 'caisson') {
            type = 'citerne';
            dimensions = {
              diametre: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
              hauteur: fabricObj.hauteur || 2
            };
          } else if (fabricObj.customType === 'terrasse') {
            type = 'terrasse';
            dimensions = {
              largeur: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
              profondeur: (fabricObj.getScaledHeight ? fabricObj.getScaledHeight() : fabricObj.height) / echelle
            };
          } else if (fabricObj.customType === 'paves') {
            type = 'terrasse'; // ✅ Les pavés sont des terrasses en 3D
            customType = 'paves'; // ✅ Préserver le customType original
            dimensions = {
              largeur: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
              profondeur: (fabricObj.getScaledHeight ? fabricObj.getScaledHeight() : fabricObj.height) / echelle
            };
          } else if (fabricObj.customType === 'arbre') {
            type = 'arbre';
            dimensions = {
              hauteur: fabricObj.hauteur || 5,
              envergure: fabricObj.envergure || 3,
              profondeurRacines: fabricObj.profondeurRacines || 1
            };
          } else if (fabricObj.customType === 'maison') {
            type = 'maison';
            dimensions = {
              largeur: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
              profondeur: (fabricObj.getScaledHeight ? fabricObj.getScaledHeight() : fabricObj.height) / echelle,
              hauteur: fabricObj.hauteur || 7
            };
          } else {
            // ✅ Par défaut, essayer de détecter selon la forme
            if (fabricObj.type === 'circle') {
              type = 'citerne';
              dimensions = {
                diametre: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
                hauteur: fabricObj.hauteur || 2
              };
            } else {
              // Maison par défaut pour les rectangles
              type = 'maison';
              dimensions = {
                largeur: (fabricObj.getScaledWidth ? fabricObj.getScaledWidth() : fabricObj.width) / echelle,
                profondeur: (fabricObj.getScaledHeight ? fabricObj.getScaledHeight() : fabricObj.height) / echelle,
                hauteur: fabricObj.hauteur || 7
              };
            }
          }
          
          const unifiedObject = {
            id: `obj-${idx}`,
            type: type,
            customType: customType,
            position: position,
            rotation: fabricObj.angle || 0,
            dimensions: dimensions,
            material: {
              typeToit: fabricObj.typeToit || 'deux-pentes'
            }
          };
          
          switch (type) {
            case 'maison':
              data3D.maisons.push(unifiedObject);
              break;
            case 'citerne':
              data3D.citernes.push(unifiedObject);
              break;
            case 'terrasse':
              data3D.terrasses.push(unifiedObject);
              break;
            case 'arbre':
              data3D.arbres.push(unifiedObject);
              break;
          }
        }
      });
    } else {
      // Utiliser les objets du gestionnaire
      objectsRef.current.forEach((unifiedObject) => {
        const threeData = toThreeObject(unifiedObject);
        
        switch (unifiedObject.type) {
          case 'maison':
            data3D.maisons.push(threeData);
            break;
          case 'citerne':
            data3D.citernes.push(threeData);
            break;
          case 'terrasse':
            data3D.terrasses.push(threeData);
            break;
          case 'arbre':
            data3D.arbres.push(threeData);
            break;
        }
      });
    }
    
    return data3D;
  }, [toThreeObject, canvas]);

  /**
   * Sauvegarde tous les objets
   */
  const saveObjects = useCallback(() => {
    const serializedObjects = Array.from(objectsRef.current.values()).map(obj => obj.serialize());
    return serializedObjects;
  }, []);

  /**
   * Charge des objets depuis la sauvegarde
   */
  const loadObjects = useCallback((serializedObjects) => {
    // Nettoyer les objets existants
    objectsRef.current.clear();
    setObjects(new Map());
    
    if (canvas) {
      const objectsToRemove = canvas.getObjects().filter(obj => obj.unifiedObjectId);
      objectsToRemove.forEach(obj => canvas.remove(obj));
    }
    
    // Charger les nouveaux objets
    serializedObjects.forEach(data => {
      const unifiedObject = UnifiedObject.deserialize(data);
      addObject(unifiedObject);
    });
  }, [canvas, addObject]);

  /**
   * Obtient la classe Fabric.js selon le type
   */
  const getFabricClass = useCallback((type) => {
    switch (type) {
      case 'maison':
      case 'terrasse':
        return fabric.Rect;
      case 'citerne':
      case 'arbre':
        return fabric.Circle;
      default:
        return fabric.Rect;
    }
  }, []);

  // Valeurs mémorisées
  const objectCount = useMemo(() => objectsRef.current.size, [objects]);
  const selectedObjectId = useMemo(() => selectedObject?.id, [selectedObject]);

  return {
    // État
    objects: Array.from(objects.values()),
    selectedObject,
    objectCount,
    selectedObjectId,
    
    // Actions
    addObject,
    removeObject,
    updateObject,
    selectObject,
    deselectObject,
    getObject,
    getAllObjects,
    getObjectsByType,
    
    // Conversion
    to3DData,
    saveObjects,
    loadObjects
  };
};

export default useUnifiedObjectManager;
