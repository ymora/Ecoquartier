import { memo, useCallback, useEffect, useRef } from 'react';
import { useUnifiedRendering } from '../hooks/useUnifiedRendering';
import { UnifiedObject, ObjectFactory } from '../models/UnifiedObject';

/**
 * Rendu unifié d'un objet (2D/3D)
 * Principe DRY : Un seul composant pour les deux représentations
 * Applique les principes SOLID et les meilleures pratiques 2025
 */
const UnifiedObjectRenderer = memo(({ 
  unifiedObject,
  mode = '2d', // '2d' ou '3d'
  canvas = null,
  echelle = 40,
  onSelection = null,
  onMove = null,
  onPropertyChange = null,
  className = ''
}) => {
  const { 
    toFabricObject, 
    toThreeObject, 
    createFabricObject,
    syncFabricToUnified,
    handleObjectSelection,
    handleObjectMove 
  } = useUnifiedRendering();
  
  const fabricObjectRef = useRef(null);
  const threeObjectRef = useRef(null);

  /**
   * Gère la sélection de l'objet
   */
  const handleSelection = useCallback(() => {
    handleObjectSelection(unifiedObject, canvas, onSelection);
  }, [unifiedObject, canvas, onSelection, handleObjectSelection]);

  /**
   * Gère le déplacement de l'objet
   */
  const handleMove = useCallback((newPosition) => {
    handleObjectMove(unifiedObject, newPosition, canvas, echelle);
    if (onMove) {
      onMove(unifiedObject, newPosition);
    }
  }, [unifiedObject, canvas, echelle, onMove, handleObjectMove]);

  /**
   * Gère le changement de propriété
   */
  const handlePropertyChange = useCallback((property, value) => {
    unifiedObject.setProperty(property, value);
    if (onPropertyChange) {
      onPropertyChange(unifiedObject, property, value);
    }
  }, [unifiedObject, onPropertyChange]);

  /**
   * Rendu 2D (Fabric.js)
   */
  const render2D = useCallback(() => {
    if (!canvas || !unifiedObject) return null;

    const fabricData = toFabricObject(unifiedObject, echelle);
    
    // Créer l'objet Fabric.js selon le type
    let fabricObj;
    switch (unifiedObject.type) {
      case 'maison':
        fabricObj = createFabricObject(unifiedObject, fabric.Rect, echelle);
        break;
      case 'citerne':
        fabricObj = createFabricObject(unifiedObject, fabric.Circle, echelle);
        break;
      case 'terrasse':
        fabricObj = createFabricObject(unifiedObject, fabric.Rect, echelle);
        break;
      case 'arbre':
        fabricObj = createFabricObject(unifiedObject, fabric.Circle, echelle);
        break;
      default:
        fabricObj = createFabricObject(unifiedObject, fabric.Rect, echelle);
    }
    
    // Ajouter les event listeners
    fabricObj.on('selected', handleSelection);
    fabricObj.on('moving', (e) => {
      const newPosition = {
        x: e.target.left / echelle,
        y: e.target.elevationSol || 0,
        z: e.target.top / echelle
      };
      handleMove(newPosition);
    });
    
    fabricObjectRef.current = fabricObj;
    return fabricObj;
  }, [canvas, unifiedObject, echelle, toFabricObject, createFabricObject, handleSelection, handleMove]);

  /**
   * Rendu 3D (Three.js)
   */
  const render3D = useCallback(() => {
    if (!unifiedObject) return null;

    const threeData = toThreeObject(unifiedObject);
    
    // Rendu selon le type d'objet
    switch (unifiedObject.type) {
      case 'maison':
        return (
          <Maison3D
            {...threeData}
            onClick={handleSelection}
            onMove={handleMove}
          />
        );
        
      case 'citerne':
        return (
          <Citerne3D
            {...threeData}
            onClick={handleSelection}
            onMove={handleMove}
          />
        );
        
      case 'terrasse':
        return (
          <Terrasse3D
            {...threeData}
            onClick={handleSelection}
            onMove={handleMove}
          />
        );
        
      case 'arbre':
        return (
          <Arbre3D
            {...threeData}
            onClick={handleSelection}
            onMove={handleMove}
          />
        );
        
      default:
        return null;
    }
  }, [unifiedObject, toThreeObject, handleSelection, handleMove]);

  /**
   * Synchronisation bidirectionnelle
   */
  useEffect(() => {
    if (!unifiedObject) return;

    // Écouter les changements de l'objet unifié
    const unsubscribe = unifiedObject.addChangeListener(({ key, newValue }) => {
      // Synchroniser avec la représentation 2D
      if (mode === '2d' && fabricObjectRef.current) {
        syncFabricToUnified(fabricObjectRef.current, unifiedObject, echelle);
      }
      
      // Notifier le changement de propriété
      if (onPropertyChange) {
        onPropertyChange(unifiedObject, key, newValue);
      }
    });

    return unsubscribe;
  }, [unifiedObject, mode, echelle, syncFabricToUnified, onPropertyChange]);

  /**
   * Nettoyage
   */
  useEffect(() => {
    return () => {
      if (fabricObjectRef.current && canvas) {
        canvas.remove(fabricObjectRef.current);
      }
    };
  }, [canvas]);

  // Rendu selon le mode
  if (mode === '2d') {
    return render2D();
  } else if (mode === '3d') {
    return render3D();
  }

  return null;
});

UnifiedObjectRenderer.displayName = 'UnifiedObjectRenderer';

export default UnifiedObjectRenderer;
