/**
 * ombreArbre.js
 * ✅ Système de calcul et affichage des ombres portées par les arbres
 * Prend en compte : densité feuillage, saison, heure, taille de l'arbre
 */

import * as fabric from 'fabric';
import logger from '../logger';

/**
 * Calculer l'opacité de l'ombre selon le feuillage et la saison
 */
const calculerOpaciteOmbre = (arbreData, saison) => {
  // Si pas de données, opacité moyenne
  if (!arbreData) return 0.25;
  
  // Vérifier si l'arbre est caduc
  const estCaduc = arbreData.feuillage?.type === 'Caduc';
  
  // En hiver, arbres caducs = pas d'ombre (branches nues)
  if (estCaduc && saison === 'hiver') {
    return 0.05; // Ombre très légère des branches
  }
  
  // Déterminer la densité du feuillage depuis la description
  const description = arbreData.feuillage?.description?.toLowerCase() || '';
  const nom = arbreData.name?.toLowerCase() || '';
  
  let densiteBase = 0.3; // Densité par défaut
  
  // Mots-clés pour feuillage dense
  if (description.includes('dense') || 
      description.includes('épais') || 
      description.includes('compact') ||
      description.includes('touffu') ||
      nom.includes('érable') ||
      nom.includes('hêtre')) {
    densiteBase = 0.5; // Ombre épaisse
  }
  
  // Mots-clés pour feuillage léger
  else if (description.includes('léger') || 
           description.includes('aéré') || 
           description.includes('fin') ||
           description.includes('gracieux') ||
           nom.includes('bouleau') ||
           nom.includes('saule')) {
    densiteBase = 0.2; // Ombre légère
  }
  
  // Ajustements saisonniers
  switch (saison) {
    case 'printemps':
      // Feuillage naissant = ombre plus légère
      return densiteBase * 0.7;
      
    case 'ete':
      // Feuillage maximum
      return densiteBase;
      
    case 'automne':
      // Feuillage qui tombe = ombre réduite
      return estCaduc ? densiteBase * 0.5 : densiteBase * 0.9;
      
    case 'hiver':
      // Déjà géré plus haut pour les caducs
      return densiteBase * 0.8; // Persistants en hiver
      
    default:
      return densiteBase;
  }
};

/**
 * Calculer la longueur de l'ombre selon l'heure de la journée
 */
const calculerLongueurOmbre = (hauteurArbre, heureJournee) => {
  // Angle du soleil selon l'heure (0° = lever, 90° = midi, 180° = coucher)
  // heureJournee va de 0 (6h) à 1 (18h)
  const heureRelle = 6 + heureJournee * 12; // 6h à 18h
  
  // Angle du soleil (60° à midi en été, plus bas matin/soir)
  let angleSoleil;
  
  if (heureRelle < 9) {
    // Matin : soleil bas (15-40°)
    angleSoleil = 15 + (heureRelle - 6) * 8.33; // 15° à 6h, 40° à 9h
  } else if (heureRelle <= 15) {
    // Midi : soleil haut (40-60°)
    angleSoleil = 40 + ((heureRelle - 9) / 6) * 20; // 40° à 9h, 60° à 15h
  } else {
    // Soir : soleil bas (60-15°)
    angleSoleil = 60 - ((heureRelle - 15) / 3) * 45; // 60° à 15h, 15° à 18h
  }
  
  // Limiter l'angle pour éviter divisions par zéro
  angleSoleil = Math.max(5, Math.min(85, angleSoleil));
  
  const angleRad = (angleSoleil * Math.PI) / 180;
  const longueurOmbre = hauteurArbre / Math.tan(angleRad);
  
  return {
    longueur: longueurOmbre,
    angle: angleSoleil
  };
};

/**
 * Afficher les ombres de tous les arbres sur le canvas 2D
 */
export const afficherOmbresArbres = (canvas, echelle, saison = 'ete', heureJournee = 0.5, orientation = 'nord-haut', visible = true) => {
  if (!canvas) return;
  
  // Supprimer les anciennes ombres d'arbres
  canvas.getObjects()
    .filter(obj => obj.isOmbreArbre)
    .forEach(ombre => canvas.remove(ombre));
  
  if (!visible) {
    canvas.renderAll();
    return;
  }
  
  // Trouver tous les arbres
  const arbres = canvas.getObjects().filter(obj => 
    obj.customType === 'arbre-a-planter' || 
    obj.customType === 'arbre-existant' ||
    obj.customType === 'arbre'
  );
  
  if (arbres.length === 0) {
    return;
  }
  
  logger.info('OmbreArbre', `Calcul des ombres pour ${arbres.length} arbre(s) - Saison: ${saison}, Heure: ${(heureJournee * 12 + 6).toFixed(1)}h`);
  
  arbres.forEach(arbre => {
    const arbreData = arbre.arbreData;
    if (!arbreData) return;
    
    // Calculer l'opacité selon le feuillage et la saison
    const opacite = calculerOpaciteOmbre(arbreData, saison);
    
    // Extraire la hauteur et l'envergure
    const hauteurMax = parseFloat(arbreData.tailleMaturite?.split('-')[1] || '8');
    const envergureMax = parseFloat(arbreData.envergure?.split('-')[1] || '6');
    
    // Calculer la longueur de l'ombre
    const { longueur: longueurOmbre, angle: angleSoleil } = calculerLongueurOmbre(hauteurMax, heureJournee);
    
    // Dimensions de l'ombre en pixels
    const rayonEnvergure = (envergureMax / 2) * echelle;
    const longueurPixels = longueurOmbre * echelle;
    
    // Direction de l'ombre selon l'orientation de la carte
    let offsetX = 0;
    let offsetY = 0;
    
    switch(orientation) {
      case 'nord-haut':  // Nord en haut → ombre vers le haut (sud)
        offsetX = 0;
        offsetY = -longueurPixels / 2;
        break;
      case 'sud-haut':   // Sud en haut → ombre vers le bas (nord)
        offsetX = 0;
        offsetY = longueurPixels / 2;
        break;
      case 'est-haut':   // Est en haut → ombre vers la droite (ouest)
        offsetX = longueurPixels / 2;
        offsetY = 0;
        break;
      case 'ouest-haut': // Ouest en haut → ombre vers la gauche (est)
        offsetX = -longueurPixels / 2;
        offsetY = 0;
        break;
    }
    
    // Créer l'ombre (ellipse allongée)
    const ombre = new fabric.Ellipse({
      left: arbre.left + offsetX,
      top: arbre.top + offsetY,
      rx: rayonEnvergure, // Rayon horizontal = envergure
      ry: longueurPixels / 2, // Rayon vertical = longueur ombre
      fill: `rgba(0, 0, 0, ${opacite})`,
      selectable: false,
      evented: false,
      isOmbreArbre: true,
      arbreSource: arbre.planteId // Référence pour mise à jour
    });
    
    // Positionner l'ombre en arrière-plan
    canvas.add(ombre);
    canvas.sendToBack(ombre);
  });
  
  canvas.renderAll();
  
  logger.info('OmbreArbre', `✅ Ombres affichées (angle soleil: ${angleSoleil?.toFixed(0)}°)`);
};

/**
 * Obtenir les informations d'ombre pour un arbre spécifique
 * Utile pour l'affichage dans l'interface
 */
export const getInfoOmbreArbre = (arbreData, saison = 'ete', heureJournee = 0.5) => {
  if (!arbreData) return null;
  
  const opacite = calculerOpaciteOmbre(arbreData, saison);
  const hauteurMax = parseFloat(arbreData.tailleMaturite?.split('-')[1] || '8');
  const envergureMax = parseFloat(arbreData.envergure?.split('-')[1] || '6');
  const { longueur: longueurOmbre, angle: angleSoleil } = calculerLongueurOmbre(hauteurMax, heureJournee);
  
  // Déterminer le type de densité
  let typeDensite = 'Moyenne';
  if (opacite >= 0.45) typeDensite = 'Dense';
  else if (opacite <= 0.25) typeDensite = 'Légère';
  
  // Calculer la surface d'ombre (ellipse)
  const surfaceOmbre = Math.PI * (envergureMax / 2) * (longueurOmbre / 2);
  
  return {
    opacite: (opacite * 100).toFixed(0) + '%',
    densiteFeuillage: typeDensite,
    longueurOmbre: longueurOmbre.toFixed(1) + 'm',
    surfaceOmbre: surfaceOmbre.toFixed(1) + 'm²',
    angleSoleil: angleSoleil.toFixed(0) + '°',
    estCaduc: arbreData.feuillage?.type === 'Caduc',
    noteHiver: arbreData.feuillage?.type === 'Caduc' ? '⚠️ Ombre quasi-nulle en hiver (branches nues)' : '✓ Ombre persistante en hiver'
  };
};

