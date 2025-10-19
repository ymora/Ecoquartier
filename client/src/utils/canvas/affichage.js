/**
 * affichage.js
 * Fonctions d'affichage visuel (tooltip, menu, zones, ombres, guides)
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerDistanceRectangle, calculerDistanceLigne } from './canvasHelpers';

/**
 * Afficher les zones de contraintes autour des obstacles
 */
export const afficherZonesContraintes = (canvas, echelle, zonesContraintesVisibles) => {
  // Supprimer les anciennes zones
  canvas.getObjects().filter(obj => obj.isZoneContrainte).forEach(obj => canvas.remove(obj));
  
  if (!zonesContraintesVisibles) return;
  
  const arbres = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter');
  if (arbres.length === 0) return;
  
  // Pour chaque arbre, récupérer ses contraintes
  arbres.forEach(arbreGroup => {
    const arbre = arbreGroup.arbreData;
    if (!arbre) return;
    
    const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
    const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
    
    // Zones autour de la maison
    const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
    if (maison) {
      // Zone interdite (rouge)
      const zoneRouge = new fabric.Rect({
        left: maison.left - distanceFondations * echelle,
        top: maison.top - distanceFondations * echelle,
        width: maison.getScaledWidth() + (distanceFondations * 2 * echelle),
        height: maison.getScaledHeight() + (distanceFondations * 2 * echelle),
        fill: 'rgba(244, 67, 54, 0.08)',
        stroke: '#c62828',
        strokeWidth: 1,
        strokeDashArray: [8, 4],
        selectable: false,
        evented: false,
        isZoneContrainte: true
      });
      canvas.add(zoneRouge);
      canvas.sendObjectToBack(zoneRouge);
      
      // Zone attention (orange)
      const zoneOrange = new fabric.Rect({
        left: maison.left - (distanceFondations + 1) * echelle,
        top: maison.top - (distanceFondations + 1) * echelle,
        width: maison.getScaledWidth() + ((distanceFondations + 1) * 2 * echelle),
        height: maison.getScaledHeight() + ((distanceFondations + 1) * 2 * echelle),
        fill: 'rgba(255, 152, 0, 0.05)',
        stroke: '#e65100',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        isZoneContrainte: true
      });
      canvas.add(zoneOrange);
      canvas.sendObjectToBack(zoneOrange);
    }
    
    // Zones autour des citernes
    const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
    const distanceFosse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
    citernes.forEach(citerne => {
      const zoneRouge = new fabric.Rect({
        left: citerne.left - distanceFosse * echelle,
        top: citerne.top - distanceFosse * echelle,
        width: citerne.getScaledWidth() + (distanceFosse * 2 * echelle),
        height: citerne.getScaledHeight() + (distanceFosse * 2 * echelle),
        fill: 'rgba(33, 150, 243, 0.08)',
        stroke: '#1976d2',
        strokeWidth: 1,
        strokeDashArray: [8, 4],
        selectable: false,
        evented: false,
        isZoneContrainte: true
      });
      canvas.add(zoneRouge);
      canvas.sendObjectToBack(zoneRouge);
    });
  });
  
  // Zones le long des clôtures
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  clotures.forEach(cloture => {
    // Créer une zone tampon de 2m le long de la clôture
    const angle = Math.atan2(cloture.y2 - cloture.y1, cloture.x2 - cloture.x1);
    const perpAngle = angle + Math.PI / 2;
    const offset = 2 * echelle;
    
    // Points pour créer un polygone le long de la ligne
    const points = [
      { x: cloture.x1 + cloture.left + Math.cos(perpAngle) * offset, y: cloture.y1 + cloture.top + Math.sin(perpAngle) * offset },
      { x: cloture.x2 + cloture.left + Math.cos(perpAngle) * offset, y: cloture.y2 + cloture.top + Math.sin(perpAngle) * offset },
      { x: cloture.x2 + cloture.left - Math.cos(perpAngle) * offset, y: cloture.y2 + cloture.top - Math.sin(perpAngle) * offset },
      { x: cloture.x1 + cloture.left - Math.cos(perpAngle) * offset, y: cloture.y1 + cloture.top - Math.sin(perpAngle) * offset }
    ];
    
    const zoneClot = new fabric.Polygon(points, {
      fill: 'rgba(255, 193, 7, 0.08)',
      stroke: '#ffa726',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      isZoneContrainte: true
    });
    canvas.add(zoneClot);
    canvas.sendObjectToBack(zoneClot);
  });
  
  canvas.renderAll();
};

/**
 * Afficher l'ombre de la maison selon la saison ET l'orientation
 */
export const afficherOmbreMaison = (canvas, echelle, ombreVisible, saison, orientation) => {
  // Supprimer anciennes ombres
  canvas.getObjects().filter(obj => obj.isOmbre).forEach(obj => canvas.remove(obj));
  
  if (!ombreVisible) return;
  
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (!maison) return;
  
  // Angles solaires selon la saison (Bessancourt, latitude 49°N)
  const angles = {
    hiver: 18,      // 21 décembre - Solstice hiver
    printemps: 45,  // 21 mars / 21 septembre - Équinoxes
    ete: 65,        // 21 juin - Solstice été
    automne: 45
  };
  
  const angleSoleil = angles[saison] || 45;
  const angleRad = (angleSoleil * Math.PI) / 180;
  
  // Hauteur de la maison
  const hauteurMaison = maison.hauteurBatiment || 7;
  
  // Longueur de l'ombre projetée
  const longueurOmbre = hauteurMaison / Math.tan(angleRad);
  const longueurPixels = longueurOmbre * echelle;
  
  // Direction : ombre vers le NORD (soleil au sud à midi)
  // Ajuster selon l'orientation de la carte
  let offsetX = 0;
  let offsetY = 0;
  let width = maison.getScaledWidth();
  let height = longueurPixels;
  
  switch(orientation) {
    case 'nord-haut':  // Nord en haut → ombre vers le haut
      offsetX = 0;
      offsetY = -longueurPixels;
      width = maison.getScaledWidth();
      height = longueurPixels;
      break;
    case 'sud-haut':   // Sud en haut → ombre vers le bas
      offsetX = 0;
      offsetY = maison.getScaledHeight();
      width = maison.getScaledWidth();
      height = longueurPixels;
      break;
    case 'est-haut':   // Est en haut → ombre vers la droite
      offsetX = maison.getScaledWidth();
      offsetY = 0;
      width = longueurPixels;
      height = maison.getScaledHeight();
      break;
    case 'ouest-haut': // Ouest en haut → ombre vers la gauche
      offsetX = -longueurPixels;
      offsetY = 0;
      width = longueurPixels;
      height = maison.getScaledHeight();
      break;
  }
  
  // Créer l'ombre (rectangle semi-transparent)
  const ombre = new fabric.Rect({
    left: maison.left + offsetX,
    top: maison.top + offsetY,
    width: width,
    height: height,
    fill: 'rgba(0, 0, 0, 0.2)',
    selectable: false,
    evented: false,
    isOmbre: true
  });
  
  canvas.add(ombre);
  canvas.sendObjectToBack(ombre);
  canvas.renderAll();
};

/**
 * Afficher des guides d'alignement temporaires
 */
export const afficherGuideTemporaire = (canvas, type, position) => {
  // Supprimer anciens guides
  canvas.getObjects().filter(obj => obj.alignmentGuide).forEach(obj => canvas.remove(obj));
  
  if (type === 'horizontal') {
    const guide = new fabric.Line([0, position, canvas.width, position], {
      stroke: '#ff0000',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      alignmentGuide: true
    });
    canvas.add(guide);
  } else if (type === 'vertical') {
    const guide = new fabric.Line([position, 0, position, canvas.height], {
      stroke: '#ff0000',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      alignmentGuide: true
    });
    canvas.add(guide);
  }
  
  canvas.renderAll();
  
  // Auto-suppression après 500ms
  setTimeout(() => {
    canvas.getObjects().filter(obj => obj.alignmentGuide).forEach(obj => canvas.remove(obj));
    canvas.renderAll();
  }, 500);
};

/**
 * Afficher le cercle du tronc pendant le drag
 */
export const afficherCercleTronc = (canvas, arbreGroup, echelle, anneeProjection, calculerTailleSelonAnnee) => {
  // Supprimer ancien cercle
  canvas.getObjects().filter(obj => obj.isTroncIndicator).forEach(obj => canvas.remove(obj));
  
  const arbre = arbreGroup.arbreData;
  if (!arbre) return;
  
  // Calculer le diamètre selon l'année de projection
  const tailles = calculerTailleSelonAnnee(arbre, anneeProjection);
  const diametreTronc = tailles.diametreTroncActuel;
  const rayonTronc = (diametreTronc / 2) * echelle;
  
  const cercleTronc = new fabric.Circle({
    left: arbreGroup.left,
    top: arbreGroup.top,
    radius: rayonTronc,
    fill: 'rgba(244, 67, 54, 0.3)',
    stroke: '#c62828',
    strokeWidth: 2,
    strokeDashArray: [5, 3],
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isTroncIndicator: true
  });
  
  canvas.add(cercleTronc);
  canvas.renderAll();
};

/**
 * Cacher le cercle du tronc
 */
export const cacherCercleTronc = (canvas) => {
  canvas.getObjects().filter(obj => obj.isTroncIndicator).forEach(obj => canvas.remove(obj));
  canvas.renderAll();
};

