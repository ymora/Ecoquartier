/**
 * canvasHelpers.js
 * Fonctions utilitaires géométriques pour le canvas
 */

import logger from '../logger';

/**
 * Calculer la distance entre un point et un rectangle
 */
export const calculerDistanceRectangle = (px, py, rect) => {
  const rx = rect.left;
  const ry = rect.top;
  const rw = rect.getScaledWidth();
  const rh = rect.getScaledHeight();
  
  const dx = Math.max(rx - px, 0, px - (rx + rw));
  const dy = Math.max(ry - py, 0, py - (ry + rh));
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculer la distance entre un point et une ligne
 */
export const calculerDistanceLigne = (px, py, ligne) => {
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
 */
export const trouverPointPlusProcheMaison = (px, py, rect) => {
  const rx = rect.left;
  const ry = rect.top;
  const rw = rect.getScaledWidth();
  const rh = rect.getScaledHeight();
  
  const closestX = Math.max(rx, Math.min(px, rx + rw));
  const closestY = Math.max(ry, Math.min(py, ry + rh));
  
  return { x: closestX, y: closestY };
};

/**
 * Trouver le point le plus proche sur une ligne
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

