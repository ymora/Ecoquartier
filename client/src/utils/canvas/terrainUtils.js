/**
 * terrainUtils.js
 * ✅ Utilitaires pour créer et gérer un objet terrain sélectionnable
 * Permet de voir et modifier les couches de sol (terre, marne, etc.)
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { canvasOperations } from './canvasOperations';

/**
 * Créer un objet terrain sélectionnable pour afficher les couches de sol
 * @param {number} echelle - Échelle du plan
 * @param {Object} dimensions - Dimensions du terrain
 * @returns {fabric.Object} - Objet terrain sélectionnable
 */
export const creerObjetTerrain = (echelle, dimensions) => {
  const largeur = dimensions.largeur * echelle;
  const hauteur = dimensions.hauteur * echelle;
  
  // ✅ Créer le maillage d'élévation (tous les 5m)
  // ⭐ MEILLEURE PRATIQUE : Régler la hauteur des NŒUDS (intersections) plutôt que des cellules
  // Cela permet une interpolation naturelle et une surface continue
  const tailleMailleM = 5; // Maillage tous les 5 mètres
  const nbCellulesX = Math.floor(dimensions.largeur / tailleMailleM);
  const nbCellulesZ = Math.floor(dimensions.hauteur / tailleMailleM);
  
  // Nombre de nœuds = nombre de cellules + 1 (les intersections)
  const nbNoeudsX = nbCellulesX + 1;
  const nbNoeudsZ = nbCellulesZ + 1;
  
  // Initialiser le maillage avec élévation 0 partout (terrain plat par défaut)
  // maillageElevation[i][j] = élévation du NŒUD en mètres
  const maillageElevation = [];
  for (let i = 0; i < nbNoeudsZ; i++) {
    maillageElevation[i] = [];
    for (let j = 0; j < nbNoeudsX; j++) {
      maillageElevation[i][j] = 0; // Élévation en mètres
    }
  }
  
  // ✅ Rectangle TRANSPARENT pour la sélection uniquement (zone cliquable invisible)
  const zoneSelection = new fabric.Rect({
    left: -largeur / 2,
    top: -hauteur / 2,
    width: largeur,
    height: hauteur,
    fill: 'rgba(139, 195, 74, 0.05)', // Presque invisible, juste pour voir la zone
    stroke: 'transparent',
    strokeWidth: 0,
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
    // ✅ Ajouter le maillage d'élévation
    maillageElevation: maillageElevation,
    tailleMailleM: tailleMailleM,
    // Propriétés de validation
    validationStatus: 'ok',
    validationMessages: []
  });
  
  // ✅ Créer les éléments du maillage (lignes vertes + nœuds cliquables)
  const elementsMaillage = [];
  
  // Calculer dimensions du maillage centré
  const largeurMaillage = nbCellulesX * tailleMailleM;
  const hauteurMaillage = nbCellulesZ * tailleMailleM;
  const largeurMaillagePx = nbCellulesX * tailleMailleM * echelle;
  const hauteurMaillagePx = nbCellulesZ * tailleMailleM * echelle;
  
  // Offset pour centrer le maillage
  const offsetXPx = (largeur - largeurMaillagePx) / 2;
  const offsetZPx = (hauteur - hauteurMaillagePx) / 2;
  
  // Lignes horizontales (vertes)
  for (let i = 0; i < nbNoeudsZ; i++) {
    const y = -hauteur / 2 + offsetZPx + i * tailleMailleM * echelle;
    const line = new fabric.Line(
      [-largeur / 2 + offsetXPx, y, -largeur / 2 + offsetXPx + largeurMaillagePx, y],
      {
        stroke: '#2e7d32',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }
    );
    elementsMaillage.push(line);
  }
  
  // Lignes verticales (vertes)
  for (let j = 0; j < nbNoeudsX; j++) {
    const x = -largeur / 2 + offsetXPx + j * tailleMailleM * echelle;
    const line = new fabric.Line(
      [x, -hauteur / 2 + offsetZPx, x, -hauteur / 2 + offsetZPx + hauteurMaillagePx],
      {
        stroke: '#2e7d32',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }
    );
    elementsMaillage.push(line);
  }
  
  // ⭐ Créer les NŒUDS cliquables (intersections des lignes)
  // C'est la meilleure pratique : interpolation naturelle entre les nœuds
  for (let i = 0; i < nbNoeudsZ; i++) {
    for (let j = 0; j < nbNoeudsX; j++) {
      const x = -largeur / 2 + offsetXPx + j * tailleMailleM * echelle;
      const y = -hauteur / 2 + offsetZPx + i * tailleMailleM * echelle;
      const elevation = maillageElevation[i][j];
      
      // Point de contrôle (nœud)
      const noeud = new fabric.Circle({
        left: x,
        top: y,
        radius: 6,
        fill: elevation === 0 ? '#2196f3' : (elevation > 0 ? '#4caf50' : '#f44336'),
        stroke: '#ffffff',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: true,
        hoverCursor: 'pointer',
        noeudI: i,
        noeudJ: j,
        isSelected: false, // ✅ État de sélection du nœud
        isNoeudMaillage: true // ✅ Pour filtrer lors de l'export JSON
      });
      
      // ✅ Gestionnaire de clic pour SÉLECTIONNER/DÉSÉLECTIONNER le nœud
      noeud.on('mousedown', function(e) {
        if (e.e) e.e.stopPropagation();
        
        const terrainGroup = this.group;
        if (!terrainGroup) return;
        
        // Toggle sélection
        this.isSelected = !this.isSelected;
        
        // Mettre à jour l'apparence
        if (this.isSelected) {
          this.set({
            stroke: '#ffeb3b', // Jaune pour indiquer la sélection
            strokeWidth: 4,
            radius: 8
          });
        } else {
          this.set({
            stroke: '#ffffff',
            strokeWidth: 2,
            radius: 6
          });
        }
        
        // Mettre à jour la liste des nœuds sélectionnés dans le terrain
        if (!terrainGroup.noeudsSelectionnes) {
          terrainGroup.noeudsSelectionnes = [];
        }
        
        const noeudKey = `${i},${j}`;
        const index = terrainGroup.noeudsSelectionnes.findIndex(n => n.key === noeudKey);
        
        if (this.isSelected && index === -1) {
          terrainGroup.noeudsSelectionnes.push({ i, j, key: noeudKey, noeud: this });
        } else if (!this.isSelected && index !== -1) {
          terrainGroup.noeudsSelectionnes.splice(index, 1);
        }
        
        // ✅ IMPORTANT : Créer une NOUVELLE copie du tableau pour forcer la mise à jour React
        terrainGroup.noeudsSelectionnes = [...terrainGroup.noeudsSelectionnes];
        
        if (terrainGroup.canvas) {
          // ✅ IMPORTANT : Forcer la sélection du terrain parent pour mettre à jour le panneau Config
          terrainGroup.canvas.setActiveObject(terrainGroup);
          terrainGroup.canvas.renderAll();
          // Déclencher l'événement pour forcer React à se mettre à jour
          terrainGroup.canvas.fire('selection:updated', { selected: [terrainGroup] });
        }
        
        logger.debug('Terrain', `Nœud [${i},${j}] ${this.isSelected ? 'sélectionné' : 'désélectionné'}. Total: ${terrainGroup.noeudsSelectionnes.length}`);
      });
      
      // Survol
      noeud.on('mouseover', function() {
        if (!this.isSelected) {
          this.set({ radius: 8, strokeWidth: 3 });
          this.canvas?.renderAll();
        }
      });
      
      noeud.on('mouseout', function() {
        if (!this.isSelected) {
          this.set({ radius: 6, strokeWidth: 2 });
          this.canvas?.renderAll();
        }
      });
      
      elementsMaillage.push(noeud);
      
      // Label d'élévation à côté du nœud
      const labelElev = new fabric.Text(elevation.toFixed(2) + 'm', {
        left: x + 10,
        top: y - 10,
        fontSize: 10,
        fontWeight: 'bold',
        fill: elevation === 0 ? '#1976d2' : (elevation > 0 ? '#2e7d32' : '#c62828'),
        originX: 'left',
        originY: 'bottom',
        selectable: false,
        evented: false,
        noeudI: i,
        noeudJ: j,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 2
      });
      elementsMaillage.push(labelElev);
    }
  }
  
  // Ajouter un label pour identifier le terrain
  const label = new fabric.Text('TERRAIN', {
    left: 0,
    top: -hauteur / 4,
    fontSize: Math.min(16, hauteur / 8),
    fill: '#1976d2',
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  
  elementsMaillage.push(label);
  
  // ✅ Grouper la zone de sélection invisible + les éléments du maillage visibles
  const terrainGroup = new fabric.Group([zoneSelection, ...elementsMaillage], {
    customType: 'sol',
    name: 'Terrain',
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    subTargetCheck: true, // ✅ IMPORTANT : Permet les événements sur les sous-objets (nœuds)
    interactive: true, // ✅ Rend les sous-objets cliquables
    hasBorders: true,
    hasControls: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    // ✅ TERRAIN EN ARRIÈRE-PLAN - zIndex très bas pour rester sous tous les objets
    zIndex: -1000,
    // ✅ Limiter la zone de sélection au rectangle du terrain uniquement (sans le label)
    // Utiliser un padding négatif pour réduire la zone de sélection aux dimensions du terrain
    padding: 0, // Pas de padding supplémentaire
    // Propriétés pour les couches de sol
    couchesSol: [
      { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
      { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
    ],
    // Propriétés de validation
    validationStatus: 'ok',
    validationMessages: []
  });
  
  // ✅ Limiter la zone de sélection en utilisant _setCornerCoords qui force les dimensions
  // Forcer les coordonnées après la création du groupe
  terrainGroup.setCoords();
  
  // ✅ Transférer les propriétés du maillage au groupe
  terrainGroup.maillageElevation = maillageElevation;
  terrainGroup.tailleMailleM = tailleMailleM;
  terrainGroup.nbNoeudsX = nbNoeudsX;
  terrainGroup.nbNoeudsZ = nbNoeudsZ;
  terrainGroup.nbCellulesX = nbCellulesX;
  terrainGroup.nbCellulesZ = nbCellulesZ;
  terrainGroup.noeudsSelectionnes = []; // ✅ Liste des nœuds sélectionnés
  
  logger.info('Terrain', `✅ Terrain créé avec maillage ${nbNoeudsX}×${nbNoeudsZ} nœuds, ${nbCellulesX}×${nbCellulesZ} cellules`);
  
  return terrainGroup;
};

/**
 * Modifier l'élévation des nœuds sélectionnés
 * @param {fabric.Group} terrainGroup - Le groupe terrain
 * @param {number} increment - Incrément d'élévation (ex: +0.1m ou -0.1m)
 */
export const modifierElevationNoeudsSelectionnes = (terrainGroup, increment) => {
  if (!terrainGroup || !terrainGroup.noeudsSelectionnes || terrainGroup.noeudsSelectionnes.length === 0) {
    logger.warn('Terrain', 'Aucun nœud sélectionné');
    return;
  }
  
  const maillageElevation = terrainGroup.maillageElevation;
  
  terrainGroup.noeudsSelectionnes.forEach(({ i, j, noeud }) => {
    const elevation = maillageElevation[i][j];
    const nouvelleElev = Math.max(-5, Math.min(5, elevation + increment));
    maillageElevation[i][j] = nouvelleElev;
    
    // Mettre à jour la couleur du nœud
    noeud.set({
      fill: nouvelleElev === 0 ? '#2196f3' : (nouvelleElev > 0 ? '#4caf50' : '#f44336')
    });
    
    // Trouver et mettre à jour le label correspondant
    if (terrainGroup._objects) {
      const labelObj = terrainGroup._objects.find(el => 
        el.type === 'text' && el.noeudI === i && el.noeudJ === j
      );
      if (labelObj) {
        labelObj.set({
          text: nouvelleElev.toFixed(2) + 'm',
          fill: nouvelleElev === 0 ? '#1976d2' : (nouvelleElev > 0 ? '#2e7d32' : '#c62828')
        });
      }
    }
  });
  
  // ✅ CRITIQUE : Créer une NOUVELLE copie du tableau pour forcer React à détecter le changement
  terrainGroup.maillageElevation = maillageElevation.map(row => [...row]);
  
  // Synchroniser la 3D et forcer mise à jour du panneau Config
  if (terrainGroup.canvas) {
    terrainGroup.canvas.renderAll();
    terrainGroup.canvas.fire('object:modified', { target: terrainGroup });
    terrainGroup.canvas.fire('selection:updated', { selected: [terrainGroup] }); // ✅ Force React à se mettre à jour
  }
  
  logger.info('Terrain', `✅ ${terrainGroup.noeudsSelectionnes.length} nœud(s) modifié(s) de ${increment > 0 ? '+' : ''}${increment.toFixed(2)}m`);
};

/**
 * Désélectionner tous les nœuds
 * @param {fabric.Group} terrainGroup - Le groupe terrain
 */
export const deselectionnerTousLesNoeuds = (terrainGroup) => {
  if (!terrainGroup || !terrainGroup.noeudsSelectionnes) return;
  
  terrainGroup.noeudsSelectionnes.forEach(({ noeud }) => {
    noeud.isSelected = false;
    noeud.set({
      stroke: '#ffffff',
      strokeWidth: 2,
      radius: 6
    });
  });
  
  terrainGroup.noeudsSelectionnes = [];
  
  if (terrainGroup.canvas) {
    terrainGroup.canvas.renderAll();
    terrainGroup.canvas.fire('selection:updated', { selected: [terrainGroup] }); // ✅ Force React à se mettre à jour
  }
  
  logger.debug('Terrain', 'Tous les nœuds désélectionnés');
};

/**
 * Modifier tous les nœuds du maillage avec une fonction d'opération
 * @param {fabric.Group} terrainGroup - Le groupe terrain
 * @param {Function} operation - Fonction qui prend l'élévation actuelle et retourne la nouvelle
 * @param {string} messageLog - Message pour le log
 */
export const modifierToutLeMaillage = (terrainGroup, operation, messageLog) => {
  if (!terrainGroup?.maillageElevation) {
    logger.warn('Terrain', 'Aucun maillage d\'élévation');
    return;
  }
  
  const maillageElevation = terrainGroup.maillageElevation;
  
  for (let i = 0; i < maillageElevation.length; i++) {
    for (let j = 0; j < maillageElevation[i].length; j++) {
      maillageElevation[i][j] = operation(maillageElevation[i][j]);
    }
  }
  
  // ✅ CRITIQUE : Créer une NOUVELLE copie du tableau pour forcer React à détecter le changement
  terrainGroup.maillageElevation = maillageElevation.map(row => [...row]);
  
  // Mettre à jour les nœuds visuels
  if (terrainGroup._objects) {
    for (let i = 0; i < maillageElevation.length; i++) {
      for (let j = 0; j < maillageElevation[i].length; j++) {
        const elevation = maillageElevation[i][j];
        
        // Trouver le nœud correspondant
        const noeud = terrainGroup._objects.find(el => 
          el.type === 'circle' && el.noeudI === i && el.noeudJ === j
        );
        
        if (noeud) {
          noeud.set({
            fill: elevation === 0 ? '#2196f3' : (elevation > 0 ? '#4caf50' : '#f44336')
          });
        }
        
        // Trouver et mettre à jour le label correspondant
        const labelObj = terrainGroup._objects.find(el => 
          el.type === 'text' && el.noeudI === i && el.noeudJ === j
        );
        
        if (labelObj) {
          labelObj.set({
            text: elevation.toFixed(2) + 'm',
            fill: elevation === 0 ? '#1976d2' : (elevation > 0 ? '#2e7d32' : '#c62828')
          });
        }
      }
    }
  }
  
  // Synchroniser la 3D
  if (terrainGroup.canvas) {
    terrainGroup.canvas.renderAll();
    terrainGroup.canvas.fire('object:modified', { target: terrainGroup });
  }
  
  if (messageLog) {
    logger.info('Terrain', messageLog);
  }
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
  canvasOperations.ajouter(canvas, terrain);
  
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
    zIndex: -1000,
    // ✅ Réduire le padding pour que la zone de sélection corresponde exactement au rectangle
    padding: 0
  });
  
  // ✅ Gestionnaires pour maintenir le terrain en arrière-plan même quand sélectionné
  terrain.on('selected', () => {
    // Forcer le terrain à rester au fond immédiatement après sélection
    setTimeout(() => {
      canvas.sendObjectToBack(terrain);
      canvasOperations.rendre(canvas);
    }, 0);
  });
  
  // ✅ Gestionnaire pour maintenir le terrain en arrière-plan quand les contrôles sont affichés
  terrain.on('moving', () => {
    // Même en mouvement, le terrain doit rester en arrière-plan
    canvas.sendObjectToBack(terrain);
  });
  
  // Ajouter un événement de clic pour faciliter la sélection
  terrain.on('mousedown', (e) => {
    // Ne sélectionner que si on clique directement sur le terrain (pas sur un objet au-dessus)
    if (e.target === terrain) {
      canvas.setActiveObject(terrain);
      // ✅ Forcer immédiatement le terrain au fond après sélection
      canvas.sendObjectToBack(terrain);
      canvasOperations.rendre(canvas);
      logger.info('Terrain', '✅ Terrain sélectionné par clic direct');
    }
  });
  
  // Permettre la sélection par clic droit même si d'autres objets sont au-dessus
  terrain.on('mouseup', (e) => {
    if (e.e && e.e.button === 2) { // Clic droit
      canvas.setActiveObject(terrain);
      // ✅ Forcer immédiatement le terrain au fond après sélection
      canvas.sendObjectToBack(terrain);
      canvasOperations.rendre(canvas);
      logger.info('Terrain', '✅ Terrain sélectionné par clic droit');
    }
  });
  
  canvasOperations.rendre(canvas);
  
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
    canvasOperations.rendre(canvas);
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
      canvasOperations.rendre(canvas);
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
// ✅ Cache pour éviter les recalculs inutiles
let terrainResizeCache = {
  lastCheck: 0,
  lastBounds: null,
  resizeTimer: null
};

/**
 * Ajuster automatiquement la taille du terrain (agrandir ou rétrécir) - VERSION OPTIMISÉE
 * pour que tous les objets restent à l'intérieur avec 2m de marge
 * Utilise un debounce pour éviter les recalculs trop fréquents
 */
export const agrandirTerrainSiNecessaire = (canvas, objet, echelle, onDimensionsChange) => {
  if (!canvas || !onDimensionsChange) return;
  
  // ✅ Debounce : ne recalculer que toutes les 300ms maximum
  if (terrainResizeCache.resizeTimer) {
    clearTimeout(terrainResizeCache.resizeTimer);
  }
  
  terrainResizeCache.resizeTimer = setTimeout(() => {
    _calculerEtRedimensionnerTerrain(canvas, echelle, onDimensionsChange);
  }, 300); // Debounce de 300ms
};

/**
 * Fonction interne optimisée pour le calcul et redimensionnement
 */
const _calculerEtRedimensionnerTerrain = (canvas, echelle, onDimensionsChange) => {
  const terrain = canvas.getObjects().find(obj => obj.customType === 'sol');
  if (!terrain) return;
  
  // ✅ Cache : éviter les recalculs si rien n'a changé (vérification rapide)
  const terrainBounds = terrain.getBoundingRect();
  const terrainHash = `${terrainBounds.width.toFixed(1)}_${terrainBounds.height.toFixed(1)}_${terrainBounds.left.toFixed(1)}_${terrainBounds.top.toFixed(1)}`;
  
  if (terrainResizeCache.lastBounds === terrainHash && Date.now() - terrainResizeCache.lastCheck < 500) {
    return; // Pas besoin de recalculer
  }
  
  terrainResizeCache.lastCheck = Date.now();
  
  // ✅ Calcul optimisé : obtenir tous les objets une seule fois
  const tousObjets = canvas.getObjects();
  const objets = [];
  for (let i = 0; i < tousObjets.length; i++) {
    const obj = tousObjets[i];
    if (obj.customType !== 'sol' &&
        !obj.isGridLine && 
        !obj.measureLabel && 
        !obj.isBoussole && 
        !obj.isImageFond &&
        !obj.alignmentGuide &&
        !obj.isDimensionBox &&
        !obj.isAideButton &&
        !obj.isCenterMark) {
      objets.push(obj);
    }
  }
  
  if (objets.length === 0) {
    return;
  }
  
  // ✅ Calcul optimisé des bounds (une seule passe)
  const marge = 2 * echelle; // 2 mètres en pixels
  let minLeft = Infinity, maxRight = -Infinity, minTop = Infinity, maxBottom = -Infinity;
  
  for (let i = 0; i < objets.length; i++) {
    const bounds = objets[i].getBoundingRect();
    const right = bounds.left + bounds.width;
    const bottom = bounds.top + bounds.height;
    
    if (bounds.left < minLeft) minLeft = bounds.left;
    if (right > maxRight) maxRight = right;
    if (bounds.top < minTop) minTop = bounds.top;
    if (bottom > maxBottom) maxBottom = bottom;
  }
  
  // Ajouter la marge de 2m de chaque côté
  const requiredLeft = minLeft - marge;
  const requiredRight = maxRight + marge;
  const requiredTop = minTop - marge;
  const requiredBottom = maxBottom + marge;
  
  // Dimensions requises en pixels
  const requiredWidth = requiredRight - requiredLeft;
  const requiredHeight = requiredBottom - requiredTop;
  
  // Convertir en mètres
  const requiredLargeurM = requiredWidth / echelle;
  const requiredHauteurM = requiredHeight / echelle;
  
  // Calculer le centre requis
  const requiredCentreX = (requiredLeft + requiredRight) / 2;
  const requiredCentreY = (requiredTop + requiredBottom) / 2;
  
  // Dimensions actuelles du terrain
  const currentWidth = terrainBounds.width;
  const currentHeight = terrainBounds.height;
  const currentCentreX = terrainBounds.left + currentWidth / 2;
  const currentCentreY = terrainBounds.top + currentHeight / 2;
  
  // Convertir en mètres pour comparaison
  const currentLargeurM = currentWidth / echelle;
  const currentHauteurM = currentHeight / echelle;
  
  // ✅ Vérifier si un ajustement est nécessaire (avec tolérance de 0.2m pour éviter les micro-ajustements)
  const tolérance = 0.2; // 20 cm (augmenté pour réduire les recalculs)
  const largeurDoitChanger = Math.abs(requiredLargeurM - currentLargeurM) > tolérance;
  const hauteurDoitChanger = Math.abs(requiredHauteurM - currentHauteurM) > tolérance;
  const centreDoitChanger = Math.abs(requiredCentreX - currentCentreX) > 10 || Math.abs(requiredCentreY - currentCentreY) > 10;
  
  if (largeurDoitChanger || hauteurDoitChanger || centreDoitChanger) {
    // Utiliser les dimensions requises (elles sont toujours suffisantes)
    const newLargeurM = Math.max(requiredLargeurM, 10); // Minimum 10m
    const newHauteurM = Math.max(requiredHauteurM, 10); // Minimum 10m
    
    // ✅ Conserver le maillage d'élévation existant si possible
    const ancienMaillage = terrain.maillageElevation || null;
    const ancienNbNoeudsX = terrain.nbNoeudsX || 0;
    const ancienNbNoeudsZ = terrain.nbNoeudsZ || 0;
    
    // Supprimer l'ancien terrain et recréer avec la nouvelle taille
    const oldActive = canvas.getActiveObject() === terrain;
    canvasOperations.supprimer(canvas, terrain, false);

    const nouveauTerrain = creerObjetTerrain(echelle, { largeur: newLargeurM, hauteur: newHauteurM });
    
    // ✅ Tenter de préserver le maillage d'élévation si dimensions compatibles
    if (ancienMaillage && nouveauTerrain.maillageElevation) {
      const newNbNoeudsX = nouveauTerrain.nbNoeudsX;
      const newNbNoeudsZ = nouveauTerrain.nbNoeudsZ;
      
      // Copier les valeurs d'élévation de l'ancien maillage vers le nouveau
      for (let i = 0; i < Math.min(ancienNbNoeudsZ, newNbNoeudsZ); i++) {
        for (let j = 0; j < Math.min(ancienNbNoeudsX, newNbNoeudsX); j++) {
          nouveauTerrain.maillageElevation[i][j] = ancienMaillage[i][j];
        }
      }
    }
    
    nouveauTerrain.set({ 
      left: requiredCentreX, 
      top: requiredCentreY, 
      originX: 'center', 
      originY: 'center' 
    });

    canvasOperations.ajouter(canvas, nouveauTerrain, false);
    canvas.sendObjectToBack(nouveauTerrain);
    canvasOperations.rendre(canvas);

    if (oldActive) {
      canvas.setActiveObject(nouveauTerrain);
    }

    const nouvellesDimensions = { largeur: newLargeurM, hauteur: newHauteurM };
    onDimensionsChange(nouvellesDimensions);
    
    // ✅ Mettre à jour le cache
    const newBounds = nouveauTerrain.getBoundingRect();
    terrainResizeCache.lastBounds = `${newBounds.width.toFixed(1)}_${newBounds.height.toFixed(1)}_${newBounds.left.toFixed(1)}_${newBounds.top.toFixed(1)}`;
    
    // ✅ Log uniquement si changement significatif (évite spam console)
    if (Math.abs(newLargeurM - currentLargeurM) > 0.5 || Math.abs(newHauteurM - currentHauteurM) > 0.5) {
      const action = newLargeurM < currentLargeurM || newHauteurM < currentHauteurM ? 'rétréci' : 'agrandi';
      logger.info('Terrain', `✅ Terrain ${action} : ${newLargeurM.toFixed(1)}m x ${newHauteurM.toFixed(1)}m`);
    }
  } else {
    // ✅ Mettre à jour le cache même si pas de changement (pour éviter recalcul)
    terrainResizeCache.lastBounds = terrainHash;
  }
};
