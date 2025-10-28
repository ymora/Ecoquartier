/**
 * Utilitaires centralisés pour les opérations canvas
 * Évite la duplication de code dans toutes les fonctions canvas
 */

/**
 * Opérations canvas standardisées
 */
export const canvasOperations = {
  /**
   * Ajouter un objet au canvas avec rendu
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object} objet - Objet à ajouter
   * @param {boolean} render - Si true, déclenche le rendu
   */
  ajouter: (canvas, objet, render = true) => {
    if (!canvas || !objet) return;
    canvas.add(objet);
    if (render) canvas.renderAll();
  },

  /**
   * Supprimer un objet du canvas avec rendu
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object} objet - Objet à supprimer
   * @param {boolean} render - Si true, déclenche le rendu
   */
  supprimer: (canvas, objet, render = true) => {
    if (!canvas || !objet) return;
    canvas.remove(objet);
    if (render) canvas.renderAll();
  },

  /**
   * Supprimer plusieurs objets du canvas avec rendu
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object[]} objets - Objets à supprimer
   * @param {boolean} render - Si true, déclenche le rendu
   */
  supprimerMultiples: (canvas, objets, render = true) => {
    if (!canvas || !objets) return;
    objets.forEach(objet => canvas.remove(objet));
    if (render) canvas.renderAll();
  },

  /**
   * Sélectionner un objet avec rendu
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object} objet - Objet à sélectionner
   * @param {boolean} render - Si true, déclenche le rendu
   */
  selectionner: (canvas, objet, render = true) => {
    if (!canvas || !objet) return;
    canvas.setActiveObject(objet);
    if (render) canvas.renderAll();
  },

  /**
   * Désélectionner tous les objets avec rendu
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {boolean} render - Si true, déclenche le rendu
   */
  deselectionner: (canvas, render = true) => {
    if (!canvas) return;
    canvas.discardActiveObject();
    if (render) canvas.renderAll();
  },

  /**
   * Forcer le rendu du canvas
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   */
  rendre: (canvas) => {
    if (!canvas) return;
    canvas.renderAll();
  },

  /**
   * Nettoyer le canvas en gardant seulement les éléments d'interface
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {boolean} render - Si true, déclenche le rendu
   */
  nettoyer: (canvas, render = true) => {
    if (!canvas) return;
    
    const objets = canvas.getObjects().filter(obj => 
      !obj.isGridLine && 
      !obj.measureLabel && 
      !obj.isBoussole && 
      !obj.isSolIndicator &&
      !obj.alignmentGuide &&
      !obj.isDimensionBox &&
      !obj.isAideButton &&
      !obj.isImageFond &&
      !obj.isCenterMark
    );
    
    canvasOperations.supprimerMultiples(canvas, objets, render);
  }
};

/**
 * Filtres d'objets standardisés
 */
export const filtresObjets = {
  /**
   * Objets d'interface (à conserver lors du nettoyage)
   */
  interface: (obj) => 
    obj.isGridLine || 
    obj.measureLabel || 
    obj.isBoussole || 
    obj.isSolIndicator ||
    obj.alignmentGuide ||
    obj.isDimensionBox ||
    obj.isAideButton ||
    obj.isImageFond ||
    obj.isCenterMark,

  /**
   * Objets métier (maisons, arbres, etc.)
   */
  metier: (obj) => 
    obj.customType && 
    !filtresObjets.interface(obj),

  /**
   * Objets sélectionnables
   */
  selectionnables: (obj) => 
    obj.selectable && 
    obj.evented && 
    !filtresObjets.interface(obj)
};

/**
 * Opérations de positionnement standardisées
 */
export const positionnement = {
  /**
   * Centrer un objet sur le canvas
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object} objet - Objet à centrer
   */
  centrer: (canvas, objet) => {
    if (!canvas || !objet) return;
    objet.set({
      left: canvas.width / 2,
      top: canvas.height / 2
    });
  },

  /**
   * Positionner un objet au centre de la vue actuelle
   * @param {fabric.Canvas} canvas - Canvas Fabric.js
   * @param {fabric.Object} objet - Objet à positionner
   */
  centrerVue: (canvas, objet) => {
    if (!canvas || !objet) return;
    const vpt = canvas.viewportTransform;
    const centerX = (canvas.width / 2 - vpt[4]) / vpt[0];
    const centerY = (canvas.height / 2 - vpt[5]) / vpt[3];
    
    objet.set({
      left: centerX,
      top: centerY
    });
  },

  /**
   * Appliquer un décalage à un objet
   * @param {fabric.Object} objet - Objet à décaler
   * @param {number} deltaX - Décalage horizontal
   * @param {number} deltaY - Décalage vertical
   */
  decaler: (objet, deltaX, deltaY) => {
    if (!objet) return;
    objet.set({
      left: objet.left + deltaX,
      top: objet.top + deltaY
    });
  }
};

/**
 * Opérations de validation standardisées
 */
export const validation = {
  /**
   * Vérifier si un objet est valide
   * @param {fabric.Object} objet - Objet à valider
   * @returns {boolean} - True si l'objet est valide
   */
  estValide: (objet) => {
    return objet && 
           objet.customType && 
           typeof objet.left === 'number' && 
           typeof objet.top === 'number';
  },

  /**
   * Vérifier si un canvas est valide
   * @param {fabric.Canvas} canvas - Canvas à valider
   * @returns {boolean} - True si le canvas est valide
   */
  canvasValide: (canvas) => {
    return canvas && 
           typeof canvas.add === 'function' && 
           typeof canvas.remove === 'function';
  }
};
