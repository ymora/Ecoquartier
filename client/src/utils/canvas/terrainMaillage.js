/**
 * terrainMaillage.js
 * ✅ Gestion du maillage d'élévation du terrain
 * Permet de créer un terrain non uniforme avec des points de contrôle
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Afficher la grille de contrôle du maillage sur le terrain
 * ✅ Chaque carré/cellule est cliquable pour régler son élévation
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
  
  const nbCellulesX = Math.floor(largeurM / tailleMailleM);
  const nbCellulesZ = Math.floor(hauteurM / tailleMailleM);
  
  // ✅ Calculer la largeur/hauteur totale du maillage
  const largeurMaillagePx = nbCellulesX * tailleMaillePixels;
  const hauteurMaillagePx = nbCellulesZ * tailleMaillePixels;
  
  // ✅ Centrer le maillage sur le terrain
  const centreTerrainX = terrain.left + terrain.width / 2;
  const centreTerrainY = terrain.top + terrain.height / 2;
  
  const startX = centreTerrainX - largeurMaillagePx / 2;
  const startY = centreTerrainY - hauteurMaillagePx / 2;
  
  // ✅ Créer les cellules/carrés cliquables
  for (let i = 0; i < nbCellulesZ; i++) {
    for (let j = 0; j < nbCellulesX; j++) {
      const x = startX + j * tailleMaillePixels;
      const y = startY + i * tailleMaillePixels;
      const elevation = terrain.maillageElevation[i][j];
      
      // Carré semi-transparent avec couleur selon élévation
      const cellule = new fabric.Rect({
        left: x,
        top: y,
        width: tailleMaillePixels,
        height: tailleMaillePixels,
        fill: elevation === 0 ? 'rgba(33, 150, 243, 0.2)' : 
              (elevation > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'),
        stroke: '#1976d2',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: true,
        hasBorders: false,
        hasControls: false,
        hoverCursor: 'pointer',
        isCelluleMaillage: true,
        celluleI: i,
        celluleJ: j,
        excludeFromExport: true
      });
      
      // ✅ Ajouter un gestionnaire de clic pour éditer l'élévation
      cellule.on('mousedown', (e) => {
        e.stopPropagation();
        // Clic gauche = augmenter, Shift+Clic = diminuer
        const increment = e.e.shiftKey ? -0.1 : 0.1; // 10 cm à la fois
        modifierElevationCellule(canvas, terrain, i, j, elevation + increment, echelle);
      });
      
      // Survol : mettre en surbrillance
      cellule.on('mouseover', () => {
        cellule.set({ strokeWidth: 2, stroke: '#ff9800' });
        canvas.renderAll();
      });
      
      cellule.on('mouseout', () => {
        cellule.set({ strokeWidth: 1, stroke: '#1976d2' });
        canvas.renderAll();
      });
      
      // Label d'élévation au centre de la cellule
      const label = new fabric.Text(elevation.toFixed(2) + 'm', {
        left: x + tailleMaillePixels / 2,
        top: y + tailleMaillePixels / 2,
        fontSize: 12,
        fontWeight: 'bold',
        fill: elevation === 0 ? '#1976d2' : (elevation > 0 ? '#2e7d32' : '#c62828'),
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        isGrilleMaillage: true,
        excludeFromExport: true
      });
      
      canvas.add(cellule);
      canvas.add(label);
    }
  }
  
  // Mettre le terrain en arrière-plan
  canvas.sendObjectToBack(terrain);
  canvas.renderAll();
  
  logger.info('Terrain', `✅ Grille de maillage affichée (${nbCellulesX}×${nbCellulesZ} cellules)`);
};

/**
 * Masquer la grille de contrôle du maillage
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 */
export const masquerGrilleMaillage = (canvas) => {
  if (!canvas) return;
  
  const objetsGrille = canvas.getObjects().filter(obj => 
    obj.isGrilleMaillage || obj.isCelluleMaillage
  );
  
  objetsGrille.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  
  if (objetsGrille.length > 0) {
    logger.info('Terrain', `✅ Grille de maillage masquée (${objetsGrille.length} éléments)`);
  }
};

/**
 * Modifier l'élévation d'une cellule du maillage
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {fabric.Object} terrain - Objet terrain
 * @param {number} celluleI - Index de la cellule en Z
 * @param {number} celluleJ - Index de la cellule en X
 * @param {number} nouvelleElevation - Nouvelle élévation en mètres
 * @param {number} echelle - Échelle du plan
 */
export const modifierElevationCellule = (canvas, terrain, celluleI, celluleJ, nouvelleElevation, echelle) => {
  if (!terrain || !terrain.maillageElevation) return;
  
  // Limiter l'élévation entre -5m et +5m
  nouvelleElevation = Math.max(-5, Math.min(5, nouvelleElevation));
  
  // Mettre à jour le maillage
  terrain.maillageElevation[celluleI][celluleJ] = nouvelleElevation;
  
  // Mettre à jour l'affichage
  afficherGrilleMaillage(canvas, terrain, echelle);
  
  logger.info('Terrain', `✅ Élévation cellule [${celluleI}][${celluleJ}] = ${nouvelleElevation.toFixed(2)}m`);
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

