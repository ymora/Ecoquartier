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
    fill: 'rgba(139, 195, 74, 0.7)', // Vert plus visible
    stroke: '#2e7d32',
    strokeWidth: 6,
    strokeDashArray: [20, 10],
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
    // ✅ TERRAIN EN ARRIÈRE-PLAN - zIndex très bas pour rester sous tous les objets
    zIndex: -1000,
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
  
  // Envoyer le terrain au fond mais le rendre sélectionnable par-dessous
  canvas.sendObjectToBack(terrain);
  
  // S'assurer que le terrain reste sélectionnable même au fond
  terrain.set({
    selectable: true,
    evented: true,
    hasBorders: true,
    hasControls: true,
    // Améliorer la visibilité pour la sélection
    hoverCursor: 'pointer',
    moveCursor: 'move',
    // Permettre la sélection même quand d'autres objets sont au-dessus
    excludeFromExport: false,
    // Z-index négatif pour être en arrière-plan mais sélectionnable
    zIndex: -1000
  });
  
  // Ajouter un événement de clic pour faciliter la sélection
  terrain.on('mousedown', (e) => {
    // Ne sélectionner que si on clique directement sur le terrain (pas sur un objet au-dessus)
    if (e.target === terrain) {
      canvas.setActiveObject(terrain);
      canvas.renderAll();
      logger.info('Terrain', '✅ Terrain sélectionné par clic direct');
    }
  });
  
  // Permettre la sélection par clic droit même si d'autres objets sont au-dessus
  terrain.on('mouseup', (e) => {
    if (e.e && e.e.button === 2) { // Clic droit
      canvas.setActiveObject(terrain);
      canvas.renderAll();
      logger.info('Terrain', '✅ Terrain sélectionné par clic droit');
    }
  });
  
  canvas.renderAll();
  
  logger.info('Terrain', '✅ Terrain ajouté au canvas et sélectionnable');
  logger.info('Terrain', `📏 Dimensions: ${dimensions.largeur}m x ${dimensions.hauteur}m`);
  logger.info('Terrain', `📍 Position: (${terrain.left}, ${terrain.top})`);
  logger.info('Terrain', `🎨 Couleur: ${terrain.fill}, Bordure: ${terrain.stroke}`);
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

/**
 * Sélectionner le terrain sur le canvas
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 */
export const selectionnerTerrain = (canvas) => {
  if (!canvas) return;
  
  const terrain = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (terrain) {
    canvas.setActiveObject(terrain);
    canvas.renderAll();
    logger.info('Terrain', '✅ Terrain sélectionné');
    return terrain;
  } else {
    logger.warn('Terrain', '❌ Aucun terrain trouvé sur le canvas');
    return null;
  }
};

/**
 * Sélectionner le terrain par-dessous les objets (pour objets enterrés)
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {number} x - Position X du clic
 * @param {number} y - Position Y du clic
 */
export const selectionnerTerrainParDessous = (canvas, x, y) => {
  if (!canvas) return;
  
  const terrain = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (!terrain) return null;
  
  // Vérifier si le clic est dans les limites du terrain
  const terrainBounds = terrain.getBoundingRect();
  const isInsideTerrain = x >= terrainBounds.left && 
                         x <= terrainBounds.left + terrainBounds.width &&
                         y >= terrainBounds.top && 
                         y <= terrainBounds.top + terrainBounds.height;
  
  if (isInsideTerrain) {
    // Vérifier s'il y a un objet au-dessus à cette position
    const objetsAuDessus = canvas.getObjects().filter(obj => {
      if (obj === terrain || !obj.customType) return false;
      
      const objBounds = obj.getBoundingRect();
      return x >= objBounds.left && 
             x <= objBounds.left + objBounds.width &&
             y >= objBounds.top && 
             y <= objBounds.top + objBounds.height;
    });
    
    // Si pas d'objet au-dessus, sélectionner le terrain
    if (objetsAuDessus.length === 0) {
      canvas.setActiveObject(terrain);
      canvas.renderAll();
      logger.info('Terrain', '✅ Terrain sélectionné par-dessous');
      return terrain;
    }
  }
};
  
/**
 * Agrandir automatiquement le terrain si un objet sort de ses limites
 * @param {fabric.Canvas} canvas - Canvas Fabric.js
 * @param {fabric.Object} objet - Objet qui pourrait sortir du terrain
 * @param {number} echelle - Échelle du plan
 * @param {Function} onDimensionsChange - Callback pour mettre à jour les dimensions
 */
export const agrandirTerrainSiNecessaire = (canvas, objet, echelle, onDimensionsChange) => {
  if (!canvas || !objet || !onDimensionsChange) return;
  
  const terrain = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (!terrain) return;
  
  // Calculer les limites actuelles du terrain
  const terrainBounds = terrain.getBoundingRect();
  const terrainLeft = terrainBounds.left;
  const terrainRight = terrainBounds.left + terrainBounds.width;
  const terrainTop = terrainBounds.top;
  const terrainBottom = terrainBounds.top + terrainBounds.height;
  
  // Calculer les limites de l'objet
  const objetBounds = objet.getBoundingRect();
  const objetLeft = objetBounds.left;
  const objetRight = objetBounds.left + objetBounds.width;
  const objetTop = objetBounds.top;
  const objetBottom = objetBounds.top + objetBounds.height;
  
  // Vérifier si l'objet sort du terrain
  let nouveauLeft = terrainLeft;
  let nouveauTop = terrainTop;
  let nouvelleLargeur = terrainBounds.width;
  let nouvelleHauteur = terrainBounds.height;
  
  let terrainModifie = false;
  
  // Vérifier les limites avec marge de 2m (60 pixels à l'échelle 30)
  const marge = 2 * echelle; // 2 mètres en pixels
  
  if (objetLeft < terrainLeft + marge) {
    const extension = (terrainLeft + marge) - objetLeft;
    nouveauLeft = terrainLeft - extension;
    nouvelleLargeur = terrainBounds.width + extension;
    terrainModifie = true;
  }
  
  if (objetRight > terrainRight - marge) {
    const extension = objetRight - (terrainRight - marge);
    nouvelleLargeur = terrainBounds.width + extension;
    terrainModifie = true;
  }
  
  if (objetTop < terrainTop + marge) {
    const extension = (terrainTop + marge) - objetTop;
    nouveauTop = terrainTop - extension;
    nouvelleHauteur = terrainBounds.height + extension;
    terrainModifie = true;
  }
  
  if (objetBottom > terrainBottom - marge) {
    const extension = objetBottom - (terrainBottom - marge);
    nouvelleHauteur = terrainBounds.height + extension;
    terrainModifie = true;
  }
  
  if (terrainModifie) {
    // Mettre à jour le terrain
    terrain.set({
      left: nouveauLeft,
      top: nouveauTop,
      width: nouvelleLargeur,
      height: nouvelleHauteur
    });
    
    // Mettre à jour le label du terrain
    const label = terrain.getObjects ? terrain.getObjects().find(obj => obj.type === 'text') : null;
    if (label) {
      label.set({
        left: nouveauLeft + nouvelleLargeur / 2,
        top: nouveauTop + nouvelleHauteur / 2
      });
    }
    
    terrain.setCoords();
    canvas.renderAll();
    
    // Convertir en mètres et notifier le changement
    const nouvellesDimensions = {
      largeur: nouvelleLargeur / echelle,
      hauteur: nouvelleHauteur / echelle
    };
    
    onDimensionsChange(nouvellesDimensions);
    
    logger.info('Terrain', `✅ Terrain agrandi automatiquement: ${nouvellesDimensions.largeur.toFixed(1)}m x ${nouvellesDimensions.hauteur.toFixed(1)}m`);
  }
};
