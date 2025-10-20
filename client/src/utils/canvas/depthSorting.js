/**
 * Gestion de l'ordre de rendu des objets selon leur profondeur
 * Les objets plus haut (top plus petit) doivent être rendus en arrière
 * Pour simuler une vue isométrique/perspective
 */

/**
 * Trier les objets du canvas par position Y (profondeur visuelle)
 * @param {fabric.Canvas} canvas - Le canvas Fabric.js
 */
export function trierObjetsParProfondeur(canvas) {
  if (!canvas) return;
  
  // Récupérer tous les objets (sauf les utilitaires)
  const objets = canvas.getObjects().filter(obj => 
    !obj.isOmbre &&
    !obj.isZoneContrainte &&
    !obj.alignmentGuide &&
    !obj.isLigneMesure &&
    !obj.isTroncIndicator &&
    !obj.isImageFond &&
    !obj.isConnectionIndicator &&
    !obj.isSnapIndicator &&
    !obj.isSoleilIndicator
  );
  
  // Trier par position Y (top)
  // Les objets avec top plus petit (plus haut visuellement) doivent être en arrière
  objets.sort((a, b) => {
    const topA = getTopPosition(a);
    const topB = getTopPosition(b);
    return topA - topB;
  });
  
  // Réorganiser dans le canvas
  // Utiliser sendObjectToBack de Fabric.js (méthode correcte)
  objets.forEach((obj) => {
    canvas.sendObjectToBack(obj);
  });
  
  // Maintenant les objets sont triés : le premier du tableau (top le plus petit) est en arrière
  // Les suivants se superposent progressivement
}

/**
 * Obtenir la position Y la plus haute d'un objet (en tenant compte de sa hauteur)
 * @param {fabric.Object} obj - L'objet
 * @returns {number} - Position Y du point le plus haut
 */
function getTopPosition(obj) {
  // Pour les groupes et objets complexes, utiliser le bounding box
  const bounds = obj.getBoundingRect();
  
  // Retourner le top (point le plus haut)
  // Plus le top est petit, plus l'objet est haut sur le canvas, donc plus il doit être en arrière
  return bounds.top;
}

/**
 * Obtenir la position Y la plus basse d'un objet (bas de l'objet)
 * @param {fabric.Object} obj - L'objet
 * @returns {number} - Position Y du point le plus bas
 */
function getBottomPosition(obj) {
  const bounds = obj.getBoundingRect();
  return bounds.top + bounds.height;
}

/**
 * Réorganiser automatiquement les objets après un déplacement
 * @param {fabric.Canvas} canvas - Le canvas
 */
export function autoSortOnMove(canvas) {
  if (!canvas) return;
  
  // Écouter les déplacements d'objets
  canvas.on('object:moved', () => {
    trierObjetsParProfondeur(canvas);
    canvas.renderAll();
  });
  
  // Écouter les ajouts d'objets
  canvas.on('object:added', () => {
    // Petit délai pour que l'objet soit bien positionné
    setTimeout(() => {
      trierObjetsParProfondeur(canvas);
      canvas.renderAll();
    }, 10);
  });
}

/**
 * Désactiver le tri automatique
 * @param {fabric.Canvas} canvas - Le canvas
 */
export function disableAutoSort(canvas) {
  if (!canvas) return;
  canvas.off('object:moved');
  canvas.off('object:added');
}

/**
 * Forcer le tri immédiat de tous les objets
 * À appeler après chargement d'un plan ou modifications massives
 * @param {fabric.Canvas} canvas - Le canvas
 */
export function forcerTriObjets(canvas) {
  trierObjetsParProfondeur(canvas);
  
  // S'assurer que l'image de fond reste en arrière
  const imageFond = canvas.getObjects().find(obj => obj.isImageFond);
  if (imageFond) {
    canvas.sendObjectToBack(imageFond);
  }
  
  // S'assurer que les zones de contraintes sont en arrière aussi
  const zonesContraintes = canvas.getObjects().filter(obj => obj.isZoneContrainte);
  zonesContraintes.forEach(zone => {
    canvas.sendObjectToBack(zone);
  });
  
  // Les ombres doivent être juste au-dessus des zones
  const ombres = canvas.getObjects().filter(obj => obj.isOmbre);
  ombres.forEach(ombre => {
    const proprietaire = canvas.getObjects().find(o => 
      o.customType === 'maison' || 
      o.customType === 'arbre-a-planter' || 
      o.customType === 'arbre-existant'
    );
    if (proprietaire) {
      const indexProprietaire = canvas.getObjects().indexOf(proprietaire);
      if (indexProprietaire > 0) {
        canvas.moveTo(ombre, indexProprietaire - 1);
      }
    }
  });
  
  canvas.renderAll();
}

