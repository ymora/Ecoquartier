/**
 * Utilitaires géométriques pour le planificateur
 * Fonctions pures, réutilisables et testables
 */

/**
 * Calcule la distance entre deux points
 */
export const calculerDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Calcule la distance d'un point à un rectangle
 */
export const calculerDistanceRectangle = (px, py, rect) => {
  const rectLeft = rect.left;
  const rectTop = rect.top;
  const rectRight = rect.left + rect.getScaledWidth();
  const rectBottom = rect.top + rect.getScaledHeight();
  
  // Point à l'intérieur du rectangle
  if (px >= rectLeft && px <= rectRight && py >= rectTop && py <= rectBottom) {
    return 0;
  }
  
  // Trouver le point le plus proche sur le rectangle
  const closestX = Math.max(rectLeft, Math.min(px, rectRight));
  const closestY = Math.max(rectTop, Math.min(py, rectBottom));
  
  return calculerDistance(px, py, closestX, closestY);
};

/**
 * Trouve le point le plus proche d'un rectangle
 */
export const trouverPointPlusProcheRectangle = (px, py, rect) => {
  const rectLeft = rect.left;
  const rectTop = rect.top;
  const rectRight = rect.left + rect.getScaledWidth();
  const rectBottom = rect.top + rect.getScaledHeight();
  
  const closestX = Math.max(rectLeft, Math.min(px, rectRight));
  const closestY = Math.max(rectTop, Math.min(py, rectBottom));
  
  return { x: closestX, y: closestY };
};

/**
 * Calcule la distance d'un point à une ligne
 */
export const calculerDistanceLigne = (px, py, ligne) => {
  const x1 = ligne.x1 + ligne.left;
  const y1 = ligne.y1 + ligne.top;
  const x2 = ligne.x2 + ligne.left;
  const y2 = ligne.y2 + ligne.top;
  
  return distancePointSegment(px, py, x1, y1, x2, y2);
};

/**
 * Distance d'un point à un segment
 */
export const distancePointSegment = (px, py, x1, y1, x2, y2) => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
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
 * Trouve le point le plus proche d'une ligne
 */
export const trouverPointPlusProcheLigne = (px, py, ligne) => {
  const x1 = ligne.x1 + ligne.left;
  const y1 = ligne.y1 + ligne.top;
  const x2 = ligne.x2 + ligne.left;
  const y2 = ligne.y2 + ligne.top;
  
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
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
  
  return { x: xx, y: yy };
};

/**
 * Calcule l'angle entre deux points (en radians)
 */
export const calculerAngle = (x1, y1, x2, y2) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

/**
 * Vérifie si un point est à l'intérieur d'un rectangle
 */
export const pointDansRectangle = (px, py, rect) => {
  return px >= rect.left && 
         px <= rect.left + rect.getScaledWidth() &&
         py >= rect.top && 
         py <= rect.top + rect.getScaledHeight();
};

/**
 * Calcule l'aire d'un rectangle
 */
export const calculerAireRectangle = (largeur, hauteur) => {
  return largeur * hauteur;
};

/**
 * Calcule l'aire d'un cercle/ellipse
 */
export const calculerAireEllipse = (rayonX, rayonY) => {
  return Math.PI * rayonX * rayonY;
};

/**
 * Calcule la longueur d'une ligne
 */
export const calculerLongueurLigne = (x1, y1, x2, y2) => {
  return calculerDistance(x1, y1, x2, y2);
};

/**
 * Arrondit au mètre le plus proche
 */
export const arrondir = (valeur) => {
  return Math.round(valeur);
};

/**
 * Calcule le centre d'un rectangle
 */
export const calculerCentre = (rect) => {
  return {
    x: rect.left + rect.getScaledWidth() / 2,
    y: rect.top + rect.getScaledHeight() / 2
  };
};

/**
 * Vérifie si deux rectangles se chevauchent
 */
export const rectanglesChevauchent = (rect1, rect2) => {
  return !(rect1.left + rect1.getScaledWidth() < rect2.left ||
           rect2.left + rect2.getScaledWidth() < rect1.left ||
           rect1.top + rect1.getScaledHeight() < rect2.top ||
           rect2.top + rect2.getScaledHeight() < rect1.top);
};

/**
 * Crée un polygone pour une zone tampon autour d'une ligne
 */
export const creerZoneTamponLigne = (ligne, offset) => {
  const x1 = ligne.x1 + ligne.left;
  const y1 = ligne.y1 + ligne.top;
  const x2 = ligne.x2 + ligne.left;
  const y2 = ligne.y2 + ligne.top;
  
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const perpAngle = angle + Math.PI / 2;
  
  return [
    { x: x1 + Math.cos(perpAngle) * offset, y: y1 + Math.sin(perpAngle) * offset },
    { x: x2 + Math.cos(perpAngle) * offset, y: y2 + Math.sin(perpAngle) * offset },
    { x: x2 - Math.cos(perpAngle) * offset, y: y2 - Math.sin(perpAngle) * offset },
    { x: x1 - Math.cos(perpAngle) * offset, y: y1 - Math.sin(perpAngle) * offset }
  ];
};

/**
 * Projette un rectangle selon un angle et une distance (pour ombre)
 */
export const projetterRectangle = (rect, angle, distance) => {
  const mWidth = rect.getScaledWidth();
  const mHeight = rect.getScaledHeight();
  const mLeft = rect.left;
  const mTop = rect.top;
  
  // 4 coins du rectangle
  const coins = [
    { x: mLeft, y: mTop },
    { x: mLeft + mWidth, y: mTop },
    { x: mLeft + mWidth, y: mTop + mHeight },
    { x: mLeft, y: mTop + mHeight }
  ];
  
  // Projeter chaque coin
  const coinsProjectes = coins.map(coin => ({
    x: coin.x + Math.cos(angle) * distance,
    y: coin.y + Math.sin(angle) * distance
  }));
  
  return {
    original: coins,
    projetes: coinsProjectes
  };
};

