/**
 * canvasValidation.js
 * Validation des positions d'arbres et affichage visuel
 */

import * as fabric from 'fabric';
import logger from '../logger';
import { calculerDistanceRectangle, calculerDistanceCercle, calculerDistanceLigne, trouverPointPlusProcheMaison, trouverPointPlusProcheLigne } from './canvasHelpers';

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
  
  // Vérifier maison/fondations
  const maison = canvas.getObjects().find(obj => obj.customType === 'maison');
  if (maison) {
    const distMaison = calculerDistanceRectangle(x, y, maison) / echelle;
    const profondeurFondations = maison.profondeurFondations || 1.2;
    
    if (profondeurRacines > profondeurFondations && distMaison < distanceFondations) {
      problemes.push(`🏠 Racines ${profondeurRacines}m > fondations ${profondeurFondations}m (${distMaison.toFixed(1)}m)`);
    } else if (distMaison < distanceFondations) {
      problemes.push(`🏠 ${distMaison.toFixed(1)}m < ${distanceFondations}m minimum`);
    } else if (distMaison < distanceFondations + 1) {
      avertissements.push(`🏠 ${distMaison.toFixed(1)}m (min ${distanceFondations}m)`);
    }
  }
  
  // Vérifier canalisations
  const canalisations = canvas.getObjects().filter(obj => obj.customType === 'canalisation');
  for (const canal of canalisations) {
    const distCanal = calculerDistanceLigne(x, y, canal) / echelle;
    const profondeurCanal = canal.profondeur || 0.6;
    
    if (profondeurRacines > profondeurCanal && distCanal < distanceCanalisations) {
      problemes.push(`🚰 Racines ${profondeurRacines}m > canal ${profondeurCanal}m (${distCanal.toFixed(1)}m)`);
    } else if (distCanal < distanceCanalisations) {
      problemes.push(`🚰 ${distCanal.toFixed(1)}m < ${distanceCanalisations}m minimum`);
    }
  }
  
  // Vérifier clôtures/limites
  const clotures = canvas.getObjects().filter(obj => obj.customType === 'cloture');
  const diametreTronc = 0.15; // 15cm estimation
  const rayonTronc = diametreTronc / 2;
  
  for (const cloture of clotures) {
    const distCloture = calculerDistanceLigne(x, y, cloture) / echelle;
    
    if (distCloture < rayonTronc) {
      problemes.push(`⚖️ Tronc dépasse limite (${distCloture.toFixed(1)}m)`);
    } else if (distCloture < distanceCloture) {
      problemes.push(`⚖️ ${distCloture.toFixed(1)}m < ${distanceCloture}m légal (CC Art.671)`);
    } else if (distCloture < distanceCloture + 0.5) {
      avertissements.push(`⚠️ Limite ${distCloture.toFixed(1)}m (min ${distanceCloture}m)`);
    }
  }
  
  // Vérifier citernes/fosses septiques (CERCLE - mesure depuis le BORD)
  const citernes = canvas.getObjects().filter(obj => obj.customType === 'citerne');
  const distanceFosseSeptique = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.fossesSeptiques?.split('m')[0] || '6');
  
  for (const citerne of citernes) {
    // CORRECTION : Utiliser calculerDistanceCercle pour mesurer depuis le BORD
    const distCiterne = calculerDistanceCercle(x, y, citerne) / echelle;
    const profondeurCiterne = citerne.profondeur || 2.5;
    
    // Si les racines atteignent la profondeur de la citerne
    if (profondeurRacines > profondeurCiterne && distCiterne < distanceFosseSeptique) {
      problemes.push(`💧 Racines atteignent citerne (${distCiterne.toFixed(1)}m < ${distanceFosseSeptique}m)`);
    } else if (distCiterne < distanceFosseSeptique) {
      problemes.push(`💧 Trop proche citerne (${distCiterne.toFixed(1)}m < ${distanceFosseSeptique}m)`);
    }
  }
  
  // Vérifier terrasses/pavés (inclut aussi les zones minéralisées)
  const terrasses = canvas.getObjects().filter(obj => obj.customType === 'paves' || obj.customType === 'terrasse');
  for (const terrasse of terrasses) {
    const distTerrasse = calculerDistanceRectangle(x, y, terrasse) / echelle;
    
    // Racines agressives = problème si trop proche
    if (systemeRacinaire === 'Élevée' || systemeRacinaire === 'Forte') {
      if (distTerrasse < distanceTerrasse + 1) {
        problemes.push(`🟩 ${distTerrasse.toFixed(1)}m < ${distanceTerrasse + 1}m (racines ${systemeRacinaire.toLowerCase()})`);
      }
    } else if (distTerrasse < distanceTerrasse) {
      avertissements.push(`🟩 ${distTerrasse.toFixed(1)}m pavés (min ${distanceTerrasse}m)`);
    } else if (distTerrasse < distanceTerrasse + 0.5) {
      avertissements.push(`⚠️ ${distTerrasse.toFixed(1)}m pavés (proche limite)`);
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
      avertissements.push(`🌳 ${distArbre.toFixed(1)}m autre arbre (min ${distanceEntreArbres}m)`);
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
  
  // Vérifier pavés/terrasses (AJOUT LIGNES DE MESURE)
  const terrassesAffichage = canvas.getObjects().filter(obj => obj.customType === 'paves' || obj.customType === 'terrasse');
  const distanceTerrasse = parseFloat(arbre.reglementation?.distancesLegales?.infrastructures?.terrasse?.split('m')[0] || '3');
  const systemeRacinaireAffichage = arbre.reglementation?.systemeRacinaire?.agressivite || 'Modérée';
  
  for (const terrasse of terrassesAffichage) {
    const distTer = calculerDistanceRectangle(x, y, terrasse) / echelle;
    const distMinTerrasse = (systemeRacinaireAffichage === 'Élevée' || systemeRacinaireAffichage === 'Forte') 
      ? distanceTerrasse + 1 
      : distanceTerrasse;
    
    if (distTer < distMinTerrasse) {
      const pointProche = trouverPointPlusProcheMaison(x, y, terrasse);
      ajouterLigneMesureProbleme(canvas, x, y, pointProche.x, pointProche.y, distTer, distMinTerrasse, '🟩');
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

