/**
 * canvasValidation.js
 * Validation des positions d'arbres et affichage visuel
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerDistanceRectangle, calculerDistanceLigne, trouverPointPlusProcheMaison, trouverPointPlusProcheLigne } from './canvasHelpers';

/**
 * Valider la position d'un arbre et changer sa couleur
 */
export const validerPositionArbre = (canvas, arbreGroup, echelle, couchesSol, orientation) => {
  const arbre = arbreGroup.arbreData;
  if (!arbre) return;
  
  logger.debug('Validation', `Validation arbre: ${arbre.name}`, { arbreId: arbre.id });
  
  // Extraire les distances minimales depuis les données réglementaires
  const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
  const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
  const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
  const distanceEntreArbres = parseFloat(arbre.reglementation?.distancesLegales?.entreArbres?.distance?.split('m')[0] || '5');
  const distanceTerrasse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.terrasse?.split('m')[0] || '3');
  const distancePiscine = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.piscine?.split('m')[0] || '4');
  
  // Données supplémentaires pour validation
  const systemeRacinaire = arbre.reglementation?.systemeRacinaire?.agressivite || 'Modérée';
  const exposition = arbre.exposition || '';
  
  // IMPORTANT : Déclarer profondeurRacines ICI (utilisée dans les validations 3D)
  const profondeurRacines = parseFloat(arbre.reglementation?.systemeRacinaire?.profondeur?.split('-')[0] || '1');
  
  const problemes = [];
  const avertissements = [];
  const conseils = [];
  
  const x = arbreGroup.left;
  const y = arbreGroup.top;
  
  // Vérifier maison/fondations (validation 3D : profondeur)
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (maison) {
    const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
    const profondeurFondations = maison.profondeurFondations || 1.2;
    
    // Si les racines descendent plus profond que les fondations
    if (profondeurRacines > profondeurFondations && distMaison < distanceFondations) {
      problemes.push(`🏠 CRITIQUE: Racines (${profondeurRacines}m prof.) dépassent fondations (${profondeurFondations}m) à ${distMaison.toFixed(1)}m`);
    } else if (distMaison < distanceFondations) {
      problemes.push(`🏠 Trop près de la maison (${distMaison.toFixed(1)}m < ${distanceFondations}m requis)`);
    } else if (distMaison < distanceFondations + 1) {
      avertissements.push(`🏠 Proche de la maison (${distMaison.toFixed(1)}m, ${distanceFondations}m recommandé)`);
    }
  }
  
  // Vérifier canalisations (validation 3D : profondeur)
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  for (const canal of canalisations) {
    const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
    const profondeurCanal = canal.profondeur || 0.6;
    
    // Si les racines descendent plus profond que la canalisation
    if (profondeurRacines > profondeurCanal && distCanal < distanceCanalisations) {
      problemes.push(`🚰 CRITIQUE: Racines (${profondeurRacines}m) dépassent canalisation (${profondeurCanal}m) à ${distCanal.toFixed(1)}m - Risque colmatage`);
    } else if (distCanal < distanceCanalisations) {
      problemes.push(`🚰 Trop près d'une canalisation (${distCanal.toFixed(1)}m < ${distanceCanalisations}m requis)`);
    } else if (distCanal < distanceCanalisations + 0.5) {
      avertissements.push(`🚰 Proche canalisation (${distCanal.toFixed(1)}m)`);
    }
  }
  
  // Vérifier clôtures/limites (DISTANCE LÉGALE VOISINAGE - Code Civil Art. 671)
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  
  // Extraire le diamètre du tronc (si disponible, sinon estimation à 30cm)
  const diametreTronc = 0.3; // 30cm par défaut (estimation adulte)
  const rayonTronc = diametreTronc / 2;
  
  for (const cloture of clotures) {
    const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
    
    // Le TRONC ne doit pas dépasser la clôture (limite interne propriété)
    if (distCloture < rayonTronc) {
      problemes.push(`⚖️ ILLÉGAL: Tronc dépasse votre limite de propriété (${distCloture.toFixed(1)}m < ${rayonTronc.toFixed(1)}m) - Voisin peut exiger arrachage`);
    }
    // L'arbre entier (branches) doit respecter la distance légale voisinage
    else if (distCloture < distanceCloture) {
      const articleLoi = arbre.reglementation?.distancesLegales?.voisinage?.regle || 'Code Civil Art. 671';
      const sanction = arbre.reglementation?.distancesLegales?.voisinage?.sanction || 'Voisin peut exiger arrachage';
      problemes.push(`⚖️ DISTANCE LÉGALE NON RESPECTÉE: ${distCloture.toFixed(1)}m < ${distanceCloture}m requis (${articleLoi}) - ${sanction}`);
    } else if (distCloture < distanceCloture + 0.5) {
      avertissements.push(`⚠️ Proche limite voisinage (${distCloture.toFixed(1)}m, ${distanceCloture}m légal minimum)`);
    }
  }
  
  // Vérifier citernes/fosses septiques (validation 3D critique)
  const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
  const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
  
  for (const citerne of citernes) {
    const distCiterne = calculerDistanceRectangle(x, y, citerne) / echelle;
    const profondeurCiterne = citerne.profondeur || 2.5;
    
    // Si les racines atteignent la profondeur de la citerne
    if (profondeurRacines > profondeurCiterne && distCiterne < distanceFosseSeptique) {
      problemes.push(`💧 DANGER: Racines (${profondeurRacines}m) atteignent citerne (${profondeurCiterne}m) - Risque contamination`);
    } else if (distCiterne < distanceFosseSeptique) {
      problemes.push(`💧 Trop près fosse septique (${distCiterne.toFixed(1)}m < ${distanceFosseSeptique}m légal)`);
    }
  }
  
  // Vérifier terrasses/pavés
  const terrasses = canvas.getObjects().filter(obj => obj.customType === 'paves');
  for (const terrasse of terrasses) {
    const distTerrasse = calculerDistanceRectangle(x, y, terrasse) / echelle;
    if (distTerrasse < distanceTerrasse) {
      avertissements.push(`🏡 Proche d'une terrasse (${distTerrasse.toFixed(1)}m < ${distanceTerrasse}m recommandé)`);
    }
  }
  
  // Vérifier autres arbres
  const autresArbres = canvas.getObjects().filter(obj => 
    (obj.customType === 'arbre-a-planter' || obj.customType === 'arbre-existant') && obj !== arbreGroup
  );
  for (const autreArbre of autresArbres) {
    const dx = (x - autreArbre.left) / echelle;
    const dy = (y - autreArbre.top) / echelle;
    const distArbre = Math.sqrt(dx * dx + dy * dy);
    if (distArbre < distanceEntreArbres) {
      problemes.push(`🌳 Trop près d'un autre arbre (${distArbre.toFixed(1)}m < ${distanceEntreArbres}m requis)`);
    } else if (distArbre < distanceEntreArbres + 1) {
      avertissements.push(`🌳 Proche d'un autre arbre (${distArbre.toFixed(1)}m)`);
    }
  }
  
  // Vérifier la compatibilité avec le sol (profondeurRacines déjà déclarée en haut)
  const profondeurTerreVegetale = couchesSol[0].profondeur / 100; // Convertir cm en m
  const typeSolProfondeur = couchesSol[1].type;
  
  if (profondeurRacines > profondeurTerreVegetale) {
    if (typeSolProfondeur === 'calcaire' && arbre.sol?.ph?.includes('acide')) {
      avertissements.push(`🌍 Sol calcaire en profondeur (${couchesSol[1].profondeur}cm) : cet arbre préfère sol acide (pH ${arbre.sol.ph})`);
    } else if (typeSolProfondeur === 'rocheux' && profondeurRacines > 1) {
      problemes.push(`⛰️ Sol rocheux à ${profondeurTerreVegetale}m : racines atteignent ${profondeurRacines}m (croissance limitée)`);
    } else if (typeSolProfondeur === 'argileux' && arbre.sol?.type?.includes('drainé')) {
      avertissements.push(`🌍 Sol argileux en profondeur : drainage peut être insuffisant pour cet arbre`);
    }
  }
  
  // Ajouter des conseils basés sur les caractéristiques de l'arbre
  if (systemeRacinaire === 'Élevée' || systemeRacinaire === 'Forte') {
    conseils.push(`⚠️ Système racinaire ${systemeRacinaire.toLowerCase()} : privilégier éloignement maximal des infrastructures`);
  }
  
  if (exposition.includes('Soleil') && orientation === 'nord-bas') {
    conseils.push(`☀️ Cet arbre aime le soleil : le placer au sud du terrain pour exposition maximale`);
  }
  
  if (arbre.arrosage?.includes('Régulier') || arbre.arrosage?.includes('Abondant')) {
    conseils.push(`💧 Arrosage ${arbre.arrosage.split('.')[0].toLowerCase()} : éviter trop loin du point d'eau`);
  }
  
  if (arbre.sol?.humidite?.includes('Frais') || arbre.sol?.humidite?.includes('Humide')) {
    conseils.push(`💧 Préfère sol frais : éviter zones sèches ou en hauteur`);
  }
  
  // Conseil sur la composition du sol
  conseils.push(`🌍 Sol actuel : ${profondeurTerreVegetale}m de terre végétale, puis ${couchesSol[1].nom.toLowerCase()}`);
  
  // Changer la couleur de l'ellipse (accès direct via _objects)
  const ellipse = arbreGroup._objects ? arbreGroup._objects[0] : null;
  
  if (!ellipse) {
    logger.error('Validation', `Impossible d'accéder à l'ellipse de ${arbre.name}`);
    return;
  }
  
  if (problemes.length > 0) {
    ellipse.set({
      fill: 'rgba(244, 67, 54, 0.4)', // Rouge
      stroke: '#c62828'
    });
    arbreGroup.validationStatus = 'error';
    arbreGroup.validationMessages = problemes;
    arbreGroup.validationConseils = conseils;
  } else if (avertissements.length > 0) {
    ellipse.set({
      fill: 'rgba(255, 152, 0, 0.4)', // Orange
      stroke: '#e65100'
    });
    arbreGroup.validationStatus = 'warning';
    arbreGroup.validationMessages = avertissements;
    arbreGroup.validationConseils = conseils;
  } else {
    ellipse.set({
      fill: 'rgba(129, 199, 132, 0.4)', // Vert
      stroke: '#2e7d32'
    });
    arbreGroup.validationStatus = 'ok';
    arbreGroup.validationMessages = ['✅ Position conforme à toutes les règles'];
    arbreGroup.validationConseils = conseils;
  }
  
  // Forcer le rendu du groupe
  arbreGroup.dirty = true;
  arbreGroup.setCoords();
  canvas.renderAll();
};

/**
 * Afficher les lignes de mesure pour les distances problématiques
 */
export const afficherLignesMesure = (canvas, arbreGroup, echelle) => {
  // Supprimer les anciennes lignes de mesure
  canvas.getObjects().filter(obj => obj.isLigneMesure).forEach(obj => canvas.remove(obj));
  
  const arbre = arbreGroup.arbreData;
  if (!arbre) return;
  
  const x = arbreGroup.left;
  const y = arbreGroup.top;
  
  // Extraire les distances minimales
  const distanceFondations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fondations?.split('m')[0] || '5');
  const distanceCanalisations = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.canalisations?.split('m')[0] || '4');
  const distanceCloture = parseFloat(arbre.reglementation?.distancesLegales?.voisinage?.distance?.split('m')[0] || '2');
  
  // Vérifier maison
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (maison) {
    const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
    if (distMaison < distanceFondations) {
      // Trouver le point le plus proche sur la maison
      const pointProche = trouverPointPlusProcheMaison(x, y, maison);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distMaison, distanceFondations, '🏠');
    }
  }
  
  // Vérifier canalisations
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  for (const canal of canalisations) {
    const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
    if (distCanal < distanceCanalisations) {
      const pointProche = trouverPointPlusProcheLigne(x, y, canal);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCanal, distanceCanalisations, '🚰');
    }
  }
  
  // Vérifier clôtures (LIMITE DE PROPRIÉTÉ = VOISINAGE)
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  for (const cloture of clotures) {
    const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
    if (distCloture < distanceCloture || distCloture < 0.15) {
      const pointProche = trouverPointPlusProcheLigne(x, y, cloture);
      // Message spécifique pour la distance légale voisinage
      const iconeLegal = distCloture < distanceCloture ? '⚖️' : '🚧';
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCloture, distanceCloture, iconeLegal);
    }
  }
  
  // Vérifier citernes/fosses
  const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
  const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
  for (const citerne of citernes) {
    const distCiterne = calculerDistanceRectangle(x, y, citerne) / echelle;
    if (distCiterne < distanceFosseSeptique) {
      const pointProche = trouverPointPlusProcheMaison(x, y, citerne);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distCiterne, distanceFosseSeptique, '💧');
    }
  }
  
  canvas.renderAll();
};

/**
 * Ajouter une ligne de mesure problématique
 */
const ajouterLigneMesureProbleme = (canvas, x1, y1, x2, y2, distActuelle, distMin, icone) => {
  // Ligne pointillée rouge
  const ligne = new fabric.Line([x1, y1, x2, y2], {
    stroke: '#d32f2f',
    strokeWidth: 2,
    strokeDashArray: [8, 4],
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(ligne);
  
  // Label de distance au milieu
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  const label = new fabric.Text(`${icone} ${distActuelle.toFixed(1)}m < ${distMin}m`, {
    left: midX,
    top: midY - 15,
    fontSize: 11,
    fontWeight: 'bold',
    fill: '#d32f2f',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 4,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false,
    isLigneMesure: true
  });
  canvas.add(label);
};

