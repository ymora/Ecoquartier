/**
 * actionsCanvas.js
 * Actions globales sur le canvas (supprimer, verrouiller, effacer, etc.)
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerDistanceRectangle, calculerDistanceLigne } from './canvasHelpers';

/**
 * Supprimer la sélection active
 */
export const supprimerSelection = (canvas, exporterPlanCallback) => {
  if (!canvas) return;
  
  const actifs = canvas.getActiveObjects();
  const locked = actifs.filter(obj => obj.locked);
  
  if (locked.length > 0) {
    alert(`⚠️ ${locked.length} objet(s) verrouillé(s)`);
    return;
  }
  
  actifs.forEach(obj => {
    if (!obj.isGridLine && !obj.isImageFond) canvas.remove(obj);
  });
  canvas.discardActiveObject();
  canvas.renderAll();
  exporterPlanCallback(canvas);
};

/**
 * Verrouiller la sélection
 */
export const verrouillerSelection = (canvas) => {
  if (!canvas) return;
  
  const actifs = canvas.getActiveObjects();
  if (actifs.length === 0) {
    alert('Sélectionnez d\'abord un ou plusieurs objets');
    return;
  }
  
  actifs.forEach(obj => {
    if (!obj.isGridLine) {
      obj.locked = true;
      obj.selectable = true;
      obj.evented = true;
      obj.lockMovementX = true;
      obj.lockMovementY = true;
      obj.lockScalingX = true;
      obj.lockScalingY = true;
      obj.lockRotation = true;
      obj.hasControls = false;
      
      if (obj.stroke) {
        obj.originalStroke = obj.stroke;
        obj.stroke = '#ff9800';
        obj.strokeWidth = (obj.strokeWidth || 2) + 1;
      } else {
        obj.originalFill = obj.fill;
        obj.fill = obj.fill ? obj.fill.replace('0.3', '0.2').replace('0.4', '0.3') : obj.fill;
      }
    }
  });
  
  canvas.discardActiveObject();
  canvas.renderAll();
  alert(`✅ ${actifs.length} objet(s) verrouillé(s)`);
};

/**
 * Déverrouiller tous les objets
 */
export const deverrouillerTout = (canvas) => {
  if (!canvas) return;
  
  let count = 0;
  canvas.getObjects().forEach(obj => {
    if (obj.locked) {
      obj.locked = false;
      obj.selectable = true;
      obj.evented = true;
      obj.lockMovementX = false;
      obj.lockMovementY = false;
      obj.lockScalingX = false;
      obj.lockScalingY = false;
      obj.lockRotation = false;
      obj.hasControls = true;
      
      if (obj.originalStroke) {
        obj.stroke = obj.originalStroke;
        obj.strokeWidth = (obj.strokeWidth || 3) - 1;
        delete obj.originalStroke;
      }
      if (obj.originalFill) {
        obj.fill = obj.originalFill;
        delete obj.originalFill;
      }
      count++;
    }
  });
  
  canvas.renderAll();
  if (count > 0) {
    alert(`🔓 ${count} objet(s) déverrouillé(s)`);
  } else {
    alert('Aucun objet verrouillé');
  }
};

/**
 * Effacer tout le plan
 */
export const effacerTout = (canvas, exporterPlanCallback) => {
  if (!canvas) return;
  
  if (!confirm('⚠️ Effacer TOUT le plan et la sauvegarde ?\n(L\'image de fond sera conservée)')) {
    return;
  }
  
  const objets = canvas.getObjects().filter(obj => !obj.isGridLine && !obj.isBoussole && !obj.isImageFond);
  objets.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  
  localStorage.removeItem('planTerrain');
  exporterPlanCallback(canvas);
};

/**
 * Ajouter un point intermédiaire sur une ligne (canalisation/clôture)
 */
export const ajouterPointIntermediaire = (canvas, ligne, pointer) => {
  const x1 = ligne.x1 + ligne.left;
  const y1 = ligne.y1 + ligne.top;
  const x2 = ligne.x2 + ligne.left;
  const y2 = ligne.y2 + ligne.top;
  
  const pointX = pointer.x;
  const pointY = pointer.y;
  
  const props = {
    stroke: ligne.stroke,
    strokeWidth: ligne.strokeWidth,
    strokeDashArray: ligne.strokeDashArray,
    strokeLineCap: ligne.strokeLineCap,
    customType: ligne.customType,
    strokeUniform: ligne.strokeUniform,
    hasBorders: true,
    hasControls: true,
    cornerSize: 12,
    cornerColor: ligne.stroke,
    cornerStyle: 'circle',
    transparentCorners: false
  };
  
  const ligne1 = new fabric.Line([x1, y1, pointX, pointY], props);
  const ligne2 = new fabric.Line([pointX, pointY, x2, y2], props);
  
  const point = new fabric.Circle({
    left: pointX,
    top: pointY,
    radius: 6,
    fill: ligne.stroke,
    stroke: 'white',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    hasControls: false,
    hasBorders: false,
    customType: `${ligne.customType}-point`
  });
  
  canvas.remove(ligne);
  canvas.add(ligne1, ligne2, point);
  canvas.renderAll();
  
  logger.info('PointIntermediaire', `Point ajouté sur ${ligne.customType}`);
};

/**
 * Trouver une position valide pour un arbre
 */
export const trouverPositionValide = (canvas, arbre, largeur, hauteur, index, echelle) => {
  const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
  const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
  const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
  const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');

  const positions = [];
  const gridSize = echelle;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const margin = largeur / 2 + echelle;

  for (let x = margin; x < canvasWidth - margin; x += gridSize) {
    for (let y = margin; y < canvasHeight - margin; y += gridSize) {
      let isValid = true;
      let score = 1000;

      const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
      if (maison) {
        const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
        if (distMaison < distanceFondations) {
          isValid = false;
        } else {
          score += distMaison * 10;
        }
      }

      const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
      for (const canal of canalisations) {
        const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
        if (distCanal < distanceCanalisations) {
          isValid = false;
          break;
        } else {
          score += distCanal * 5;
        }
      }

      const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
      for (const cloture of clotures) {
        const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
        if (distCloture < distanceCloture) {
          isValid = false;
          break;
        } else {
          score += distCloture * 8;
        }
      }

      const autresArbres = canvas.getObjects().filter(obj => 
        obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant'
      );
      for (const autreArbre of autresArbres) {
        const dx = (x - autreArbre.left) / echelle;
        const dy = (y - autreArbre.top) / echelle;
        const distArbre = Math.sqrt(dx * dx + dy * dy);
        if (distArbre < distanceEntreArbres) {
          isValid = false;
          break;
        } else {
          score += distArbre * 3;
        }
      }

      const distFromCenter = Math.abs(x - canvasWidth / 2) + Math.abs(y - canvasHeight / 2);
      score -= distFromCenter * 0.1;

      if (isValid) {
        positions.push({ x, y, score });
      }
    }
  }

  if (positions.length === 0) {
    logger.warn('Placement', `Aucune position valide pour ${arbre.name}`, { index });
    return {
      x: 150 + (index * 200),
      y: 150 + (index * 150)
    };
  }

  positions.sort((a, b) => b.score - a.score);
  // Debug désactivé pour performance
  // logger.debug('Placement', `${positions.length} positions valides pour ${arbre.name}`, {
  //   meilleure: positions[0]
  // });
  return positions[0];
};

/**
 * Créer le plan par défaut avec bordures
 */
export const creerPlanParDefaut = (canvas, dimensions, echelle) => {
  const largeurPixels = dimensions.largeur * echelle;
  const hauteurPixels = dimensions.hauteur * echelle;
  const marge = echelle;

  const cadre = new fabric.Rect({
    left: marge,
    top: marge,
    width: largeurPixels - 2 * marge,
    height: hauteurPixels - 2 * marge,
    fill: 'rgba(255, 255, 255, 0.01)',
    stroke: '#4caf50',
    strokeWidth: 3,
    strokeDashArray: [10, 5],
    selectable: false,
    evented: false
  });

  canvas.add(cadre);
  canvas.renderAll();
  
  logger.info('PlanDefaut', `Créé: ${dimensions.largeur}×${dimensions.hauteur}m`);
};

