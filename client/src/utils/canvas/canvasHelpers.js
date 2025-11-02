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

/**
 * Calculer la distance entre un point et un rectangle
 * @param {number} pointX - Coordonnée X du point
 * @param {number} pointY - Coordonnée Y du point
 * @param {Object} rect - Rectangle avec left, top, width, height
 * @returns {number} Distance en pixels
 */
export const calculerDistanceRectangle = (pointX, pointY, rect) => {
  // Centre du rectangle
  const centreX = rect.left;
  const centreY = rect.top;
  
  // Demi-dimensions
  const demiLargeur = (rect.getScaledWidth ? rect.getScaledWidth() : rect.width) / 2;
  const demiHauteur = (rect.getScaledHeight ? rect.getScaledHeight() : rect.height) / 2;
  
  // Point le plus proche sur le rectangle
  const closestX = Math.max(centreX - demiLargeur, Math.min(pointX, centreX + demiLargeur));
  const closestY = Math.max(centreY - demiHauteur, Math.min(pointY, centreY + demiHauteur));
  
  // Distance euclidienne
  const dx = pointX - closestX;
  const dy = pointY - closestY;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculer la distance entre un point et une ligne
 * @param {number} pointX - Coordonnée X du point
 * @param {number} pointY - Coordonnée Y du point
 * @param {Object} ligne - Ligne avec x1, y1, x2, y2
 * @returns {number} Distance en pixels
 */
export const calculerDistanceLigne = (pointX, pointY, ligne) => {
  const x1 = ligne.x1 + ligne.left;
  const y1 = ligne.y1 + ligne.top;
  const x2 = ligne.x2 + ligne.left;
  const y2 = ligne.y2 + ligne.top;
  
  const A = pointX - x1;
  const B = pointY - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) param = dot / lenSq;
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = pointX - xx;
  const dy = pointY - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculer la distance entre un point et un cercle
 * @param {number} pointX - Coordonnée X du point
 * @param {number} pointY - Coordonnée Y du point
 * @param {Object} cercle - Cercle avec left, top, radius ou diametre
 * @returns {number} Distance en pixels
 */
export const calculerDistanceCercle = (pointX, pointY, cercle) => {
  const centreX = cercle.left;
  const centreY = cercle.top;
  
  // Distance au centre
  const dx = pointX - centreX;
  const dy = pointY - centreY;
  const distCentre = Math.sqrt(dx * dx + dy * dy);
  
  // Rayon du cercle
  const rayon = cercle.radius || (cercle.diametre / 2) || 0;
  
  // Distance au bord = distance au centre - rayon
  return Math.max(0, distCentre - rayon);
};
