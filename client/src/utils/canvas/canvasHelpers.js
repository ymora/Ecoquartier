/**
 * canvasHelpers.js
 * Fonctions utilitaires géométriques pour le canvas
 */

/**
 * Calculer la distance entre un point et un rectangle
 * Prend en compte originX/Y: 'center'
 */
export const calculerDistanceRectangle = (px, py, rect) => {
  const rw = rect.getScaledWidth();
  const rh = rect.getScaledHeight();
  
  // Si l'objet est centré (originX/Y: 'center'), left/top = centre
  const isCentered = rect.originX === 'center' || rect.originY === 'center';
  const rx = isCentered ? rect.left - rw / 2 : rect.left;
  const ry = isCentered ? rect.top - rh / 2 : rect.top;
  
  const dx = Math.max(rx - px, 0, px - (rx + rw));
  const dy = Math.max(ry - py, 0, py - (ry + rh));
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculer la distance entre un point et un cercle (depuis le BORD)
 */
export const calculerDistanceCercle = (px, py, cercleGroup) => {
  // Le cercleGroup est un Group, trouver le cercle à l'intérieur
  const cercle = cercleGroup._objects ? cercleGroup._objects[0] : cercleGroup;
  
  // Centre du cercle (le group utilise originX/Y: center)
  const cx = cercleGroup.left;
  const cy = cercleGroup.top;
  
  // Rayon du cercle
  const rayon = cercle.radius || (cercleGroup.diametre / 2) * 40; // echelle 40 par défaut
  
  // Distance centre à centre
  const distCentre = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
  
  // Distance depuis le BORD du cercle
  return Math.max(0, distCentre - rayon);
};

/**
 * Calculer la distance entre un point et une ligne
 */
export const calculerDistanceLigne = (px, py, ligneOuGroup) => {
  let x1, y1, x2, y2;
  
  // Si c'est un Group (clôtures du plan démo avec x1, y1, x2, y2 au niveau du group)
  if (ligneOuGroup._objects && ligneOuGroup.x1 !== undefined) {
    x1 = ligneOuGroup.x1;
    y1 = ligneOuGroup.y1;
    x2 = ligneOuGroup.x2;
    y2 = ligneOuGroup.y2;
  } else {
    // Ligne simple ou autre objet
    x1 = (ligneOuGroup.x1 || 0) + ligneOuGroup.left;
    y1 = (ligneOuGroup.y1 || 0) + ligneOuGroup.top;
    x2 = (ligneOuGroup.x2 || 0) + ligneOuGroup.left;
    y2 = (ligneOuGroup.y2 || 0) + ligneOuGroup.top;
  }
  
  const A = px - x1;
  const B = py - y1;
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
  
  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Trouver le point le plus proche sur un rectangle
 * Prend en compte originX/Y: 'center'
 */
export const trouverPointPlusProcheMaison = (px, py, rect) => {
  const rw = rect.getScaledWidth();
  const rh = rect.getScaledHeight();
  
  // Si l'objet est centré (originX/Y: 'center'), left/top = centre
  const isCentered = rect.originX === 'center' || rect.originY === 'center';
  const rx = isCentered ? rect.left - rw / 2 : rect.left;
  const ry = isCentered ? rect.top - rh / 2 : rect.top;
  
  const closestX = Math.max(rx, Math.min(px, rx + rw));
  const closestY = Math.max(ry, Math.min(py, ry + rh));
  
  return { x: closestX, y: closestY };
};

/**
 * Trouver le point le plus proche sur une ligne
 */
export const trouverPointPlusProcheLigne = (px, py, ligneOuGroup) => {
  let x1, y1, x2, y2;
  
  // Si c'est un Group (clôtures du plan démo)
  if (ligneOuGroup._objects && ligneOuGroup.x1 !== undefined) {
    x1 = ligneOuGroup.x1;
    y1 = ligneOuGroup.y1;
    x2 = ligneOuGroup.x2;
    y2 = ligneOuGroup.y2;
  } else {
    // Ligne simple
    x1 = (ligneOuGroup.x1 || 0) + ligneOuGroup.left;
    y1 = (ligneOuGroup.y1 || 0) + ligneOuGroup.top;
    x2 = (ligneOuGroup.x2 || 0) + ligneOuGroup.left;
    y2 = (ligneOuGroup.y2 || 0) + ligneOuGroup.top;
  }
  
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = lenSq !== 0 ? dot / lenSq : -1;
  
  param = Math.max(0, Math.min(1, param));
  
  return {
    x: x1 + param * C,
    y: y1 + param * D
  };
};

/**
 * Calculer la distance entre deux points
 */
export const calculerDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculer les dimensions d'un terrain en mètres
 */
export const calculerDimensionsTerrain = (canvas, echelle) => {
  const largeurM = (canvas.width / echelle).toFixed(1);
  const hauteurM = (canvas.height / echelle).toFixed(1);
  return { largeurM, hauteurM };
};

/**
 * Projeter un rectangle pour les calculs de distance 3D
 */
export const projetterRectangle = (rect, profondeur, echelle) => {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.getScaledWidth(),
    height: rect.getScaledHeight(),
    profondeur: profondeur,
    echelleM: echelle
  };
};

/**
 * Convertir pixels en mètres
 */
export const pxVersMetre = (px, echelle) => px / echelle;

/**
 * Convertir mètres en pixels
 */
export const metreVersPx = (m, echelle) => m * echelle;

