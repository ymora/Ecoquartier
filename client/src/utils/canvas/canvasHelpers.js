/**
 * canvasHelpers.js
 * ✅ Fonctions utilitaires pour le canvas (nettoyage, etc.)
 * Créé pour factoriser le code dupliqué
 */

import { canvasOperations } from './canvasOperations';
import logger from '../logger';

/**
 * Nettoyer le canvas de tous les objets (sauf éléments UI)
 * ✅ FONCTION UNIFIÉE utilisée par tous les chargeurs de plan
 * 
 * @param {fabric.Canvas} canvas - Canvas à nettoyer
 * @returns {number} Nombre d'objets supprimés
 */
export const nettoyerCanvas = (canvas) => {
  if (!canvas) return 0;
  
  // Filtrer pour garder uniquement les éléments d'interface
  const objetsASupprimer = canvas.getObjects().filter(obj => 
    !obj.isGridLine &&       // Grille
    !obj.measureLabel &&     // Labels de mesure
    !obj.isBoussole &&       // Boussole
    !obj.isSolIndicator &&   // Indicateur sud
    !obj.alignmentGuide &&   // Guides d'alignement
    !obj.isDimensionBox &&   // Boîtes de dimensions
    !obj.isAideButton &&     // Boutons d'aide
    !obj.isImageFond &&      // Image de fond
    !obj.isCenterMark &&     // Marque centrale
    !obj.isNoeudMaillage &&  // Nœuds du maillage terrain
    !obj.isLigneMaillage &&  // Lignes du maillage terrain
    !obj.isLabelMaillage     // Labels du maillage terrain
    // ✅ TOUT LE RESTE est supprimé (maisons, arbres, terrain, etc.)
  );
  
  // Supprimer tous les objets
  let terrainSupprime = false;
  objetsASupprimer.forEach(obj => {
    if (obj.customType === 'sol') {
      terrainSupprime = true;
    }
    canvasOperations.supprimer(canvas, obj);
  });
  
  if (terrainSupprime) {
    logger.info('Canvas', '🗑️ Ancien terrain supprimé');
  }
  
  logger.info('Canvas', `🧹 ${objetsASupprimer.length} objet(s) supprimé(s)`);
  
  return objetsASupprimer.length;
};
