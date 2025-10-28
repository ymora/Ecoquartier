/**
 * terrainUtils.js
 * ✅ Utilitaires pour créer et gérer un objet terrain sélectionnable
 * Permet de voir et modifier les couches de sol (terre, marne, etc.)
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Créer un objet terrain sélectionnable pour afficher les couches de sol
 * @param {number} echelle - Échelle du plan
 * @param {Object} dimensions - Dimensions du terrain
 * @returns {fabric.Object} - Objet terrain sélectionnable
 */
export const creerObjetTerrain = (echelle, dimensions) => {
  const largeur = dimensions.largeur * echelle;
  const hauteur = dimensions.hauteur * echelle;
  
  // Créer un rectangle pour représenter le terrain
  const terrain = new fabric.Rect({
    left: -largeur / 2,
    top: -hauteur / 2,
    width: largeur,
    height: hauteur,
    fill: 'rgba(139, 195, 74, 0.3)', // Vert transparent
    stroke: '#4caf50',
    strokeWidth: 3,
    strokeDashArray: [10, 5],
    selectable: true,
    evented: true,
    hasBorders: true,
    hasControls: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    customType: 'sol',
    name: 'Terrain',
    // Propriétés pour les couches de sol
    couchesSol: [
      { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
      { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
    ],
    // Propriétés de validation
    validationStatus: 'ok',
    validationMessages: []
  });
  
  // Ajouter un label pour identifier le terrain
  const label = new fabric.Text('TERRAIN', {
    left: 0,
    top: 0,
    fontSize: 16,
    fill: '#1976d2',
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  // Grouper le terrain et le label
  const terrainGroup = new fabric.Group([terrain, label], {
    customType: 'sol',
    name: 'Terrain',
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    hasBorders: true,
    hasControls: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    // Propriétés pour les couches de sol
    couchesSol: [
      { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
      { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
    ],
    // Propriétés de validation
    validationStatus: 'ok',
    validationMessages: []
  });
  
  logger.info('Terrain', 'Objet terrain créé et sélectionnable');
  
  return terrainGroup;
};

/**
 * Ajouter un objet terrain au canvas
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle du plan
 * @param {Object} dimensions - Dimensions du terrain
 */
export const ajouterTerrainAuCanvas = (canvas, echelle, dimensions) => {
  if (!canvas) return;
  
  // Vérifier si un terrain existe déjà
  const terrainExistant = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (terrainExistant) {
    logger.info('Terrain', 'Terrain déjà présent sur le canvas');
    return;
  }
  
  // Créer et ajouter le terrain
  const terrain = creerObjetTerrain(echelle, dimensions);
  canvas.add(terrain);
  
  // Envoyer le terrain au fond
  canvas.sendObjectToBack(terrain);
  
  canvas.renderAll();
  
  logger.info('Terrain', '✅ Terrain ajouté au canvas et sélectionnable');
};

/**
 * Mettre à jour les couches de sol d'un objet terrain
 * @param {fabric.Object} objetTerrain - Objet terrain sélectionné
 * @param {Array} nouvellesCouches - Nouvelles couches de sol
 */
export const mettreAJourCouchesSol = (objetTerrain, nouvellesCouches) => {
  if (!objetTerrain || objetTerrain.customType !== 'sol') return;
  
  objetTerrain.set('couchesSol', nouvellesCouches);
  
  logger.info('Terrain', 'Couches de sol mises à jour', nouvellesCouches);
};
