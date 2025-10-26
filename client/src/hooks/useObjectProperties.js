import { useCallback, useMemo } from 'react';
import { ECHELLE_PIXELS_PAR_METRE } from '../config/constants';

/**
 * Hook unifié pour gérer les propriétés d'objets 2D/3D
 * Applique les principes SOLID et les meilleures pratiques 2025
 */
export const useObjectProperties = () => {
  
  /**
   * Met à jour une propriété d'objet de manière unifiée
   * @param {Object} objet - L'objet à modifier
   * @param {string} propriete - Le nom de la propriété
   * @param {any} valeur - La nouvelle valeur
   * @param {Object} options - Options de mise à jour
   */
  const updateObjectProperty = useCallback((objet, propriete, valeur, options = {}) => {
    if (!objet) return;

    const { 
      canvas = null, 
      echelle = ECHELLE_PIXELS_PAR_METRE,
      onSync = null,
      onExport = null 
    } = options;

    // Conversion de la valeur en nombre si nécessaire
    const numValue = typeof valeur === 'object' && valeur?.target ? 
      parseFloat(valeur.target.value) : 
      parseFloat(valeur);

    if (isNaN(numValue)) return;

    // Gestion spécialisée selon le type de propriété
    switch (propriete) {
      case 'angle':
        return updateRotation(objet, numValue, canvas);
      
      case 'width':
      case 'height':
        return updateDimensions(objet, propriete, numValue, echelle, canvas);
      
      case 'largeur':
      case 'profondeur':
        return updateCustomDimensions(objet, propriete, numValue, echelle, canvas);
      
      case 'elevationSol':
        return updateElevation(objet, numValue, canvas);
      
      case 'hauteur':
        return updateHeight(objet, numValue, canvas);
      
      case 'diametre':
        return updateDiameter(objet, numValue, canvas);
      
      case 'typeToit':
        return updateRoofType(objet, valeur, canvas);
      
      default:
        return updateGenericProperty(objet, propriete, numValue, canvas);
    }
  }, []);

  /**
   * Met à jour la rotation d'un objet
   */
  const updateRotation = useCallback((objet, angle, canvas) => {
    objet.set({ angle });
    objet.rotate(angle);
    objet.setCoords();
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour les dimensions Fabric.js
   */
  const updateDimensions = useCallback((objet, propriete, valeur, echelle, canvas) => {
    const pixelValue = valeur * echelle;
    
    if (propriete === 'width') {
      const newScaleX = pixelValue / objet.width;
      objet.set({ scaleX: newScaleX });
    } else {
      const newScaleY = pixelValue / objet.height;
      objet.set({ scaleY: newScaleY });
    }
    
    // Mettre à jour l'icône si c'est un groupe
    updateGroupIcon(objet, echelle);
    objet.setCoords();
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour les dimensions personnalisées (largeur, profondeur)
   */
  const updateCustomDimensions = useCallback((objet, propriete, valeur, echelle, canvas) => {
    const pixelValue = valeur * echelle;
    
    // Mettre à jour la propriété personnalisée
    objet.set({ [propriete]: valeur });
    
    // Calculer les nouveaux scaleX/scaleY
    const currentWidth = objet.getScaledWidth ? objet.getScaledWidth() : objet.width;
    const currentHeight = objet.getScaledHeight ? objet.getScaledHeight() : objet.height;
    
    let scaleX = objet.scaleX || 1;
    let scaleY = objet.scaleY || 1;
    
    if (propriete === 'largeur') {
      scaleX = pixelValue / objet.width;
    } else if (propriete === 'profondeur') {
      scaleY = pixelValue / objet.height;
    }
    
    objet.set({ scaleX, scaleY });
    
    // Mettre à jour l'icône si c'est un groupe
    updateGroupIcon(objet, echelle);
    objet.setCoords();
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour l'élévation d'un objet
   */
  const updateElevation = useCallback((objet, valeur, canvas) => {
    objet.set({ elevationSol: valeur });
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour la hauteur d'un objet
   */
  const updateHeight = useCallback((objet, valeur, canvas) => {
    objet.set({ hauteur: valeur });
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour le diamètre d'un objet
   */
  const updateDiameter = useCallback((objet, valeur, canvas) => {
    objet.set({ diametre: valeur });
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour le type de toit
   */
  const updateRoofType = useCallback((objet, valeur, canvas) => {
    objet.set({ typeToit: valeur });
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour une propriété générique
   */
  const updateGenericProperty = useCallback((objet, propriete, valeur, canvas) => {
    objet.set({ [propriete]: valeur });
    canvas?.requestRenderAll();
  }, []);

  /**
   * Met à jour l'icône d'un groupe Fabric.js
   */
  const updateGroupIcon = useCallback((objet, echelle) => {
    if (objet._objects && objet._objects.length > 1) {
      const icone = objet._objects[1];
      if (icone && icone.fontSize !== undefined) {
        const nouvelleLargeur = objet.getScaledWidth ? objet.getScaledWidth() : objet.width;
        const nouvelleProfondeur = objet.getScaledHeight ? objet.getScaledHeight() : objet.height;
        const nouvelleTailleIcone = Math.min(nouvelleLargeur, nouvelleProfondeur) * 0.4;
        icone.set({ fontSize: Math.max(nouvelleTailleIcone, 24) });
      }
    }
  }, []);

  /**
   * Obtient la valeur d'une propriété d'objet
   */
  const getObjectProperty = useCallback((objet, propriete, echelle = ECHELLE_PIXELS_PAR_METRE) => {
    if (!objet) return 0;

    switch (propriete) {
      case 'width':
        return ((objet.getScaledWidth ? objet.getScaledWidth() : objet.width) / echelle).toFixed(2);
      case 'height':
        return ((objet.getScaledHeight ? objet.getScaledHeight() : objet.height) / echelle).toFixed(2);
      case 'angle':
        return Math.round(objet.angle || 0).toString();
      case 'elevationSol':
        return (objet.elevationSol || 0).toString();
      case 'hauteur':
        return (objet.hauteur || 0).toString();
      case 'diametre':
        return (objet.diametre || 0).toString();
      case 'largeur':
        return (objet.largeur || 0).toString();
      case 'profondeur':
        return (objet.profondeur || 0).toString();
      case 'typeToit':
        return objet.typeToit || 'deux-pentes';
      default:
        return (objet[propriete] || 0).toString();
    }
  }, []);

  /**
   * Valide une valeur selon les contraintes
   */
  const validateValue = useCallback((valeur, min, max, step = 0.1) => {
    const numValue = parseFloat(valeur);
    if (isNaN(numValue)) return min;
    
    const clampedValue = Math.max(min, Math.min(max, numValue));
    return Math.round(clampedValue / step) * step;
  }, []);

  /**
   * Crée un gestionnaire de changement de propriété
   */
  const createPropertyHandler = useCallback((objet, propriete, options = {}) => {
    return (e) => {
      const valeur = typeof e === 'object' && e.target ? e.target.value : e;
      updateObjectProperty(objet, propriete, valeur, options);
    };
  }, [updateObjectProperty]);

  return {
    updateObjectProperty,
    getObjectProperty,
    validateValue,
    createPropertyHandler,
    updateRotation,
    updateDimensions,
    updateCustomDimensions,
    updateElevation,
    updateHeight,
    updateDiameter,
    updateRoofType
  };
};

export default useObjectProperties;
