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
  
  // Trier par zIndex d'abord, puis par position Y (top)
  // Le terrain doit toujours rester en arrière-plan (zIndex négatif)
  objets.sort((a, b) => {
    const zIndexA = a.zIndex || 0;
    const zIndexB = b.zIndex || 0;
    
    // Si zIndex différent, trier par zIndex (terrain = -1000 en premier)
    if (zIndexA !== zIndexB) {
      return zIndexA - zIndexB;
    }
    
    // Si même zIndex, trier par position Y (top)
    const topA = getTopPosition(a);
    const topB = getTopPosition(b);
    
    // Si les positions sont très proches (moins de 5px), utiliser l'ordre d'ajout
    if (Math.abs(topA - topB) < 5) {
      return a._id - b._id;
    }
    
    return topA - topB;
  });
  
  // Réorganiser dans le canvas selon le tri
  // Le terrain (zIndex = -1000) doit toujours être en arrière-plan
  objets.forEach((obj) => {
    if (obj.zIndex === -1000) {
      // Terrain : toujours en arrière-plan
      canvas.sendObjectToBack(obj);
    } else {
      // Autres objets : position selon leur ordre dans le tableau trié
      canvas.bringObjectToFront(obj);
    }
  });
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

// Les fonctions autoSortOnMove et disableAutoSort ont été supprimées
// Le tri est géré manuellement dans useCanvasEvents pour éviter les doubles renderAll()

/**
 * Forcer le terrain à rester en arrière-plan
 * @param {fabric.Canvas} canvas - Le canvas Fabric.js
 */
export function forcerTerrainEnArrierePlan(canvas) {
  if (!canvas) return;
  
  const terrain = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (terrain) {
    // ✅ FORCER LE TERRAIN AU FOND avec sendObjectToBack
    canvas.sendObjectToBack(terrain);
    
    // ✅ S'assurer que l'image de fond reste encore plus en arrière
    const imageFond = canvas.getObjects().find(obj => obj.isImageFond);
    if (imageFond) {
      canvas.sendObjectToBack(imageFond);
    }
    
    // ✅ S'assurer que les zones de contraintes sont en arrière aussi
    const zonesContraintes = canvas.getObjects().filter(obj => obj.isZoneContrainte);
    zonesContraintes.forEach(zone => {
      canvas.sendObjectToBack(zone);
    });
    
    // ✅ Les ombres doivent être juste au-dessus des zones
    const ombres = canvas.getObjects().filter(obj => obj.isOmbre);
    ombres.forEach(ombre => {
      canvas.sendObjectToBack(ombre);
    });
    
    // ✅ Rendre le terrain visible mais en arrière-plan
    terrain.set({
      opacity: 0.7, // Légèrement transparent pour voir les objets au-dessus
      selectable: true, // Reste sélectionnable
      evented: true
    });
    
    // ✅ S'assurer que même si le terrain est sélectionné, il reste au fond
    // Cela évite qu'il passe au premier plan quand on clique dessus
    if (canvas.getActiveObject() === terrain) {
      // Le terrain est sélectionné mais on le force quand même au fond
      canvas.sendObjectToBack(terrain);
    }
  }
}

/**
 * Forcer le tri immédiat de tous les objets
 * À appeler après chargement d'un plan ou modifications massives
 * @param {fabric.Canvas} canvas - Le canvas
 */
export function forcerTriObjets(canvas) {
  // D'abord, forcer le terrain en arrière-plan
  forcerTerrainEnArrierePlan(canvas);
  
  // Ensuite, trier les autres objets
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
    canvas.sendObjectToBack(ombre);
  });
  
  // Note: renderAll() n'est PAS appelé ici pour éviter les doubles appels
  // L'appelant doit faire renderAll() après
}

