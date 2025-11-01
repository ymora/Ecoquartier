/**
 * terrainMaillage.js
 * ✅ Gestion du maillage d'élévation du terrain
 * Permet de créer un terrain non uniforme avec des points de contrôle
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Afficher la grille de contrôle du maillage sur le terrain
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {fabric.Object} terrain - Objet terrain
 * @param {number} echelle - Échelle du plan
 */
export const afficherGrilleMaillage = (canvas, terrain, echelle) => {
  if (!canvas || !terrain || !terrain.maillageElevation) return;
  
  // Supprimer l'ancienne grille si elle existe
  masquerGrilleMaillage(canvas);
  
  const largeurM = terrain.width / echelle;
  const hauteurM = terrain.height / echelle;
  const tailleMailleM = terrain.tailleMailleM || 5;
  const tailleMaillePixels = tailleMailleM * echelle;
  
  const nbNoeudsX = Math.floor(largeurM / tailleMailleM) + 1;
  const nbNoeudsZ = Math.floor(hauteurM / tailleMailleM) + 1;
  
  const startX = terrain.left;
  const startY = terrain.top;
  
  // Créer les lignes de grille horizontales
  for (let i = 0; i < nbNoeudsZ; i++) {
    const y = startY + i * tailleMaillePixels;
    const line = new fabric.Line([startX, y, startX + terrain.width, y], {
      stroke: '#1976d2',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      isGrilleMaillage: true,
      excludeFromExport: true
    });
    canvas.add(line);
  }
  
  // Créer les lignes de grille verticales
  for (let j = 0; j < nbNoeudsX; j++) {
    const x = startX + j * tailleMaillePixels;
    const line = new fabric.Line([x, startY, x, startY + terrain.height], {
      stroke: '#1976d2',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      isGrilleMaillage: true,
      excludeFromExport: true
    });
    canvas.add(line);
  }
  
  // Créer les points de contrôle (nœuds)
  for (let i = 0; i < nbNoeudsZ; i++) {
    for (let j = 0; j < nbNoeudsX; j++) {
      const x = startX + j * tailleMaillePixels;
      const y = startY + i * tailleMaillePixels;
      const elevation = terrain.maillageElevation[i][j];
      
      // Point de contrôle
      const point = new fabric.Circle({
        left: x,
        top: y,
        radius: 8,
        fill: elevation === 0 ? '#2196f3' : (elevation > 0 ? '#4caf50' : '#f44336'),
        stroke: '#ffffff',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        selectable: false, // ✅ Ne pas pouvoir sélectionner le nœud (évite confusion)
        evented: true,
        hasBorders: false,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'pointer',
        isNoeudMaillage: true,
        noeudI: i,
        noeudJ: j,
        excludeFromExport: true
      });
      
      // ✅ Ajouter un gestionnaire de clic pour éditer l'élévation
      point.on('mousedown', (e) => {
        e.stopPropagation();
        // Clic gauche = augmenter, Shift+Clic = diminuer
        const increment = e.e.shiftKey ? -0.1 : 0.1; // 10 cm à la fois
        modifierElevationNoeud(canvas, terrain, i, j, elevation + increment, echelle);
      });
      
      // Label d'élévation
      const label = new fabric.Text(elevation.toFixed(2) + 'm', {
        left: x,
        top: y + 12,
        fontSize: 10,
        fill: '#1976d2',
        originX: 'center',
        originY: 'top',
        selectable: false,
        evented: false,
        isGrilleMaillage: true,
        excludeFromExport: true
      });
      
      canvas.add(point);
      canvas.add(label);
    }
  }
  
  // Mettre le terrain en arrière-plan
  canvas.sendObjectToBack(terrain);
  canvas.renderAll();
  
  logger.info('Terrain', `✅ Grille de maillage affichée (${nbNoeudsX}×${nbNoeudsZ} nœuds)`);
};

/**
 * Masquer la grille de contrôle du maillage
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 */
export const masquerGrilleMaillage = (canvas) => {
  if (!canvas) return;
  
  const objetsGrille = canvas.getObjects().filter(obj => 
    obj.isGrilleMaillage || obj.isNoeudMaillage
  );
  
  objetsGrille.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  
  if (objetsGrille.length > 0) {
    logger.info('Terrain', `✅ Grille de maillage masquée (${objetsGrille.length} éléments)`);
  }
};

/**
 * Modifier l'élévation d'un nœud du maillage
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {fabric.Object} terrain - Objet terrain
 * @param {number} noeudI - Index du nœud en Z
 * @param {number} noeudJ - Index du nœud en X
 * @param {number} nouvelleElevation - Nouvelle élévation en mètres
 * @param {number} echelle - Échelle du plan
 */
export const modifierElevationNoeud = (canvas, terrain, noeudI, noeudJ, nouvelleElevation, echelle) => {
  if (!terrain || !terrain.maillageElevation) return;
  
  // Mettre à jour le maillage
  terrain.maillageElevation[noeudI][noeudJ] = nouvelleElevation;
  
  // Mettre à jour l'affichage
  afficherGrilleMaillage(canvas, terrain, echelle);
  
  logger.info('Terrain', `✅ Élévation nœud [${noeudI}][${noeudJ}] = ${nouvelleElevation.toFixed(2)}m`);
};

/**
 * Obtenir l'élévation interpolée à une position donnée
 * @param {fabric.Object} terrain - Objet terrain
 * @param {number} posXm - Position X en mètres (relative au centre du terrain)
 * @param {number} posZm - Position Z en mètres (relative au centre du terrain)
 * @param {number} echelle - Échelle du plan
 * @returns {number} Élévation interpolée en mètres
 */
export const obtenirElevationInterpolee = (terrain, posXm, posZm, echelle) => {
  if (!terrain || !terrain.maillageElevation) return 0;
  
  const largeurM = terrain.width / echelle;
  const hauteurM = terrain.height / echelle;
  const tailleMailleM = terrain.tailleMailleM || 5;
  
  // Convertir position relative au terrain (origine au coin supérieur gauche)
  const localX = posXm + largeurM / 2;
  const localZ = posZm + hauteurM / 2;
  
  // Trouver les indices des nœuds environnants
  const i = Math.floor(localZ / tailleMailleM);
  const j = Math.floor(localX / tailleMailleM);
  
  const nbNoeudsZ = terrain.maillageElevation.length;
  const nbNoeudsX = terrain.maillageElevation[0]?.length || 0;
  
  // Vérifier les limites
  if (i < 0 || i >= nbNoeudsZ - 1 || j < 0 || j >= nbNoeudsX - 1) {
    // Hors limites, retourner l'élévation du nœud le plus proche
    const iClamped = Math.max(0, Math.min(i, nbNoeudsZ - 1));
    const jClamped = Math.max(0, Math.min(j, nbNoeudsX - 1));
    return terrain.maillageElevation[iClamped][jClamped];
  }
  
  // Interpolation bilinéaire entre les 4 nœuds environnants
  const fx = (localX - j * tailleMailleM) / tailleMailleM;
  const fz = (localZ - i * tailleMailleM) / tailleMailleM;
  
  const e00 = terrain.maillageElevation[i][j];
  const e10 = terrain.maillageElevation[i][j + 1];
  const e01 = terrain.maillageElevation[i + 1][j];
  const e11 = terrain.maillageElevation[i + 1][j + 1];
  
  const e0 = e00 * (1 - fx) + e10 * fx;
  const e1 = e01 * (1 - fx) + e11 * fx;
  
  return e0 * (1 - fz) + e1 * fz;
};

