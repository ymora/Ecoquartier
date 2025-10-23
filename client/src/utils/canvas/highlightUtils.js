/**
 * highlightUtils.js
 * ✅ Fonctions unifiées pour mettre en évidence visuellement les objets
 * Support des objets simples et groupes Fabric.js
 */

/**
 * Fonction générique pour mettre en évidence un objet
 * @param {fabric.Object} obj - Objet Fabric.js à mettre en évidence
 * @param {Object} options - Options de mise en évidence
 * @param {string} options.color - Couleur du contour (ex: '#f44336' pour rouge, '#4caf50' pour vert)
 * @param {number} options.width - Largeur du contour
 * @param {string} options.saveKey - Clé pour sauvegarder l'état (ex: '__hoverStroke', '__selectedStroke')
 * @param {fabric.Canvas} canvas - Instance du canvas pour renderAll()
 */
export const highlightObject = (obj, options = {}) => {
  if (!obj) return;
  
  const {
    color = '#f44336',
    width = 5,
    saveKey = '__hoverStroke',
    canvas = null
  } = options;
  
  const applyHighlight = (targetObj) => {
    if (!targetObj.stroke) return;
    
    // Sauvegarder l'état actuel
    targetObj[`${saveKey}`] = targetObj.stroke;
    targetObj[`${saveKey}Width`] = targetObj.strokeWidth;
    targetObj[`${saveKey}DashArray`] = targetObj.strokeDashArray;
    
    // Appliquer le nouveau style
    targetObj.set({ 
      strokeWidth: width, 
      stroke: color, 
      strokeDashArray: null 
    });
  };
  
  // Gérer les groupes Fabric.js
  if (obj._objects && obj._objects.length > 0) {
    obj._objects.forEach(subObj => applyHighlight(subObj));
  } else {
    applyHighlight(obj);
  }
  
  if (canvas) canvas.renderAll();
};

/**
 * Fonction générique pour retirer la mise en évidence
 * @param {fabric.Object} obj - Objet Fabric.js
 * @param {string} saveKey - Clé utilisée pour sauvegarder l'état
 * @param {fabric.Canvas} canvas - Instance du canvas pour renderAll()
 */
export const unhighlightObject = (obj, saveKey = '__hoverStroke', canvas = null) => {
  if (!obj) return;
  
  const restoreHighlight = (targetObj) => {
    if (!targetObj.stroke || !targetObj[saveKey]) return;
    
    targetObj.set({ 
      strokeWidth: targetObj[`${saveKey}Width`] || 3, 
      stroke: targetObj[saveKey],
      strokeDashArray: targetObj[`${saveKey}DashArray`]
    });
  };
  
  // Gérer les groupes Fabric.js
  if (obj._objects && obj._objects.length > 0) {
    obj._objects.forEach(subObj => restoreHighlight(subObj));
  } else {
    restoreHighlight(obj);
  }
  
  if (canvas) canvas.renderAll();
};

/**
 * Fonction de highlight pour hover (rouge)
 */
export const highlightHover = (obj, canvas) => {
  highlightObject(obj, { 
    color: '#f44336', 
    width: 5, 
    saveKey: '__hoverStroke',
    canvas 
  });
};

/**
 * Fonction de unhighlight pour hover (rouge)
 */
export const unhighlightHover = (obj, canvas) => {
  unhighlightObject(obj, '__hoverStroke', canvas);
};

/**
 * Fonction de highlight pour sélection (vert)
 */
export const highlightSelection = (obj, canvas) => {
  highlightObject(obj, { 
    color: '#4caf50', 
    width: 6, 
    saveKey: '__selectedStroke',
    canvas 
  });
};

/**
 * Fonction de unhighlight pour sélection (vert)
 */
export const unhighlightSelection = (obj, canvas) => {
  unhighlightObject(obj, '__selectedStroke', canvas);
};

