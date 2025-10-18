/**
 * canvasObjects.js
 * Création des différents objets du canvas (maison, arbres, canalisations, etc.)
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { TAILLE_PLANTATION } from '../../config/planificateurConfig';

/**
 * Calculer la taille d'un arbre selon l'année de projection
 */
export const calculerTailleSelonAnnee = (arbre, annee, echelle = 30) => {
  // Tailles à la plantation (jeune plant)
  const hauteurPlantation = TAILLE_PLANTATION.hauteur;
  const envergurePlantation = TAILLE_PLANTATION.envergure;
  const diametreTroncPlantation = TAILLE_PLANTATION.diametreTronc;
  
  // Tailles à maturité (depuis les données de l'arbre)
  const hauteurMax = parseFloat(arbre.tailleMaturite?.split('-').pop()?.replace('m', '') || '8');
  const envergureMax = parseFloat(arbre.envergure?.split('-').pop()?.replace('m', '') || '6');
  
  // Estimer diamètre tronc max (en mètres) basé sur la hauteur
  // Formule empirique : diamètre ≈ hauteur / 25 (pour arbres moyens)
  const diametreTroncMax = hauteurMax / 25;
  
  // Années jusqu'à maturité (par défaut 20 ans)
  const anneesMaturite = 20;
  
  // Type de croissance (rapide, moyenne, lente)
  const typeCroissance = arbre.croissance?.toLowerCase().includes('rapide') ? 'rapide'
    : arbre.croissance?.toLowerCase().includes('lente') ? 'lente'
    : 'moyenne';
  
  // Calcul du pourcentage de croissance selon le type
  let pourcentageHauteur, pourcentageEnvergure, pourcentageTronc;
  
  if (typeCroissance === 'rapide') {
    // Croissance rapide : 70% à 10 ans, 100% à 15 ans
    pourcentageHauteur = Math.min(1, annee / 15);
    pourcentageEnvergure = Math.min(1, annee / 15);
    pourcentageTronc = Math.min(1, annee / 15);
  } else if (typeCroissance === 'lente') {
    // Croissance lente : 40% à 10 ans, 100% à 25-30 ans
    pourcentageHauteur = Math.min(1, annee / 30);
    pourcentageEnvergure = Math.min(1, annee / 30);
    pourcentageTronc = Math.min(1, annee / 30);
  } else {
    // Croissance moyenne : 60% à 10 ans, 100% à 20 ans
    pourcentageHauteur = Math.min(1, annee / anneesMaturite);
    pourcentageEnvergure = Math.min(1, annee / anneesMaturite);
    pourcentageTronc = Math.min(1, annee / anneesMaturite);
  }
  
  // Calculer les tailles actuelles
  const hauteurActuelle = hauteurPlantation + (hauteurMax - hauteurPlantation) * pourcentageHauteur;
  const envergureActuelle = envergurePlantation + (envergureMax - envergurePlantation) * pourcentageEnvergure;
  const diametreTroncActuel = diametreTroncPlantation + (diametreTroncMax - diametreTroncPlantation) * pourcentageTronc;
  
  // Convertir en pixels pour Fabric.js
  const largeur = envergureActuelle * echelle;
  const hauteur = hauteurActuelle * echelle;
  
  return {
    largeur,
    hauteur,
    hauteurActuelle,
    envergureActuelle,
    diametreTroncActuel,
    hauteurMax,
    envergureMax,
    anneesMaturite,
    pourcentageHauteur,
    pourcentageEnvergure,
    pourcentageTronc,
    typeCroissance
  };
};

/**
 * Trouver une position valide pour un arbre
 */
export const trouverPositionValide = (canvas, arbre, largeur, hauteur, index, echelle = 30) => {
  // Extraire les distances minimales depuis les données de l'arbre
  const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
  const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
  const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
  const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');
  
  // Récupérer tous les objets existants
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  const autresArbres = canvas.getObjects().filter(obj => obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant');
  
  // Grille de recherche (tous les 2m)
  const pasGrille = 2 * echelle;
  const positions = [];
  
  // Fonction helper locale
  const calculerDistanceRectangle = (px, py, rect) => {
    const rx = rect.left;
    const ry = rect.top;
    const rw = rect.getScaledWidth();
    const rh = rect.getScaledHeight();
    
    const dx = Math.max(rx - px, 0, px - (rx + rw));
    const dy = Math.max(ry - py, 0, py - (ry + rh));
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const calculerDistanceLigne = (px, py, ligne) => {
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
  
  for (let x = 100; x < canvas.width - 100; x += pasGrille) {
    for (let y = 100; y < canvas.height - 100; y += pasGrille) {
      let valide = true;
      
      // Vérifier distance avec la maison
      if (maison) {
        const distMaison = calculerDistanceRectangle(x, y, maison);
        if (distMaison < distanceFondations * echelle) {
          valide = false;
          continue;
        }
      }
      
      // Vérifier distance avec les canalisations
      for (const canal of canalisations) {
        const distCanal = calculerDistanceLigne(x, y, canal);
        if (distCanal < distanceCanalisations * echelle) {
          valide = false;
          break;
        }
      }
      if (!valide) continue;
      
      // Vérifier distance avec les clôtures
      for (const cloture of clotures) {
        const distCloture = calculerDistanceLigne(x, y, cloture);
        if (distCloture < distanceCloture * echelle) {
          valide = false;
          break;
        }
      }
      if (!valide) continue;
      
      // Vérifier distance avec les autres arbres
      for (const autreArbre of autresArbres) {
        const dx = x - autreArbre.left;
        const dy = y - autreArbre.top;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < distanceEntreArbres * echelle) {
          valide = false;
          break;
        }
      }
      if (!valide) continue;
      
      // Calculer un score pour cette position (plus c'est haut, mieux c'est)
      let score = 0;
      
      // Préférer le centre du terrain
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      score += (1000 - distFromCenter); // Plus près du centre = mieux
      
      // Préférer loin des obstacles
      if (maison) {
        const distMaison = calculerDistanceRectangle(x, y, maison);
        score += distMaison; // Plus loin = mieux
      }
      
      // Préférer loin des autres arbres (éviter regroupement)
      autresArbres.forEach(autreArbre => {
        const dx = x - autreArbre.left;
        const dy = y - autreArbre.top;
        const dist = Math.sqrt(dx * dx + dy * dy);
        score += dist * 0.5; // Bonus distance
      });
      
      positions.push({ x, y, score });
    }
  }
  
  // Si aucune position valide, placer en diagonale par défaut (visible mais clairement invalide)
  if (positions.length === 0) {
    logger.warn('Placement', `Aucune position valide pour ${arbre.name}`, { index });
    return {
      x: 150 + (index * 200),
      y: 150 + (index * 150)
    };
  }
  
  // Trier par score (meilleur en premier) et prendre la meilleure
  positions.sort((a, b) => b.score - a.score);
  logger.debug('Placement', `${positions.length} positions valides trouvées pour ${arbre.name}`, {
    meilleure: positions[0],
    score: positions[0].score.toFixed(0)
  });
  return positions[0];
};

/**
 * Afficher le cercle du tronc pendant le déplacement
 */
export const afficherCercleTronc = (canvas, arbreGroup, echelle, anneeProjection) => {
  // Supprimer l'ancien cercle s'il existe
  const ancienCercle = canvas.getObjects().find(obj => obj.isTroncIndicator);
  if (ancienCercle) canvas.remove(ancienCercle);
  
  const arbre = arbreGroup.arbreData;
  if (!arbre) return;
  
  // Calculer le diamètre selon l'année de projection
  const tailles = calculerTailleSelonAnnee(arbre, anneeProjection, echelle);
  const diametreTronc = tailles.diametreTroncActuel;
  const rayonTronc = (diametreTronc / 2) * echelle;
  
  const cercleTronc = new fabric.Circle({
    left: arbreGroup.left,
    top: arbreGroup.top,
    radius: rayonTronc,
    fill: 'rgba(255, 0, 0, 0.2)',
    stroke: '#d32f2f',
    strokeWidth: 2,
    strokeDashArray: [5, 5],
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
  const cercleTronc = canvas.getObjects().find(obj => obj.isTroncIndicator);
  if (cercleTronc) canvas.remove(cercleTronc);
  canvas.renderAll();
};

